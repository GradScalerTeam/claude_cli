# Project Commands
- Dev: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`

# Backend Architecture
- `src/routes` or `src/api` contains request handlers
- `src/services` contains business logic
- `src/models` or `src/db` contains persistence access
- Authentication, validation, and error handling should follow existing middleware patterns

# API And Data Rules
- Prefer preserving existing response shapes unless a contract change is explicitly requested
- Keep validation at the boundary
- Keep authorization separate from authentication checks
- Avoid mixing schema changes into unrelated handler edits

# Validation Strategy
- Prefer targeted handler or service tests first
- If a change touches background jobs, run the narrowest related job validation and review retry/idempotency risk
- If a schema or migration is involved, review rollout order and rollback safety before broad validation

# Agent Routing
- Backend implementation -> `api-builder`
- API review -> `/review-api`
- Background job review -> `/review-background-job`
- General code review -> `code-reviewer`
- Validation runs -> `test-runner`

# Do Not
- Do not bypass existing auth or validation layers
- Do not change public API contracts silently
- Do not assume migration changes are safe without checking rollout and rollback behavior
