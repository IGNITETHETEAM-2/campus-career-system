# Build and Run Guide - Campus Career System

## ⚠️ Prerequisites - MUST INSTALL FIRST

### 1. Install Node.js (REQUIRED)
**Status**: ❌ Not currently installed

**Steps:**
1. Download Node.js LTS from: https://nodejs.org/
   - Recommended: v20.x LTS or v18.x LTS
2. Run the installer
3. Accept default options
4. **IMPORTANT**: Restart your PowerShell/Command Prompt after installation
5. Verify installation:
   ```powershell
   node --version  # Should show v18.x or v20.x
   npm --version   # Should show v9.x or v10.x
   ```

### 2. Setup MongoDB (REQUIRED)
Choose ONE option:

**Option A: Local MongoDB**
- Download: https://www.mongodb.com/try/download/community
- Install with default settings
- MongoDB service starts automatically
- Default connection: `mongodb://localhost:27017/campus-career`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Visit: https://www.mongodb.com/cloud/atlas
- Create free account
- Create free cluster
- Get connection string
- Update `MONGO_URI` in `.env` file (see Configuration section)

## 📁 Project Structure

```
campus-career-system/
├── backend/              # Node.js/Express API server
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Backend entry point
├── frontend/            # React application
│   ├── public/          # Static files
│   └── src/             # React source code
├── start.js             # Auto-start script
└── package.json         # Root package configuration
```

## 🚀 Build and Run - Quick Start

### Method 1: Automatic (Recommended)

**After installing Node.js and MongoDB:**

```powershell
# Navigate to project directory
cd d:\Muzhir\campus-career-system

# Start both servers automatically
npm start
```

**What happens:**
- ✅ Checks for Node.js and npm
- ✅ Installs all dependencies (first time only)
- ✅ Creates `.env` files if missing
- ✅ Starts backend server (port 5000)
- ✅ Starts frontend React app (port 3000)
- ✅ Opens browser automatically at http://localhost:3000

### Method 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` file (or it will be auto-created with defaults):

```env
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/campus-career

# For MongoDB Atlas (replace with your connection string):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-career

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key-change-this-in-production-min-32-chars

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
```

### Frontend Environment Variables

Create `frontend/.env` file (or environment variables set in start.js):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🏗️ Production Build

### Build Frontend for Production

```powershell
cd frontend
npm install
npm run build
```

This creates optimized production files in `frontend/build/` directory.

### Serve Production Build

```powershell
# Option 1: Serve with backend
cd backend
NODE_ENV=production node server.js
# Add static file serving in server.js if needed

# Option 2: Use serve package
npm install -g serve
serve -s build -l 3000
```

## ✅ Verification

### 1. Check Installation
```powershell
node --version    # Should be v14.0.0 or higher
npm --version     # Should be v6.0.0 or higher
```

### 2. Check MongoDB
**Local:**
```powershell
# Check if MongoDB service is running (Windows)
Get-Service MongoDB
```

**Atlas:**
- Test connection string in MongoDB Compass
- Or verify in Atlas dashboard

### 3. Start Application
```powershell
npm start
```

### 4. Verify Servers

**Backend Health Check:**
```
http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-01-17T..."
}
```

**Frontend:**
```
http://localhost:3000
```
Should show the Campus Career System login page.

## 🐛 Troubleshooting

### Issue: "node is not recognized"
**Cause**: Node.js not installed or not in PATH
**Solution**: 
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. Verify: `node --version`

### Issue: "Port 5000 already in use"
**Cause**: Another service using port 5000
**Solution**:
```powershell
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use the stop script
npm run stop
```

### Issue: "Port 3000 already in use"
**Cause**: Another React app or service using port 3000
**Solution**:
```powershell
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "MongoDB connection failed"
**Local MongoDB:**
- Check if MongoDB service is running
- Verify connection string: `mongodb://localhost:27017/campus-career`

**MongoDB Atlas:**
- Verify connection string in `.env` file
- Check network access in Atlas dashboard (add your IP)
- Verify database user credentials

### Issue: "Module not found" or "Dependencies missing"
**Solution**:
```powershell
# Install dependencies
npm install

# Or install all (root, backend, frontend)
npm run install-all
```

### Issue: "npm ERR! code EACCES"
**Cause**: Permission issues
**Solution**:
- Run PowerShell as Administrator
- Or use `npm install --legacy-peer-deps`

## 📊 Application URLs

Once running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **API Endpoints**: http://localhost:5000/api/*

## 🎯 Next Steps After Running

1. **Register Account**: Visit http://localhost:3000 and click "Register"
2. **Login**: Use your registered credentials
3. **Explore Features**:
   - Dashboard with statistics
   - Events management
   - Feedback submission
   - Campus notices
   - Career analysis (AI-powered)

## 📝 Development Notes

- **Hot Reload**: Enabled in development mode (auto-refresh on file changes)
- **API CORS**: Configured to allow requests from localhost:3000
- **JWT Tokens**: Expire after 24 hours (configurable)
- **Database**: Auto-creates collections on first use
- **Logging**: Request logs in backend console

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Use strong passwords for MongoDB Atlas
- Restrict CORS_ORIGIN in production
- Never commit `.env` files to version control

---

**Ready to start?** Install Node.js first, then run: `npm start`
