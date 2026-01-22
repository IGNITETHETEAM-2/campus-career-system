# Installation & Configuration Guide

Complete step-by-step installation for Campus Career System.

## Prerequisites

Verify you have all required software:

```powershell
# Check Node.js version (should be v14+)
node --version

# Check npm version (should be v6+)
npm --version

# Verify Python (optional, some packages may need it)
python --version
```

If missing, download from:
- Node.js: https://nodejs.org/ (includes npm)
- MongoDB: https://www.mongodb.com/try/download/community

## Installation Steps

### 1. Navigate to Project Directory

```powershell
cd d:\Muzhir\campus-career-system
```

### 2. Install Root Dependencies

```powershell
npm install
```

### 3. Install Backend Dependencies

```powershell
cd backend
npm install
cd ..
```

### 4. Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

### 5. Configure MongoDB

#### Local MongoDB (Recommended for Development)

**Windows:**
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. During installation, choose "Install MongoDB as a Service"
3. Start the service:
   ```powershell
   # PowerShell as Administrator
   net start MongoDB
   
   # Or check Services: Services → MongoDB → Start
   ```
4. Connection string: `mongodb://localhost:27017/campus-career`

**Mac:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string: mongodb://localhost:27017/campus-career
```

**Linux (Ubuntu/Debian):**
```bash
# Install MongoDB
curl https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Connection string: mongodb://localhost:27017/campus-career
```

#### Cloud MongoDB (Atlas) - No Installation Needed

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Click "Create a Cluster"
4. Choose "Free" tier
5. Configure cluster (default settings OK)
6. Click "Connect" and get connection string
7. Create database user and password
8. Save connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/campus-career?retryWrites=true&w=majority
   ```

### 6. Configure Environment Variables

#### Edit `.env` File

```powershell
# Open with default editor
notepad .env

# Or with VS Code
code .env
```

#### For Local MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/campus-career
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### For MongoDB Atlas (Cloud):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-career?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 7. Start the Application

```powershell
# Automatic startup (recommended)
npm start

# This will:
# - Check Node.js and npm
# - Install any missing dependencies
# - Start backend on http://localhost:5000
# - Start frontend on http://localhost:3000
# - Open browser automatically
```

### 8. Verify Installation

Open browser and visit:
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/api/health

Expected response from health check:
```json
{
  "status": "OK",
  "timestamp": "2026-01-17T..."
}
```

## Alternative Startup Methods

### Manual Startup (Two Terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
# Starts on port 5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
# Starts on port 3000
```

### Production Build

```powershell
# Build frontend
cd frontend
npm run build

# Build backend (Node doesn't need building, but install deps)
cd ../backend
npm install

# Start production server
npm start
```

## Verify MongoDB Connection

### Test Local MongoDB

```powershell
# If mongosh is installed
mongosh

# In mongosh shell:
use campus-career
show collections
```

### Test MongoDB Atlas

```powershell
# With mongosh
mongosh "mongodb+srv://username:password@cluster.mongodb.net/campus-career"

# In shell:
show collections
```

## Port Configuration

### Check if Ports Are Available

```powershell
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :5000
lsof -i :3000
```

### Use Different Ports

If ports are in use, edit `.env`:

```env
PORT=5001                              # Backend on 5001
# For frontend, modify start.js or use:
PORT=3001 npm start                    # Frontend on 3001
```

Then update frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Troubleshooting Installation

### Issue: "npm: command not found"

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal/PowerShell
- Verify: `node --version`

### Issue: "MongoDB connection failed"

**Solution:**
- Verify MongoDB is running:
  - Windows: Check Services panel
  - Mac: `brew services list`
  - Linux: `sudo systemctl status mongod`
- Verify connection string in `.env`
- Test connection: `mongosh` or use MongoDB Compass

### Issue: "Port 5000/3000 already in use"

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID [PID] /F

# Use different port (see Port Configuration above)
```

### Issue: "Dependencies install fails"

**Solution:**
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: "EACCES: permission denied" (Mac/Linux)

**Solution:**
```bash
# Change npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then reinstall
npm install
```

## Verify Installation Checklist

After installation, verify:

- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] MongoDB running (local or cloud)
- [ ] `.env` file configured
- [ ] Backend dependencies installed: `ls backend/node_modules`
- [ ] Frontend dependencies installed: `ls frontend/node_modules`
- [ ] Application starts: `npm start`
- [ ] Frontend loads: http://localhost:3000
- [ ] API responds: http://localhost:5000/api/health
- [ ] Can register user
- [ ] Can login with user
- [ ] Can access dashboard

## Next Steps

1. **Read**: [QUICK_START.md](./QUICK_START.md) - How to use the app
2. **Read**: [SETUP.md](./SETUP.md) - Detailed configuration
3. **Deploy**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Go to production
4. **Develop**: [.github/copilot-instructions.md](.github/copilot-instructions.md) - Add features

## Get Help

- Check error messages in terminal
- Review [SETUP.md](./SETUP.md) troubleshooting section
- Check MongoDB connection: `mongosh`
- Use browser DevTools (F12) for frontend issues
- Check API with Postman: https://www.postman.com/

---

**Installation Complete!** Your Campus Career System is ready to use. 🎉
