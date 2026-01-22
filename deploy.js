#!/usr/bin/env node

/**
 * Campus Career System - Quick Heroku Deployment Script
 * This script guides you through deploying to Heroku step-by-step
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🚀 Campus Career System - Heroku Deployment Setup            ║
║     Complete guide to deploy your app in 5 minutes            ║
╚════════════════════════════════════════════════════════════════╝
`);

  // Step 1: Check prerequisites
  console.log('\n📋 CHECKING PREREQUISITES...\n');
  
  try {
    execSync('heroku --version', { stdio: 'ignore' });
    console.log('✅ Heroku CLI installed');
  } catch (e) {
    console.log('❌ Heroku CLI not found');
    console.log('\n   👉 Install from: https://devcenter.heroku.com/articles/heroku-cli');
    console.log('   After installing, re-run this script.\n');
    process.exit(1);
  }

  try {
    execSync('git --version', { stdio: 'ignore' });
    console.log('✅ Git installed');
  } catch (e) {
    console.log('❌ Git not found');
    process.exit(1);
  }

  // Step 2: Get app name
  console.log('\n📱 CREATE HEROKU APP\n');
  
  const appName = await question('Enter desired Heroku app name (e.g., campus-career-system): ');
  
  if (!appName || appName.length < 3) {
    console.log('❌ Invalid app name. Must be at least 3 characters.');
    process.exit(1);
  }

  console.log('\n   🔄 Creating Heroku app...');
  try {
    execSync(`heroku create ${appName}`, { stdio: 'inherit' });
    console.log('✅ Heroku app created!');
  } catch (e) {
    console.log('❌ Failed to create app (may already exist)');
    const confirm = await question('Continue anyway? (y/n): ');
    if (confirm.toLowerCase() !== 'y') process.exit(1);
  }

  // Step 3: MongoDB setup
  console.log('\n🗄️  MONGODB ATLAS SETUP\n');
  console.log('   1. Go to: https://www.mongodb.com/cloud/atlas');
  console.log('   2. Create free cluster (or use existing)');
  console.log('   3. Create database user');
  console.log('   4. Get connection string (Database > Connect > Connect your application)');
  
  const mongoUri = await question('\nPaste your MongoDB connection string: ');
  
  if (!mongoUri.includes('mongodb')) {
    console.log('❌ Invalid MongoDB URI');
    process.exit(1);
  }

  // Step 4: Set Heroku config vars
  console.log('\n⚙️  CONFIGURING HEROKU...\n');
  console.log('   🔄 Setting config variables...');

  const jwtSecret = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);

  try {
    execSync(`heroku config:set MONGO_URI="${mongoUri}" --app ${appName}`, { stdio: 'inherit' });
    execSync(`heroku config:set JWT_SECRET="${jwtSecret}" --app ${appName}`, { stdio: 'inherit' });
    execSync(`heroku config:set NODE_ENV="production" --app ${appName}`, { stdio: 'inherit' });
    console.log('✅ Config variables set!');
  } catch (e) {
    console.log('❌ Failed to set config vars');
    process.exit(1);
  }

  // Step 5: Get Heroku API key
  console.log('\n🔑 GITHUB SECRETS SETUP\n');
  console.log('   1. Go to: https://dashboard.heroku.com/account');
  console.log('   2. Scroll to "API Key"');
  console.log('   3. Click "Reveal" and copy the key');
  
  const apiKey = await question('\nPaste your Heroku API Key: ');
  
  if (!apiKey || apiKey.length < 10) {
    console.log('❌ Invalid API key');
    process.exit(1);
  }

  // Step 6: Get GitHub email
  const herokuEmail = await question('Enter your Heroku account email: ');

  // Step 7: Instructions for GitHub secrets
  console.log('\n📝 ADD THESE SECRETS TO GITHUB:\n');
  console.log('   1. Go to: https://github.com/IGNITETHETEAM-2/campus-career-system/settings/secrets/actions');
  console.log('   2. Click "New repository secret" and add:\n');
  
  console.log(`   Secret Name: HEROKU_API_KEY`);
  console.log(`   Value: ${apiKey}\n`);
  
  console.log(`   Secret Name: HEROKU_APP_NAME`);
  console.log(`   Value: ${appName}\n`);
  
  console.log(`   Secret Name: HEROKU_EMAIL`);
  console.log(`   Value: ${herokuEmail}\n`);

  const secretsAdded = await question('Have you added all 3 secrets to GitHub? (y/n): ');
  
  if (secretsAdded.toLowerCase() !== 'y') {
    console.log('❌ Please add the secrets and re-run this script.');
    process.exit(1);
  }

  // Step 8: Deploy!
  console.log('\n🚀 DEPLOYING...\n');
  console.log('   📤 Pushing code to GitHub...');
  
  try {
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Code pushed!');
  } catch (e) {
    console.log('⚠️  Git push failed (may be no changes)');
  }

  // Step 9: Monitor deployment
  console.log('\n📊 DEPLOYMENT IN PROGRESS\n');
  console.log('   Monitor at: https://github.com/IGNITETHETEAM-2/campus-career-system/actions');
  console.log('   Heroku logs: heroku logs --tail --app ' + appName);
  
  const wait = await question('\nWait 30 seconds then press Enter to check status...');

  console.log('\n   🔄 Checking app status...');
  try {
    const output = execSync(`heroku apps:info --app ${appName}`, { encoding: 'utf-8' });
    console.log(output);
  } catch (e) {
    console.log('Could not fetch app info');
  }

  // Final success
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ DEPLOYMENT COMPLETE!                                       ║
╚════════════════════════════════════════════════════════════════╝

🌐 Your app is now live at:
   https://${appName}.herokuapp.com

📚 Useful commands:
   heroku logs --tail --app ${appName}
   heroku config --app ${appName}
   heroku restart --app ${appName}

🔍 Test your API:
   curl https://${appName}.herokuapp.com/api/auth/me

📝 Next steps:
   • Monitor GitHub Actions for automatic deployments
   • Check Heroku logs if something goes wrong
   • Set up custom domain (optional)

Questions? See QUICK_HEROKU_SETUP.md or GITHUB_SECRETS_SETUP.md
`);

  rl.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
