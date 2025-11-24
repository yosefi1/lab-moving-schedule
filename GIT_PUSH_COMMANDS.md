# פקודות Git לדחיפה ל-GitHub

## שלב 1: מצא את ה-URL של ה-Repository

1. היכנס ל-GitHub
2. פתח את ה-Repository שלך
3. לחץ על הכפתור הירוק **"Code"**
4. העתק את ה-URL (HTTPS או SSH)

**דוגמה:** `https://github.com/YOUR-USERNAME/lab-moving-schedule.git`

---

## שלב 2: חבר את ה-Repository המקומי ל-GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/lab-moving-schedule.git
```

**החלף `YOUR-USERNAME` ו-`lab-moving-schedule`** בשם המשתמש והשם של ה-repository שלך!

---

## שלב 3: דחוף את השינויים

```bash
git push -u origin main
```

**או אם ה-branch שלך נקרא `master`:**
```bash
git push -u origin master
```

---

## אם יש שגיאה "upstream branch"

אם תקבל שגיאה, נסה:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## סיכום - כל הפקודות:

```bash
# 1. חבר ל-GitHub (החלף את ה-URL!)
git remote add origin https://github.com/YOUR-USERNAME/lab-moving-schedule.git

# 2. דחוף
git push -u origin main
```

---

## אם כבר יש remote:

אם תקבל שגיאה "remote origin already exists", אז:

```bash
# בדוק מה ה-remote הנוכחי
git remote -v

# אם צריך לשנות:
git remote set-url origin https://github.com/YOUR-USERNAME/lab-moving-schedule.git

# ואז דחוף:
git push -u origin main
```

