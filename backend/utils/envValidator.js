// Environment variable validation
// Vercel deployment environment variables:
// Backend runtime (serverless):
// - MONGO_URI: MongoDB connection string
// - JWT_SECRET: JWT signing key
// - NODE_ENV: 'production' on Vercel
// - CORS_ORIGIN: Allowed frontend origin (e.g., https://your-frontend.vercel.app)
// - PORT: ignored in serverless, used locally
// CI/CD (GitHub secrets used by workflows):
// - VERCEL_TOKEN
// - VERCEL_ORG_ID
// - VERCEL_PROJECT_ID_BACKEND
// - VERCEL_PROJECT_ID_FRONTEND
// Frontend build:
// - REACT_APP_API_URL: e.g., https://your-backend.vercel.app/api (set via FRONTEND_API_URL secret)
const requiredEnvVars = {
  development: ['MONGO_URI'],
  production: ['MONGO_URI', 'JWT_SECRET', 'PORT'],
  test: ['MONGO_URI']
};

const validateEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const missing = [];

  const vars = requiredEnvVars[env] || requiredEnvVars.development;

  vars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values where available.');
  }

  // Set defaults
  if (!process.env.JWT_SECRET && env === 'development') {
    console.warn('⚠️  JWT_SECRET not set. Using default (INSECURE for production!)');
    process.env.JWT_SECRET = 'your-secret-key-change-this-in-production';
  }

  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }

  if (!process.env.MONGO_URI) {
    process.env.MONGO_URI = 'mongodb://localhost:27017/campus-career';
  }

  return missing.length === 0;
};

module.exports = { validateEnv };
