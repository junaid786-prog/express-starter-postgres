# Code Style Guide

## General Rules
- Use 2 spaces for indentation
- Max line length: 100 characters
- Use semicolons
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use async/await over callbacks
- Use ES6+ features
- Always use APIResponse wrapper for consistent responses

## Type Safety with JSDoc

### Function Documentation
```javascript
/**
 * Creates a new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Created user object
 * @throws {ValidationError} If validation fails
 */
async function createUser(userData) {
  // implementation
}
```

### Type Definitions (types.js)
```javascript
/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} CreateUserDTO
 * @property {string} email
 * @property {string} password
 * @property {string} name
 */
```

## API Response Wrapper (CRITICAL)

### Response Utility (utils/response.js)
```javascript
/**
 * Standardized API response wrapper
 */
class APIResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Success response with pagination
   * @param {Object} res - Express response object
   * @param {Array} data - Response data array
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Success message
   */
  static successWithPagination(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: pagination.pages,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Created response (201)
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   * @param {string} message - Success message
   */
  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * No content response (204)
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Error code
   * @param {Array} errors - Validation errors (optional)
   */
  static error(res, message, statusCode = 500, code = 'INTERNAL_ERROR', errors = null) {
    const response = {
      success: false,
      message,
      error: {
        code,
        ...(errors && { details: errors }),
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response (400)
   * @param {Object} res - Express response object
   * @param {Array} errors - Validation error details
   * @param {string} message - Error message
   */
  static validationError(res, errors, message = 'Validation failed') {
    return this.error(res, message, 400, 'VALIDATION_ERROR', errors);
  }

  /**
   * Unauthorized response (401)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401, 'UNAUTHORIZED');
  }

  /**
   * Forbidden response (403)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403, 'FORBIDDEN');
  }

  /**
   * Not found response (404)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404, 'NOT_FOUND');
  }

  /**
   * Conflict response (409)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static conflict(res, message = 'Resource conflict') {
    return this.error(res, message, 409, 'CONFLICT');
  }

  /**
   * Internal server error response (500)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, 500, 'INTERNAL_ERROR');
  }
}

module.exports = APIResponse;
```

## Module Structure

### Routes (routes.js)
```javascript
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('./validator');

// ✅ Keep routes thin and declarative
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.getById);
router.post('/', authenticate, validate.create, controller.create);
router.put('/:id', authenticate, validate.update, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
```

### Controller (controller.js)
```javascript
const service = require('./service');
const APIResponse = require('../../utils/response');
const { ValidationError } = require('../../utils/errors');

/**
 * User controller - handles HTTP requests
 */
class UserController {
  /**
   * Get all users
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async list(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await service.getUsers({ page, limit });
      
      return APIResponse.successWithPagination(
        res,
        result.users,
        result.pagination,
        'Users retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await service.getUserById(id);
      
      if (!user) {
        return APIResponse.notFound(res, 'User not found');
      }
      
      return APIResponse.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   */
  async create(req, res, next) {
    try {
      const user = await service.createUser(req.body);
      return APIResponse.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await service.updateUser(id, req.body);
      
      if (!user) {
        return APIResponse.notFound(res, 'User not found');
      }
      
      return APIResponse.success(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await service.deleteUser(id);
      
      if (!deleted) {
        return APIResponse.notFound(res, 'User not found');
      }
      
      return APIResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

// Export instance methods bound to instance
const controller = new UserController();
module.exports = {
  list: controller.list.bind(controller),
  getById: controller.getById.bind(controller),
  create: controller.create.bind(controller),
  update: controller.update.bind(controller),
  remove: controller.remove.bind(controller),
};
```

### Service (service.js)
```javascript
const repository = require('./repository');
const { ValidationError } = require('../../utils/errors');
const bcrypt = require('bcrypt');

/**
 * User service - contains business logic
 */
class UserService {
  /**
   * Get paginated users
   * @param {Object} options
   * @param {number} options.page
   * @param {number} options.limit
   * @returns {Promise<{users: Array, pagination: Object}>}
   */
  async getUsers({ page, limit }) {
    const offset = (page - 1) * limit;
    const users = await repository.findAll({ limit, offset });
    const total = await repository.count();
    
    return {
      users: users.map(this.sanitizeUser),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>}
   */
  async getUserById(id) {
    const user = await repository.findById(id);
    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Create new user
   * @param {CreateUserDTO} userData
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    // Check if user exists
    const existing = await repository.findByEmail(userData.email);
    if (existing) {
      throw new ValidationError('Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await repository.create({
      ...userData,
      password: hashedPassword,
    });
    
    return this.sanitizeUser(user);
  }

  /**
   * Remove sensitive fields
   * @param {User} user
   * @returns {Object}
   * @private
   */
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = new UserService();
```

### Repository (repository.js)
```javascript
const User = require('./model');

/**
 * User repository - handles database operations
 */
class UserRepository {
  /**
   * Find all users
   * @param {Object} options
   * @param {number} options.limit
   * @param {number} options.offset
   * @returns {Promise<Array>}
   */
  async findAll({ limit, offset }) {
    return await User.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Find user by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return await User.findByPk(id);
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  /**
   * Create user
   * @param {CreateUserDTO} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Update user
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<Object|null>}
   */
  async update(id, updates) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updates);
  }

  /**
   * Delete user
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }

  /**
   * Count all users
   * @returns {Promise<number>}
   */
  async count() {
    return await User.count();
  }
}

module.exports = new UserRepository();
```

### Model - Sequelize (model.js)
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../../database/connection');

/**
 * User model
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true, // Use snake_case for DB columns
});

module.exports = User;
```

### Model - MongoDB (model.js)
```javascript
const mongoose = require('mongoose');

/**
 * User schema
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

module.exports = mongoose.model('User', userSchema);
```

### Validator (validator.js)
```javascript
const Joi = require('joi');
const APIResponse = require('../../utils/response');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema
 * @returns {Function} Express middleware
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return APIResponse.validationError(res, errors);
    }
    
    next();
  };
};

/**
 * User validation schemas
 */
const schemas = {
  create: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(100).required(),
  }),
  
  update: Joi.object({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(100),
    password: Joi.string().min(8),
  }).min(1), // At least one field required
};

module.exports = {
  create: validateRequest(schemas.create),
  update: validateRequest(schemas.update),
};
```

## Middleware Patterns

### Authentication Middleware
```javascript
const jwt = require('jsonwebtoken');
const APIResponse = require('../utils/response');

/**
 * Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return APIResponse.unauthorized(res, 'No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return APIResponse.unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Check user role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return APIResponse.forbidden(res, 'Insufficient permissions');
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

## Error Classes

```javascript
class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
};
```

## Error Handler Middleware

```javascript
// middleware/errorHandler.js
const APIResponse = require('../utils/response');
const { AppError } = require('../utils/errors');

/**
 * Global error handler
 * Must be last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Operational errors (known errors)
  if (err.isOperational) {
    return APIResponse.error(
      res,
      err.message,
      err.status,
      err.code
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return APIResponse.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return APIResponse.unauthorized(res, 'Token expired');
  }

  // Sequelize/Database errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
    return APIResponse.validationError(res, errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return APIResponse.conflict(res, 'Resource already exists');
  }

  // Mongoose errors
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message,
    }));
    return APIResponse.validationError(res, errors);
  }

  if (err.code === 11000) { // Mongoose duplicate key
    return APIResponse.conflict(res, 'Resource already exists');
  }

  // Unknown errors - don't leak details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return APIResponse.serverError(res, message);
};

module.exports = errorHandler;
```

## Configuration

```javascript
// config/index.js
require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

// Validate required config
const required = ['JWT_SECRET', 'DB_HOST', 'DB_NAME'];
required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = config;
```

## Common Mistakes

### ❌ Wrong: Manual response formatting
```javascript
async create(req, res) {
  const user = await service.createUser(req.body);
  res.status(201).json({
    success: true,
    data: user,
    message: 'User created'
  });
}
```

### ✅ Right: Use APIResponse wrapper
```javascript
async create(req, res, next) {
  try {
    const user = await service.createUser(req.body);
    return APIResponse.created(res, user, 'User created successfully');
  } catch (error) {
    next(error);
  }
}
```

### ❌ Wrong: Business logic in controller
```javascript
async create(req, res) {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(400).json({ error: 'User exists' });
  }
  const hashed = await bcrypt.hash(req.body.password, 10);
  // ... more logic
}
```

### ✅ Right: Thin controller with APIResponse
```javascript
async create(req, res, next) {
  try {
    const user = await service.createUser(req.body);
    return APIResponse.created(res, user, 'User created successfully');
  } catch (error) {
    next(error);
  }
}
```

### ❌ Wrong: Direct model import in controller
```javascript
const User = require('./model');

async getUser(req, res) {
  const user = await User.findByPk(req.params.id);
  res.json({ data: user });
}
```

### ✅ Right: Use repository and APIResponse
```javascript
const repository = require('./repository');
const APIResponse = require('../../utils/response');

async getUser(req, res, next) {
  try {
    const user = await repository.findById(req.params.id);
    if (!user) {
      return APIResponse.notFound(res, 'User not found');
    }
    return APIResponse.success(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
}
```

### ❌ Wrong: No validation
```javascript
router.post('/users', controller.create);
```

### ✅ Right: With validation
```javascript
router.post('/users', validate.create, controller.create);
```

### ❌ Wrong: Inconsistent error responses
```javascript
if (!user) {
  return res.status(404).json({ message: 'Not found' });
}
// vs
if (error) {
  return res.status(400).json({ error: error.message });
}
```

### ✅ Right: Consistent error responses with APIResponse
```javascript
if (!user) {
  return APIResponse.notFound(res, 'User not found');
}

if (error.isOperational) {
  return APIResponse.error(res, error.message, error.status, error.code);
}
```

## Example: Complete Auth Controller with APIResponse

```javascript
// modules/auth/controller.js
const authService = require('./service');
const APIResponse = require('../../utils/response');

class AuthController {
  /**
   * User login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      return APIResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * User registration
   */
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return APIResponse.created(res, user, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   */
  async logout(req, res, next) {
    try {
      await authService.logout(req.user.id);
      return APIResponse.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  async me(req, res, next) {
    try {
      const user = await authService.getUserProfile(req.user.id);
      return APIResponse.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return APIResponse.success(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }
}

const controller = new AuthController();
module.exports = {
  login: controller.login.bind(controller),
  register: controller.register.bind(controller),
  logout: controller.logout.bind(controller),
  me: controller.me.bind(controller),
  refreshToken: controller.refreshToken.bind(controller),
};
```