// Setup script to create .env file if it doesn't exist
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnv() {
  console.log('\n🔧 Campus Career System - Environment Setup\n');
  console.log('This script will help you create the backend/.env file.\n');

  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const envExamplePath = path.join(__dirname, 'backend', '.env.example');

  // Check if .env already exists
  if (fs.existsSync(backendEnvPath)) {
    console.log('⚠️  backend/.env already exists!');
    const overwrite = await question('Do you want to overwrite it? (yes/no): ');
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  // Read example if exists
  let defaultValues = {
    MONGO_URI: 'mongodb://localhost:27017/campus-career',
    JWT_SECRET: 'your-super-secret-key-change-this-in-production-min-32-chars',
    PORT: '5000',
    NODE_ENV: 'development',
    CORS_ORIGIN: '*'
  };

  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    // Parse example file (simple parsing)
    exampleContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          defaultValues[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }

  console.log('\n📋 Configuration Questions:\n');
  console.log('Press Enter to use default values shown in [brackets]\n');

  // MongoDB URI
  const mongoUri = await question(`MongoDB Connection String [${defaultValues.MONGO_URI}]: `);
  const MONGO_URI = mongoUri.trim() || defaultValues.MONGO_URI;

  // JWT Secret
  const jwtSecret = await question(`JWT Secret Key [${defaultValues.JWT_SECRET}]: `);
  const JWT_SECRET = jwtSecret.trim() || defaultValues.JWT_SECRET;

  // Port
  const port = await question(`Server Port [${defaultValues.PORT}]: `);
  const PORT = port.trim() || defaultValues.PORT;

  // Node Environment
  const nodeEnv = await question(`Node Environment (development/production) [${defaultValues.NODE_ENV}]: `);
  const NODE_ENV = nodeEnv.trim() || defaultValues.NODE_ENV;

  // CORS Origin
  const corsOrigin = await question(`CORS Origin (use * for development) [${defaultValues.CORS_ORIGIN}]: `);
  const CORS_ORIGIN = corsOrigin.trim() || defaultValues.CORS_ORIGIN;

  // Create .env content
  const envContent = `# MongoDB Configuration
MONGO_URI=${MONGO_URI}

# JWT Secret Key (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=${JWT_SECRET}

# Server Configuration
PORT=${PORT}
NODE_ENV=${NODE_ENV}

# CORS Configuration
CORS_ORIGIN=${CORS_ORIGIN}
`;

  // Ensure backend directory exists
  const backendDir = path.join(__dirname, 'backend');
  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }

  // Write .env file
  fs.writeFileSync(backendEnvPath, envContent);

  console.log('\n✅ Environment file created successfully!');
  console.log(`📁 Location: ${backendEnvPath}\n`);

  console.log('📋 Configuration Summary:');
  console.log(`   MONGO_URI: ${MONGO_URI.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`   JWT_SECRET: ${JWT_SECRET.substring(0, 20)}...`);
  console.log(`   PORT: ${PORT}`);
  console.log(`   NODE_ENV: ${NODE_ENV}`);
  console.log(`   CORS_ORIGIN: ${CORS_ORIGIN}\n`);

  console.log('🚀 Next Steps:');
  console.log('   1. Verify MongoDB connection string is correct');
  console.log('   2. Change JWT_SECRET for production');
  console.log('   3. Run: npm start\n');

  rl.close();
}

setupEnv().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
