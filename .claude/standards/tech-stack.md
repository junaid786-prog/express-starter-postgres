# Tech Stack

> **Note**: Update this file for each project based on requirements

## Current Project Stack

### Runtime & Framework
- **Node.js**: v18+ (LTS)
- **Express.js**: v4.x - Web framework
- **Environment**: Node.js server-side

### Database
- **PostgreSQL**: v14+ with Sequelize ORM
  - For relational data, complex queries, ACID transactions
  - Connection pooling with pg/pg-pool
  - Full SQL support with foreign keys and constraints

### ORM
- **Sequelize**: v6+ (for PostgreSQL)
  - Migration support with CLI
  - Model definitions with associations
  - Query builder with raw SQL support
  - Hooks and lifecycle events
  - Database sync and seeding

### Authentication & Security
- **jsonwebtoken**: JWT token generation/verification
- **bcrypt**: Password hashing
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting
- **express-validator** or **joi**: Input validation

### Middleware & Utilities
- **dotenv**: Environment variable management
- **morgan**: HTTP request logger
- **compression**: Response compression
- **express-async-errors**: Async error handling

### Development Tools
- **nodemon**: Development server with auto-reload
- **eslint**: Code linting
- **prettier**: Code formatting
- **jest** or **mocha**: Testing framework

### Optional Based on Needs
- **multer**: File upload handling
- **sharp**: Image processing
- **node-cron**: Scheduled tasks
- **socket.io**: WebSocket support
- **redis**: Caching and sessions
- **bull**: Job queue management
- **winston**: Advanced logging
- **swagger-ui-express**: API documentation

## Database Selection Guide

### Use PostgreSQL When:
- Complex relationships between entities
- Need ACID transactions
- Financial data or critical consistency
- Complex joins and aggregations
- Structured, predictable schema

## Current Project Choice

**Primary Database**: PostgreSQL with Sequelize ORM

**Reasoning**:
- Structured data with clear relationships between entities
- Need for ACID transactions and data integrity
- Complex queries and joins for reporting
- Better suited for business logic with defined schemas
- Strong type safety with Sequelize models

## Package Versions

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.8.1",
    "jsonwebtoken": "^9.0.1",
    "bcrypt": "^5.1.0",
    "joi": "^17.9.2",
    "morgan": "^1.10.0",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "jest": "^29.6.1"
  }
}
```

### For PostgreSQL Projects Add:
```json
{
  "dependencies": {
    "sequelize": "^6.32.1",
    "pg": "^8.11.1",
    "pg-hstore": "^2.3.4"
  }
}
```

### Required PostgreSQL Dependencies:
```json
{
  "dependencies": {
    "sequelize": "^6.32.1",
    "pg": "^8.11.1",
    "pg-hstore": "^2.3.4",
    "sequelize-cli": "^6.6.1"
  }
}
```

## Project Structure

```
project-root/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── users/
│   │   ├── auth/
│   │   └── events/
│   ├── middleware/        # Custom middleware
│   ├── config/           # Configuration files
│   ├── database/         # DB connection & migrations
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── connection.js
│   ├── utils/            # Utility functions
│   │   ├── errors.js
│   │   ├── logger.js
│   │   └── helpers.js
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── llm/                 # LLM context cache
│   └── cache/
│       └── modules.json
├── tests/               # Test files
├── docs/                # API documentation
├── .env.example         # Environment template
├── .env                 # Environment variables (gitignored)
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── CHANGELOG.md
├── README.md
├── CLAUDE.md           # AI assistant entry point
├── best-practices.md
├── code-styles.md
└── tech-stack.md
```

## Environment Variables Template

```env
# Server
NODE_ENV=development
PORT=3000

# Database - PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=password

# Database Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE=10000
DB_POOL_ACQUIRE=60000

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Security
CORS_ORIGIN=http://localhost:3001

# Optional Services
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
```

## Migration Strategy

### Sequelize (PostgreSQL)
```bash
# Create migration
npm run migrate:create -- --name create-users-table

# Run migrations
npm run migrate

# Rollback
npm run migrate:rollback
```

### Sequelize CLI Commands
```bash
# Initialize Sequelize
npx sequelize-cli init

# Create model
npx sequelize-cli model:generate --name User --attributes name:string,email:string

# Create seed
npx sequelize-cli seed:generate --name demo-users

# Run seeds
npx sequelize-cli db:seed:all
```

## Switching Databases Mid-Project

If project requirements change:

1. Keep existing database code in separate module
2. Add new database configuration
3. Create migration plan with data transfer scripts
4. Update `tech-stack.md` with new choice and reasoning
5. Document in CHANGELOG.md
6. Update all module READMEs with new patterns

## Performance Considerations

### PostgreSQL
- Use connection pooling (min: 2, max: 10)
- Index foreign keys and frequently queried columns
- Use prepared statements (Sequelize does this)
- Enable query logging in development only

### Sequelize Best Practices
- Use eager loading with include for associations
- Implement pagination with limit and offset
- Use raw queries for complex operations
- Leverage database views for reporting

## Deployment Considerations

### Database URL
- PostgreSQL: `postgresql://user:password@host:port/database`
- Connection string format: `postgres://[user]:[password]@[host]:[port]/[database]?sslmode=[mode]`

### Environment-Specific Config
- Development: Local databases
- Staging: Cloud databases with test data
- Production: Managed databases with backups

## Common Gotchas

### PostgreSQL + Sequelize
- Remember to run migrations before starting app
- Use transactions for multi-table operations
- Don't forget to close connections on app shutdown
- Use `underscored: true` for snake_case columns

### Sequelize Specific
- Always define associations in both directions
- Use migrations for all schema changes
- Handle connection errors gracefully
- Implement proper transaction rollback
- Use paranoid: true for soft deletes
- Configure timestamps: true for createdAt/updatedAt