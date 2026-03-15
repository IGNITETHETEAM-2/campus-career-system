const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedSpecificUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-career-system';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const userData = {
      name: 'Mohammed Muzhir Taha',
      email: 'mohammedmuzhirtaha@gmail.com',
      password: 'mohammedmuzhirtaha@gmail.com', // Will be hashed
      role: 'student'
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('User already exists, updating...');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      existingUser.name = userData.name;
      existingUser.password = hashedPassword;
      existingUser.role = userData.role;
      await existingUser.save();
      console.log('User updated successfully');
    } else {
      console.log('Creating new user...');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });
      await newUser.save();
      console.log('User created successfully');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedSpecificUser();
