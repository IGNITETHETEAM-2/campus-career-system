# Render Deployment Guide for Backend

## Quick Deploy to Render

### Step 1: Go to Render
Visit: https://render.com

### Step 2: Sign Up/Login
- Click "Get Started for Free"
- Sign in with GitHub (recommended)

### Step 3: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Click "Connect GitHub"
4. Find and select: `IGNITETHETEAM-2/campus-career-system`
5. Click "Connect"

### Step 4: Configure Service

**Basic Settings:**
- **Name:** `campus-career-backend`
- **Region:** Oregon (US West) - Free tier
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select: **Free** ($0/month)

### Step 5: Add Environment Variables

Click "Advanced" → Add Environment Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `5000` | Required |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/campus-career` | **Replace with your MongoDB Atlas URI** |
| `JWT_SECRET` | `your-secure-random-32-char-string` | **Generate a secure random string** |
| `GEMINI_API_KEY` | `AIzaSyBz9sDddZKoKeaQa89IDNxjJe2bCVMvSZQ` | Optional - for AI features |
| `CORS_ORIGIN` | `https://campus-career-system-c2tx.vercel.app` | Your Vercel URL |

**Generate JWT_SECRET:**
```bash
# Run this in terminal to generate a secure key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. Render will build and deploy automatically

### Step 7: Get Your Backend URL
After deployment completes:
- Your backend will be at: `https://campus-career-backend.onrender.com`
- Copy this URL!

### Step 8: Update Vercel Environment Variables
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `campus-career-system-c2tx`
3. Go to Settings → Environment Variables
4. Add/Update:
   - `REACT_APP_API_URL` = `https://campus-career-backend.onrender.com/api`
5. Go to Deployments → Click (...) → Redeploy

### Step 9: Test Your Deployment
1. Test backend health: `https://campus-career-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","timestamp":"..."}`
2. Visit your frontend: `https://campus-career-system-c2tx.vercel.app`
3. Should see: "Backend: ✓ Connected"
4. Try registering and logging in

## MongoDB Atlas Setup (If Needed)

If you don't have MongoDB Atlas:

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster (M0)
4. Create database user:
   - Username: `campususer`
   - Password: (generate secure password)
5. Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://campususer:yourpassword@cluster0.xxxxx.mongodb.net/campus-career?retryWrites=true&w=majority`

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all dependencies are in `backend/package.json`
- Ensure Node version is compatible (18+)

### "Application failed to respond"
- Check if `PORT` environment variable is set to `5000`
- Verify `npm start` command works locally
- Check logs for errors

### MongoDB Connection Error
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas allows connections from `0.0.0.0/0`
- Ensure database user has correct permissions

### CORS Errors
- Verify `CORS_ORIGIN` includes your Vercel URL
- Check backend logs for CORS errors
- Ensure URL doesn't have trailing slash

## Important Notes

⚠️ **Free Tier Limitations:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid tier ($7/month) for always-on service

✅ **Automatic Deployments:**
- Render auto-deploys when you push to GitHub
- No manual deployment needed after initial setup

🔒 **Security:**
- Never commit environment variables to Git
- Use strong JWT_SECRET (32+ characters)
- Keep MongoDB credentials secure

## Summary

1. ✅ Create Render account
2. ✅ Connect GitHub repository
3. ✅ Configure backend service
4. ✅ Add environment variables
5. ✅ Deploy and wait
6. ✅ Copy backend URL
7. ✅ Update Vercel environment variables
8. ✅ Test production app

**Your backend will be live at:** `https://campus-career-backend.onrender.com`
