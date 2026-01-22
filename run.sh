#!/bin/bash

set -e

clear

echo ""
echo "════════════════════════════════════════"
echo "  Campus Career System - Auto Start"
echo "  Environment: Development"
echo "════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✓ Node.js and npm detected"
echo ""
echo "Starting application..."
echo ""

# Run the start script
if node start.js; then
    echo "✓ Application started successfully"
else
    echo "❌ Error running application"
    exit 1
fi
