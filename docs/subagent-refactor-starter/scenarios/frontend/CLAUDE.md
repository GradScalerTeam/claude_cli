# Project Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

# Frontend Architecture
- `src/app` or `app/` contains route entry points
- `src/components` contains reusable UI components
- `src/features` contains feature-specific state and UI logic
- Shared design tokens and primitives should be reused before adding new patterns

# State And UI Rules
- Prefer existing state ownership patterns before introducing new shared state
- Keep loading, error, and empty states explicit
- Preserve keyboard accessibility and focus behavior
- Do not introduce a new component abstraction when an existing primitive already fits

# Validation Strategy
- For small UI changes, prefer the narrowest relevant test command
- For component-heavy changes, validate the changed component plus its nearest callers
- If no targeted test exists, run the smallest reasonable project-level validation and say so explicitly

# Agent Routing
- UI implementation -> `frontend-builder`
- Component contract review -> `/review-component-contract`
- General code review -> `code-reviewer`
- Validation runs -> `test-runner`

# Do Not
- Do not rewrite unrelated screens while touching a local UI issue
- Do not silently change public component APIs without calling out migration impact
- Do not weaken accessibility or keyboard behavior for visual convenience
