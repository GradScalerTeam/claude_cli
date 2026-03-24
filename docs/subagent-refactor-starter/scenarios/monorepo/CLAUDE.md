# Project Commands
- Dev: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Affected tests: `pnpm turbo run test --filter=<package>`

# Workspace Layout
- `apps/` contains deployable applications
- `packages/` contains shared libraries and internal tooling
- Public package contracts should be treated as stable unless a coordinated change is intended
- Shared types and schemas may affect multiple consumers even when the diff looks local

# Boundary Rules
- Check dependency direction before introducing cross-package imports
- Prefer changes inside the owning package instead of leaking logic across workspace boundaries
- Distinguish internal-only modules from exported public package APIs
- Narrow validation scope to affected apps and packages whenever defensible

# Validation Strategy
- Start from changed packages, then expand to direct consumers
- Full-workspace validation is a fallback, not the default
- Contract or shared-type changes require explicit consumer review
- If ownership is unclear, surface the boundary question instead of guessing

# Agent Routing
- Cross-package boundary review -> `workspace-boundary-reviewer`
- Impact mapping -> `/summarize-cross-package-impact`
- General code review -> `code-reviewer`
- Validation runs -> `test-runner`

# Do Not
- Do not assume a shared package change is isolated without checking consumers
- Do not recommend full monorepo validation when a narrower scope is defensible
- Do not blur internal package implementation details with public workspace contracts
