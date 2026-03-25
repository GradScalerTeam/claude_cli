# OpenClaw Inbox Triage Execution Checklist

This is the short operating version of the workflow.

Related reading:

- [OpenClaw Inbox Triage + Claude CLI Repo Executor](OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md)

---

## Execution order

1. Intake
2. Deduplicate
3. Classify
4. Select repo
5. Write bridge doc
6. Launch Claude CLI
7. Verify result
8. Write back to the source channel

---

## What each step does

### 1. Intake

- Pull the task from issue, inbox, webhook, or a message stream
- Decide whether it deserves repo workflow treatment

### 2. Deduplicate

- Check whether it was already handled
- Check whether it is just a repeated reminder

### 3. Classify

- Decide whether the task is development, documentation, review, or just a reminder
- If it is only a reminder, keep it in OpenClaw

### 4. Select repo

- Assign the task to one best-fit repository
- If the repo is still unclear, stay in OpenClaw

### 5. Write bridge doc

- State the problem
- State the target repo
- State the expected outcome
- State the verification criteria

### 6. Launch Claude CLI

- Run Claude CLI inside the target repo
- Let it read repo docs and constraints

### 7. Verify result

- Check whether the change was made
- Check whether validation ran
- Check whether anything still needs manual follow-up

### 8. Write back

- Send the result back to the issue, inbox, or thread
- Make the next review easy to reproduce

---

## Minimal gate

Use this checklist when both are true:

- the task is clearly assigned to one repo
- the task requires changing or verifying repo content
