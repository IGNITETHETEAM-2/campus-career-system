const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-career';
      
      console.log(`🔄 Attempting to connect to MongoDB...`);
      console.log(`📍 Connection string: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000, // Increased timeout
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        w: 'majority'
      });

      console.log('✓ MongoDB connected successfully');
      console.log(`✓ Database: ${mongoose.connection.name}`);
      console.log(`✓ Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      
      // Set up connection event handlers
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠ MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('error', (err) => {
        console.error('✗ MongoDB connection error:', err.message);
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✓ MongoDB reconnected successfully');
      });

      return true;
    } catch (error) {
      retries++;
      console.error(`\n✗ MongoDB connection attempt ${retries}/${maxRetries} failed`);
      console.error(`   Error: ${error.message}`);
      
      // Provide helpful error messages
      if (error.message.includes('ECONNREFUSED')) {
        console.error('   💡 Tip: Make sure MongoDB is running');
        console.error('   💡 For local MongoDB: Start the MongoDB service');
        console.error('   💡 For MongoDB Atlas: Check your connection string and network access');
      } else if (error.message.includes('authentication failed')) {
        console.error('   💡 Tip: Check your MongoDB username and password');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('   💡 Tip: Check your MongoDB host/URL');
      }

      if (retries < maxRetries) {
        const waitTime = retries * 2;
        console.log(`⏳ Retrying in ${waitTime} seconds...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        return connect();
      }

      console.error('\n✗ Failed to connect to MongoDB after multiple attempts');
      console.error('\n📋 Troubleshooting Steps:');
      console.error('1. Check if MongoDB is running (local) or accessible (Atlas)');
      console.error('2. Verify MONGO_URI in .env file');
      console.error('3. For MongoDB Atlas: Check network access and IP whitelist');
      console.error('4. For local MongoDB: Ensure MongoDB service is started');
      console.error('\n⚠️  Server will continue but database operations will fail until connected.\n');
      
      // Don't exit - let server start without DB (for development)
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      return false;
    }
  };

  return connect();
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('\n✓ MongoDB connection closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
