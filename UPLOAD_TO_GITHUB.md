# איך להעלות קבצים ל-GitHub

## שיטה 1: דרך הדפדפן (הכי קל!) ⭐

### שלב 1: פתח את ה-Repository
1. היכנס ל-GitHub
2. פתח את ה-Repository שיצרת (`lab-moving-schedule`)

### שלב 2: העלה קבצים
1. בדף ה-Repository, לחץ על הכפתור **"uploading an existing file"**
   (או אם יש לך כבר קבצים, לחץ על **"Add file"** → **"Upload files"**)

2. **גרור את כל התיקייה** `C:\Projects\Lab Moving` לתוך הדפדפן
   - או לחילופין: לחץ "choose your files" ובחר את כל הקבצים

3. הקבצים שצריכים להיות:
   - ✅ `index.html`
   - ✅ `app.js`
   - ✅ `style.css`
   - ✅ `config.js`
   - ✅ `firebase-config.js` (חשוב!)
   - ✅ `firebase-init.js`
   - ✅ כל שאר הקבצים (README.md, SETUP.md, וכו')

### שלב 3: Commit
1. למטה, תחת "Commit changes", כתוב:
   ```
   Initial commit - Lab Moving Schedule app
   ```

2. לחץ **"Commit changes"** (כפתור ירוק)

3. **סיימת!** כל הקבצים עכשיו ב-GitHub

---

## שיטה 2: דרך Git (אם יש לך Git מותקן)

### שלב 1: פתח Terminal/PowerShell
1. לחץ `Windows + R`
2. הקלד: `powershell`
3. לחץ Enter

### שלב 2: נווט לתיקייה
```powershell
cd "C:\Projects\Lab Moving"
```

### שלב 3: אתחל Git
```powershell
git init
git add .
git commit -m "Initial commit - Lab Moving Schedule app"
```

### שלב 4: חבר ל-GitHub
```powershell
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lab-moving-schedule.git
git push -u origin main
```

**החלף `YOUR-USERNAME`** בשם המשתמש שלך ב-GitHub!

---

## איך יודעים שהכל עלה?

1. רענן את דף ה-Repository ב-GitHub
2. אתה אמור לראות את כל הקבצים:
   - `index.html`
   - `app.js`
   - `style.css`
   - `config.js`
   - `firebase-config.js`
   - וכו'

3. אם אתה רואה את כל הקבצים → **הצלחת!** ✅

---

## בעיות נפוצות

**"File too large":**
- GitHub מגביל קבצים גדולים
- אם יש לך קובץ גדול, תצטרך Git LFS

**"firebase-config.js לא עלה":**
- ודא שהוא לא ב-.gitignore
- העלה אותו ידנית

**"Nothing to commit":**
- הקבצים כבר ב-GitHub
- זה בסדר!

---

## הבא: חיבור ל-Netlify

אחרי שהכל עלה ל-GitHub:
1. היכנס ל-Netlify: [app.netlify.com](https://app.netlify.com)
2. "Add new site" → "Import from GitHub"
3. בחר את ה-Repository
4. Deploy!

