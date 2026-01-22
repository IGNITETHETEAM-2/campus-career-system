#!/bin/bash
# MongoDB Setup Helper Script for Campus Career System

echo "======================================"
echo "Campus Career System - MongoDB Setup"
echo "======================================"
echo ""

# Check if MongoDB is installed
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB is installed"
    mongod --version
else
    echo "✗ MongoDB is not installed"
    echo ""
    echo "To install MongoDB:"
    echo "  macOS:  brew tap mongodb/brew && brew install mongodb-community"
    echo "  Linux:  https://docs.mongodb.com/manual/installation/"
    echo "  Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/"
    exit 1
fi

echo ""
echo "Select MongoDB setup option:"
echo "1. Start local MongoDB server"
echo "2. Set up MongoDB Atlas (cloud)"
echo "3. Show connection string"
echo "4. Test connection"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "Starting MongoDB server..."
        if command -v mongod &> /dev/null; then
            mongod --dbpath ./data/db 2>/dev/null || {
                mkdir -p ./data/db
                mongod --dbpath ./data/db
            }
        else
            echo "MongoDB not found in PATH"
        fi
        ;;
    2)
        echo ""
        echo "MongoDB Atlas Setup:"
        echo "1. Go to https://www.mongodb.com/cloud/atlas"
        echo "2. Sign up or log in"
        echo "3. Create a new project"
        echo "4. Create a cluster (free tier available)"
        echo "5. Add IP address to whitelist (0.0.0.0/0 for development)"
        echo "6. Create database user"
        echo "7. Get connection string"
        echo ""
        read -p "Enter your MongoDB Atlas connection string: " mongo_uri
        echo "MONGO_URI=$mongo_uri" > .env.local
        echo "Connection string saved to .env.local"
        ;;
    3)
        echo ""
        echo "MongoDB Connection Strings:"
        echo ""
        echo "Local Development:"
        echo "  mongodb://localhost:27017/campus-career"
        echo ""
        echo "MongoDB Atlas Template:"
        echo "  mongodb+srv://username:password@cluster.mongodb.net/campus-career?retryWrites=true&w=majority"
        ;;
    4)
        echo ""
        echo "Testing MongoDB connection..."
        if command -v mongosh &> /dev/null; then
            mongosh mongodb://localhost:27017/campus-career --eval "db.adminCommand('ping')"
        elif command -v mongo &> /dev/null; then
            mongo mongodb://localhost:27017/campus-career --eval "db.adminCommand('ping')"
        else
            echo "mongosh not found. Testing with Node.js..."
            node -e "
                const mongoose = require('mongoose');
                mongoose.connect('mongodb://localhost:27017/campus-career')
                  .then(() => {
                    console.log('✓ Connection successful');
                    process.exit(0);
                  })
                  .catch(err => {
                    console.log('✗ Connection failed:', err.message);
                    process.exit(1);
                  });
            "
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
