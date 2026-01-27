const mongoose = require('mongoose');

// Cache the database connection
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_DB) {
      console.log(' Using cached MongoDB connection');
    }
    return cachedConnection;
  }

  const maxRetries = 3; // Reduced retries for serverless
  let retries = 0;

  const connect = async () => {
    try {
      const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-career';

      // Only log in development or if explicitly debug enabled to keep logs clean
      if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_DB) {
        console.log(`🔄 Attempting to connect to MongoDB...`);
        console.log(`📍 Connection string: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
      }

      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // Reduced timeout for serverless
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 0, // Allow dropping to 0 for serverless
        retryWrites: true,
        w: 'majority',
        bufferCommands: false // Disable buffering
      });

      cachedConnection = conn;

      console.log('✓ MongoDB connected successfully');

      // Set up connection event handlers (only once)
      if (mongoose.connection.listeners('disconnected').length === 0) {
        mongoose.connection.on('disconnected', () => {
          console.warn('⚠ MongoDB disconnected.');
          cachedConnection = null;
        });

        mongoose.connection.on('error', (err) => {
          console.error('✗ MongoDB connection error:', err.message);
          cachedConnection = null;
        });
      }

      return conn;
    } catch (error) {
      retries++;
      console.error(`\n✗ MongoDB connection attempt ${retries}/${maxRetries} failed`);
      console.error(`   Error: ${error.message}`);

      if (retries < maxRetries) {
        const waitTime = retries; // 1s, 2s... faster backoff
        // console.log(`⏳ Retrying in ${waitTime} seconds...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        return connect();
      }

      console.error('\n✗ Failed to connect to MongoDB after multiple attempts');

      // In Vercel/Serverless, we should throw to let the function fail and retry
      throw error;
    }
  };

  return connect();
};

module.exports = connectDB;
