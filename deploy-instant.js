#!/usr/bin/env node

/**
 * Campus Career System - Instant Deployment
 * One command to go from zero to production
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (q) => new Promise(r => rl.question(q, r));

async function run() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         🚀 INSTANT DEPLOYMENT TO PRODUCTION                 ║
║            Campus Career System                             ║
╚══════════════════════════════════════════════════════════════╝
`);

  try {
    // Step 1: App name
    console.log('\n📝 App Configuration\n');
    const appName = await question('Enter app name (e.g. campus-career-system): ');
    
    if (!appName || appName.length < 3) {
      console.log('❌ Invalid name');
      process.exit(1);
    }

    // Step 2: MongoDB
    console.log('\n🗄️  MongoDB Connection\n');
    console.log('Get your connection string from:');
    console.log('  1. https://cloud.mongodb.com → Create free cluster');
    console.log('  2. Database → Connect → Connect your application');
    console.log('  3. Copy the connection string\n');
    
    const mongoUri = await question('Paste MongoDB connection string: ');
    
    if (!mongoUri.includes('mongodb')) {
      console.log('❌ Invalid MongoDB URI');
      process.exit(1);
    }

    // Step 3: Heroku account
    console.log('\n🔑 Heroku Authentication\n');
    console.log('Opening Heroku login...');
    
    try {
      execSync('heroku login', { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️  Heroku login may have failed');
    }

    // Step 4: Create app
    console.log('\n🏗️  Creating Heroku App...\n');
    
    try {
      execSync(`heroku create ${appName}`, { stdio: 'inherit' });
      console.log('✅ App created!\n');
    } catch (e) {
      console.log('⚠️  App may already exist, continuing...\n');
    }

    // Step 5: Configure
    console.log('⚙️  Configuring Heroku...\n');
    
    const jwtSecret = require('crypto').randomBytes(32).toString('hex');
    
    console.log('Setting environment variables...');
    execSync(`heroku config:set MONGO_URI="${mongoUri}" --app ${appName}`, { stdio: 'inherit' });
    execSync(`heroku config:set JWT_SECRET="${jwtSecret}" --app ${appName}`, { stdio: 'inherit' });
    execSync(`heroku config:set NODE_ENV="production" --app ${appName}`, { stdio: 'inherit' });

    // Step 6: Get credentials
    console.log('\n🔐 Getting GitHub Secrets\n');
    
    let apiKey;
    try {
      apiKey = execSync('heroku auth:token', { encoding: 'utf-8' }).trim();
      console.log('✅ API key retrieved\n');
    } catch (e) {
      apiKey = await question('Paste your Heroku API key: ');
    }

    const email = await question('Your Heroku email: ');

    // Step 7: Guide to GitHub
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         ADD THESE SECRETS TO GITHUB (2 minutes)             ║
╚══════════════════════════════════════════════════════════════╝

Go to: https://github.com/IGNITETHETEAM-2/campus-career-system/settings/secrets/actions

Add 3 Repository Secrets:

1️⃣  Name: HEROKU_API_KEY
   Value: ${apiKey}

2️⃣  Name: HEROKU_APP_NAME
   Value: ${appName}

3️⃣  Name: HEROKU_EMAIL
   Value: ${email}

`);

    const secretsAdded = await question('Have you added all 3 secrets? (yes/no): ');
    
    if (secretsAdded.toLowerCase() !== 'yes') {
      console.log('❌ Please add the secrets first');
      process.exit(1);
    }

    // Step 8: Deploy
    console.log('\n📤 Pushing to GitHub...\n');
    execSync('git push origin main', { stdio: 'inherit' });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              ✅ DEPLOYMENT STARTED!                         ║
╚══════════════════════════════════════════════════════════════╝

Your app is deploying now! Follow deployment:

📊 GitHub Actions:
   https://github.com/IGNITETHETEAM-2/campus-career-system/actions

🌐 Your app (wait 1-2 min):
   https://${appName}.herokuapp.com

📋 Heroku logs:
   heroku logs --tail --app ${appName}

The pipeline will:
  ✓ Install dependencies (cached)
  ✓ Run tests (backend + frontend)
  ✓ Build frontend
  ✓ Deploy to Heroku
  ✓ Health check

⏱️  Should be live in 3-5 minutes!

`);

    rl.close();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

run();
