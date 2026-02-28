/**
 * Debug script to test authentication flow
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const testLogin = async () => {
  try {
    console.log('🔐 Authentication Debug Test\n');
    
    // Connect to MongoDB
    console.log('1️⃣  Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/campus-career');
    console.log('   ✓ Connected\n');

    // Find test user
    console.log('2️⃣  Looking for test user (student@test.com)...');
    const user = await User.findOne({ email: 'student@test.com' }).select('+password');
    
    if (!user) {
      console.log('   ✗ User not found');
      process.exit(1);
    }
    console.log('   ✓ User found');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password Hash: ${user.password.substring(0, 20)}...\n`);

    // Test password comparison
    console.log('3️⃣  Testing password comparison...');
    const testPasswords = ['Student123', 'student123', 'wrong123', 'Password1'];
    
    for (const testPass of testPasswords) {
      const isValid = await user.comparePassword(testPass);
      console.log(`   "${testPass}": ${isValid ? '✓ Valid' : '✗ Invalid'}`);
    }
    console.log();

    // Test token generation
    console.log('4️⃣  Testing token generation...');
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    console.log(`   ✓ Token created`);
    console.log(`   Token preview: ${token.substring(0, 50)}...\n`);

    // Verify token
    console.log('5️⃣  Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log(`   ✓ Token valid`);
    console.log(`   User ID: ${decoded.userId}`);
    console.log(`   Email: ${decoded.email}`);
    console.log(`   Role: ${decoded.role}\n`);

    console.log('✅ All authentication tests passed!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
