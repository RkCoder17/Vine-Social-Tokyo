# Deployment Guide — Vine Social Tokyo (Option 2: Everything on Vercel)

One Vercel project hosts both the React frontend and the FastAPI backend (as a serverless function). No Render, no separate backend host.

| Layer | Service | Cost |
|---|---|---|
| Frontend + API | Vercel | Free |
| Database | MongoDB Atlas (M0) | Free |
| Images | Cloudinary | Free |
| Domain | Your registrar | ~$10–12/year (optional) |

---

## 0. Push to GitHub

Vercel deploys from a GitHub repo.

```bash
cd vine-social-tokyo
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vine-social-tokyo.git
git push -u origin main
```

`.gitignore` already excludes `.env` files and `node_modules` — don't commit real secrets.

---

## 1. MongoDB Atlas (Database) — ~10 min

1. https://www.mongodb.com/cloud/atlas/register → create a free account.
2. Create a **free M0 cluster** (pick a region close to your users, e.g. Tokyo/Singapore).
3. **Database Access** → add a database user (username + password). Save these.
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`). Required since Vercel functions don't have fixed IPs.
5. **Database** → Connect → Drivers → copy the connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `PASSWORD` with your real password. This is your `MONGO_URL` for step 3.

---

## 2. Cloudinary (Image Hosting) — ~10 min

1. https://cloudinary.com/users/register/free → sign up.
2. Your **Dashboard** immediately shows: Cloud Name, API Key, API Secret.
3. Copy all three for step 3.

This is what your admin panel's image uploads use instead of a local folder — Vercel's serverless functions can't persist files between requests, so this is the "folder" equivalent that actually survives.

---

## 3. Deploy to Vercel — ~10 min

1. https://vercel.com → sign up with GitHub.
2. **Add New** → **Project** → import `vine-social-tokyo`.
3. Vercel should auto-detect the config from `vercel.json` (frontend build + Python function). Leave Root Directory as the repo root — do **not** set it to `frontend`, since `api/` needs to stay visible at the project root.
4. Before deploying, add these **Environment Variables** (Project Settings → Environment Variables, or during import):

   | Key | Value |
   |---|---|
   | `MONGO_URL` | your Atlas connection string from step 1 |
   | `DB_NAME` | `vine_social_tokyo` |
   | `CORS_ORIGINS` | `*` (you can leave this — same-origin requests don't need CORS anyway, this only matters if you call the API from elsewhere) |
   | `SECRET_KEY` | a long random string — generate with `openssl rand -hex 32` |
   | `ADMIN_EMAIL` | the email you want to log into `/admin` with |
   | `ADMIN_PASSWORD` | a strong password — seeds the admin account on first API call |
   | `CLOUDINARY_CLOUD_NAME` | from step 2 |
   | `CLOUDINARY_API_KEY` | from step 2 |
   | `CLOUDINARY_API_SECRET` | from step 2 |

5. Leave `REACT_APP_BACKEND_URL` **unset** (or empty). Frontend and API share the same domain, so the app calls a relative `/api/...` path automatically.
6. Click **Deploy**. First build takes a few minutes (installs frontend deps, builds React, bundles the Python function).
7. Once live, you'll get a URL like:
   ```
   https://vine-social-tokyo.vercel.app
   ```

8. Sanity check the API:
   ```bash
   curl https://vine-social-tokyo.vercel.app/api/settings
   ```
   You should get back a JSON settings object.

> **No cold-start penalty pattern to worry about here** the way Render's free tier has — Vercel functions spin up fast on demand. First request after a long idle period may take a second or two longer, but nothing like Render's 30–50s wake-up.

---

## 4. Custom Domain (optional) — ~15 min

If you bought `vinesocial.tokyo` (or similar):

1. Vercel → your project → **Settings → Domains** → add `vinesocial.tokyo` and `www.vinesocial.tokyo`.
2. Vercel shows you DNS records (usually an `A` record + `CNAME`).
3. Add those records at your domain registrar (GoDaddy, Namecheap, etc.).
4. DNS propagation can take minutes to a few hours.

No CORS changes needed afterward — frontend and API are still same-origin under your new domain.

---

## 5. Final checklist

- [ ] Visit your Vercel URL — homepage loads
- [ ] `/menu`, `/gallery`, `/about`, `/parties`, `/contact` all load
- [ ] Submit the contact form — confirm it shows up under `/admin` → Contact tab (or in Atlas, `contact_submissions` collection)
- [ ] Go to `/admin`, log in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Upload a gallery image — confirm the URL starts with `https://res.cloudinary.com/...`
- [ ] Delete that test image — confirm it's removed from both the gallery and Cloudinary (check your Cloudinary Media Library)
- [ ] Add/edit/delete a menu item
- [ ] Update settings (hours, phone, etc.) and confirm it reflects on the public site

---

## Local development

```bash
npm i -g vercel          # one-time
vercel link              # connect this folder to your Vercel project
vercel env pull api/.env # pulls your real env vars down for local testing (optional)
vercel dev                # runs frontend + api/index.py together on localhost:3000
```

`vercel dev` is the closest simulation of production — it routes `/api/*` to the Python function exactly like the real deployment.

---

## Troubleshooting

**Admin login fails with "Invalid credentials"**
The admin account seeds itself on the *first* API request after deploy, using whatever `ADMIN_EMAIL`/`ADMIN_PASSWORD` were set at that time. If you changed `ADMIN_PASSWORD` after that, the old one is still in Mongo. Fix: in Atlas, delete the document in `admin_users`, then make any API request (e.g. reload `/admin`) — it reseeds from your current env vars.

**Images fail to upload**
Check the three `CLOUDINARY_*` values in Vercel's environment variables for typos — this is the most common cause. Check the function logs (Vercel dashboard → your project → Deployments → click a deployment → Functions) for the exact error.

**"Internal Server Error" on any `/api/*` call right after deploy**
Almost always a missing required env var — `MONGO_URL`, `SECRET_KEY`, `ADMIN_PASSWORD`, or one of the `CLOUDINARY_*` vars. The code intentionally raises on a missing var instead of silently using an insecure default, so check the function logs for a `KeyError`.

**Changes to `api/index.py` don't seem to apply**
Each push to GitHub triggers a fresh Vercel deployment, so this is usually a browser cache issue — hard refresh, or check you're looking at the latest deployment in the Vercel dashboard, not a stale preview URL.

**Build fails with a Python dependency error**
Confirm `requirements.txt` is at the **repo root**, not inside `api/`. Vercel looks for it there to detect and install the Python function's dependencies.
