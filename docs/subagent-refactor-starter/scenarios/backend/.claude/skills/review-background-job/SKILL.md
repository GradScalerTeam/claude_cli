---
name: review-background-job
description: Review background jobs, schedulers, or queue workers for idempotency, retry safety, failure handling, and duplicate execution risk. Use when the user asks to review async backend job logic.
argument-hint: [job-or-worker-path]
context: fork
allowed-tools: Read, Grep, Glob, Bash(ls/git diff/git log/git show/wc)
user-invocable: true
---

# Review Background Job

Review the job, worker, or scheduler under `$ARGUMENTS`.

If `$ARGUMENTS` is empty, ask the user which background job or worker should be reviewed.

Before reviewing:
1. Read `CLAUDE.md` if it exists.
2. Read `checklist.md` in this skill folder.
3. Inspect the job code and the services it calls.

Then:
1. Check retry safety and idempotency.
2. Check duplicate execution and concurrency risk.
3. Check failure handling, alerting, and partial-write behavior.
4. Check whether the job is safe during deploys or restarts.
5. Report findings by severity with file references.

Output format:
- `Findings`
- `Retry Risks`
- `Data Consistency Risks`
- `Evidence`
