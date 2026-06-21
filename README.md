# Vine Social Tokyo - Restaurant Website

A modern, elegant website for Vine Social Tokyo restaurant featuring Indian flavours with a modern tapas experience. Built with React (frontend) and FastAPI (backend, running as a single Vercel serverless function) with MongoDB Atlas as the database.

---

## 📁 Project Structure

```
vine-social-tokyo/
├── api/
│   └── index.py                  # FastAPI app — deployed as one Vercel serverless function
├── requirements.txt              # Python dependencies (must stay at repo root for Vercel)
├── vercel.json                   # Routes /api/* to the function, everything else to the React build
│
├── frontend/                     # React frontend application
│   ├── public/
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
│   └── .env.production         # Frontend environment variables (left empty — same-origin API)
│
├── design_guidelines.json       # UI/UX design specifications
├── DEPLOYMENT.md                 # Step-by-step deployment guide
└── README.md                    # This file
```

One Vercel project serves both the React app and the API — there's no separate backend host.

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
| `api/index.py` | FastAPI app with all API endpoints (auth, menu, gallery, contact, settings, image upload) — deployed as one Vercel serverless function |
| `requirements.txt` | Python dependencies (must live at repo root, not inside `api/`, for Vercel to detect them) |
| `api/.env` | Local-only environment variables for `vercel dev` — production vars are set in the Vercel dashboard |

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
| DELETE | `/api/gallery/{image_id}` | Delete gallery image (also removes from Cloudinary) |
| POST | `/api/upload` | Upload image to Cloudinary, returns secure URL |
| GET | `/api/contact` | Get all contact submissions |
| PUT | `/api/settings` | Update restaurant settings |

---

## 🔐 Admin Credentials

Admin login is seeded the first time the API runs, from environment variables — there is no hardcoded default.

Set these on Vercel before first deploy:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

*Note: To change credentials after the admin user already exists, update the password by re-hashing it, or delete the `admin_users` document in Atlas — the next request will reseed it from the current env vars.*

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
- **FastAPI** - Modern Python web framework, deployed as one Vercel serverless function
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Passlib** - Password hashing (bcrypt)
- **Python-JOSE** - JWT token handling
- **Python-Multipart** - File upload support
- **Cloudinary** - Image hosting (Vercel's filesystem is read-only, so uploads can't go to local disk)

### Database
- **MongoDB Atlas** - NoSQL database, free M0 tier

### Hosting
- **Vercel** - Single project serves both the React build and the `/api` serverless function. No separate backend host needed.

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running on localhost:27017 (or an Atlas connection string)
- A free Cloudinary account (for image uploads)
- [Vercel CLI](https://vercel.com/docs/cli) for local testing: `npm i -g vercel`

### Local development
```bash
# Frontend (terminal 1)
cd frontend
npm install
npm start          # runs on localhost:3000

# Full stack with API (terminal 2, from repo root)
vercel dev          # runs both frontend and api/index.py together, simulating production
```

### Environment Variables

**`api/.env`** (local only — in production these are set in the Vercel dashboard):
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=vine_social_tokyo
CORS_ORIGINS=*
SECRET_KEY=<generate a long random string>
ADMIN_EMAIL=admin@vinesocial.tokyo
ADMIN_PASSWORD=<choose a strong password>
CLOUDINARY_CLOUD_NAME=<from cloudinary dashboard>
CLOUDINARY_API_KEY=<from cloudinary dashboard>
CLOUDINARY_API_SECRET=<from cloudinary dashboard>
```

**`frontend/.env.production`:**
```
REACT_APP_BACKEND_URL=
```
Left empty intentionally — the frontend and API share the same Vercel domain, so requests go to a relative `/api/...` path instead of a separate backend URL.

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

### Cloudinary (production)
- Images uploaded via the admin panel are sent straight to Cloudinary — Vercel's serverless functions have a read-only, ephemeral filesystem, so a local uploads folder isn't an option there
- Each upload returns a permanent `secure_url` (e.g. `https://res.cloudinary.com/...`) plus a `public_id`
- When deleting a gallery image from the admin panel, the file is also removed from Cloudinary
- Free tier gives 25GB storage / 25GB bandwidth, which is plenty for a restaurant site

### External URLs
- You can also use external image URLs (Unsplash, Pexels, etc.)
- Paste the URL directly in the image field

---

## 🎨 Customization Guide

### Changing Colors
Edit `frontend/src/index.css`:
```css
:root {
  --background: 15 15 15;        /* Background color */
  --primary: 203 160 82;         /* Gold accent */
  --secondary: 27 59 54;         /* Deep green */
  /* ... */
}
```

### Changing Fonts
Edit `frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

### Adding Menu Categories
Update `CATEGORIES` array in:
- `frontend/src/pages/Menu.js`
- `frontend/src/pages/Admin.js`

---

## 🚨 Important Notes

1. **Do NOT hardcode URLs or credentials** in code — always use environment variables
2. **Image uploads** go to Cloudinary, not local disk — Vercel's filesystem can't persist files between requests
3. **Admin password** is set via the `ADMIN_PASSWORD` env var before first deploy, not hardcoded
4. **JWT secret key** must be set via the `SECRET_KEY` env var — there is no default fallback
5. **MongoDB connection** uses `MONGO_URL` from env vars (Atlas connection string in production)
6. **One Vercel project** serves both frontend and API — `api/index.py` becomes a single serverless function that handles every `/api/*` route

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
- [ ] Image upload returns a Cloudinary URL
- [ ] Database operations work (CRUD)
- [ ] Admin account seeds correctly on first request

### API Testing with curl

Replace `YOUR_SITE_URL` with your deployed Vercel URL (or `http://localhost:3000` when running `vercel dev` locally).

```bash
# Get menu items
curl YOUR_SITE_URL/api/menu

# Get settings
curl YOUR_SITE_URL/api/settings

# Login as admin
curl -X POST YOUR_SITE_URL/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_ADMIN_EMAIL","password":"YOUR_ADMIN_PASSWORD"}'

# Add menu item (replace {TOKEN})
curl -X POST YOUR_SITE_URL/api/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"category":"Small Plates","name":"Test Dish","description":"Delicious test","price":"¥800"}'
```

---

## 🔄 Deployment

See **DEPLOYMENT.md** in the project root for the full step-by-step guide. Summary:

| Layer | Service | Cost |
|---|---|---|
| Frontend + Backend | Vercel (one project) | Free |
| Database | MongoDB Atlas (M0) | Free |
| Images | Cloudinary | Free |
| Domain | Your registrar | ~$10–12/year |

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
