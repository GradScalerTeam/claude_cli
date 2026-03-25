---
name: review-component-contract
description: Review UI components for prop design, state ownership, interaction behavior, accessibility, and regression risk. Use when the user asks to review a component or frontend change.
argument-hint: [component-or-folder]
context: fork
allowed-tools: Read, Grep, Glob, Bash(ls/git diff/git log/git show/wc)
user-invocable: true
---

# Review Component Contract

Review the component or frontend area under `$ARGUMENTS`.

If `$ARGUMENTS` is empty, ask the user which component or folder should be reviewed.

Before reviewing:
1. Read `CLAUDE.md` if it exists.
2. Read `checklist.md` in this skill folder.
3. Inspect the target component and its closest callers.

Then:
1. Check prop clarity and responsibility boundaries.
2. Check state ownership and mutation flow.
3. Check interaction behavior and loading/error/empty states.
4. Check accessibility and obvious regression risk.
5. Report findings by severity with file references.

Output format:
- `Findings`
- `A11y Gaps`
- `Regression Risks`
- `Evidence`
