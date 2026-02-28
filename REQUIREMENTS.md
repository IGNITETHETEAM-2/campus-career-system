# Campus Management System - Requirements & Build Guide

## 📋 System Requirements

### Required Software

#### 1. Node.js (REQUIRED - Not Currently Installed)
- **Minimum Version**: Node.js v14.0.0
- **Recommended Version**: Node.js v18.x LTS or v20.x LTS
- **Download**: https://nodejs.org/
- **Installation**: Download and run the installer (includes npm automatically)
- **Verify Installation**:
  ```powershell
  node --version  # Should show v14.0.0 or higher
  npm --version   # Should show v6.0.0 or higher
  ```

#### 2. MongoDB Database (REQUIRED)
Choose **ONE** of the following options:

**Option A: Local MongoDB (Recommended for Development)**
- **Version**: MongoDB Community Edition 4.4 or higher
- **Download**: https://www.mongodb.com/try/download/community
- **Default Connection**: `mongodb://localhost:27017/campus-career`
- **Setup**: Install MongoDB, start the service (auto-starts on Windows)

**Option B: MongoDB Atlas (Cloud - Free Tier Available)**
- **Setup**: Create free account at https://www.mongodb.com/cloud/atlas
- **Connection**: Use connection string from Atlas dashboard
- **Advantage**: No local installation needed

#### 3. Code Editor (Optional but Recommended)
- **Visual Studio Code**: https://code.visualstudio.com/
- **Or any text editor** for viewing/editing files

### Optional Tools
- **Git**: For version control (https://git-scm.com/)
- **Postman**: For API testing (https://www.postman.com/)

## 📦 Dependencies

### Backend Dependencies (Auto-installed)
- **express**: ^4.18.2 - Web framework
- **mongoose**: ^7.0.0 - MongoDB ODM
- **dotenv**: ^16.0.3 - Environment variables
- **jsonwebtoken**: ^9.0.0 - JWT authentication
- **bcryptjs**: ^2.4.3 - Password hashing
- **cors**: ^2.8.5 - Cross-origin resource sharing
- **nodemon**: ^2.0.22 (dev) - Auto-restart server

### Frontend Dependencies (Auto-installed)
- **react**: ^18.2.0 - React library
- **react-dom**: ^18.2.0 - React DOM rendering
- **react-scripts**: 5.0.1 - Create React App scripts

## 🔧 Environment Configuration

### Required Environment Variables

#### Backend (.env in backend/ directory)
```env
MONGO_URI=mongodb://localhost:27017/campus-career
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
```

#### Frontend (environment variables set in start.js)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🚀 Build & Run Instructions

### Prerequisites Check
1. ✅ Node.js installed (`node --version`)
2. ✅ npm installed (`npm --version`)
3. ✅ MongoDB running (local or Atlas configured)

### Step 1: Install Node.js
1. Download Node.js LTS from https://nodejs.org/
2. Run installer with default options
3. **Restart PowerShell/Command Prompt**
4. Verify: `node --version` and `npm --version`

### Step 2: Setup MongoDB

**For Local MongoDB:**
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB service starts automatically
4. No further configuration needed

**For MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `MONGO_URI` in `.env` file

### Step 3: Configure Environment
- `.env` files are created automatically if missing
- Default values work for local development
- Update `MONGO_URI` if using MongoDB Atlas
- Change `JWT_SECRET` for production

### Step 4: Build & Run

#### Automatic Method (Recommended)
```powershell
# Navigate to project directory
cd d:\Muzhir\campus-career-system

# Install dependencies and start both servers
npm start
```

This will:
- ✅ Check for Node.js and npm
- ✅ Install all dependencies (first time only)
- ✅ Start backend server on port 5000
- ✅ Start frontend React app on port 3000
- ✅ Open browser automatically

#### Manual Method (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm start
```

### Step 5: Production Build

```powershell
# Build frontend for production
cd frontend
npm run build

# Start backend in production mode
cd ../backend
NODE_ENV=production node server.js
```

## 📍 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **API Base**: http://localhost:5000/api

## 🏗️ Project Structure

```
campus-career-system/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/            # React frontend
│   ├── public/          # Static files
│   └── src/             # React source code
│       ├── pages/       # Page components
│       ├── components/  # Reusable components
│       └── api.js       # API client
└── start.js             # Auto-start script
```

## 🔍 Verification Steps

1. **Check Node.js Installation:**
   ```powershell
   node --version
   npm --version
   ```

2. **Check MongoDB Connection:**
   - Local: MongoDB service should be running
   - Atlas: Test connection string in MongoDB Compass

3. **Start Application:**
   ```powershell
   npm start
   ```

4. **Verify Servers Running:**
   - Backend: Visit http://localhost:5000/api/health
   - Frontend: Visit http://localhost:3000

5. **Test Application:**
   - Register a new account
   - Login with credentials
   - Test dashboard and features

## 🐛 Troubleshooting

### "Node.js not found"
- **Solution**: Install Node.js from https://nodejs.org/
- **Action**: Restart PowerShell after installation

### "Port 5000/3000 already in use"
- **Solution**: Stop other services using these ports
- **Action**: `npm run stop` (Windows) or kill process manually

### "MongoDB connection failed"
- **Local**: Ensure MongoDB service is running
- **Atlas**: Check connection string and network access
- **Action**: Verify `MONGO_URI` in `.env` file

### "Dependencies not installing"
- **Solution**: Clear npm cache and reinstall
- **Action**: `npm cache clean --force` then `npm install`

### "Module not found errors"
- **Solution**: Reinstall dependencies
- **Action**: Delete `node_modules` and `package-lock.json`, then `npm install`

## 📝 Notes

- First run will take longer (installing dependencies)
- Development mode uses hot-reload (auto-refresh on changes)
- Production build creates optimized static files
- Environment variables are loaded from `.env` files
- JWT tokens expire after 24 hours (configurable)

## ✅ Quick Checklist

- [ ] Node.js v14+ installed
- [ ] npm v6+ installed
- [ ] MongoDB setup (local or Atlas)
- [ ] `.env` file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Backend server running (port 5000)
- [ ] Frontend app running (port 3000)
- [ ] Browser opens automatically

---

**Ready to build?** Install Node.js, then run: `npm start`
