# ⚡ Quick Command Reference

## Essential Commands

### Start the Application
```powershell
cd d:\Muzhir\campus-career-system
npm start
```
✅ Automatically starts backend (port 5000) and frontend (port 3000)

### Access the Application
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
API Docs:  http://localhost:5000/api/health
```

### Backend Only
```powershell
cd backend
npm run dev      # With auto-reload
npm start        # Standard start
npm test         # Run tests
npm run lint     # Check code
```

### Frontend Only
```powershell
cd frontend
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

### Install Dependencies
```powershell
npm install               # Root dependencies
npm run install-all       # All dependencies
cd backend && npm install # Backend only
cd frontend && npm install # Frontend only
```

### Stop Running Processes
```powershell
npm run stop              # Windows
Ctrl + C                  # Any terminal (double press if needed)
```

### Find Open Ports
```powershell
netstat -ano | findstr :5000   # Check port 5000
netstat -ano | findstr :3000   # Check port 3000
```

### Kill Process on Port
```powershell
taskkill /PID [PID] /F         # Kill by PID
npm run stop                    # Kill all node processes
```

## API Testing Commands

### Health Check
```powershell
curl http://localhost:5000/api/health
```

### Register User
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123","role":"student"}'
```

### Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Get Events
```powershell
curl http://localhost:5000/api/events
```

## Database Commands

### Connect to MongoDB (Local)
```powershell
mongosh
use campus-career
show collections
```

### Check Database Collections
```
db.users.find()
db.resumes.find()
db.events.find()
```

## Configuration Management

### View Environment Variables
```powershell
cat .env                         # View root .env
cat backend/.env.development    # View backend dev config
cat backend/.env.production     # View backend prod config
```

### Edit Environment Variables
```powershell
notepad .env                     # Edit with Notepad
code .env                        # Edit with VS Code
```

## Git Commands

### Initialize Git (if not done)
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/campus-career-system.git
git push -u origin main
```

### Push Changes
```powershell
git add .
git commit -m "Description of changes"
git push
```

### Check Status
```powershell
git status
git log --oneline
```

## Debugging Commands

### View Backend Logs
```powershell
# If using PM2
pm2 logs

# If using nodemon
# Logs appear in terminal

# Last error
Get-EventLog -LogName Application -Source "Node.js" -Newest 10
```

### View Frontend Errors
```
F12              # Open DevTools
Console Tab      # View errors
Network Tab      # View API calls
```

### Check Dependencies
```powershell
npm list              # List all dependencies
npm outdated          # Check for updates
npm audit             # Security audit
npm audit fix         # Auto-fix vulnerabilities
```

## Code Quality Commands

### Format Code
```powershell
npm run format --if-present      # Format all files
cd frontend && npm run format    # Format frontend
cd backend && npm run format     # Format backend
```

### Lint Code
```powershell
npm run lint --if-present       # Check code
```

### Update Dependencies
```powershell
npm update               # Update all packages
npm update package-name  # Update specific package
npm install package@latest # Install latest version
```

## Deployment Commands

### Build Frontend
```powershell
cd frontend
npm run build
# Output in: frontend/build/
```

### Deploy to Heroku
```powershell
heroku login
heroku create app-name
git push heroku main
heroku logs --tail
```

### Deploy to AWS
```bash
# After EC2 setup
git clone repo-url
cd campus-career-system
npm run install-all
pm2 start backend/server.js
```

## Testing Commands

### Run Tests
```powershell
npm test                         # Root tests
cd backend && npm test          # Backend tests
cd frontend && npm test         # Frontend tests
```

### Test Specific Features
```powershell
# Manual testing
# Navigate to http://localhost:3000
# 1. Register account
# 2. Login
# 3. Test each page
# 4. Check browser console for errors
```

## Environment Setup Commands

### Check Versions
```powershell
node --version      # Should be v14+
npm --version       # Should be v6+
mongosh --version   # MongoDB shell
```

### Install Node.js (if needed)
```powershell
# Download from: https://nodejs.org/
# Windows: Run installer
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

### Install MongoDB (if needed)
```powershell
# Windows: Download installer from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt install mongodb
```

## Help Commands

### Get npm Help
```powershell
npm --help          # General help
npm start --help    # Specific command help
npm list --help     # List command help
```

### View Package Scripts
```powershell
npm run             # List all available scripts
```

## Troubleshooting Commands

### Check Disk Space
```powershell
Get-Volume           # Windows volume info
df -h                # Mac/Linux disk space
```

### Clear npm Cache
```powershell
npm cache clean --force
```

### Reinstall Everything
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run install-all
```

### Reset to Clean State
```powershell
# Reset everything
Remove-Item -Recurse -Force node_modules backend/node_modules frontend/node_modules
Remove-Item package-lock.json backend/package-lock.json frontend/package-lock.json
npm install
npm run install-all
npm start
```

## Documentation Commands

### View Documentation
```powershell
# View START_HERE.md
Get-Content START_HERE.md

# View QUICK_START.md
Get-Content QUICK_START.md

# View SETUP.md
Get-Content SETUP.md

# Open in default editor
notepad START_HERE.md
notepad SETUP.md
```

## Quick Navigation

| Task | Command |
|------|---------|
| Start app | `npm start` |
| Backend only | `cd backend && npm run dev` |
| Frontend only | `cd frontend && npm start` |
| Stop app | `Ctrl + C` |
| Install deps | `npm run install-all` |
| Format code | `npm run format` |
| Check code | `npm run lint` |
| Test app | `npm test` |
| View docs | `Get-Content START_HERE.md` |
| Check health | `curl http://localhost:5000/api/health` |

## Common Workflows

### Development Workflow
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: As needed
cd <project>
npm run lint
npm run format
```

### Testing Workflow
```powershell
npm run install-all
npm start
# Navigate to http://localhost:3000
# Register → Login → Test features
```

### Deployment Workflow
```powershell
npm run install-all
npm run build        # Build frontend if needed
npm test            # Run tests
git add .
git commit -m "Ready for deployment"
git push
# GitHub Actions runs CI/CD automatically
```

## Where to Get Help

| Issue | Solution |
|-------|----------|
| Setup problems | Read START_HERE.md |
| Installation help | Read INSTALLATION.md |
| Configuration | Read SETUP.md |
| Deployment | Read DEPLOYMENT.md |
| API documentation | Read SETUP.md API section |
| Development | Read .github/copilot-instructions.md |
| Testing | Read VERIFICATION.md |
| Navigation | Read DOCUMENTATION_INDEX.md |

---

**💡 Tip**: Bookmark this page for quick reference!

**🚀 Ready to start?** Run: `npm start`
