# GitHub Repository Secrets Setup Guide

This document explains what secrets need to be configured in your GitHub repository for CI/CD to work.

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

---

## Required Secrets for Heroku Deployment

### 1. HEROKU_API_KEY
- **What it is**: Your Heroku authentication token
- **How to get it**:
  - Log in to [Heroku Dashboard](https://dashboard.heroku.com)
  - Click your profile icon → **Account settings**
  - Scroll to "API Key" section
  - Click "Reveal" and copy the key
  - Paste into GitHub as the secret value

### 2. HEROKU_APP_NAME
- **What it is**: The name of your Heroku app (e.g., `campus-career-system`)
- **How to get it**:
  - Log in to Heroku Dashboard
  - The app name appears in the URL: `https://dashboard.heroku.com/apps/{YOUR_APP_NAME}`
  - Example: `my-campus-app`

### 3. HEROKU_EMAIL
- **What it is**: Your Heroku account email
- **Example**: `your-email@example.com`

---

## Environment Variables for Backend (Heroku Config Vars)

These are NOT GitHub secrets—they're set in Heroku itself.

### How to Set Config Vars in Heroku

1. Log in to [Heroku Dashboard](https://dashboard.heroku.com)
2. Click your app
3. Go to **Settings** → **Config Vars**
4. Click **Reveal Config Vars** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/campus-career` | From MongoDB Atlas |
| `JWT_SECRET` | Generate a strong random string (32+ chars) | NEVER share this |
| `NODE_ENV` | `production` | Required for production |
| `GEMINI_API_KEY` | (optional) Your API key if using AI features | Leave blank if not using |
| `PORT` | `5000` | Heroku assigns dynamically; backend should use $PORT env var |

---

## MongoDB Atlas Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a cluster (default settings fine for dev)
4. Go to **Database** → **Connect**
5. Choose "Connect your application"
6. Copy the connection string and replace:
   - `<username>` with your database user
   - `<password>` with your password
   - Use this as your `MONGO_URI` in Heroku config vars

---

## Summary Checklist

- [ ] Created Heroku app (`heroku create campus-career-system`)
- [ ] Added HEROKU_API_KEY to GitHub secrets
- [ ] Added HEROKU_APP_NAME to GitHub secrets
- [ ] Added HEROKU_EMAIL to GitHub secrets
- [ ] Configured MONGO_URI in Heroku config vars
- [ ] Configured JWT_SECRET in Heroku config vars
- [ ] Set NODE_ENV to "production" in Heroku config vars
- [ ] Pushed code to main branch to trigger deployment

---

## Testing the Deployment

After pushing to main:
1. Go to GitHub repo → **Actions** tab
2. Watch the CI/CD pipeline run
3. If successful, visit `https://{HEROKU_APP_NAME}.herokuapp.com`
4. Check Heroku logs: `heroku logs --tail --app {HEROKU_APP_NAME}`

---

## Troubleshooting

### Deployment fails: "Health check failed"
- Ensure `/api/auth/me` endpoint is accessible
- Check backend logs: `heroku logs --app {app-name}`

### "MONGO_URI not set"
- Verify MongoDB Atlas connection string in Heroku config vars
- Test locally with `MONGO_URI=...` before pushing

### "Build failed on Heroku"
- Check GitHub Actions logs first
- Then check Heroku build logs: `heroku logs --app {app-name}`

---

For more help, see:
- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/deploying-nodejs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/getting-started/)
