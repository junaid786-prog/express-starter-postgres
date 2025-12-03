# Continue Development Command

This command helps resume development in a new chat session while maintaining consistency with established patterns.

## Command Usage

When starting a new chat session, use:

```
/continue-dev
```

## What This Command Does

1. **Reads Project Context**
   - Loads `llm/cache/modules.json` to understand completed specs
   - Reviews `CHANGELOG.md` for recent changes
   - Checks `.claude/standards/` files for guidelines

2. **Establishes Development Standards**
   - Follows patterns from `DEVELOPMENT.md`
   - Applies code styles from `code-styles.md`
   - Adheres to best practices from `best-practices.md`
   - References tech stack from `tech-stack.md`

3. **Identifies Next Task**
   - Determines next pending spec from cache
   - Shows current progress
   - Asks for confirmation before proceeding

4. **Maintains Consistency**
   - Uses same file structure patterns
   - Follows same naming conventions
   - Implements same error handling
   - Updates documentation automatically

## Implementation

The assistant will:

1. Read and summarize current state
2. Show what specs are completed
3. Identify next spec to implement
4. Ask: "Ready to continue with Spec X: [Name]?"
5. Upon confirmation, follow the standard workflow:
   - Create Model (if needed)
   - Create Validation schemas
   - Create Controller
   - Create Routes
   - Register in app.js
   - Update CHANGELOG.md
   - Update modules.json cache

## Files It References

### Required Files
- `.claude/specs.md` - Milestone specifications and progress tracking
- `CHANGELOG.md` - Change history
- `DEVELOPMENT.md` - Development workflow guide
- `.claude/standards/best-practices.md` - Coding best practices
- `.claude/standards/code-styles.md` - Code style guidelines
- `.claude/standards/tech-stack.md` - Technology stack

### Optional Files (if exist)
- `llm/cache/modules.json` - Module state tracking
- `.claude/prd.md` - Product requirements document

## Example Flow

**User:** `/continue-dev`

**Assistant Response:**
```
📋 Project Status - Slotwise 

Completed Milestones (0/8):

Next Up:
🔸 Milestone 1:
Development Standards Loaded:
✓ Tech Stack: Node.js, Express, PostgreSQL/MongoDB, JWT
✓ Architecture: Modular (controller-route-validation pattern)  
✓ Integrations: ServiceTitan, Scheduling Pro, Klaviyo, SMS
✓ Analytics: GA4, Meta Pixel, Google Ads, VWO
✓ Error Handling: express-async-errors + custom classes
✓ Validation: Joi schemas

Ready to continue with Milestone 1: Architecture & Review?
```

## Automatic Updates

After completing each milestone, the assistant will automatically:

1. ✅ Update `CHANGELOG.md` with new entries
2. ✅ Update `.claude/specs.md` with:
   - Mark milestone tasks as completed
   - Add implementation notes
   - Update progress tracking
3. ✅ Follow all patterns from established architecture
4. ✅ Test integration endpoints thoroughly

## Benefits

- **Seamless Resumption**: Pick up exactly where you left off
- **Consistency**: Maintains same code patterns across sessions
- **Documentation**: Auto-updates changelog and cache
- **Context Aware**: Knows what's done and what's next
- **No Repetition**: Doesn't recreate existing files

## Notes

- This command should be run at the start of each new chat session
- It ensures the assistant has full context of the project
- All standards and patterns are automatically applied
- The assistant will ask before making changes
