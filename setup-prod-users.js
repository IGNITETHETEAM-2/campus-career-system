const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Production MongoDB URI - replace with your actual production URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://your-connection-string';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
  department: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const setupProductionUsers = async () => {
  try {
    console.log('Connecting to production database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Hash password
    const hashedPassword = await bcrypt.hash('muzhir123', 10);

    // Admin user
    await User.findOneAndUpdate(
      { email: 'mohammedmuzhirtaha@gmail.com' },
      {
        name: 'Mohammed Muzhir Taha',
        email: 'mohammedmuzhirtaha@gmail.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Administration'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user created/updated');

    // Student user
    await User.findOneAndUpdate(
      { email: 'mohammed@gmail.com' },
      {
        name: 'Mohammed Student',
        email: 'mohammed@gmail.com',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Student user created/updated');

    console.log('\n🎉 Production users setup completed!');
    console.log('\nLogin credentials:');
    console.log('Admin: mohammedmuzhirtaha@gmail.com / muzhir123');
    console.log('Student: mohammed@gmail.com / muzhir123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setupProductionUsers();