@echo off
REM Campus Career System - Automated Deployment Script (Windows)
REM This script helps automate the deployment process

echo ========================================
echo Campus Career System - Deployment Helper
echo ========================================
echo.

if "%1"=="" (
    echo Error: Backend URL not provided
    echo.
    echo Usage: deploy.bat ^<backend-url^>
    echo Example: deploy.bat https://campus-career-backend.onrender.com
    echo.
    exit /b 1
)

set BACKEND_URL=%1
set API_URL=%BACKEND_URL%/api

echo Backend URL: %BACKEND_URL%
echo API URL: %API_URL%
echo.

echo Updating frontend/.env.production...
(
echo # Production Environment Variables for Frontend
echo REACT_APP_API_URL=%API_URL%
echo REACT_APP_ENV=production
echo GENERATE_SOURCEMAP=false
) > frontend\.env.production

echo Updated frontend/.env.production
echo.

echo Committing changes...
git add frontend\.env.production
git commit -m "Update backend URL to %BACKEND_URL%"

echo Pushing to GitHub...
git push origin main

echo.
echo Deployment triggered!
echo.
echo Next steps:
echo 1. Wait 2-3 minutes for Vercel to rebuild
echo 2. Visit: https://campus-career-system-c2tx.vercel.app
echo 3. Check backend status indicator
echo.
echo Backend URL configured: %API_URL%
