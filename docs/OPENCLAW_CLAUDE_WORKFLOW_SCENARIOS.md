# OpenClaw + Claude CLI Workflow Scenarios

This page splits the integration story into concrete usage patterns.

If you already read the general integration guide, this page answers the next question:

- Which workflow should I use for which kind of task?

Related reading:

- [Long-Lived Assistant Systems + Claude CLI Integration Guide](ASSISTANT_CLAUDE_INTEGRATION.md)
- [OpenClaw Inbox Triage + Claude CLI Repo Executor](OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md)

---

## Scenario 1: OpenClaw as the outer loop, Claude CLI as the repo executor

If you only want this one pattern, read:

- [OpenClaw Inbox Triage + Claude CLI Repo Executor](OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md)

Use this when:

- messages arrive from inboxes, webhooks, or reminders
- the task belongs to one repository
- the work needs repo-local context and verification

Flow:

1. OpenClaw receives the request.
2. OpenClaw triages and chooses the repo.
3. OpenClaw writes a short task brief or issue doc.
4. OpenClaw launches `claude -p` in the target repo.
5. Claude CLI reads `CLAUDE.md`, docs, skills, and subagents.
6. Claude CLI returns a concise result summary.
7. OpenClaw sends the outcome back to the original channel.

Good for:

- issue processing
- code review
- doc maintenance
- repo-scoped fixes

---

## Scenario 2: Manual Claude CLI use with OpenClaw only for routing and reminders

Use this when:

- you want a light integration
- you are already in the repo yourself
- OpenClaw should not own the execution path

Flow:

1. OpenClaw collects or reminds.
2. You open the target repository manually.
3. You run Claude CLI yourself.
4. Claude CLI handles implementation and validation.

Good for:

- local development
- focused feature work
- one-off investigations

---

## Scenario 3: Claude CLI only

Use this when the task is just a repo task.

No extra outer loop is needed if you only want:

- code changes
- tests
- docs
- review

Good for:

- small repo maintenance
- isolated development work
- quick follow-up fixes

---

## Scenario 4: OpenClaw plus bridge artifacts

Use this when the task is too fuzzy to hand over directly.

Instead of passing a raw prompt, create a bridge artifact:

- issue summary
- triage report
- spec
- next-actions note

Then let Claude CLI consume that artifact.

Good for:

- larger work items
- multi-step changes
- work that needs to be reviewed later

---

## Practical rule

If the task is about:

- where work comes from
- when it should run
- where the result should go

that is OpenClaw territory.

If the task is about:

- what to change in the repo
- how to validate it
- how to use repo-local specialists

that is Claude CLI territory.
