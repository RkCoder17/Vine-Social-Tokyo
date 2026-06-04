# Vine Social Tokyo - Restaurant Website

A modern, elegant website for Vine Social Tokyo restaurant featuring Indian flavours with a modern tapas experience. Built with React (frontend) and FastAPI (backend) with MongoDB database.

---

## 📁 Project Structure

```
/app/
├── backend/                      # FastAPI backend server
│   ├── server.py                # Main FastAPI application with all API endpoints
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Backend environment variables
│
├── frontend/                     # React frontend application
│   ├── public/
│   │   └── uploads/             # Local folder for uploaded images
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── Header.js       # Navigation header with glassmorphism
│   │   │   └── Footer.js       # Footer with contact info
│   │   ├── pages/               # Main page components
│   │   │   ├── Home.js         # Homepage with hero, about preview, menu highlights
│   │   │   ├── About.js        # About us page with story and concept
│   │   │   ├── Menu.js         # Dynamic menu with categories
│   │   │   ├── Gallery.js      # Image gallery with bento grid layout
│   │   │   ├── Parties.js      # Parties & events page
│   │   │   ├── Contact.js      # Contact form and information
│   │   │   └── Admin.js        # Admin panel for content management
│   │   ├── App.js              # Main app with routing
│   │   ├── App.css             # Component-specific styles
│   │   └── index.css           # Global styles with custom theme
│   ├── package.json            # Node.js dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── .env                    # Frontend environment variables
│
├── design_guidelines.json       # UI/UX design specifications
└── README.md                    # This file
```

---

## 🎨 Design Theme

**Dark Luxury + Warm + Elegant**

- **Colors:**
  - Background: `#0F0F0F` (Deep black)
  - Surface: `#1B1C1A` (Charcoal)
  - Primary/Gold: `#CBA052`
  - Secondary/Deep Green: `#1B3B36`
  - Text Primary: `#F5F2E9` (Warm beige)
  - Text Secondary: `#A3A199` (Muted gray)

- **Typography:**
  - Headings: `Cormorant Garamond` (Elegant serif)
  - Body: `Outfit` (Clean modern sans-serif)

- **Special Effects:**
  - Glassmorphism on header (backdrop blur + transparency)
  - Bento grid layout for gallery (asymmetrical, varying sizes)
  - Hover animations on images (scale + zoom)
  - Smooth scrolling and transitions

---

## 🚀 Features

### Phase 1 (Completed)

1. **Main Section (Hero)**
   - Full-screen hero image with overlay
   - Restaurant name, tagline, and CTA buttons
   - Smooth scroll animations

2. **About Us Section**
   - Who we are, concept, why different
   - Image-text grid layout
   - Warm, inviting copy

3. **Menu Page**
   - 6 categories: Small Plates, Tandoor, Mains, Drinks, Lunch Sets, Party Courses
   - Dynamic loading from database
   - Beautiful card-based layout with images
   - Category filtering

4. **Gallery Page**
   - Bento-style asymmetrical grid
   - Mix of food, interior, and dining photos
   - Hover effects and captions

5. **Party/Catering Page**
   - Birthday parties, corporate events, private gatherings
   - Feature cards with icons
   - Custom package CTA

6. **Contact Page**
   - Contact form (name, phone, email, message)
   - Google Maps integration
   - Address, phone, email, Instagram, WhatsApp links
   - Form submissions stored in database

7. **Social Media Integration**
   - Instagram, email, phone links in header and footer
   - WhatsApp direct chat button

8. **Footer**
   - Address, opening hours, social links
   - Quick navigation links
   - Copyright information

9. **Admin Panel**
   - Simple login authentication (JWT-based)
   - Menu management: Add, edit, delete menu items with images
   - Gallery management: Upload/delete images
   - Settings: Update opening hours, contact info, announcements
   - View contact form submissions
   - File upload to local folder with automatic deletion

### Phase 2 (Future Enhancements)

- Online reservations system
- Online party booking
- Payment integration
- Event calendar
- Newsletter subscription

---

## 📂 File Purposes

### Backend Files

| File | Purpose |
|------|---------|
| `server.py` | Main FastAPI server with all API endpoints (auth, menu, gallery, contact, settings, file upload) |
| `requirements.txt` | Python dependencies (FastAPI, motor, passlib, python-jose, python-multipart, etc.) |
| `.env` | Environment variables (MongoDB URL, DB name, CORS origins, JWT secret key) |

### Frontend Files

| File | Purpose |
|------|---------|
| **Components** | |
| `Header.js` | Top navigation bar with logo, menu links, social icons, mobile menu |
| `Footer.js` | Footer with brand, contact info, hours, social links |
| **Pages** | |
| `Home.js` | Homepage: Hero section, about preview, menu highlights, CTA sections |
| `About.js` | About page: Story, concept, why different sections |
| `Menu.js` | Menu page: Category tabs, dynamic menu items from database |
| `Gallery.js` | Gallery page: Bento grid layout with images |
| `Parties.js` | Parties & events page: Packages, catering info |
| `Contact.js` | Contact page: Form, contact info, Google Maps |
| `Admin.js` | Admin panel: Login, menu/gallery/settings management, contact submissions |
| **Styles** | |
| `index.css` | Global styles, custom CSS variables, utility classes |
| `App.css` | Component-specific styles (hero overlay, bento grid, hover effects) |
| **Config** | |
| `App.js` | Main app component with React Router setup |
| `package.json` | Node.js dependencies and scripts |
| `.env` | Frontend environment variables (backend URL) |

---

## 🗄️ Database Structure

### MongoDB Collections

1. **admin_users**
   - `id`: Unique identifier
   - `email`: Admin email
   - `password`: Hashed password (bcrypt)

2. **menu_items**
   - `id`: Unique identifier
   - `category`: Menu category (Small Plates, Tandoor, etc.)
   - `name`: Item name
   - `description`: Item description
   - `price`: Price string (e.g., "¥1,200")
   - `image_url`: Image URL or local path
   - `order`: Sort order

3. **gallery_images**
   - `id`: Unique identifier
   - `url`: Image URL or local path
   - `caption`: Optional caption
   - `category`: Optional category (Food, Interior, etc.)

4. **contact_submissions**
   - `id`: Unique identifier
   - `name`: Sender name
   - `phone`: Phone number
   - `email`: Email address
   - `message`: Message content
   - `timestamp`: Submission timestamp

5. **settings**
   - `id`: Always "settings" (single document)
   - `opening_hours`: Restaurant hours
   - `phone`: Contact phone
   - `email`: Contact email
   - `address`: Physical address
   - `instagram`: Instagram handle
   - `whatsapp`: WhatsApp number
   - `announcement`: Optional banner announcement

---

## 🔑 API Endpoints

### Public Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/menu` | Get all menu items (optional category filter) |
| GET | `/api/menu?category=Small Plates` | Get menu items by category |
| GET | `/api/gallery` | Get all gallery images |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/settings` | Get restaurant settings |

### Admin Endpoints (Requires Authentication)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/login` | Admin login (returns JWT token) |
| GET | `/api/admin/verify` | Verify JWT token |
| POST | `/api/menu` | Create menu item |
| PUT | `/api/menu/{item_id}` | Update menu item |
| DELETE | `/api/menu/{item_id}` | Delete menu item |
| POST | `/api/gallery` | Add gallery image |
| DELETE | `/api/gallery/{image_id}` | Delete gallery image (also removes local file) |
| POST | `/api/upload` | Upload file to `/public/uploads/` |
| GET | `/api/contact` | Get all contact submissions |
| PUT | `/api/settings` | Update restaurant settings |

---

## 🔐 Admin Credentials

**Default Admin Login:**
- Email: `admin@vinesocial.tokyo`
- Password: `VineSocial2024!`

*Note: Change these credentials in production by updating the admin user in MongoDB.*

---

## 🛠️ Tech Stack

### Frontend
- **React** (v19.x) - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Modern icon library
- **Axios** - HTTP requests

### Backend
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Passlib** - Password hashing (bcrypt)
- **Python-JOSE** - JWT token handling
- **Python-Multipart** - File upload support

### Database
- **MongoDB** - NoSQL database

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running on localhost:27017

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
# Server runs automatically via supervisor on 0.0.0.0:8001
```

### Frontend Setup
```bash
cd /app/frontend
yarn install
# Server runs automatically via supervisor on port 3000
```

### Environment Variables

**Backend (.env):**
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
SECRET_KEY="vine-social-tokyo-secret-key-2024-change-in-production"
```

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=https://vine-social-tokyo.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## 🎯 How to Use

### For Regular Users
1. Visit the website homepage
2. Browse menu categories
3. View gallery images
4. Learn about parties and events
5. Submit contact form for inquiries
6. Click WhatsApp button for instant messaging

### For Admins
1. Navigate to `/admin`
2. Login with credentials
3. **Menu Management:**
   - Add new menu items with category, name, description, price, image
   - Edit existing items
   - Delete items
   - Upload images locally or use URLs
4. **Gallery Management:**
   - Add images with optional captions and categories
   - Delete images (removes from database and local folder)
5. **Settings Management:**
   - Update opening hours
   - Change contact info (phone, email, address)
   - Update social media handles
   - Add/edit homepage announcements
6. **Contact Submissions:**
   - View all submitted contact forms
   - See customer inquiries with timestamps

---

## 📸 Image Management

### Local Storage
- Images uploaded via admin panel are stored in `/app/frontend/public/uploads/`
- Each file gets a unique UUID filename
- When deleting images from admin panel, the local file is also removed
- Accessible via `/uploads/{filename}` in the frontend

### External URLs
- You can also use external image URLs (Unsplash, Pexels, etc.)
- Paste the URL directly in the image field

---

## 🎨 Customization Guide

### Changing Colors
Edit `/app/frontend/src/index.css`:
```css
:root {
  --background: 15 15 15;        /* Background color */
  --primary: 203 160 82;         /* Gold accent */
  --secondary: 27 59 54;         /* Deep green */
  /* ... */
}
```

### Changing Fonts
Edit `/app/frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

### Adding Menu Categories
Update `CATEGORIES` array in:
- `/app/frontend/src/pages/Menu.js`
- `/app/frontend/src/pages/Admin.js`

---

## 🚨 Important Notes

1. **Do NOT hardcode URLs or credentials** in code - always use environment variables
2. **File uploads** are stored locally in `/public/uploads/` - ensure this folder exists
3. **Admin password** should be changed in production
4. **JWT secret key** should be changed in production
5. **MongoDB connection** uses the existing MONGO_URL from .env
6. **Services restart** is only needed when:
   - Installing new dependencies
   - Changing .env files
   - Other changes use hot reload automatically

---

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Homepage loads with hero image
- [ ] Navigation works (all links)
- [ ] Mobile menu opens/closes
- [ ] Menu page displays items by category
- [ ] Gallery displays bento grid
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Admin can add/edit/delete menu items
- [ ] Admin can upload images
- [ ] Admin can update settings

**Backend:**
- [ ] API endpoints return correct data
- [ ] Authentication works (JWT)
- [ ] File upload saves to correct folder
- [ ] Database operations work (CRUD)
- [ ] Admin seeding runs on startup

### API Testing with curl

```bash
# Get menu items
curl https://vine-social-tokyo.preview.emergentagent.com/api/menu

# Get settings
curl https://vine-social-tokyo.preview.emergentagent.com/api/settings

# Login as admin
curl -X POST https://vine-social-tokyo.preview.emergentagent.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vinesocial.tokyo","password":"VineSocial2024!"}'

# Add menu item (replace {TOKEN})
curl -X POST https://vine-social-tokyo.preview.emergentagent.com/api/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"category":"Small Plates","name":"Test Dish","description":"Delicious test","price":"¥800"}'
```

---

## 🔄 Deployment

The application is designed to run in a Kubernetes environment with:
- Backend on internal port 8001
- Frontend on internal port 3000
- External access via REACT_APP_BACKEND_URL
- Hot reload enabled for development
- Supervisor for process management

---

## 📝 License

Proprietary - Vine Social Tokyo © 2024

---

## 👨‍💻 Development

Built with ❤️ for Vine Social Tokyo

For questions or support, contact the development team.

---

## 🎉 What's Next?

After testing Phase 1, consider implementing Phase 2 features:
- Online reservation system
- Payment gateway (Stripe/PayPal)
- Event calendar with booking
- Email newsletter integration
- Customer loyalty program
- Multi-language support (English/Japanese)
