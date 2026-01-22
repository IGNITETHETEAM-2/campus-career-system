// Setup Verification Script
// Run this with: node CHECK_SETUP.js

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Campus Career System Setup...\n');

let errors = [];
let warnings = [];

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 14) {
  errors.push(`Node.js version ${nodeVersion} is too old. Need v14+`);
} else {
  console.log(`✓ Node.js version: ${nodeVersion}`);
}

// Check npm
try {
  const npmVersion = require('child_process').execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✓ npm version: ${npmVersion}`);
} catch (e) {
  errors.push('npm not found or not accessible');
}

// Check project structure
const requiredDirs = ['backend', 'frontend', 'backend/config', 'backend/models', 'backend/routes', 'frontend/src', 'frontend/src/pages'];
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✓ Directory exists: ${dir}`);
  } else {
    errors.push(`Missing directory: ${dir}`);
  }
});

// Check required files
const requiredFiles = [
  'backend/server.js',
  'backend/package.json',
  'frontend/package.json',
  'frontend/src/App.js',
  'frontend/src/index.js',
  'start.js'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ File exists: ${file}`);
  } else {
    errors.push(`Missing file: ${file}`);
  }
});

// Check if node_modules exist
const backendModules = path.join(__dirname, 'backend', 'node_modules');
const frontendModules = path.join(__dirname, 'frontend', 'node_modules');

if (!fs.existsSync(backendModules)) {
  warnings.push('Backend node_modules not found. Run: npm install in backend/');
}

if (!fs.existsSync(frontendModules)) {
  warnings.push('Frontend node_modules not found. Run: npm install in frontend/');
}

if (fs.existsSync(backendModules) && fs.existsSync(frontendModules)) {
  console.log(`✓ Dependencies installed`);
}

// Check .env file
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  warnings.push('.env file not found in backend/. Will use defaults.');
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Setup is complete! Ready to build and run.');
  console.log('\nTo start the application:');
  console.log('  npm start');
} else {
  if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach(err => console.log(`  - ${err}`));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warn => console.log(`  - ${warn}`));
  }
  if (errors.length === 0) {
    console.log('\n✅ Setup looks good! Warnings are non-critical.');
  }
}
console.log('='.repeat(50) + '\n');

process.exit(errors.length > 0 ? 1 : 0);
