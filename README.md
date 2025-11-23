# Lab Moving Schedule Web App

A beautiful, interactive web application for tracking lab migration tasks and timelines.

## Quick Start (Local)

Simply open `index.html` in your web browser. No server needed!

## Sharing with Others

Here are several ways to make this app accessible to your team:

### Option 1: GitHub Pages (Free & Easy) ⭐ Recommended

1. Create a GitHub account (if you don't have one)
2. Create a new repository (e.g., "lab-moving-schedule")
3. Upload all three files (`index.html`, `style.css`, `app.js`) to the repository
4. Go to repository Settings → Pages
5. Select "main" branch and click Save
6. Your app will be live at: `https://yourusername.github.io/lab-moving-schedule/`

**Pros:** Free, easy, permanent URL, automatic HTTPS
**Cons:** Requires GitHub account

### Option 2: Netlify Drop (Free, No Account Needed)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your project folder
3. Get an instant URL (e.g., `https://random-name-123.netlify.app`)

**Pros:** Super fast, no account needed, free
**Cons:** URL changes each time you upload

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "Add New Project"
4. Drag and drop your folder or connect GitHub
5. Deploy!

**Pros:** Free, fast, great performance
**Cons:** Requires account

### Option 4: Local Network Sharing

If everyone is on the same network:

1. Install Python (if not installed)
2. Open terminal in this folder
3. Run: `python -m http.server 8000`
4. Share your IP address: `http://YOUR_IP:8000`
   - Find your IP: Windows: `ipconfig`, Mac/Linux: `ifconfig`

**Pros:** No internet needed, instant
**Cons:** Only works on same network, requires your computer to be on

### Option 5: Simple Cloud Storage

Upload to:
- **Google Drive** → Share link → Anyone with link can view
- **OneDrive** → Share link
- **Dropbox** → Share link

**Note:** Some services may require users to download files instead of viewing directly.

## Shared Data Setup

✅ **This app now supports shared data!** All users see the same tasks in real-time.

**To enable shared data:**
1. Follow the instructions in `SETUP.md` to configure Firebase (free, takes 5 minutes)
2. Create `firebase-config.js` from `firebase-config.js.example`
3. Deploy the app (see options below)

**Without Firebase:** The app will work with localStorage (each user has their own data)

## Features

- ✅ Visual timeline (weeks 14-28)
- ✅ Color-coded tasks
- ✅ Dependencies tracking
- ✅ Finish-before dates
- ✅ Add/Edit/Delete tasks
- ✅ Export to JSON
- ✅ Responsive design
- ✅ Auto-save in browser

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling
- `app.js` - Application logic

## Need Help?

If you want to add shared data storage (so everyone sees the same tasks), we can add:
- Firebase (free tier available)
- A simple backend server
- Google Sheets integration

Let me know if you need help setting up any of these options!

