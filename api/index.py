from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import cloudinary
import cloudinary.uploader

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')  # no-ops safely in production where Vercel injects env vars directly

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== MONGODB (lazy connection — safe for serverless cold starts) =====
# A client created at import time can bind to the wrong asyncio event loop in
# serverless environments. Creating it lazily on first use, inside the loop
# that's actually serving requests, avoids "Future attached to a different loop" errors.
_mongo_client: Optional[AsyncIOMotorClient] = None

def get_db():
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    return _mongo_client[os.environ["DB_NAME"]]

# ===== SECURITY =====
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# Admin credentials (seeded on first run, configurable via env — no hardcoded defaults)
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@vinesocial.tokyo")
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

# ===== CLOUDINARY (image hosting — replaces local folder storage) =====
cloudinary.config(
    cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
    api_key=os.environ["CLOUDINARY_API_KEY"],
    api_secret=os.environ["CLOUDINARY_API_SECRET"],
    secure=True
)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====
class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    token: str

class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    name: str
    description: str
    price: str
    image_url: Optional[str] = None
    order: int = 0

class MenuItemCreate(BaseModel):
    category: str
    name: str
    description: str
    price: str
    image_url: Optional[str] = None
    order: int = 0

class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    caption: Optional[str] = None
    category: Optional[str] = None
    cloudinary_public_id: Optional[str] = None

class GalleryImageCreate(BaseModel):
    url: str
    caption: Optional[str] = None
    category: Optional[str] = None
    cloudinary_public_id: Optional[str] = None

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: str
    phone: str
    email: str
    message: str

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "settings"
    opening_hours: str = "Mon-Sun: 11:30 AM - 11:00 PM"
    phone: str = "+81 3-1234-5678"
    email: str = "contact@vinesocialtokyo.com"
    address: str = "Shibuya, Tokyo, Japan"
    instagram: str = "@vinesocialtokyo"
    whatsapp: str = "+81312345678"
    announcement: Optional[str] = None

class SettingsUpdate(BaseModel):
    opening_hours: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None
    announcement: Optional[str] = None

# ===== AUTHENTICATION =====
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===== SEED ADMIN + SETTINGS (runs lazily on first request, not at cold start) =====
_seeded = False

async def ensure_seeded():
    global _seeded
    if _seeded:
        return
    db = get_db()
    admin_exists = await db.admin_users.find_one({"email": ADMIN_EMAIL})
    if not admin_exists:
        hashed_password = pwd_context.hash(ADMIN_PASSWORD)
        await db.admin_users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password": hashed_password
        })
        logger.info("Admin user seeded")

    settings_exist = await db.settings.find_one({"id": "settings"})
    if not settings_exist:
        await db.settings.insert_one(Settings().model_dump())
    _seeded = True

@app.middleware("http")
async def seed_on_first_request(request, call_next):
    await ensure_seeded()
    return await call_next(request)

# ===== ROUTES =====
@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(login: AdminLogin):
    db = get_db()
    admin = await db.admin_users.find_one({"email": login.email}, {"_id": 0})
    if not admin or not pwd_context.verify(login.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": login.email})
    return {"email": login.email, "token": token}

@api_router.get("/admin/verify")
async def verify_admin(email: str = Depends(verify_token)):
    return {"email": email, "valid": True}

# ===== MENU ROUTES =====
@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate, email: str = Depends(verify_token)):
    db = get_db()
    menu_item = MenuItem(**item.model_dump())
    doc = menu_item.model_dump()
    await db.menu_items.insert_one(doc)
    return menu_item

@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu_items(category: Optional[str] = None):
    db = get_db()
    query = {"category": category} if category else {}
    items = await db.menu_items.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    return items

@api_router.put("/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item: MenuItemCreate, email: str = Depends(verify_token)):
    db = get_db()
    updated = await db.menu_items.find_one_and_update(
        {"id": item_id},
        {"$set": item.model_dump()},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    updated.pop("_id", None)
    return updated

@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str, email: str = Depends(verify_token)):
    db = get_db()
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}

# ===== GALLERY ROUTES =====
@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image: GalleryImageCreate, email: str = Depends(verify_token)):
    db = get_db()
    gallery_img = GalleryImage(**image.model_dump())
    doc = gallery_img.model_dump()
    await db.gallery_images.insert_one(doc)
    return gallery_img

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    db = get_db()
    images = await db.gallery_images.find({}, {"_id": 0}).to_list(1000)
    return images

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, email: str = Depends(verify_token)):
    db = get_db()
    image = await db.gallery_images.find_one({"id": image_id}, {"_id": 0})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # If it's a Cloudinary-hosted image, delete it from Cloudinary too
    public_id = image.get("cloudinary_public_id")
    if public_id:
        try:
            cloudinary.uploader.destroy(public_id)
        except Exception as e:
            logger.warning(f"Cloudinary delete failed for {public_id}: {e}")

    result = await db.gallery_images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

# ===== UPLOAD ROUTE =====
# Images go straight to Cloudinary — Vercel's serverless filesystem is read-only
# and ephemeral, so a local /uploads folder would lose every file on the next deploy.
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), email: str = Depends(verify_token)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")

    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="vine_social_tokyo",
            resource_type="image"
        )
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {e}")
        raise HTTPException(status_code=502, detail="Image upload failed")

    return {"url": result["secure_url"], "public_id": result["public_id"]}

# ===== CONTACT ROUTES =====
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(submission: ContactSubmissionCreate):
    db = get_db()
    contact = ContactSubmission(**submission.model_dump())
    doc = contact.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contact_submissions.insert_one(doc)
    return contact

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions(email: str = Depends(verify_token)):
    db = get_db()
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for sub in submissions:
        if isinstance(sub['timestamp'], str):
            sub['timestamp'] = datetime.fromisoformat(sub['timestamp'])
    return submissions

# ===== SETTINGS ROUTES =====
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    db = get_db()
    settings = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    if not settings:
        return Settings()
    return settings

@api_router.put("/settings", response_model=Settings)
async def update_settings(settings_update: SettingsUpdate, email: str = Depends(verify_token)):
    db = get_db()
    update_data = {k: v for k, v in settings_update.model_dump().items() if v is not None}
    updated = await db.settings.find_one_and_update(
        {"id": "settings"},
        {"$set": update_data},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Settings not found")
    updated.pop("_id", None)
    return updated

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
