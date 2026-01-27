# 🤖 Automated Deployment Guide

## What You Need

1. **Render Backend URL** - After deploying to Render, you'll get a URL like:
   - `https://campus-career-backend.onrender.com`

2. **This automated script** - I've created `deploy.bat` for you

## Quick Deploy (Automated)

Once you have your Render backend URL, run:

```bash
# Windows
deploy.bat https://campus-career-backend.onrender.com

# Linux/Mac
chmod +x deploy.sh
./deploy.sh https://campus-career-backend.onrender.com
```

**What the script does:**
1. ✅ Updates `frontend/.env.production` with your backend URL
2. ✅ Commits the changes to Git
3. ✅ Pushes to GitHub
4. ✅ Triggers Vercel auto-deployment

## Manual Steps (If You Prefer)

### Step 1: Get Backend URL from Render

After deploying to Render:
1. Go to Render dashboard
2. Click on your service: `campus-career-backend`
3. Copy the URL (e.g., `https://campus-career-backend.onrender.com`)

### Step 2: Update Frontend Environment

Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://campus-career-backend.onrender.com/api
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

### Step 3: Deploy

```bash
git add frontend/.env.production
git commit -m "Update backend URL for production"
git push origin main
```

Vercel will auto-deploy in 2-3 minutes!

## Verify Deployment

1. Wait 2-3 minutes for Vercel to rebuild
2. Visit: https://campus-career-system-c2tx.vercel.app
3. Check: Should see "Backend: ✓ Connected" (green)
4. Test: Register and login

## Troubleshooting

**"Backend: ✗ Disconnected"**
- Verify Render backend is running
- Check backend URL is correct (no trailing slash)
- Test backend directly: `https://your-backend.onrender.com/api/health`

**Vercel not updating**
- Check GitHub commit was pushed
- Go to Vercel → Deployments → Check latest build
- Manually trigger redeploy if needed

## Summary

1. Deploy backend to Render → Get URL
2. Run: `deploy.bat https://your-backend-url.onrender.com`
3. Wait 2-3 minutes
4. Test your app!

**The script automates everything after you get the Render URL!**
