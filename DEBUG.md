# Debugging Firebase Connection

If you see "🔄 Connecting..." instead of "✅ Connected & Synced", follow these steps:

## Step 1: Check Browser Console
1. Open `index.html` in your browser
2. Press **F12** (or right-click → Inspect)
3. Click the **Console** tab
4. Look for error messages (red text)

**Common errors:**
- `Firebase config not found` → Check firebase-config.js exists
- `Permission denied` → Firestore rules need to be set
- `CORS error` → Need to deploy (can't use file://)

## Step 2: Verify Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **lab-moving-schedule**
3. Click **Firestore Database** (left menu)
4. Click **Rules** tab
5. Make sure it says:

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

6. Click **Publish** if you changed anything

## Step 3: Test Locally (Limited)
**Important:** Opening `index.html` directly (file://) may have CORS issues.

**Better:** Use a local server:
1. Open terminal in your project folder
2. Run: `python -m http.server 8000` (or `python3 -m http.server 8000`)
3. Open browser: `http://localhost:8000`

## Step 4: Deploy (Best Solution)
The easiest way is to deploy online. See DEPLOY.md for instructions.

