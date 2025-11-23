# הוראות מהירות - חיבור GitHub ל-Netlify

## שלבים מהירים:

### 1. העלה ל-GitHub (5 דקות)
1. צור Repository חדש ב-GitHub
2. העלה את כל הקבצים (כולל `firebase-config.js`!)
3. Commit

### 2. חבר ל-Netlify (2 דקות)
1. Netlify → "Add new site" → "Import from GitHub"
2. בחר את ה-Repository
3. Deploy!

### 3. קבל URL קבוע
- Netlify יתן לך URL כמו: `https://your-site.netlify.app`
- זה ה-URL הקבוע - לא ישתנה!

## עכשיו כל push = עדכון אוטומטי! 🚀

**דוגמה:**
```bash
# שינית סיסמה ב-config.js
git add config.js
git commit -m "Updated password"
git push
# → Netlify מעדכן אוטומטית תוך 1-2 דקות!
```

## ⚠️ חשוב!
**ודא ש-`firebase-config.js` נכלל ב-GitHub!**
- הקובץ צריך להיות ב-Repository
- בלי זה, האפליקציה לא תתחבר ל-Firebase

## עזרה?
ראה `GITHUB_NETLIFY_SETUP.md` להוראות מפורטות בעברית.

