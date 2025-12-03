# Backend Best Practices

## Architecture Layers (CRITICAL)

### Layer Hierarchy
```
Routes → Controllers → Services → Repositories → Models
```

**Rules:**
- Routes: Only routing, apply middleware, pass to controller
- Controllers: Validate input, orchestrate services, format response
- Services: Business logic, transactions, cross-repository operations
- Repositories: Database queries only, return plain objects
- Models: Schema definitions only, no queries

**Common Mistakes:**
- ❌ Never import models in controllers
- ❌ Never write business logic in controllers
- ❌ Never write queries outside repositories
- ❌ Never import repositories directly in routes

## Modular Structure

### Module Organization
```
src/modules/[module-name]/
├── routes.js          # Route definitions
├── controller.js      # Request handling
├── service.js         # Business logic
├── repository.js      # Database operations
├── model.js          # Schema/Model
├── validator.js      # Input validation schemas
├── types.js          # TypeScript types/JSDoc
└── README.md         # Module documentation
```

### Module Independence
- Each module is self-contained
- Modules communicate through services (not directly)
- Shared logic goes in `src/utils/`
- No circular dependencies between modules

## REST API Standards

### Endpoint Naming
```
✅ GET    /users
✅ GET    /users/:id
✅ POST   /users
✅ PUT    /users/:id
✅ PATCH  /users/:id
✅ DELETE /users/:id

✅ GET    /users/:userId/posts
✅ POST   /users/:userId/posts

❌ GET    /getUsers
❌ POST   /createUser
❌ GET    /user_list
```

### Status Codes
- 200: Success with body
- 201: Created
- 204: Success no body
- 400: Bad request (validation error)
- 401: Unauthorized (not logged in)
- 403: Forbidden (no permission)
- 404: Not found
- 409: Conflict (duplicate)
- 500: Server error

### Response Format
```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: { message: "...", code: "..." } }

// List with pagination
{ 
  success: true, 
  data: [...],
  pagination: { page, limit, total }
}
```

## Security (NON-NEGOTIABLE)

### Input Validation
- Validate ALL inputs (body, params, query)
- Use validation library (Joi, Zod, express-validator)
- Whitelist approach, not blacklist
- Sanitize HTML inputs

### Authentication & Authorization
- JWT tokens in HTTP-only cookies (preferred) or Bearer tokens
- Verify tokens in middleware, not in controllers
- Check permissions before business logic
- Never trust client-sent user IDs

### Database Security
```javascript
// ✅ Parameterized queries
await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ String concatenation
await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### Environment Variables
- All secrets in `.env`
- Never commit `.env` file
- Provide `.env.example` with dummy values
- Validate required env vars on startup

### Rate Limiting
```javascript
// Apply to all routes or sensitive routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per window
});
```

## Error Handling

### Centralized Error Handler
```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    error: { message, code: err.code }
  });
};
```

### Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.code = 'VALIDATION_ERROR';
  }
}
```

### Try-Catch in Async Routes
```javascript
// Use async handler wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply to routes
router.get('/users', asyncHandler(userController.getUsers));
```

## Database Operations

### Migrations
- Every schema change needs a migration
- Name: `YYYYMMDDHHMMSS-description.js`
- Test rollback before committing
- Never modify existing migrations

### Transactions
```javascript
// Use transactions for multi-table operations
async createOrder(orderData) {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.create(orderData, { transaction });
    await Inventory.decrement('stock', { transaction });
    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Repository Pattern
```javascript
// ✅ Repository handles queries
class UserRepository {
  async findById(id) {
    return await User.findByPk(id);
  }
  
  async create(data) {
    return await User.create(data);
  }
}

// ❌ Don't query in service
async getUserData(id) {
  const user = await User.findByPk(id); // NO!
}
```

## File Organization

### File Size Limit
- Max 200 lines per file
- Split into multiple files if exceeded
- Use barrel exports (index.js) for modules

### Naming Conventions
- Files: kebab-case (user-service.js)
- Folders: kebab-case (user-management)
- Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE

### Import Order
```javascript
// 1. Node built-ins
const path = require('path');

// 2. External packages
const express = require('express');

// 3. Internal modules
const userService = require('./services/user-service');

// 4. Config/constants
const config = require('./config');
```

## Task Division

### Before Starting
1. Break feature into subtasks (max 2 hours each)
2. Identify files to create/modify
3. Plan migration if needed
4. Update `llm/cache/modules.json` with context

### Development Flow
1. Write/update model & migration
2. Create repository methods
3. Write service logic
4. Create controller
5. Add routes
6. Add validation
7. Test manually
8. Update documentation

### Testing at Each Step
- Test repository methods independently
- Test service logic with mock data
- Test endpoints with Postman/curl
- Test error cases
- Test authentication/authorization

## LLM Cache Management

### Update modules.json
```json
{
  "modules": {
    "users": {
      "purpose": "User management and authentication",
      "endpoints": ["/users", "/users/:id", "/auth/login"],
      "dependencies": ["events"],
      "lastModified": "2025-10-16"
    }
  }
}
```

### Module README Template
```markdown
# Module Name

## Purpose
Brief description

## Endpoints
- GET /resource
- POST /resource

## Dependencies
- Other modules used
- External services

## Database Tables
- table_name: description

## Integration Notes
- How other modules use this
- Important considerations
```

## Changelog Maintenance

### Format
```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Modified behavior

### Fixed
- Bug fix description

### Security
- Security updates
```

## Scripts (package.json)

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "node src/database/migrate.js",
    "migrate:rollback": "node src/database/migrate.js rollback",
    "seed": "node src/database/seed.js",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write \"src/**/*.js\""
  }
}
```

## Common Pitfalls

1. **Mixing Concerns**: Keep layers separate, don't skip layers
2. **Fat Controllers**: Move logic to services
3. **Direct Model Access**: Always use repositories
4. **Missing Validation**: Validate at route level
5. **Weak Error Handling**: Use try-catch and error middleware
6. **No Transactions**: Use for related operations
7. **Hardcoded Values**: Use config/environment variables
8. **Poor Naming**: Use RESTful conventions
9. **Missing Documentation**: Update docs with code
10. **Large Files**: Split when exceeding 200 lines