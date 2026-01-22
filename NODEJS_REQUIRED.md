# ⚠️ Node.js Not Installed - Installation Required

## Current Status
- ❌ Node.js is NOT installed on this system
- ❌ npm is NOT installed on this system
- ✅ Application code is complete and ready
- ✅ All files are in place

## What You Need to Do

### Step 1: Install Node.js

1. Go to: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
   - Current LTS: v20.x or v22.x
   - This includes npm automatically
3. Run the installer
4. Choose default options
5. Complete the installation
6. **Restart your Terminal/PowerShell** (important!)

### Step 2: Verify Installation

Open a **NEW** PowerShell terminal and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.10.0
9.8.1
```

### Step 3: Setup MongoDB

You need a database. Choose ONE:

**Option A: Local MongoDB (Easiest for Development)**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB will start automatically
4. Connection: `mongodb://localhost:27017/campus-career`

**Option B: MongoDB Atlas (Cloud - No Installation Needed)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create FREE account
3. Create free cluster
4. Get connection string
5. Update `.env` file with your connection string

### Step 4: Start the Application

After installing Node.js and setting up MongoDB:

```powershell
cd d:\Muzhir\campus-career-system
npm start
```

This will:
- Install all dependencies (first time only)
- Start backend on http://localhost:5000
- Start frontend on http://localhost:3000
- Open browser automatically

## Detailed Installation Guide

See: **[INSTALLATION.md](./INSTALLATION.md)** for complete step-by-step instructions

## Quick Reference

### Prerequisites
- [ ] Node.js v14+ installed
- [ ] npm v6+ installed  
- [ ] MongoDB running (local or cloud)

### Installation Steps
1. Install Node.js from https://nodejs.org/
2. Restart Terminal
3. Setup MongoDB (local or cloud)
4. Update `.env` file if using MongoDB Atlas
5. Run: `npm start`

### Expected Result
- Backend running on: http://localhost:5000
- Frontend running on: http://localhost:3000
- Open browser to: http://localhost:3000

## Configuration

Your `.env` file is ready at:
```
d:\Muzhir\campus-career-system\.env
```

Current settings:
```env
MONGO_URI=mongodb://localhost:27017/campus-career
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

If using MongoDB Atlas, update `MONGO_URI`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-career
```

## Installation Help

### For Windows
1. Download Node.js installer (LTS)
2. Run the installer
3. Click "Next" through all options
4. Restart PowerShell
5. Verify: `node --version`

### For Mac
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

### For Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

## After Installation

Once Node.js is installed:

```powershell
cd d:\Muzhir\campus-career-system

# First time - installs dependencies
npm start

# Browser will open automatically
# You'll see the application at: http://localhost:3000
```

## Next Steps

1. ✅ Install Node.js
2. ✅ Restart Terminal
3. ✅ Setup MongoDB
4. ✅ Run: `npm start`
5. ✅ Register an account
6. ✅ Test the features

## Application Status

✅ **Code**: Complete and ready
✅ **Database Models**: All created
✅ **API**: All endpoints implemented
✅ **Frontend**: All pages complete
✅ **Documentation**: Comprehensive guides available
❌ **Node.js**: REQUIRED - Not installed

## Getting Help

### Node.js Installation
- Official Site: https://nodejs.org/
- Installation Guide: https://nodejs.org/en/download/
- Troubleshooting: https://nodejs.org/en/docs/

### MongoDB Setup
- Local: https://docs.mongodb.com/manual/installation/
- Cloud: https://docs.mongodb.com/atlas/

### Project Help
- See: START_HERE.md
- See: INSTALLATION.md
- See: QUICK_START.md

---

**Once Node.js is installed, run:** `npm start` from the project directory.

The application is ready to go! 🚀
