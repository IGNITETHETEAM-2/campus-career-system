# Database Setup Guide - Campus Management System

## 🗄️ Database Connection Setup

This guide will help you set up MongoDB for the Campus Management System.

---

## Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Create a Free Cluster
1. Click "Create" or "Build a Database"
2. Choose "M0 FREE" (Free tier)
3. Select a cloud provider and region (closest to you)
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set privileges to "Atlas Admin" (for free tier)
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `campus-career` (or keep default)

Example:
```
mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/campus-career?retryWrites=true&w=majority
```

### Step 6: Add to .env File
1. Copy `backend/.env.example` to `backend/.env`
2. Update `MONGO_URI` with your connection string:

```env
MONGO_URI=mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/campus-career?retryWrites=true&w=majority
```

---

## Option 2: Local MongoDB (For Advanced Users)

### Step 1: Install MongoDB Community Edition
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service (recommended)
5. Install MongoDB Compass (GUI tool - optional but helpful)

### Step 2: Verify Installation
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it:
Start-Service MongoDB

# Or use MongoDB Compass to connect
```

### Step 3: Configure .env File
1. Copy `backend/.env.example` to `backend/.env`
2. Use default local connection:

```env
MONGO_URI=mongodb://localhost:27017/campus-career
```

---

## 🔧 Configuration Steps

### 1. Create .env File
```powershell
# Copy example file
copy backend\.env.example backend\.env

# Or manually create backend/.env with:
MONGO_URI=your-connection-string-here
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
```

### 2. Update Connection String
- **MongoDB Atlas**: Use the connection string from Atlas dashboard
- **Local MongoDB**: Use `mongodb://localhost:27017/campus-career`

### 3. Set JWT Secret
Generate a strong secret key:
```powershell
# Using Node.js (if installed)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use a random string generator online
# Minimum 32 characters recommended
```

---

## ✅ Verify Database Connection

### Method 1: Test Connection in Code
```powershell
# Start the server
npm start

# Check console output for:
# ✓ MongoDB connected successfully
# ✓ Database: campus-career
```

### Method 2: Test with MongoDB Compass
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect using your connection string
3. Verify you can see the database

### Method 3: Test API Health Endpoint
```powershell
# Start server, then test:
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","timestamp":"..."}
```

---

## 🐛 Troubleshooting

### Issue: "ECONNREFUSED" Error
**Cause**: MongoDB not running or wrong connection string

**Solutions**:
- **Local**: Check if MongoDB service is running: `Get-Service MongoDB`
- **Atlas**: Verify connection string and network access
- Check firewall settings

### Issue: "Authentication failed"
**Cause**: Wrong username/password

**Solutions**:
- Verify credentials in MongoDB Atlas
- Check connection string format
- Ensure password is URL-encoded if it contains special characters

### Issue: "ENOTFOUND" Error
**Cause**: Invalid hostname or DNS issue

**Solutions**:
- Check connection string hostname
- Verify internet connection (for Atlas)
- Try pinging the MongoDB host

### Issue: "Network access denied"
**Cause**: IP not whitelisted in MongoDB Atlas

**Solutions**:
1. Go to MongoDB Atlas → Network Access
2. Add your current IP address
3. Or temporarily allow all IPs (0.0.0.0/0) for development

### Issue: Database connects but collections don't exist
**This is normal!** Collections are created automatically when you:
- Register a user (creates `users` collection)
- Create an event (creates `events` collection)
- Submit feedback (creates `feedbacks` collection)
- etc.

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas account created OR Local MongoDB installed
- [ ] Database user created (Atlas) OR MongoDB service running (Local)
- [ ] Network access configured (Atlas) OR Service started (Local)
- [ ] Connection string obtained
- [ ] `.env` file created in `backend/` directory
- [ ] `MONGO_URI` set in `.env` file
- [ ] `JWT_SECRET` set in `.env` file
- [ ] Server starts without connection errors
- [ ] Health endpoint returns OK

---

## 🚀 Next Steps

After database is configured:

1. **Start the application**:
   ```powershell
   npm start
   ```

2. **Verify connection**:
   - Check console for "✓ MongoDB connected successfully"
   - Visit http://localhost:5000/api/health

3. **Test registration**:
   - Visit http://localhost:3000
   - Register a new user
   - Check MongoDB for new `users` collection

---

## 📚 Additional Resources

- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
- **MongoDB Local Installation**: https://docs.mongodb.com/manual/installation/
- **MongoDB Compass**: https://www.mongodb.com/products/compass
- **Connection String Format**: https://docs.mongodb.com/manual/reference/connection-string/

---

**Need Help?** Check `BUILD_AND_RUN.md` for more troubleshooting tips.
