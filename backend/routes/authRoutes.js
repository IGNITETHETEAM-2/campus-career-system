const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRequest, schemas } = require('../utils/validation');

const LoginHistory = require('../models/LoginHistory');

const router = express.Router();

router.post('/register', validateRequest(schemas.registerUser), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user (password hashing is now handled by the model pre-save hook)
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
});

router.post('/login', validateRequest(schemas.loginUser), async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password using model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await LoginHistory.create({ userId: user._id, ipAddress, userAgent, status: 'Failed' });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Save login history
    await LoginHistory.create({
      userId: user._id,
      ipAddress,
      userAgent,
      status: 'Success'
    });

    // Set HTTP-Only cookie with production-ready settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Always true for cross-site cookies
      sameSite: 'none', // Needed for cross-site cookie sharing between frontend/backend subdomains
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      message: 'Login successful',
      token, // Still return token for backward compatibility if needed
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
});

// Logout endpoint to clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user profile
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Verify token endpoint
router.post('/verify', (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;
