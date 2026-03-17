const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
// xss-clean removed (deprecated, causes issues on Node 18+). XSS protection is handled by Helmet CSP.
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { validateEnv } = require('./utils/envValidator');

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

const app = express();

// Security middleware - Helmet sets various HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// CORS configuration
// CORS_ORIGIN can be a comma-separated list of allowed origins (e.g., for Vercel + localhost)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : null;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, mobile apps, Render health checks)
    if (!origin) return callback(null, true);
    // In development, allow all
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    // In production, check against allowed origins
    if (!allowedOrigins || allowedOrigins.length === 0) {
      return callback(new Error('CORS_ORIGIN env var not set in production'), false);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin '${origin}' not allowed by CORS`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

// XSS protection handled by Helmet CSP headers above

// Compression middleware - compress responses
app.use(compression());

// Logging middleware - use morgan for better logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Database Connection
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/skill-gap', require('./routes/skillGapRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - improved error handling
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate entry',
      message: `${Object.keys(err.keyValue)[0]} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`${'='.repeat(50)}\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
