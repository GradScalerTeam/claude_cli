# Global Doc Master

A global Claude Code subagent for creating and maintaining the durable project documents that make every later session faster, safer, and more consistent.

---

## What It Is

`global-doc-master` is the documentation-first subagent in this repository.

Use it when you want Claude to create structured docs instead of leaving important context trapped inside a chat thread.

It is best at turning:

- vague feature ideas
- incomplete business context
- undocumented implementation flows
- bug reports
- deployment knowledge
- debugging habits

into durable markdown under `docs/`.

This agent is most valuable in modern Claude Code workflows because `CLAUDE.md`, flow docs, issue docs, and planning docs give Claude stable memory to work from in future sessions.

---

## Where It Fits In The Workflow

Recommended sequence:

```text
1. Start in the repo                -> claude
2. Create or update project memory  -> /init + CLAUDE.md
3. Create structured docs           -> @global-doc-master
4. Review docs                      -> /global-review-doc
5. Fix docs until READY             -> @global-doc-fixer
6. Build                            -> Claude + project skills/subagents
7. Review code                      -> /global-review-code
8. Update docs after changes        -> @global-doc-master
```

The key idea: this agent should usually run **before** implementation when you are defining scope, and **after** implementation when you want durable documentation of what now exists.

---

## When To Use It

Use `global-doc-master` when you need any of these:

### 1. Project overview

Create or refresh `docs/overview.md` so Claude understands the product, actors, rules, and constraints.

### 2. Planning docs

Create `docs/planning/*.md` before building a feature or system.

### 3. Feature flow docs

Create `docs/feature_flow/*.md` after a feature exists and you want the real end-to-end implementation mapped.

### 4. Deployment docs

Capture infrastructure, release steps, environment assumptions, and CI/CD behavior under `docs/deployment/`.

### 5. Issue docs

When a bug or risk is discovered, create a structured issue record under `docs/issues/` before the fix gets lost in chat history.

### 6. Resolved docs

After a fix ships, move the issue to `docs/resolved/` with what changed and how it was verified.

### 7. Debug docs

Capture how to investigate an area of the system under `docs/debug/`.

---

## When Not To Use It

Do **not** use this agent for:

- tiny one-off notes that do not need to persist
- direct code implementation
- code review
- bug-hunt execution inside source files

For those cases, use normal Claude work, project skills, or `global-review-code`.

---

## What It Produces

Typical output structure:

```text
docs/
├── overview.md
├── planning/
├── feature_flow/
├── deployment/
├── issues/
├── resolved/
└── debug/
```

### Recommended meanings

| Path | Best use |
|---|---|
| `docs/overview.md` | product context, actors, major rules, boundaries |
| `docs/planning/` | implementation-ready specs before coding |
| `docs/feature_flow/` | how built features actually work end-to-end |
| `docs/deployment/` | environments, build/release/deploy runbooks |
| `docs/issues/` | open bugs, incidents, and technical problems |
| `docs/resolved/` | closed issues and how they were fixed |
| `docs/debug/` | investigation playbooks and troubleshooting runbooks |

---

## Good Prompts

### New project overview

```text
@global-doc-master I'm starting a new project. Create an overview doc that captures
what the product does, who the users are, the main user journeys, business rules,
and major constraints.
```

### New feature plan

```text
@global-doc-master Create a planning doc for adding Stripe subscriptions to this
project. Include scope, data model changes, API changes, webhook handling, testing,
and rollout risks.
```

### Existing flow documentation

```text
@global-doc-master Document the authentication flow from login to token refresh,
including middleware, storage, and failure paths.
```

### Issue doc

```text
@global-doc-master There's a bug where users are logged out unexpectedly after token
refresh. Create an issue doc with suspected root cause and affected files.
```

### Resolved doc

```text
@global-doc-master The token refresh issue is resolved. Move the issue to resolved
and document what changed and how we verified it.
```

---

## How To Get Better Results

`global-doc-master` works best when the project already has:

- a decent `CLAUDE.md`
- real build/test/lint commands
- stable folder names
- existing docs the agent can read
- enough business context from you when the codebase cannot answer a question

High-value guidance to include in prompts:

- whether this is greenfield or existing code
- target audience of the doc
- whether you want breadth or depth
- whether to prioritize happy path only or include failure modes
- specific constraints or non-goals

---

## How It Works With The Other Components

### With `global-review-doc`

The doc master creates the document.
The review skill checks whether the document is complete, correct, and safe.

### With `global-doc-fixer`

The fixer agent closes the loop by re-running review and editing the doc until it becomes implementation-ready.

### With `doc-scanner`

Once docs exist, the doc-scanner hook makes future Claude sessions aware that those docs are present.

### With `global-review-code`

After implementation, code review validates what was built, and doc master can then update the flow or resolved docs.

---

## Installation Scope

There are two reasonable places to install this agent:

| Scope | Location | When to choose it |
|---|---|---|
| User | `~/.claude/agents/global-doc-master.md` | you want it available in every repo |
| Project | `.claude/agents/global-doc-master.md` | you want a repo-specific variant committed to git |

For most people, this particular agent works best as a **user-level global subagent**.

---

## Install It

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and install the
Global Doc Master subagent.

1. Read `agents/global-doc-master/global-doc-master.md`.
2. Create `~/.claude/agents/global-doc-master.md` with the exact same content.
3. Create the `~/.claude/agents/` directory if it does not exist.
4. After installing, read `agents/global-doc-master/README.md` and summarize what the
   subagent does, when to use it, and how it fits with the rest of the workflow.
```

After installation, restart Claude Code so the new subagent is loaded into fresh sessions.

---

## Check For Updates

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and compare the
latest `agents/global-doc-master/global-doc-master.md` with my local
`~/.claude/agents/global-doc-master.md`.

If they differ:
1. show me the important changes,
2. update my local file,
3. explain what changed in behavior or workflow.
```

---

## Final Advice

If you only install one component from this repository first, install this one.

Durable documentation is the foundation that makes every later Claude Code session more accurate.
