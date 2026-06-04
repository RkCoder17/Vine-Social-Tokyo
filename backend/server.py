from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
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
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# File upload path
UPLOAD_DIR = Path("/app/frontend/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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

class GalleryImageCreate(BaseModel):
    url: str
    caption: Optional[str] = None
    category: Optional[str] = None

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

# ===== SEED ADMIN =====
async def seed_admin():
    admin_exists = await db.admin_users.find_one({"email": "admin@vinesocial.tokyo"})
    if not admin_exists:
        hashed_password = pwd_context.hash("VineSocial2024!")
        await db.admin_users.insert_one({
            "id": str(uuid.uuid4()),
            "email": "admin@vinesocial.tokyo",
            "password": hashed_password
        })
        logging.info("Admin user seeded")

@app.on_event("startup")
async def startup():
    await seed_admin()
    # Seed initial settings
    settings_exist = await db.settings.find_one({"id": "settings"})
    if not settings_exist:
        default_settings = Settings()
        await db.settings.insert_one(default_settings.model_dump())

# ===== ROUTES =====
@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(login: AdminLogin):
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
    menu_item = MenuItem(**item.model_dump())
    doc = menu_item.model_dump()
    await db.menu_items.insert_one(doc)
    return menu_item

@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu_items(category: Optional[str] = None):
    query = {"category": category} if category else {}
    items = await db.menu_items.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    return items

@api_router.put("/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item: MenuItemCreate, email: str = Depends(verify_token)):
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
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}

# ===== GALLERY ROUTES =====
@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image: GalleryImageCreate, email: str = Depends(verify_token)):
    gallery_img = GalleryImage(**image.model_dump())
    doc = gallery_img.model_dump()
    await db.gallery_images.insert_one(doc)
    return gallery_img

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    images = await db.gallery_images.find({}, {"_id": 0}).to_list(1000)
    return images

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, email: str = Depends(verify_token)):
    # Get image to check if it's a local file
    image = await db.gallery_images.find_one({"id": image_id}, {"_id": 0})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # If it's a local upload, delete the file
    if image["url"].startswith("/uploads/"):
        file_path = UPLOAD_DIR / image["url"].replace("/uploads/", "")
        if file_path.exists():
            file_path.unlink()
    
    # Delete from database
    result = await db.gallery_images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

# ===== UPLOAD ROUTE =====
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), email: str = Depends(verify_token)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"/uploads/{unique_filename}"}

# ===== CONTACT ROUTES =====
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(submission: ContactSubmissionCreate):
    contact = ContactSubmission(**submission.model_dump())
    doc = contact.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contact_submissions.insert_one(doc)
    return contact

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions(email: str = Depends(verify_token)):
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for sub in submissions:
        if isinstance(sub['timestamp'], str):
            sub['timestamp'] = datetime.fromisoformat(sub['timestamp'])
    return submissions

# ===== SETTINGS ROUTES =====
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    if not settings:
        return Settings()
    return settings

@api_router.put("/settings", response_model=Settings)
async def update_settings(settings_update: SettingsUpdate, email: str = Depends(verify_token)):
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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
