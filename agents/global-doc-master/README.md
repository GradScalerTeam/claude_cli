# Global Doc Master Agent

The **Global Doc Master** is a documentation agent for Claude Code CLI. It is the single authority for creating, updating, and organizing all technical documentation in any project. You never write docs manually — you tell this agent what you need, and it investigates the codebase, asks clarifying questions, and produces structured markdown documents under the `docs/` folder.

---

## Why Use It

- **Consistency** — Every doc follows the same structure. No more random notes scattered across the project.
- **Accuracy** — The agent reads the actual code before writing. Every file reference, every function name, every API endpoint is real.
- **Context7 Verified** — When docs reference external libraries or frameworks, the agent verifies the APIs against current documentation. No outdated examples.
- **Searchable History** — Issues and their resolutions build up over time, creating a knowledge base for your project.
- **AI-Friendly** — Debug docs and flow docs are specifically designed so AI agents can use them to understand and work on your codebase autonomously.

---

## When to Use It

**Before you write any code.** The very first step in building anything — a new feature, a full project, even a bug fix — is creating a document with this agent.

The workflow is:

1. You describe what you want to build (can be vague — that's fine)
2. The agent scans your codebase, asks clarifying questions, and writes the document
3. You run `@global-doc-fixer` on the document — it reviews, fixes, and repeats until the doc is solid
4. Only then do you start building — either manually or by handing the doc to a development agent

**You should also use it when:**
- A feature is built and you want to document how it works end-to-end (feature flow docs)
- You need deployment documentation for your infrastructure, CI/CD, and environment setup
- A bug is discovered and you want a structured investigation before jumping into code
- An issue is resolved and you want to record the fix for future reference
- You want to capture your debugging mental model so other developers (or AI agents) can follow your process

---

## How to Use It

There are two ways to invoke the agent:

1. **Using `@` mention** — type `@global-doc-master` followed by your request
2. **Natural language** — say "use global doc master agent" and describe what you need

The agent handles the rest — it scans your codebase, asks you questions if anything is unclear, and writes the document in the correct folder with the correct template.

---

## What It Creates

All documents live under `docs/` in your project root:

```
docs/
├── planning/        # Feature specs and project plans — BEFORE coding starts
├── feature_flow/    # End-to-end flow docs — AFTER a feature is built
├── deployment/      # Deployment guides, CI/CD, server infrastructure
├── issues/          # Active bugs and problems under investigation
├── resolved/        # Closed issues — migrated from issues/ with the solution
└── debug/           # Developer debugging guides — how to investigate and test things
```

---

## Document Types

### Planning Docs (`docs/planning/`)

**When to use:** Before you write any code. Whether it's a new feature or an entire project, start here.

**How it works:**
1. Tell the agent what you want to build (can be vague — that's fine)
2. The agent scans your codebase to understand the existing tech stack and patterns
3. It asks you 2-4 rounds of structured questions to clarify scope, technical approach, integrations, and delivery
4. It writes a complete planning doc with requirements, technical design, implementation phases, testing strategy, and risks

**Example:**
```
@global-doc-master I need a planning doc for adding a payment system with Stripe
```
The agent will ask: What payment types? Subscription or one-time? Which user roles can pay? Does it need invoicing? — then produce the full spec.

---

### Feature Flow Docs (`docs/feature_flow/`)

**When to use:** After a feature is built and you want to document how it works end-to-end.

**How it works:**
1. Tell the agent which feature to document (e.g., "authentication flow", "order processing")
2. The agent does a quick codebase scan, then asks you scoping questions — which specific flow path, which layers of the stack to focus on (frontend, backend, database, full stack), what depth (overview vs deep dive), and whether to cover just the happy path or error cases too
3. Once scope is confirmed, the agent traces the actual code — only the layers and paths you asked for
4. It produces a flow document with architecture diagrams, file references with line numbers, and the complete path from user action to database

**Example:**
```
@global-doc-master document the authentication flow
```
The agent will ask: Which auth flow? (login, registration, token refresh, OAuth, all of them?) Which layers? (frontend only, backend only, full stack?) How detailed? — then traces only what you asked for with real `file:line` references.

---

### Deployment Docs (`docs/deployment/`)

**When to use:** When you need to document how the project is deployed, what the CI/CD pipeline does, server configurations, environment variables, and infrastructure details.

**How it works:**
1. Tell the agent what deployment aspect to document
2. It reads your Dockerfiles, CI/CD configs, environment files, Makefiles, and infrastructure code
3. It produces a deployment guide with setup steps, environment variables, build commands, service architecture, and troubleshooting tips

**Example:**
```
@global-doc-master create deployment docs for our backend — Docker setup, CI/CD pipeline, and production config
```

---

### Issue Docs (`docs/issues/`)

**When to use:** When you or a client discovers a bug or problem. Instead of just fixing it, document it first so the investigation is structured and traceable.

**How it works:**
1. Describe the issue to the agent — what's happening, what was expected, steps to reproduce
2. The agent analyzes the relevant code, traces the problem, and identifies likely root causes
3. It creates an issue document with the problem description, affected components (with file references), investigation notes, root cause analysis, and a recommended fix

**Example:**
```
@global-doc-master there's a bug where users get logged out after exactly 15 minutes even though the token should last 24 hours
```
The agent finds the token expiry logic, checks the refresh mechanism, identifies the root cause, and documents everything with a fix recommendation.

---

### Resolved Docs (`docs/resolved/`)

**When to use:** After an issue is fixed and confirmed working. The issue doc gets migrated here so you have a permanent history.

**How it works:**
1. Tell the agent the issue is resolved
2. It moves the doc from `docs/issues/` to `docs/resolved/`
3. It adds the resolution section — what was changed, which files were modified, how it was verified, and how to prevent it in the future

This gives you a searchable history of every bug your project has faced and how it was solved. Invaluable when similar issues pop up later.

**Example:**
```
@global-doc-master the token expiry issue is resolved — we fixed the refresh logic in authMiddleware.js
```

---

### Debug Docs (`docs/debug/`)

**When to use:** When you want to capture how a developer debugs a specific part of the system. This is your mental model — where you look at logs, which database tables you check, what error patterns mean what, and the step-by-step process you follow to investigate problems or test new features.

**How it works:**
1. Tell the agent which feature or module you want a debug guide for
2. The agent interviews you — asks where you check first, what logs you look at, which DB collections matter, what common failure patterns exist
3. It cross-references your answers with the actual codebase to add file paths, line numbers, and technical details
4. It produces a debug runbook that any developer (or AI agent) can follow to investigate issues independently

**Example:**
```
@global-doc-master create a debug guide for the payment processing module — I want Claude to know how I debug payment failures
```
The agent asks: "What's the first thing you check when a payment fails?", "Which logs do you look at?", "What DB tables do you query?" — then builds the complete debug guide.

---

## Setup

### Fresh Install

To set up the Global Doc Master as a global agent in your Claude Code CLI, paste this prompt directly into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and read the file at agents/global-doc-master/global-doc-master.md — copy its entire content and create a new agent file at ~/.claude/agents/global-doc-master.md with the exact same content. Create the ~/.claude/agents/ directory if it doesn't exist. After installing, read the README.md in the same folder (agents/global-doc-master/README.md) and give me a summary of what this agent does and how to use it.
```

That's it. The agent is now available in every project you work on with Claude Code CLI.

### Check for Updates

Already have the Global Doc Master set up and want to check if there's a newer version? Paste this into your Claude CLI:

```
Fetch the latest version of global-doc-master.md from the GitHub repo https://github.com/GradScalerTeam/claude_cli at agents/global-doc-master/global-doc-master.md — compare it with my local version at ~/.claude/agents/global-doc-master.md. If there are any differences, show me what changed, update my local file to match the latest version, and give me a summary of what was updated and why it matters.
```
