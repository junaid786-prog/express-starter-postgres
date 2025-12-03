# Claude Code - Project Entry Point

## Project Overview
Node.js backend with Express.js, using PostgreSQL with Sequelize ORM for data persistence.

## Quick Start
1. Read `.claude/standards/tech-stack.md` for current project stack
2. Check `llm/cache/modules.json` for existing modules
3. Review `CHANGELOG.md` for recent changes
4. Follow `.claude/standards/best-practices.md` and `.claude/standards/code-styles.md` strictly

## Before Starting Any Task
1. Break down the task into testable steps
2. Identify affected modules/layers
3. Check if migrations are needed (use Sequelize CLI)
4. Update `llm/cache/` with module context
5. Plan folder structure changes if needed
6. Define model associations if creating new models

## Common Mistakes to Avoid
- ❌ Don't import models directly in controllers
- ❌ Don't write business logic in routes or controllers
- ❌ Don't skip input validation
- ❌ Don't hardcode secrets or config
- ❌ Don't use process.env directly (use src/config/env.js import)
- ❌ Don't create monolithic files (split at 200 lines)
- ❌ Don't forget error handling middleware
- ❌ Don't skip migration files for schema changes
- ❌ Don't mix database queries in multiple layers
- ❌ Don't forget to use transactions for multi-table operations
- ❌ Don't use sync() in production (use migrations)
- ❌ Don't forget to define associations in models

## File Modification Rules
- Max 200 lines per file (split if exceeded)
- One responsibility per file
- Keep routes thin (only routing logic)
- Keep controllers thin (only orchestration)
- Business logic goes in services
- Data access goes in repositories (not models)

## Security Checklist
- [ ] Input validation on all endpoints
- [ ] Authentication middleware applied
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] SQL injection prevention (Sequelize parameterizes automatically)
- [ ] XSS prevention (sanitize inputs)
- [ ] Secrets in environment variables
- [ ] Error messages don't leak sensitive data
- [ ] Use Sequelize validators for data integrity
- [ ] Implement proper transaction rollbacks

## Testing Strategy
After each subtask:
1. Test the endpoint with valid data
2. Test with invalid/malicious data
3. Test authentication/authorization
4. Check error responses
5. Verify database state

## Documentation Updates Required
- Update module docs in `src/modules/[module]/README.md`
- Update `llm/cache/modules.json` with new context
- Update `CHANGELOG.md` with changes
- Update API documentation

## When Adding New Module
1. Create structure: `src/modules/[module-name]/`
2. Add routes, controllers, services, repositories, models
3. Create `src/modules/[module-name]/README.md`
4. Update `llm/cache/modules.json`
5. Add tests
6. Update main router

## Folder Structure Reference
```
src/
├── modules/
│   ├── users/
│   │   ├── routes.js
│   │   ├── controller.js
│   │   ├── service.js
│   │   ├── repository.js
│   │   ├── model.js        # Sequelize model
│   │   ├── validator.js
│   │   └── README.md
│   └── events/
├── middleware/
├── config/
│   ├── database.js         # Sequelize config
│   └── env.js             # Centralized environment variables
├── utils/
└── database/
    ├── connection.js       # Sequelize instance
    ├── migrations/         # Sequelize migrations
    ├── seeders/           # Seed data
    └── models/            # All models
```

## Environment Variables
ALWAYS use `src/config/env.js` for environment variables. NEVER use `process.env` directly.

```javascript
// ❌ Wrong - Direct process.env usage
const port = process.env.PORT || 3000;

// ✅ Correct - Use centralized env.js
const env = require('../config/env');
const port = env.PORT;
```

## Current Context
Check these files for project state:
- `llm/cache/modules.json` - Module registry and context
- `CHANGELOG.md` - Recent changes
- `.claude/standards/tech-stack.md` - Technology decisions
- `.env.example` - Required environment variables
- `src/config/env.js` - Centralized environment configuration