from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import json
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

# ===== FILE-BASED STORAGE =====
DATA_DIR = ROOT_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

def read_json(filename: str) -> list | dict:
    path = DATA_DIR / filename
    if not path.exists():
        return [] if filename != "settings.json" and filename != "admin.json" else {}
    with open(path, "r") as f:
        return json.load(f)

def write_json(filename: str, data):
    path = DATA_DIR / filename
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)

# ===== SECURITY =====
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get("SECRET_KEY", "vine-social-tokyo-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# ===== APP =====
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====
class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
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
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactSubmissionCreate(BaseModel):
    name: str
    phone: str
    email: str
    message: str

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
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

# ===== AUTH =====
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===== STARTUP =====
@app.on_event("startup")
async def startup():
    # Seed admin user
    admin = read_json("admin.json")
    if not admin:
        hashed = pwd_context.hash("VineSocial2024!")
        write_json("admin.json", {"email": "admin@vinesocial.tokyo", "password": hashed})
        logging.info("Admin seeded: admin@vinesocial.tokyo / VineSocial2024!")

    # Seed default settings
    settings = read_json("settings.json")
    if not settings:
        write_json("settings.json", Settings().model_dump())

# ===== ADMIN ROUTES =====
@api_router.post("/admin/login", response_model=AdminResponse)
async def admin_login(login: AdminLogin):
    admin = read_json("admin.json")
    if not admin or admin.get("email") != login.email or not pwd_context.verify(login.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": login.email})
    return {"email": login.email, "token": token}

@api_router.get("/admin/verify")
async def verify_admin(email: str = Depends(verify_token)):
    return {"email": email, "valid": True}

# ===== MENU ROUTES =====
@api_router.post("/menu", response_model=MenuItem)
async def create_menu_item(item: MenuItemCreate, email: str = Depends(verify_token)):
    items = read_json("menu.json")
    new_item = MenuItem(**item.model_dump())
    items.append(new_item.model_dump())
    write_json("menu.json", items)
    return new_item

@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu_items(category: Optional[str] = None):
    items = read_json("menu.json")
    if category:
        items = [i for i in items if i.get("category") == category]
    return sorted(items, key=lambda x: x.get("order", 0))

@api_router.put("/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item: MenuItemCreate, email: str = Depends(verify_token)):
    items = read_json("menu.json")
    for i, existing in enumerate(items):
        if existing["id"] == item_id:
            items[i] = {**existing, **item.model_dump()}
            write_json("menu.json", items)
            return items[i]
    raise HTTPException(status_code=404, detail="Item not found")

@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str, email: str = Depends(verify_token)):
    items = read_json("menu.json")
    new_items = [i for i in items if i["id"] != item_id]
    if len(new_items) == len(items):
        raise HTTPException(status_code=404, detail="Item not found")
    write_json("menu.json", new_items)
    return {"message": "Item deleted"}

# ===== GALLERY ROUTES =====
@api_router.post("/gallery", response_model=GalleryImage)
async def create_gallery_image(image: GalleryImageCreate, email: str = Depends(verify_token)):
    images = read_json("gallery.json")
    new_image = GalleryImage(**image.model_dump())
    images.append(new_image.model_dump())
    write_json("gallery.json", images)
    return new_image

@api_router.get("/gallery", response_model=List[GalleryImage])
async def get_gallery_images():
    return read_json("gallery.json")

@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, email: str = Depends(verify_token)):
    images = read_json("gallery.json")
    image = next((i for i in images if i["id"] == image_id), None)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    if image["url"].startswith("/uploads/"):
        file_path = UPLOAD_DIR / image["url"].replace("/uploads/", "")
        if file_path.exists():
            file_path.unlink()
    new_images = [i for i in images if i["id"] != image_id]
    write_json("gallery.json", new_images)
    return {"message": "Image deleted"}

# ===== UPLOAD ROUTE =====
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), email: str = Depends(verify_token)):
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/uploads/{unique_filename}"}

# ===== CONTACT ROUTES =====
@api_router.post("/contact", response_model=ContactSubmission)
async def create_contact_submission(submission: ContactSubmissionCreate):
    submissions = read_json("contact.json")
    contact = ContactSubmission(**submission.model_dump())
    submissions.append(contact.model_dump())
    write_json("contact.json", submissions)
    return contact

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions(email: str = Depends(verify_token)):
    submissions = read_json("contact.json")
    return sorted(submissions, key=lambda x: x.get("timestamp", ""), reverse=True)

# ===== SETTINGS ROUTES =====
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    data = read_json("settings.json")
    return Settings(**data) if data else Settings()

@api_router.put("/settings", response_model=Settings)
async def update_settings(settings_update: SettingsUpdate, email: str = Depends(verify_token)):
    current = read_json("settings.json") or Settings().model_dump()
    updates = {k: v for k, v in settings_update.model_dump().items() if v is not None}
    current.update(updates)
    write_json("settings.json", current)
    return Settings(**current)

# ===== INCLUDE ROUTER =====
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
