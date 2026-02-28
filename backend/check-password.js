const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/campus-career').then(async () => {
  const user = await User.findOne({ email: 'student@test.com' }).select('+password');
  console.log('Password length:', user.password.length);
  console.log('First 60 chars:', user.password.substring(0, 60));
  console.log('Is bcrypt?', user.password.startsWith('$2'));
  
  // Attempt manual comparison
  const bcrypt = require('bcryptjs');
  const isValid = await bcrypt.compare('Student123', user.password);
  console.log('Password matches "Student123"?', isValid);
  
  process.exit(0);
});
