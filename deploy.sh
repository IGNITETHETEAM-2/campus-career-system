#!/bin/bash

# Campus Career System - Automated Deployment Script
# This script helps automate the deployment process

echo "🚀 Campus Career System - Deployment Helper"
echo "============================================"
echo ""

# Check if backend URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Backend URL not provided"
    echo ""
    echo "Usage: ./deploy.sh <backend-url>"
    echo "Example: ./deploy.sh https://campus-career-backend.onrender.com"
    echo ""
    exit 1
fi

BACKEND_URL="$1"
API_URL="${BACKEND_URL}/api"

echo "📍 Backend URL: $BACKEND_URL"
echo "📍 API URL: $API_URL"
echo ""

# Update frontend .env.production
echo "📝 Updating frontend/.env.production..."
cat > frontend/.env.production << EOF
# Production Environment Variables for Frontend
REACT_APP_API_URL=${API_URL}
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
EOF

echo "✅ Updated frontend/.env.production"
echo ""

# Commit and push changes
echo "📦 Committing changes..."
git add frontend/.env.production
git commit -m "Update backend URL to ${BACKEND_URL}"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for Vercel to rebuild"
echo "2. Visit: https://campus-career-system-c2tx.vercel.app"
echo "3. Check backend status indicator"
echo ""
echo "Backend URL configured: ${API_URL}"
