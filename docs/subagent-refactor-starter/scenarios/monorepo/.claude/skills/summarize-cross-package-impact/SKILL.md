---
name: summarize-cross-package-impact
description: Summarize which packages, apps, contracts, and validation commands are affected by a monorepo change. Use when a diff crosses shared workspace boundaries.
argument-hint: [path-or-diff-scope]
context: fork
allowed-tools: Read, Grep, Glob, Bash(ls/git diff/git log/git show/wc/find)
user-invocable: true
---

# Summarize Cross-Package Impact

Analyze the change scope under `$ARGUMENTS`.

If `$ARGUMENTS` is empty, inspect current changes in the repository.

Before summarizing:
1. Read `CLAUDE.md` if it exists.
2. Read `checklist.md` in this skill folder.
3. Identify changed packages, their dependents, and any affected app entry points.

Then:
1. List affected packages and consumers.
2. Identify contract or shared-type changes.
3. Suggest the narrowest validation scope that still covers the risk.
4. Call out any unclear ownership or boundary violations.
5. Report with concrete evidence.

Output format:
- `Affected Packages`
- `Contract Changes`
- `Suggested Validation`
- `Boundary Questions`
- `Evidence`
