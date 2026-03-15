// Environment variable validation
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
