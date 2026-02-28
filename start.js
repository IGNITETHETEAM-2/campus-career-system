const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const isWindows = os.platform() === 'win32';

console.log('\n');
console.log('╔════════════════════════════════════════╗');
console.log('║  🚀 Campus Management System Auto Start    ║');
console.log('║     Environment: Development           ║');
console.log('╚════════════════════════════════════════╝');
console.log('\n');

// Validate project structure
const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir)) {
  console.error('❌ Backend directory not found');
  process.exit(1);
}

if (!fs.existsSync(frontendDir)) {
  console.error('❌ Frontend directory not found');
  process.exit(1);
}

// Check if node_modules exist
const backendModules = path.join(backendDir, 'node_modules');
const frontendModules = path.join(frontendDir, 'node_modules');

const needsInstall = !fs.existsSync(backendModules) || !fs.existsSync(frontendModules);

if (needsInstall) {
  console.log('📦 Installing dependencies...\n');
  const installProcess = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'install-all'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: isWindows
  });

  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✓ Dependencies installed successfully\n');
      startServers();
    } else {
      console.error('\n❌ Installation failed with code:', code);
      process.exit(1);
    }
  });

  installProcess.on('error', (err) => {
    console.error('❌ Installation error:', err.message);
    process.exit(1);
  });
} else {
  startServers();
}

function startServers() {
  let backendStarted = false;
  let frontendStarted = false;

  console.log('📦 Starting Backend Server on port 5000...\n');

  const backendProcess = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Backend failed to start:', err.message);
    process.exit(1);
  });

  backendProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n❌ Backend exited with code ${code}`);
    }
  });

  // Wait for backend to be ready before starting frontend
  setTimeout(() => {
    console.log('\n🎨 Starting Frontend React App on port 3000...\n');

    const frontendProcess = spawn(isWindows ? 'npm.cmd' : 'npm', ['start'], {
      cwd: frontendDir,
      stdio: 'inherit',
      shell: isWindows,
      env: {
        ...process.env,
        REACT_APP_API_URL: 'http://localhost:5000/api',
        BROWSER: 'none'
      }
    });

    frontendProcess.on('error', (err) => {
      console.error('❌ Frontend failed to start:', err.message);
      process.exit(1);
    });

    frontendProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`\n❌ Frontend exited with code ${code}`);
      }
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Shutting down servers...');
      backendProcess.kill('SIGTERM');
      frontendProcess.kill('SIGTERM');
      setTimeout(() => process.exit(0), 2000);
    });

    process.on('SIGTERM', () => {
      console.log('\n\n🛑 Shutting down servers...');
      backendProcess.kill('SIGTERM');
      frontendProcess.kill('SIGTERM');
      setTimeout(() => process.exit(0), 2000);
    });
  }, 3000);
}
