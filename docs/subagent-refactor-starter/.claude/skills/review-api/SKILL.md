---
name: review-api
description: Review API route handlers for validation, authentication, authorization, error handling, and test coverage. Use when the user wants an API audit or asks to review server routes.
argument-hint: [path-to-route-or-folder]
context: fork
allowed-tools: Read, Grep, Glob, Bash(ls/git diff/git log/git show/wc)
user-invocable: true
---

# Review API

Review API handlers under `$ARGUMENTS`.

If `$ARGUMENTS` is empty, ask the user which API path should be reviewed.

Before reviewing:
1. Read `CLAUDE.md` if it exists.
2. Read `checklist.md` in this skill folder.
3. Inspect the target path and the nearest related tests.

Then:
1. Verify request validation.
2. Verify authentication and authorization.
3. Verify error handling and status code consistency.
4. Verify test coverage or obvious missing tests.
5. Report findings by severity with file references.

Output format:
- `Findings`
- `Missing Tests`
- `Open Questions`
- `Evidence`
