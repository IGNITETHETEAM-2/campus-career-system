/**
 * Seed script to create a test user for authentication testing
 * Run with: node backend/seed-test-user.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testUsers = [
  {
    name: 'Test Student',
    email: 'student@test.com',
    password: 'Student123',
    role: 'student',
    phone: '9876543210',
    department: 'Computer Science'
  },
  {
    name: 'Test Recruiter',
    email: 'recruiter@test.com',
    password: 'Recruiter123',
    role: 'recruiter',
    phone: '9876543211',
    department: 'Recruitment'
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin123',
    role: 'admin',
    phone: '9876543212',
    department: 'Administration'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-career';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Delete existing test users
    await User.deleteMany({ 
      email: { $in: testUsers.map(u => u.email) } 
    });
    console.log('✓ Cleared existing test users');

    // Create new test users using .save() to trigger pre-save hook
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('✓ Test users created successfully\n');

    // Display user credentials
    console.log('═════════════════════════════════════════');
    console.log('  📋 TEST USER CREDENTIALS');
    console.log('═════════════════════════════════════════\n');
    
    createdUsers.forEach((user) => {
      const testUser = testUsers.find(u => u.email === user.email);
      console.log(`👤 ${user.role.toUpperCase()} Account`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${testUser.password}`);
      console.log(`   Name: ${user.name}`);
      console.log();
    });

    console.log('═════════════════════════════════════════');
    console.log('✨ Database seeded successfully!');
    console.log('═════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
