# 🚀 CI/CD Setup - Get to Production in 5 Minutes

Your repo now has a **unified CI/CD pipeline** ready to deploy to **Heroku**. Here's how to activate it.

## Step 1: Create Heroku App (2 minutes)

```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
# Then:
heroku login
heroku create campus-career-system  # Replace with your app name
```

Save your app name (e.g., `campus-career-system`).

## Step 2: Set Up MongoDB (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Copy connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/campus-career`)
5. In Heroku dashboard, go to **Settings → Config Vars** and add:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/campus-career
   JWT_SECRET=generate-a-random-32-char-string-here
   NODE_ENV=production
   ```

## Step 3: Configure GitHub Secrets (1 minute)

Go to **GitHub Repo → Settings → Secrets and variables → Actions**

Add these 3 secrets:
```
HEROKU_API_KEY      = (get from Heroku Account Settings)
HEROKU_APP_NAME     = campus-career-system (your app name)
HEROKU_EMAIL        = your-email@example.com
```

👉 **Full guide**: Read [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

## Step 4: Deploy (automatic)

Just push to main:
```bash
git push origin main
```

GitHub Actions will:
1. ✅ Install dependencies
2. ✅ Run tests (backend + frontend)
3. ✅ Build frontend
4. ✅ Deploy to Heroku (auto if tests pass)

**View deployment status:**
- GitHub: **Actions** tab
- Heroku: `heroku logs --tail --app campus-career-system`

## What Gets Deployed

| Component | Location |
|-----------|----------|
| **Backend** | Port 5000 (Express API) |
| **Frontend** | Port 3000 (React app) |
| **Database** | MongoDB Atlas |
| **URL** | https://campus-career-system.herokuapp.com |

## 🎯 Success!

Once deployed, test:
```bash
curl https://campus-career-system.herokuapp.com/api/auth/me
```

Should return a response (likely 401 without token, which is OK—means API is live).

---

## Troubleshooting

### ❌ "Deployment failed" in GitHub Actions
- Check GitHub Actions logs
- Most common: Missing GitHub secrets
- Solution: Re-read Step 3 carefully

### ❌ "502 Bad Gateway" on Heroku
- Means backend didn't start
- Check logs: `heroku logs --tail --app campus-career-system`
- Most common: MONGO_URI not set or incorrect

### ❌ "Cannot find module" errors
- Heroku didn't install dependencies
- Check that `package.json` and `package-lock.json` exist in root, backend, frontend
- Try rebuilding: `heroku rebuild --app campus-career-system`

### ⚠️ Want to disable auto-deploy?
Edit `.github/workflows/ci-cd.yml` and remove the `deploy` job section (or comment it out).

---

## Next Steps

✅ **Pipeline is live** — every push to main auto-deploys  
✅ **Tests run automatically** — CI catches bugs before deploy  
✅ **Logs available** — check Heroku or GitHub Actions anytime  

**Optional improvements:**
- Add more test coverage
- Set up staging environment (separate Heroku app on `develop` branch)
- Add monitoring/alerts
- Set up custom domain

---

**Questions?** Check the [full secrets guide](GITHUB_SECRETS_SETUP.md).
