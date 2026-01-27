# Deploy to Heroku - Step by Step (No CLI Required)

## Step 1: Create Heroku Account & App (5 minutes)

### 1a. Create Account
1. Go to https://www.heroku.com
2. Sign up for free account
3. Verify email

### 1b. Create New App
1. Log in to Heroku Dashboard: https://dashboard.heroku.com/apps
2. Click **New** → **Create new app**
3. Enter app name: `campus-career-system` (or your preferred name)
4. Region: Choose closest to you (US or EU)
5. Click **Create app**

**Save your app name** - you'll need it for GitHub secrets!

---

## Step 2: Set Up MongoDB Atlas (5 minutes)

### 2a. Create Free MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Try Free**
3. Create account or sign in
4. Click **Create a deployment**
5. Select **M0 Cluster (free tier)**
6. Click **Create**
7. Wait ~3 minutes for cluster to deploy

### 2b. Create Database User
1. In MongoDB Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Username: `admin`
4. Password: Generate secure password (save it!)
5. Built-in Role: **Atlas Admin**
6. Click **Add User**

### 2c. Get Connection String
1. Go to **Databases** → Your cluster
2. Click **Connect**
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<username>` with `admin`
6. Replace `<password>` with your password
7. Replace `<myFirstDatabase>` with `campus-career`

**Your connection string should look like:**
```
mongodb+srv://admin:yourpassword@cluster.mongodb.net/campus-career?retryWrites=true&w=majority
```

---

## Step 3: Configure Heroku App (2 minutes)

### 3a. Set Config Variables
1. Go to your Heroku app: https://dashboard.heroku.com/apps
2. Click your app name
3. Go to **Settings**
4. Find **Config Vars** section
5. Click **Reveal Config Vars**
6. Add these variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB connection string (from Step 2c) |
| `JWT_SECRET` | Generate a random string (32+ characters) - keep it secret! |
| `NODE_ENV` | `production` |

**To generate JWT_SECRET**, use this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3b. Add Buildpack
1. Still in Settings
2. Find **Buildpacks**
3. Click **Add buildpack**
4. Search for `nodejs`
5. Click **Save changes**

---

## Step 4: Get Heroku API Key (2 minutes)

### 4a. Find Your API Key
1. Go to https://dashboard.heroku.com/account
2. Scroll to **API Key**
3. Click **Reveal**
4. Copy the entire key
5. **Keep this secret!**

---

## Step 5: Add GitHub Secrets (3 minutes)

### 5a. Go to GitHub
1. Open your repo: https://github.com/IGNITETHETEAM-2/campus-career-system
2. Click **Settings** (repo settings, not your profile)
3. Left menu: **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 5b. Add First Secret: HEROKU_API_KEY
- **Name:** `HEROKU_API_KEY`
- **Value:** Paste your API key from Step 4
- Click **Add secret**

### 5c. Add Second Secret: HEROKU_APP_NAME
- Click **New repository secret**
- **Name:** `HEROKU_APP_NAME`
- **Value:** Your app name (e.g., `campus-career-system`)
- Click **Add secret**

### 5d. Add Third Secret: HEROKU_EMAIL
- Click **New repository secret**
- **Name:** `HEROKU_EMAIL`
- **Value:** Your Heroku account email
- Click **Add secret**

---

## Step 6: Deploy! (Automatic)

### 6a. Push Code to Trigger Deployment
```bash
cd c:\Users\HP\Dropbox\PC\Downloads\campus-career-system
git push origin main
```

### 6b. Watch GitHub Actions
1. Go to your repo → **Actions** tab
2. Watch the workflow run
3. Stages: Install → Lint → Test → Build → Deploy

### 6c. Monitor Heroku
1. Go to your Heroku app dashboard
2. Click **Activity** tab
3. Watch deployment progress
4. Look for ✅ "Deployed" message

---

## Step 7: Verify It Works! (2 minutes)

### 7a. Check Your App
1. Go to Heroku app → **Open app** button
2. Or visit: `https://{your-app-name}.herokuapp.com`
3. You should see your React frontend!

### 7b. Test the API
Open a terminal and run:
```bash
curl https://{your-app-name}.herokuapp.com/api/auth/me
```

You should get a response (likely error without token, which is fine - means API is live).

### 7c. Check Logs
If something goes wrong, view logs in terminal:
```bash
# Install Heroku CLI first from: https://devcenter.heroku.com/articles/heroku-cli
heroku logs --tail --app {your-app-name}
```

Or in Heroku dashboard: App → **More** → **View logs**

---

## ✅ Success!

Your app is now deployed to production! 

**Every time you push to main branch, it will automatically:**
1. Run tests
2. Build frontend
3. Deploy to Heroku

---

## 🆘 Troubleshooting

### "502 Bad Gateway"
- Backend isn't starting
- Check Heroku logs for errors
- Verify MONGO_URI is correct

### "Cannot find module..."
- Dependencies weren't installed
- Check Heroku logs
- Try: `heroku restart --app {app-name}`

### "Deployment failed in GitHub Actions"
- Check GitHub Actions logs first
- Then check Heroku logs
- Make sure all 3 secrets are added

### "MongoDB connection error"
- Verify MONGO_URI in Heroku config vars
- Test connection string locally first
- Make sure MongoDB IP whitelist includes Heroku IPs (0.0.0.0/0)

---

## 📚 Additional Resources

- Heroku Dashboard: https://dashboard.heroku.com
- GitHub Secrets: https://github.com/IGNITETHETEAM-2/campus-career-system/settings/secrets/actions
- MongoDB Atlas: https://cloud.mongodb.com
- Heroku Documentation: https://devcenter.heroku.com

---

**Done! Your app is live in production! 🎉**
