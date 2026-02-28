# 🚀 Authentication Quick Reference

## 🎯 Test Accounts (Ready to Use)

### Student Account
- **Email:** `student@test.com`
- **Password:** `Student123`

### Recruiter Account  
- **Email:** `recruiter@test.com`
- **Password:** `Recruiter123`

### Admin Account
- **Email:** `admin@test.com`
- **Password:** `Admin123`

---

## 🔌 How to Access

**Application URL:** https://localhost:3000

**Login Page:** Automatically shown when not logged in

1. Enter email and password
2. Click "🚀 Login"
3. You're in! 🎉

---

## 📝 Create Your Own Account

1. On login page, click **"Register"** tab
2. Fill in:
   - Full Name: `Your Name`
   - Email: `your.email@example.com`
   - Password: `AnyPassword123` (min 6 chars)
   - Role: Select Student or Recruiter
3. Click **"✨ Create Account"**
4. Back to login, use your new credentials
5. Done! ✅

---

## 🔐 Password Rules

✅ Minimum 6 characters  
✅ Can contain letters, numbers, special characters  
❌ Must be unique per account  

**Examples:**
- `Password123` ✅
- `MySecure456` ✅
- `abc` ❌ (too short)

---

## 🛠️ Admin Commands

### Reseed Test Users
```bash
cd backend
npm run seed-test-users
```

### Test Authentication Locally
```bash
node test-auth.js
```

### Check Password Hashing
```bash
node check-password.js
```

---

## 🔑 What Happens When You Login

1. ✅ Email and password sent to backend
2. ✅ Password verified using bcryptjs
3. ✅ JWT token generated (24-hour expiration)
4. ✅ Token stored in localStorage
5. ✅ User data stored in localStorage
6. ✅ Redirected to dashboard
7. ✅ Session persists until logout

---

## 🚪 Logout

Click your name/avatar in the navbar → Select **"Logout"**

This:
- Clears tokens from localStorage
- Logs out at backend
- Redirects to login page

---

## ❌ Common Issues & Fixes

### "Invalid email or password"
✓ Check spelling (case-sensitive password)  
✓ Verify email exists  
✓ Confirm password is correct  

### "Email already registered"
✓ Use different email for signup  
✓ Or login with existing account  

### "Token expired"
✓ Login again (24-hour expiration)  

### "Can't connect to API"
✓ Ensure backend running on :5000  
✓ Check CORS is enabled  

### "Page won't load without login"
✓ Clear localStorage: `localStorage.clear()`  
✓ Refresh page  
✓ Login again  

---

## 📱 What's Happening Behind the Scenes

**Backend does:**
- Store users in MongoDB
- Hash passwords with bcryptjs
- Generate JWT tokens
- Validate requests

**Frontend does:**
- Show login/register forms
- Store tokens locally
- Send tokens with API requests
- Auto-logout on token expiry

---

## 🔒 Security Features

🔐 Passwords never sent back from API  
🔐 Tokens expire after 24 hours  
🔐 Only HTTPS in production  
🔐 Login attempts tracked  
🔐 Invalid login attempts logged  

---

## 🎓 Learn More

- Full guide: `AUTHENTICATION_GUIDE.md`
- Detailed docs: `AUTHENTICATION_COMPLETE.md`
- API reference: `backend/routes/authRoutes.js`

---

**Status:** ✅ All working  
**Last Update:** February 26, 2026  
**Version:** 2.0.0
