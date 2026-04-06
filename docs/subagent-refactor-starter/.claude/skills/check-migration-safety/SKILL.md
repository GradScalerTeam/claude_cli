---
name: check-migration-safety
description: Review schema or database migrations for rollout risk, backward compatibility, locking risk, and rollback gaps. Use when migrations or schema changes are introduced.
argument-hint: [path-to-migration-or-schema-change]
context: fork
allowed-tools: Read, Grep, Glob, Bash(ls/git diff/git log/git show/wc)
user-invocable: true
---

# Check Migration Safety

Review migration or schema changes under `$ARGUMENTS`.

If `$ARGUMENTS` is empty, ask the user which migration or schema diff should be checked.

Before reviewing:
1. Read `CLAUDE.md` if it exists.
2. Read `checklist.md` in this skill folder.
3. Inspect the migration files, schema definitions, and affected application code.

Then:
1. Check backward compatibility during rollout.
2. Check whether app code and schema changes can coexist safely.
3. Check rollback feasibility.
4. Check for data loss, lock time, and deploy-order risks.
5. Report findings in severity order with concrete evidence.

Output format:
- `Findings`
- `Rollout Risks`
- `Rollback Gaps`
- `Evidence`
