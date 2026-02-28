const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setupUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Admin user
    const adminEmail = 'mohammedmuzhirtaha@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      adminUser = new User({
        name: 'Mohammed Muzhir Taha',
        email: adminEmail,
        password: 'muzhir123',
        role: 'admin',
        department: 'Administration'
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      // Update password if user exists
      adminUser.password = 'muzhir123';
      await adminUser.save();
      console.log('✅ Admin user password updated');
    }

    // Student user
    const studentEmail = 'mohammed@gmail.com';
    let studentUser = await User.findOne({ email: studentEmail });
    
    if (!studentUser) {
      studentUser = new User({
        name: 'Mohammed Student',
        email: studentEmail,
        password: 'muzhir123',
        role: 'student',
        department: 'Computer Science'
      });
      await studentUser.save();
      console.log('✅ Student user created');
    } else {
      // Update password if user exists
      studentUser.password = 'muzhir123';
      await studentUser.save();
      console.log('✅ Student user password updated');
    }

    console.log('\n🎉 User setup completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: mohammedmuzhirtaha@gmail.com / muzhir123');
    console.log('Student: mohammed@gmail.com / muzhir123');
    
  } catch (error) {
    console.error('❌ Error setting up users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setupUsers();