# OpenClaw Inbox Triage + Claude CLI Repo Executor

This page describes one practical workflow:

- OpenClaw receives and triages work first
- Claude CLI executes the work inside the target repo

If your question is how a long-lived assistant should hand work into a repo workflow, this is the cleanest pattern.

Related reading:

- [OpenClaw + Claude CLI Integration Guide](OPENCLAW_CLAUDE_INTEGRATION.md)
- [OpenClaw + Claude CLI Workflow Scenarios](OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md)
- [OpenClaw Inbox Triage Execution Checklist](OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST.md)

---

## When to use it

Use this pattern for:

- issue-triggered work
- inbox-triggered work
- webhook-triggered work
- tasks that clearly belong to one repository

Do not use it for:

- pure local development
- short in-repo work that does not need routing
- tasks that are still too fuzzy to assign to a repo

---

## Recommended division of labor

### OpenClaw owns

- intake
- deduplication
- classification
- repo selection
- bridge artifact creation
- returning the result to inbox, channel, or memory

### Claude CLI owns

- reading repo context
- using `CLAUDE.md` and project docs
- calling repo-local skills and subagents
- editing files
- testing and validation
- returning a concise summary

---

## Standard flow

1. OpenClaw receives the message.
2. OpenClaw decides whether the task should enter a repo workflow.
3. OpenClaw chooses the target repository.
4. OpenClaw writes a bridge artifact such as an issue brief or triage note.
5. OpenClaw launches Claude CLI in that repository.
6. Claude CLI reads the repo's local context and constraints.
7. Claude CLI makes the change, validates it, and summarizes the result.
8. OpenClaw sends the result back to the original channel.

---

## What to put in the bridge artifact

Keep it short, but make it explicit:

- what the problem is
- which repository it belongs to
- the expected outcome
- relevant files or areas
- verification criteria
- any manual follow-up

A minimal template:

```md
# Task Brief

## Problem
...

## Repo
...

## Expected Outcome
...

## Relevant Files
...

## Verification
...

## Manual Follow-up
...
```

---

## When to hand off

If the work is only:

- a quick judgment
- a reminder
- a classification step

then OpenClaw can usually finish it alone.

If the work requires:

- opening the repo
- comparing against code
- changing files
- running verification

then Claude CLI should take over.

---

## Fast test

Ask yourself two questions:

1. Is the task clearly assigned to one repo?
2. Does it require changing or validating repo content?

If both answers are yes, use this workflow.
