@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cls
title Campus Career System - Development

echo.
echo ════════════════════════════════════════
echo   Campus Career System - Auto Start
echo   Environment: Development
echo ════════════════════════════════════════
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm is not installed or not in PATH
    pause
    exit /b 1
)

echo ✓ Node.js and npm detected
echo.
echo Starting application...
echo.

REM Run the start script
call node start.js

if errorlevel 1 (
    echo.
    echo ❌ Error running application
    pause
    exit /b 1
)

pause
