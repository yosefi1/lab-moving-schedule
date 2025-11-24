# Setup Instructions for Shared Data

This app uses Firebase (free) to share data between all users in real-time.

## Quick Setup (5 minutes)

### Step 1: Create Firebase Account
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with your Google account (or create one)
3. Click "Add project" or "Create a project"

### Step 2: Create Firebase Project
1. Enter project name: `lab-moving-schedule` (or any name)
2. Click "Continue"
3. **Disable Google Analytics** (not needed, saves time)
4. Click "Create project"
5. Wait a few seconds, then click "Continue"

### Step 3: Enable Firestore Database
1. In Firebase Console, click "Firestore Database" in the left menu
2. Click "Create database"
3. Select "Start in test mode" (for now - it's fine for internal use)
4. Click "Next"
5. Choose a location (pick closest to you)
6. Click "Enable"

### Step 4: Get Your Config
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the `</>` (web) icon
5. Register app name: `Lab Moving Schedule`
6. Click "Register app"
7. **Copy the config object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5: Create Config File
1. Copy `firebase-config.js.example` to `firebase-config.js`
2. Paste your Firebase config values into `firebase-config.js`
3. Make sure it looks like this (use `var` not `export`):

```javascript
var firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

**Important:** Use `var firebaseConfig = { ... }` (not `export const`)

### Step 6: Set Firestore Rules (Important!)
1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace the rules with this (allows read/write for everyone - fine for internal use):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click "Publish"

### Step 7: Test It!
1. Open `index.html` in your browser
2. You should see "✅ Connected" instead of "🔄 Connecting..."
3. Add a task - it should save
4. Open the same page in another browser/device
5. You should see the same task! 🎉

## Deploy to Share

Once set up, deploy to one of these (see README.md):
- **Netlify Drop**: Drag folder to [netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages**: Upload to GitHub and enable Pages
- **Vercel**: Drag folder to [vercel.com](https://vercel.com)

**Important:** Make sure `firebase-config.js` is included when you deploy!

## Security Note

The current Firestore rules allow anyone with the URL to read/write. For internal company use, this is usually fine. If you need more security later, we can add authentication.

## Troubleshooting

**"Firebase not configured" error:**
- Make sure `firebase-config.js` exists (not just `.example`)
- Check that all values are filled in correctly

**Data not syncing:**
- Check browser console (F12) for errors
- Verify Firestore rules are published
- Make sure Firestore is enabled in Firebase Console

**Need help?** Let me know!

