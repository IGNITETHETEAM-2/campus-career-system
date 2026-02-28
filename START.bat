@echo off
title Campus Career System
echo ========================================
echo   Campus Career System - Launcher
echo ========================================
echo.

REM Add Node.js to PATH
set PATH=C:\Users\India\AppData\Local\ms-playwright-go\1.50.1;%PATH%

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "Backend - Port 5000" cmd /k "set PATH=C:\Users\India\AppData\Local\ms-playwright-go\1.50.1;%%PATH%% && cd /d f:\campus-career-system\backend && node server.js"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Dev Server...
start "Frontend - Port 3000" cmd /k "set PATH=C:\Users\India\AppData\Local\ms-playwright-go\1.50.1;%%PATH%% && cd /d f:\campus-career-system\frontend && node node_modules\react-scripts\bin\react-scripts.js start"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Opening browser in 15 seconds...
timeout /t 15 /nobreak > nul
start http://localhost:3000
