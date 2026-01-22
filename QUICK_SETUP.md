# 🚀 Quick Setup Guide - Get Running in 5 Minutes

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB Atlas account OR Local MongoDB running

---

## Step 1: Install Dependencies (2 minutes)

```powershell
cd d:\Muzhir\campus-career-system
npm run install-all
```

This installs dependencies for root, backend, and frontend.

---

## Step 2: Configure Database (2 minutes)

### Option A: MongoDB Atlas (Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Create `backend/.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-career
JWT_SECRET=your-secret-key-change-this
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
```

### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create `backend/.env` file:

```env
MONGO_URI=mongodb://localhost:27017/campus-career
JWT_SECRET=your-secret-key-change-this
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
```

**Quick Copy**: Copy `backend/.env.example` to `backend/.env` and update values.

---

## Step 3: Start Application (1 minute)

```powershell
npm start
```

This will:
- ✅ Check dependencies
- ✅ Start backend (port 5000)
- ✅ Start frontend (port 3000)
- ✅ Open browser automatically

---

## Step 4: Verify (30 seconds)

### Check Backend:
```
http://localhost:5000/api/health
```
Should return: `{"status":"OK","timestamp":"..."}`

### Check Frontend:
```
http://localhost:3000
```
Should show login page.

### Check Database Connection:
Look for in console: `✓ MongoDB connected successfully`

---

## ✅ Success!

If you see:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected successfully
- ✅ Browser opened to login page

**You're all set!** 🎉

---

## 🐛 Quick Troubleshooting

### "Node.js not found"
→ Install Node.js from https://nodejs.org/

### "MongoDB connection failed"
→ Check `backend/.env` file and MongoDB setup (see `SETUP_DATABASE.md`)

### "Port already in use"
→ Stop other services or use `npm run stop`

### "Module not found"
→ Run `npm run install-all` again

---

## 📚 Need More Help?

- **Database Setup**: See `SETUP_DATABASE.md`
- **Detailed Guide**: See `BUILD_AND_RUN.md`
- **Requirements**: See `REQUIREMENTS.md`

---

**Ready?** Run `npm start` and you're good to go! 🚀
