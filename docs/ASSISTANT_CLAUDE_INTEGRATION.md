# Long-Lived Assistant Systems + Claude CLI Integration Guide

This page answers two practical questions:

1. How should any long-lived assistant system hand work into a Claude CLI repo workflow?
2. What should be shared across the boundary, especially for MCP, credentials, and tools?

"Long-lived assistant system" is a general category here, not one specific product.

It can be:

- a Telegram, Discord, or Slack bot
- a desktop assistant app
- a cron + inbox + reminder loop
- a small FastAPI or Node control plane
- a local script that keeps memory, reminders, or task state over time
- OpenClaw

If it owns intake, reminders, routing, follow-up, or result delivery, it belongs to the outer loop described here.

In this tutorial set, you should keep two repositories distinct:

- **this `claude_cli` repo** documents the Claude CLI side, meaning `CLAUDE.md`, repo workflows, skills, subagents, and repo execution patterns
- the default reference implementation for the long-lived assistant side is the separate [`autonomous-agent-stack`](https://github.com/srxly888-creator/autonomous-agent-stack) repository

So "long-lived assistant system" is not meant as an empty abstraction here.
In the context of this documentation set, if you want a concrete, engineering-oriented outer loop, the default reference point is `autonomous-agent-stack`.

Related reading:

- [Personal assistant / knowledge system workflow](../HOW_TO_START_ASSISTANT_SYSTEM.md)
- [Existing repo workflow](../HOW_TO_START_EXISTING_PROJECT.md)
- [OpenClaw Agents vs Claude CLI Agents](OPENCLAW_AND_CLAUDE_AGENTS.md)

---

## Short answer first

### 1. The stable split is: assistant system outside, Claude CLI inside the repo

The clean mental model is not "the outer system directly drives each Claude subagent file."
It is:

- the assistant system receives, triages, schedules, and routes work
- the assistant system starts a Claude CLI session inside the target repo
- the Claude CLI main session then decides how to use `CLAUDE.md`, docs, `.claude/agents/`, and `.claude/skills/`

So the real call chain is closer to:

```text
Assistant system
  -> choose target repo
  -> run claude -p "..."
  -> Claude CLI main session takes over
  -> Claude CLI uses repo-local docs / skills / subagents
```

### 2. This pattern does not require multiple machines

This boundary is a **responsibility boundary** first, not a **machine boundary**.

One laptop is enough:

- the assistant system can receive work and keep state
- Claude CLI can run on that same machine
- the result can go back into that same assistant system

Multiple machines are a deployment choice, not a requirement.

### 3. Share services and credentials, not config files by assumption

The safer default is:

- sharing the same external services, yes
- sharing the same credentials, often yes
- assuming both systems automatically read the same MCP or settings files, no

---

## The most natural integration pattern

The strongest pattern is:

- **long-lived assistant system on the outside**
- **Claude CLI on the inside**

```mermaid
flowchart TD
    A["Inbox / channel / reminder / webhook"] --> B["Assistant system"]
    B --> C["Triage / routing / schedule"]
    C --> D["Task brief / issue doc / spec"]
    D --> E["Run Claude CLI in target repo"]
    E --> F["CLAUDE.md + docs + skills + subagents"]
    F --> G["Code / tests / docs / review"]
    G --> H["Summary back to assistant or user"]
```

If you only have one computer, the same flow still holds. The boxes are just logical layers running on one machine.

---

## How to interpret `autonomous-agent-stack` in this tutorial set

If you want a real outer-loop implementation instead of just a conceptual diagram, treat [`autonomous-agent-stack`](https://github.com/srxly888-creator/autonomous-agent-stack) as a combination of:

- a long-lived control plane
- a unified intake, session, memory, and routing layer
- an auditable task dispatch and execution-status layer
- a bridge that can hand work into Claude CLI or other executors

The important part is that it does not require multi-machine deployment on day one.

It can start as:

- single-machine intake
- single-machine session and memory
- single-machine task brief generation
- single-machine `claude -p` execution
- single-machine result recording and approval

Then expand later into:

- webhook, Telegram, or panel entry points
- queues, workers, and leases
- approval flows
- remote execution nodes

So while this guide uses the generic term "long-lived assistant system," the most recommended concrete landing point in this tutorial ecosystem is `autonomous-agent-stack`.

---

## Keep the boundary this clean

### The assistant system owns

- where work comes from
- when it should run
- reminders, follow-up, queueing, or approval
- deduplication and prioritization
- which repo should receive the task
- where the final result should go back

### Claude CLI owns

- entering one specific repo deeply
- understanding current code, branch state, and project constraints
- using project `CLAUDE.md`
- using repo-local docs, skills, and subagents
- implementation, verification, review, and delivery

One-line version:

- **the assistant system decides whether, when, and where**
- **Claude CLI decides how repo work gets done and verified**

---

## When to use this pattern

Use it when:

- work first appears in an inbox, message channel, reminder, form, or webhook
- you have more than one repo and need routing
- you want long-lived memory, follow-up, queueing, or approval
- you want a clean split between external communication and repo execution

Do not use it when:

- you are just sitting in one repo coding
- the task does not need intake, routing, or result delivery
- there is no long-lived state or automation need

If your real need is just:

- write code
- run tests
- review code
- maintain one repo

then Claude CLI alone is enough. Do not add an outer loop just because you can.

---

## Three common handoff patterns

### Pattern A: pass a concise task summary directly into Claude CLI

This is the lightest option.

```bash
cd /path/to/repo
claude -p "Read CLAUDE.md and the relevant docs first, then fix the login callback timeout. At the end output only: 1. files changed 2. verification run 3. manual follow-up needed"
```

Good when:

- the task is already clear
- you do not need a durable bridge artifact
- you want the fastest path from intake to repo execution

### Pattern B: create a bridge document first, then let Claude CLI execute against it

This is usually more reliable.

For example, the assistant system writes one of these inside the target repo:

- `docs/inbox/task-014.md`
- `docs/issues/issue-014.md`
- `docs/triage/login-timeout.md`

Then it runs:

```bash
cd /path/to/repo
claude -p "Read CLAUDE.md and docs/inbox/task-014.md, implement the work, update related docs, and end with files changed / verification / manual follow-up."
```

Benefits:

- clearer task boundaries
- easier review
- easier reruns
- less reliance on one-off chat context
- better auditability

### Pattern C: add a human gate before Claude CLI starts

If the task involves:

- external sending
- broad file changes
- high-risk commands
- production systems

then the assistant system can stop after:

- detecting the task
- preparing the brief
- requesting approval

and only launch Claude CLI after approval.

This is often the most controllable operating model.

---

## Where Claude CLI subagents fit

This is the part that gets mixed up most often.

The stable model is:

1. the assistant system is not operating directly on `.claude/agents/*.md`
2. the assistant system hands work to the **Claude CLI main session**
3. the Claude CLI main session then decides whether to use subagents

So the real layering is:

```text
Assistant system
  -> Claude CLI main session
     -> Claude CLI subagents
```

That keeps two things healthy:

- repo specialists stay defined inside the repo
- the outer assistant does not become a god scheduler for every internal repo role

---

## What this operating model adds beyond the agent comparison doc

[OpenClaw Agents vs Claude CLI Agents](OPENCLAW_AND_CLAUDE_AGENTS.md) mainly answers:

- do not confuse the terms
- do not flatten the layers
- know which thing is the long-lived brain, which thing is the repo specialist, and which thing is the temporary background worker

That document answers **"what are these things?"**

This guide answers **"once the system is live, why is this outer-loop / inner-loop split operationally better?"**

The main advantages are sixfold:

### 1. Clearer safety boundaries

You do not need the long-lived assistant to directly own repo-internal role definitions plus broad write access.

The safer split is:

- the outer loop owns intake, routing, approval, and result delivery
- repo writes and verification stay inside Claude CLI

That makes high-risk actions easier to see, gate, and audit.

### 2. Better auditability and reruns

Once you introduce task briefs, issue docs, triage notes, or specs, the system stops depending entirely on one-off chat context.

That means you can:

- inspect why a task was routed a certain way
- rerun the same work from the same brief
- hand the same brief to a different executor later
- review the workflow as an engineering artifact, not just a conversation

### 3. A much more natural single-computer starting point

Pure concept comparisons often make people think this only matters once they have multiple machines, worker pools, or a big orchestration layer.

Not true.

One of the biggest practical advantages of this model is:

- one machine is enough
- you do not need remote workers first
- you do not need distributed scheduling first
- you can get the boundary right before you scale deployment

### 4. Repo-internal roles can evolve independently

If the outer loop is tightly coupled to every repo specialist, any refactor in `.claude/agents/` or `.claude/skills/` leaks into orchestration logic.

With this split:

- the outer loop targets the Claude CLI main session
- repo-internal role design stays a repo concern

That lowers coupling substantially.

### 5. Better failure isolation

When something goes wrong, you can reason about the layer that failed:

- intake or triage failed
- the bridge artifact was weak
- Claude CLI failed inside the repo
- verification was skipped or broken
- approval blocked the run

That is much easier to debug than piling everything into one long-lived assistant brain.

### 6. A clean upgrade path from personal assistant to control plane

If you grow the system later, this boundary supports gradual expansion:

1. single-machine assistant plus Claude CLI
2. assistant plus approvals plus panel
3. assistant plus queue and workers
4. assistant plus multiple execution nodes

You do not need to throw away the operating model to scale it.

That is the key value beyond a document that only compares terminology and layers.

---

## Best practices for building this layer with `autonomous-agent-stack`

The stable order is not "connect Telegram, workers, cron, approvals, and remote nodes all at once."
The stable order is:

### Phase 1: prove the smallest single-machine loop first

First prove these five things:

1. intake works
2. session and memory persistence work
3. routing can decide whether a task belongs in a repo
4. task brief generation works
5. one `claude -p` run can execute in a repo and return a result

If that loop is not stable, multi-machine deployment will only amplify confusion.

### Phase 2: make bridge artifacts a rule, not an exception

Do not let the outer loop and Claude CLI depend forever on one-line prompt handoffs.

Pick at least one durable bridge format:

- `docs/inbox/*.md`
- `docs/issues/*.md`
- `docs/triage/*.md`

And standardize the expected result fields, such as:

- files changed
- verification
- manual follow-up
- evidence

### Phase 3: gate sensitive actions early

These should default to explicit human confirmation:

- external sending
- deletes or broad writes
- production operations
- expensive jobs

One of the outer loop's biggest jobs is not reckless automation. It is collecting risk into one controllable layer.

### Phase 4: layer memory instead of dumping everything into the main session

At minimum, separate:

- raw intake
- task brief and routing notes
- long-term memory and stable decisions

That makes auditing, reruns, and context compression much easier.

### Phase 5: add scheduling and workers last

Only after the single-machine loop is stable should you add:

- cron or heartbeat
- queues or leases
- standby workers
- remote execution nodes

Do not reverse that order.

### One-line best practice

For an outer loop like `autonomous-agent-stack`, the best starting sequence is:

- **get the responsibility boundary right first**
- **make bridge artifacts real second**
- **gate approvals and memory third**
- **expand the execution plane last**

---

## What "sharing MCP" really means

It helps to think in three layers.

### Layer 1: sharing the same external services

This is usually fine.

Examples:

- maps
- email
- GitHub API
- search
- internal retrieval services

Those services can be connected to multiple systems.

### Layer 2: sharing the same credentials

Also usually fine, but it is cleaner to keep credentials in:

- environment variables
- a secret manager
- the assistant system's secure config surface
- Claude Code's supported secure config surface

Instead of scattering secrets across repo files.

### Layer 3: sharing the exact same config file

This is where people over-assume.

For Claude Code, repo-scoped MCP is typically defined in `.mcp.json`, while project behavior and local constraints usually live under `.claude/` and user-wide `~/.claude/` scopes.

Your assistant system will usually have its own:

- config files
- runtime injection layer
- plugin system
- secret entry points

So the safer conclusion is:

- **shared services, yes**
- **shared credentials, often yes**
- **explicit bridging of selected config, possible**
- **automatic universal file sharing, do not assume it**

---

## Recommended MCP strategy

### Capabilities you want everywhere

Examples:

- search
- maps
- email
- general documentation lookup

If these are mainly for Claude CLI across many repos, prefer Claude Code user scope.

### Capabilities clearly tied to one repository

Examples:

- a repo-specific database
- a repo-specific internal API
- a project-local tool that only makes sense in that repo

Prefer the repo's `.mcp.json`.

### Capabilities the assistant system needs to own long term

Examples:

- inbox automation
- cross-channel message handling
- routing and scheduling
- reminders and follow-up

Prefer the assistant system's own config side.

One-line summary:

- **repo-specific capabilities live close to the repo**
- **assistant-specific capabilities live close to the assistant system**
- **the thing you share is usually the service and the credential, not the file itself**

---

## Single-computer setups are still first-class

If you only have one machine, the smallest workable version is usually:

1. the assistant system receives the task
2. the assistant system decides whether repo execution is needed
3. the assistant system writes a task brief, or builds one prompt
4. the assistant system runs `claude -p`
5. Claude CLI completes implementation and verification in the repo
6. the assistant system records the result, sends a notification, or leaves a follow-up

So "assistant system + Claude CLI" does not imply:

- a Mac plus a Linux box
- a remote worker pool
- a distributed cluster
- a multi-node control plane

Those are scaling choices, not the minimum pattern.

---

## Common failure modes

### Failure 1: the assistant system tries to do deep repo implementation itself

That mixes long-lived memory, intake context, and repo-local implementation context into one messy layer.

### Failure 2: Claude CLI subagents are treated like long-lived schedulers

Claude CLI subagents are great for focused repo work, not for always-on routing or duty cycles.

### Failure 3: one MCP file is expected to feed both systems automatically

The cleaner design is separate config surfaces with explicit bridging where needed.

### Failure 4: there is no bridge artifact

Without a task brief, issue doc, triage note, or spec, the system becomes overly dependent on one-off chat context and gets much harder to rerun or review.

### Failure 5: the split starts with machines instead of responsibilities

The right order is:

- define responsibility boundaries first
- decide deployment layout second

---

## Rule of thumb

If you remember one sentence, make it this:

- **the long-lived assistant system owns where work comes from, when it runs, and where the result goes back**
- **Claude CLI owns what happens after entering the repo, including how the work gets done and verified**

That is the stable integration boundary.
