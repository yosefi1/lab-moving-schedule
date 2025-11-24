# Password Protection & Domain Settings

## 🔒 Password Protection

### Change the Password

1. Open `config.js` file
2. Find this line:
   ```javascript
   password: "lab2024",
   ```
3. Change `"lab2024"` to your desired password
4. Save the file

**Example:**
```javascript
password: "MySecurePassword123!",
```

### Disable Password Protection

If you don't want a password:
1. Open `config.js`
2. Change this line:
   ```javascript
   requirePassword: true
   ```
   to:
   ```javascript
   requirePassword: false
   ```

### How It Works

- Users must enter the password when they first visit
- Password is stored in browser session (cleared when browser closes)
- Same password for everyone (simple protection)
- For stronger security, we can add user accounts later

---

## 🌐 Domain Name Options

### Option 1: Netlify Custom Domain (Free)

1. Deploy to Netlify (drag folder to netlify.com/drop)
2. Go to your site settings in Netlify
3. Click "Domain settings"
4. Click "Add custom domain"
5. Enter your domain (e.g., `lab-moving.yourcompany.com`)
6. Follow instructions to update DNS

**Cost:** Free (if you own the domain)

### Option 2: Netlify Subdomain (Free, Easy)

1. Deploy to Netlify
2. Go to site settings → Domain settings
3. Click "Options" → "Edit site name"
4. Change to something like: `lab-moving-schedule`
5. Your URL becomes: `https://lab-moving-schedule.netlify.app`

**Cost:** Free, instant

### Option 3: Use Your Own Domain

If you have a domain (e.g., `yourcompany.com`):
1. Deploy to Netlify/Vercel
2. Add custom domain in settings
3. Point DNS to: `CNAME` → `your-site.netlify.app`
4. Wait for DNS to propagate (5-30 minutes)

**Example URLs:**
- `lab-moving.yourcompany.com`
- `schedule.yourcompany.com`
- `moving.yourcompany.com`

### Option 4: GitHub Pages Custom Domain

1. Deploy to GitHub Pages
2. In repository Settings → Pages
3. Under "Custom domain", enter your domain
4. Update DNS records as shown

---

## 🔐 Security Notes

**Current Password System:**
- Simple password protection (one password for everyone)
- Password stored in `config.js` (visible in source code)
- Good for: Internal team use, basic protection
- Not for: Highly sensitive data, public access

**For Better Security (if needed):**
- We can add Firebase Authentication (user accounts)
- We can add role-based access (admin vs viewer)
- We can encrypt the password

**Current Setup is Good For:**
- Internal company use
- Team collaboration
- Preventing casual access

---

## Quick Setup

1. **Set Password:** Edit `config.js` → change `password: "lab2024"`
2. **Deploy:** Drag folder to netlify.com/drop
3. **Share URL:** Give team the Netlify URL + password
4. **Done!** Everyone can access with the password

---

## Need Help?

- **Change password:** Edit `config.js`
- **Custom domain:** Follow Option 1 or 3 above
- **Remove password:** Set `requirePassword: false` in `config.js`

