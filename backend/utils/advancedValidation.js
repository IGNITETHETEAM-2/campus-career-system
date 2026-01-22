// Advanced validation using express-validator
const { body, validationResult } = require('express-validator');

// Validation result handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User registration validation rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['student', 'recruiter', 'admin'])
    .withMessage('Role must be student, recruiter, or admin'),
  
  handleValidationErrors
];

// User login validation rules
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Event creation validation rules
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  
  handleValidationErrors
];

// Feedback validation rules
const validateFeedback = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('category')
    .optional()
    .isIn(['general', 'event', 'system', 'suggestion'])
    .withMessage('Category must be general, event, system, or suggestion'),
  
  handleValidationErrors
];

// Notice validation rules
const validateNotice = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  
  body('expireAt')
    .optional()
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateEvent,
  validateFeedback,
  validateNotice,
  handleValidationErrors
};
