// Input validation utility for campus-career backend
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

const validators = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (min 6 chars, at least one uppercase, one number)
  isValidPassword: (password) => {
    if (password.length < 6) return false;
    return /[A-Z]/.test(password) && /\d/.test(password);
  },

  // Name validation
  isValidName: (name) => {
    return name && name.trim().length >= 2 && name.length <= 100;
  },

  // Phone validation (basic)
  isValidPhone: (phone) => {
    const phoneRegex = /^[\d\s\-+()]{7,}$/;
    return phoneRegex.test(phone);
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Array of skills validation
  isValidSkillsArray: (skills) => {
    return Array.isArray(skills) &&
      skills.length > 0 &&
      skills.every(skill => typeof skill === 'string' && skill.trim().length > 0);
  },

  // Date validation
  isValidDate: (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
  }
};

// Validation schemas
const schemas = {
  registerUser: {
    name: { required: true, validator: validators.isValidName, message: 'Name must be 2-100 characters' },
    email: { required: true, validator: validators.isValidEmail, message: 'Invalid email format' },
    password: { required: true, validator: validators.isValidPassword, message: 'Password must be 6+ chars with uppercase & number' },
    role: { required: true, validator: (v) => ['student', 'recruiter', 'admin'].includes(v), message: 'Invalid role' }
  },

  loginUser: {
    email: { required: true, validator: validators.isValidEmail, message: 'Invalid email format' },
    password: { required: true, validator: (v) => v && v.length > 0, message: 'Password is required' }
  },

  createEvent: {
    title: { required: true, validator: (v) => v && v.length > 0, message: 'Event title required' },
    date: { required: true, validator: validators.isValidDate, message: 'Invalid date' }
  },

  submitFeedback: {
    title: { required: true, validator: (v) => v && v.length > 0, message: 'Title required' },
    description: { required: true, validator: (v) => v && v.length > 10, message: 'Description must be 10+ chars' },
    rating: { required: true, validator: (v) => v >= 1 && v <= 5, message: 'Rating must be 1-5' }
  },

  createNotice: {
    title: { required: true, validator: (v) => v && v.length > 0, message: 'Title required' },
    content: { required: true, validator: (v) => v && v.length > 10, message: 'Content must be 10+ chars' }
  },

  uploadResume: {
    skills: { required: true, validator: validators.isValidSkillsArray, message: 'At least one skill required' }
  }
};

// Validate function
const validate = (data, schema) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check if required
    if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    // Skip validation if value is empty and not required
    if (!value && !rules.required) continue;

    // Run custom validator
    if (rules.validator && !rules.validator(value)) {
      errors.push({ field, message: rules.message });
    }
  }

  return errors;
};

// Middleware to validate request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = validate(req.body, schema);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    next();
  };
};

module.exports = {
  validators,
  validate,
  validateRequest,
  schemas,
  ValidationError
};
