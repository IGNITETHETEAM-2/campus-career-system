# Quick Start Guide

## System Requirements
- Node.js v14 or higher
- npm v6 or higher
- MongoDB (local or Atlas connection string)

## Installation & Running

### Windows
1. Double-click `RUN.bat`
   OR
2. Open Command Prompt in project folder
3. Run: `npm start`

### Mac/Linux
1. Open Terminal in project folder
2. Run: `chmod +x run.sh && ./run.sh`
   OR
3. Run: `npm start`

## What Happens
- ✓ Checks for Node.js and npm
- ✓ Installs dependencies (if needed)
- ✓ Starts Backend Server (http://localhost:5000)
- ✓ Starts Frontend React App (http://localhost:3000)
- ✓ Opens browser automatically

## Troubleshooting

### "Node.js not found"
- Install from: https://nodejs.org/
- Restart command prompt/terminal

### "Port 5000 already in use"
- Kill existing process: `npm run stop` (Windows)
- Or use: `lsof -ti:5000 | xargs kill` (Mac/Linux)

### "MongoDB connection failed"
- Ensure MongoDB is running
- Update `.env` with correct MONGO_URI

### Permission denied on run.sh
- Run: `chmod +x run.sh`

## Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Default Login: Use register to create account

## Stop Application
- Press `Ctrl + C` in terminal
- Or close all terminals
