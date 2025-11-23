# חיבור GitHub ל-Netlify - עדכונים אוטומטיים

## שלב 1: העלאת הקבצים ל-GitHub

### א. יצירת Repository חדש
1. היכנס ל-GitHub: [github.com](https://github.com)
2. לחץ על **"+"** (פינה ימנית עליונה) → **"New repository"**
3. שם ה-Repository: `lab-moving-schedule` (או כל שם שתרצה)
4. בחר **Public** (חשוב!)
5. **אל תסמן** "Add README" (כי יש לך כבר קבצים)
6. לחץ **"Create repository"**

### ב. העלאת הקבצים
יש לך 2 אפשרויות:

**אפשרות A: דרך הדפדפן (קל)**
1. בדף ה-Repository החדש, לחץ **"uploading an existing file"**
2. גרור את כל הקבצים מהתיקייה `C:\Projects\Lab Moving`:
   - `index.html`
   - `app.js`
   - `style.css`
   - `config.js`
   - `firebase-config.js`
   - `firebase-init.js`
   - כל שאר הקבצים
3. למטה, כתוב הודעה: `Initial commit`
4. לחץ **"Commit changes"**

**אפשרות B: דרך Git (אם יש לך Git מותקן)**
```bash
cd "C:\Projects\Lab Moving"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lab-moving-schedule.git
git push -u origin main
```

---

## שלב 2: חיבור ל-Netlify

### א. יצירת חשבון/התחברות
1. היכנס ל-Netlify: [app.netlify.com](https://app.netlify.com)
2. התחבר עם חשבון GitHub שלך (לחץ "Sign up with GitHub")

### ב. חיבור ה-Repository
1. בדף הראשי של Netlify, לחץ **"Add new site"** → **"Import an existing project"**
2. בחר **"Deploy with GitHub"**
3. אם צריך, אשר את הגישה ל-GitHub
4. בחר את ה-Repository: `lab-moving-schedule`
5. לחץ **"Deploy site"**

### ג. הגדרות (אופציונלי)
Netlify יזהה אוטומטית:
- Build command: (ריק - אין צורך)
- Publish directory: `/` (root)

**פשוט לחץ "Deploy site"!**

---

## שלב 3: קבלת ה-URL

1. אחרי כמה שניות, תקבל URL כמו:
   `https://random-name-123.netlify.app`
2. **זה ה-URL הקבוע שלך!** (לא ישתנה)
3. שתף את ה-URL + הסיסמה עם הצוות

---

## איך זה עובד עכשיו? ✨

### כל פעם שאתה עושה שינויים:

1. **ערוך קבצים מקומית** (במחשב שלך)
2. **Push ל-GitHub:**
   - דרך הדפדפן: ערוך ב-GitHub → Commit
   - דרך Git: `git push`
3. **Netlify מעדכן אוטומטית!** 🎉
   - תראה הודעה ב-Netlify: "Deploy in progress"
   - אחרי 1-2 דקות, השינויים חיים!

### דוגמה:
```bash
# ערכת את config.js (שינית סיסמה)
git add config.js
git commit -m "Changed password"
git push
# → Netlify מעדכן אוטומטית!
```

---

## יתרונות

✅ **עדכונים אוטומטיים** - כל push מעדכן את האתר  
✅ **URL קבוע** - לא משתנה  
✅ **היסטוריית גרסאות** - כל שינוי נשמר ב-GitHub  
✅ **גיבוי אוטומטי** - כל הקבצים ב-GitHub  
✅ **עבודה משותפת** - כמה אנשים יכולים לערוך  

---

## טיפים

### שינוי שם ה-URL ב-Netlify:
1. Netlify Dashboard → Site settings
2. Change site name → בחר שם (למשל: `lab-moving-schedule`)
3. ה-URL יהיה: `https://lab-moving-schedule.netlify.app`

### צפייה ב-Deployments:
- ב-Netlify Dashboard תראה כל עדכון
- אפשר לראות מה השתנה בכל deployment

### Rollback (חזרה לגרסה קודמת):
- ב-Netlify → Deploys
- לחץ על deployment קודם → "Publish deploy"

---

## בעיות נפוצות

**"Deploy failed":**
- בדוק שה-`index.html` נמצא ב-root
- בדוק שאין שגיאות בקוד

**"Site not found":**
- ודא שה-Repository הוא **Public**
- ודא שהקבצים הועלו ל-GitHub

**שינויים לא מתעדכנים:**
- ודא שעשית `git push` (או commit דרך הדפדפן)
- חכה 1-2 דקות לעדכון

---

## סיכום

1. ✅ העלה קבצים ל-GitHub
2. ✅ חבר ל-Netlify
3. ✅ קבל URL קבוע
4. ✅ כל `git push` מעדכן אוטומטית!

**זה בדיוק כמו Vercel - כל push = עדכון אוטומטי!** 🚀

