# Claude Code — Modern Setup Guide

A practical setup guide for developers who want a clean, current Claude Code workflow instead of a pile of stale tips.

---

## What This Guide Covers

By the end of this guide you will have:

1. Installed Claude Code
2. Logged in and verified the installation
3. Created a useful `CLAUDE.md`
4. Learned the commands that matter most for daily work
5. Understood where settings, memories, skills, subagents, hooks, and MCP servers live

---

## Before You Install

According to Anthropic's Claude Code docs, the current baseline is:

- Node.js 18+
- macOS 10.15+, Ubuntu 20.04+/Debian 10+, or Windows 10+
- Bash, Zsh, or Fish recommended
- Network access for authentication and model calls

If your team uses Bedrock, Vertex, or Microsoft Foundry, Claude Code can be configured for those too, but the simplest path for most individuals is still a paid Claude.ai account or Anthropic Console.

---

## Installation Options

Anthropic now recommends the native installer first. npm installation still works, but it is better treated as a compatibility path for people who already manage developer CLIs through Node.

### Option 1: Recommended native installer

Anthropic documents a native installer flow for macOS, Linux, and Windows via WSL/PowerShell.

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

This is the better default if you want a cleaner install path, fewer npm permission problems, and easier updates.

### Option 2: Compatibility npm install

```bash
npm install -g @anthropic-ai/claude-code
```

Use this if you already work like this:

- you manage Node versions with tools like `nvm`, `fnm`, `Volta`, or `asdf`
- you already install CLIs globally with npm or pnpm, such as `typescript`, `pnpm`, `prettier`, or `tsx`
- you are comfortable with `PATH`, global package locations, upgrades, and uninstall flows
- you want Claude Code to behave like one more Node-based CLI in that toolkit

A simple gut check:

- if global developer CLIs through Node already feel normal to you, npm install will feel normal too
- if phrases like "global install", "PATH", or "npm permissions" already sound annoying, use the native installer instead

Important:

- Do **not** use `sudo npm install -g`
- If global npm permissions are messy on your machine, expect friction later
- Run `claude doctor` after install

### Verify installation

```bash
claude --version
claude doctor
```

If `claude` is not found or `doctor` reports a broken install, check the troubleshooting section at the end of this guide.

---

## Log In And Start Your First Session

From a project directory:

```bash
cd your-project
claude
```

On first launch, Claude Code will ask you to authenticate.

According to the current docs, Claude Code requires a `Pro`, `Max`, `Teams`, `Enterprise`, or Anthropic Console account. The free Claude.ai plan does not include Claude Code access.

Typical account paths:

- **Paid Claude.ai account**: easiest for individual use
- **Anthropic Console**: usage billed by API consumption
- **AWS Bedrock / Google Vertex AI / Microsoft Foundry**: common in enterprise environments

Once login succeeds, you are in the interactive REPL.

---

## If Your Team Uses GLM Or A Shared Model Gateway

The easiest mistake here is mixing up the Claude Code client with the model or gateway behind it.

The more stable pattern is usually not "turn Claude Code directly into a GLM client." It is:

1. install and run Claude Code normally
2. put an LLM gateway in front of your model providers
3. let that gateway handle auth, budget controls, audit, and routing
4. connect Claude Code to the gateway through an Anthropic-compatible endpoint

Think of it like this:

```text
Claude Code -> your LLM gateway -> Claude / GLM / other models
```

A minimal shape often looks like:

```bash
export ANTHROPIC_BASE_URL="https://your-llm-gateway.example.com"
export ANTHROPIC_AUTH_TOKEN="your-token"
claude
```

Why teams do this:

- centralized auth, budget, and audit
- the ability to route different projects to different backend models
- less provider-specific setup on each developer machine

Important caveats:

- the official direct-provider paths documented for Claude Code are Anthropic, Bedrock, Vertex AI, and Microsoft Foundry; GLM is not listed as a direct provider
- if your gateway is only OpenAI-compatible rather than Anthropic-compatible, do not assume Claude Code will work correctly
- if your actual goal is "mostly run GLM," validate tool use, long-context behavior, and agentic workflows in a small pilot first

The practical summary is that GLM is usually safer as a model behind your team's gateway than as an assumed drop-in replacement for the Claude experience.

---

## First 10 Minutes That Actually Matter

Most tutorials jump straight into fancy automations. Don't do that yet.

Do this first:

1. Start Claude in a real project
2. Run `/init`
3. Edit the generated `CLAUDE.md`
4. Ask Claude for a codebase overview
5. Run one safe task

Suggested first prompts:

```text
Give me an overview of this repository.
```

```text
What are the main build, test, and lint commands here?
```

```text
Find the riskiest directories to edit in this project.
```

`/init` is important because it creates durable memory instead of forcing Claude to rediscover the same conventions every session.

---

## What To Put In CLAUDE.md

A good `CLAUDE.md` should reduce repeated explanation, not become a dumping ground.

Add:

- Build, test, lint, format, and dev commands
- Architecture notes
- Naming conventions
- Paths to critical docs
- Risky or protected directories
- Deployment caveats
- Test data or sandbox environment notes

Good example:

```md
# Project Commands
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

# Architecture
- `apps/web` contains the customer-facing Next.js app
- `packages/api` contains shared API clients and schemas

# Rules
- Do not edit `infra/production/` without explicit confirmation
- Prefer Zod schemas for external input validation
```

Anthropic's memory docs also support `@path/to/file` imports inside `CLAUDE.md`, which is often cleaner than duplicating long docs.

### Why These Lines Matter

Those lines are not just for humans reading the file. They change Claude's default behavior.

| What you write | Why it matters | What Claude is more likely to do |
|---|---|---|
| `Build: pnpm build` | Tells Claude the real build command instead of letting it guess `npm run build` | When you say "verify the project still builds," it is more likely to run the correct command |
| `Test: pnpm test` | Tells Claude which regression command to use after a change | After a bug fix or feature, it is more likely to run the right test baseline |
| `Lint: pnpm lint` | Tells Claude the team's static-check entry point | It is more likely to treat lint as part of the normal validation path |
| `` `apps/web` contains the customer-facing app `` | Tells Claude where frontend work primarily lives | When you ask for a UI change, it is more likely to start in the right place |
| `` `packages/api` contains shared API clients and schemas `` | Tells Claude where the shared interface boundary lives | When you change an API, it is more likely to consider cross-package impact |
| `Do not edit infra/production/ without confirmation` | Defines a risk boundary | Claude is more likely to stop and ask before touching sensitive paths |

You can think of `CLAUDE.md` as the file that helps Claude guess less and follow the real project rules more often.

### If You Are New, Translate These Terms Like This

- `Build`: turn source code into something ready to run, deploy, or release. A simple mental model is "the official packaging step."
- `Test`: automatically check whether your change broke existing behavior. A simple mental model is "automated acceptance checking."
- `Lint`: inspect the code without running it to catch obvious mistakes, style problems, or risky patterns. A simple mental model is "a code health check."
- `apps/web`: usually the directory for the user-facing frontend.
- `packages/api`: usually the directory for shared API-related code used across parts of the app.
- `API client`: code that calls backend endpoints, such as fetching a profile or submitting an order.
- `schema`: a description of what data should look like, such as required fields and expected types.
- `infra/production`: production infrastructure config. A simple mental model is "live deployment and operations settings," where mistakes can affect the real system.

If that still feels abstract, think of `CLAUDE.md` as a short onboarding note for a new teammate:

- which commands the project really uses
- which directories matter for which kind of work
- which areas are dangerous
- how to check that a change did not break anything

Claude reads that note before it starts making decisions.

### Translate The Table Into Plain Language

#### `Build: pnpm build`

Plain language:

"When this project does its real build, the command is `pnpm build`."

Why that matters:

- many repos have `npm`, `pnpm`, or `yarn` somewhere
- if Claude does not know the real tool, it may guess wrong
- once the command is wrong, validation and debugging drift off course

Think of it as telling Claude: "Use this door, do not guess another route."

#### `Test: pnpm test`

Plain language:

"After you change code, use `pnpm test` to check that old behavior still works."

Why that matters:

- beginners often assume "the page looks fine" means the change is done
- real projects often break in ways that are not obvious by sight
- if Claude knows the test command, it is more likely to do proper regression checks

Think of it as telling Claude: "Do not just look at the surface. Run the automatic check."

#### `Lint: pnpm lint`

Plain language:

"Before calling the change done, run `pnpm lint` to catch simple mistakes and team-rule violations."

Why that matters:

- some problems can be found before the code even runs
- for example: unused variables, bad imports, inconsistent formatting, or forbidden patterns
- if Claude knows the lint command, it is more likely to treat it as a baseline self-check

Think of it as telling Claude: "Do a health check before saying the code is clean."

#### `` `apps/web` contains the customer-facing app ``

Plain language:

"If I want to change pages, buttons, forms, or layout, `apps/web` is probably the first place to look."

Why that matters:

- large repos usually contain many directories
- if you say "change the homepage button color" without a location hint, Claude may search everywhere
- if you name the right directory, Claude can start in the right place immediately

Think of it as telling Claude: "The frontend entrance is here. Do not get lost."

#### `` `packages/api` contains shared API clients and schemas ``

Plain language, split into two parts:

1. `packages/api` contains code for calling backend endpoints
2. it also contains rules for what request and response data should look like

Why that matters:

- changing an API often affects more than one place
- if Claude knows this is the shared interface layer, it is more likely to check downstream impact

Example:

- maybe the login API used to return `{ id, name }`
- now you want it to return `{ id, nickname }`
- if Claude knows `packages/api` is the shared interface layer, it is more likely to ask:
  - should the frontend display logic change too?
  - should the type definitions change too?
  - should the tests change too?

Think of it as telling Claude: "This is the seam between frontend and backend. Changes here can ripple outward."

#### `Do not edit infra/production/ without confirmation`

Plain language:

"This directory is dangerous. Do not touch it without checking first."

Why that matters:

- `infra/production` often controls live deploys, databases, networking, or environment settings
- a mistake here can affect the running system, not just one page
- once Claude sees that rule, it is more likely to stop and confirm before editing

Think of it as drawing a high-voltage danger zone on the project map.

### A More Realistic Starting Template

If you are in a monorepo, this is the kind of starting detail that is usually enough for a beginner:

```md
# Project Commands
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

# Architecture
- `apps/web` contains the customer-facing frontend
- `apps/admin` contains the internal operations UI
- `packages/api` contains shared API clients, schemas, and types
- `packages/ui` contains reusable UI components

# Rules
- Confirm before changes involving billing, auth, or production deploys
- Prefer Zod validation for external input
- When changing an API, check callers and tests too
```

It does not need to be huge on day one, but it should contain things that genuinely change Claude's decisions.

### A Copy-Paste Starter Template

If you still do not know how to begin, copy this into the `CLAUDE.md` at the project root and replace the angle-bracket placeholders with your real project details:

```md
# Project Commands
- Install: `<your install command, for example pnpm install>`
- Dev: `<your dev command, for example pnpm dev>`
- Build: `<your build command, for example pnpm build>`
- Test: `<your test command, for example pnpm test>`
- Lint: `<your lint command, for example pnpm lint>`

# Architecture
- `<frontend directory>` contains `<what it is responsible for>`
- `<backend directory>` contains `<what it is responsible for>`
- `<shared directory>` contains `<shared types, APIs, components, or utilities>`

# Docs
- Start with `README.md`
- Feature docs live in `<your docs directory>`

# Rules
- Do not edit `<high-risk directory>` without confirmation
- When changing an API, also check `<callers / types / tests>`
- After changes, run at least `<your minimum validation command>`
```

If you have no idea how to fill it in yet, use this order:

1. ask Claude to find the real project commands
2. put those commands into `Project Commands`
3. ask Claude which directories matter most
4. fill in `Rules` with the risky paths and minimum validation steps

So `CLAUDE.md` does not need to look professional on day one. It just needs to tell Claude:

- which commands are real
- which directories matter
- which areas are dangerous
- how to self-check a change

### If Your Project Is Not Shipping Software

Do not mechanically copy `Build / Test / Lint` into every `CLAUDE.md`.

For a personal assistant system, reflection vault, or knowledge workflow, it is usually better to describe how the system reads, writes, and routes work.

The sections that matter more in that kind of project are:

- `Project Purpose`: what the system is for and what language it should default to
- `Read Order`: which files are read first and which ones are the single source of truth
- `Agent Routing`: which kinds of requests go to which subagents
- `Write Destinations`: where thoughts, reflections, and plans should be stored
- `Privacy Rules`: which topics are high-sensitivity by default
- `Output Protocol`: what a summary, handoff, or reflection must include

Example:

```md
# Project Purpose
- This is a personal life assistant and reflection system. Default output is Chinese.

# Read Order
- Read `MEMORY.md` first
- Then read `context/user_profile/profile.md`
- Read `context/reference_manifest.md` when paths are needed

# Agent Routing
- thought capture -> `@thought-recorder`
- daily review -> `@daily-reflection-mentor`
- travel planning -> `@travel-assistant`

# Write Destinations
- quick thoughts go to `context/ideas/`
- daily reflections go to `memory/{YYYY-MM-DD}.md`
- stable long-term patterns go to `MEMORY.md`

# Privacy Rules
- health, relationships, and finances are high-sensitivity by default
- do not share or send externally without confirmation

# Output Protocol
- handoffs must include `State / Alerts / Follow-up / Evidence`
```

The short version is: software projects often document how to build and test; life systems are often better served by documenting what to read first, where to write, how to route work, and which information is sensitive.

---

## Daily Commands You Should Actually Know

These are the most useful built-in commands for everyday work:

| Command | Use it for |
|---|---|
| `/help` | View available commands |
| `/init` | Bootstrap a project `CLAUDE.md` |
| `/memory` | Edit and inspect memory files |
| `/config` | Open Claude Code settings |
| `/status` | Check version, connectivity, and account state |
| `/permissions` | Adjust approval rules for tools and commands |
| `/agents` | Create and manage custom subagents |
| `/mcp` | Add and manage MCP servers |
| `/hooks` | Configure hook-based automation |
| `/compact` | Shrink conversation context |
| `/plan` | Enter Plan Mode from the prompt |
| `/cost` | Inspect session cost and token usage |
| `/doctor` | Diagnose installation issues |
| `/statusline` | Configure the terminal status line |

The biggest onboarding mistake is memorizing too many commands. For most developers, `/init`, `/memory`, `/permissions`, `/agents`, `/mcp`, `/hooks`, `/compact`, and `/doctor` cover most of the workflow.

### Do Not Memorize Commands. Memorize 4 Workflows Instead

#### Scenario 1: First time in a repository

1. If the install feels suspicious, run `claude doctor`
2. Run `/init`
3. Ask Claude for the real commands, risky directories, and a repo overview
4. Use `/memory` to tighten the generated `CLAUDE.md`

The point is not "learn `/init`." The point is to establish durable memory early.

#### Scenario 2: You are about to let Claude edit files

1. Start with one small safe task
2. Watch which permissions Claude asks for
3. Use `/permissions` only for the high-frequency safe operations

That is much safer than opening everything up on day one.

#### Scenario 3: You keep repeating the same kind of request

- If it is a repeated workflow, use a skill
- If it is a repeated specialist role, use `/agents`
- If it needs an external system, use `/mcp`
- If it must happen every time, use `/hooks`

So the real skill is not memorizing the command names. It is recognizing whether you have a workflow problem, a role problem, or a tool-integration problem.

#### Scenario 4: The session is getting long and context is drifting

That is when `/compact` matters.

It does not make Claude smarter. It helps compress the current conversation so the next stretch of work has less context bloat.

---

## Permission Modes And Plan Mode

Claude Code is most useful when you understand its permission model.

### Default mode

Claude asks for permission the first time it needs more powerful actions.

### Accept edits mode

Useful when you trust Claude to edit files but still want visibility on command execution.

### Plan Mode

Plan Mode is for read-only analysis. Use it when:

- the codebase is unfamiliar
- the change is large
- the user story is still fuzzy
- you want a migration plan before edits happen

Ways to enter Plan Mode:

```bash
claude --permission-mode plan
```

Or inside a session:

```text
/plan
```

Or cycle permission modes in the UI.

This is the safest default for exploration, refactor planning, and code review.

---

## Settings Hierarchy

Anthropic's current settings hierarchy matters because many tutorials blur user, project, and local scope.

| Scope | File | Typical use |
|---|---|---|
| User | `~/.claude/settings.json` | personal defaults across projects |
| Project | `.claude/settings.json` | shared project behavior committed to git |
| Project local | `.claude/settings.local.json` | personal experiments not committed |

Use project settings for team-shared hooks or permissions. Use user settings for personal defaults.

---

## Memory Hierarchy

Claude Code can load memory from several places. The ones most people need are:

| Memory type | Location | Best use |
|---|---|---|
| Project memory | `./CLAUDE.md` | shared project instructions |
| User memory | `~/.claude/CLAUDE.md` | your personal defaults |

You can also add memories quickly by starting a prompt with `#`, and inspect/edit loaded memories with `/memory`.

For teams, project memory should hold shared conventions; personal preferences should stay out of the repo when possible.

---

## When To Add Subagents, Skills, Hooks, And MCP

### Add a subagent when...

- the same specialist role keeps showing up
- a task benefits from a focused prompt
- you want different tool access for a specialist

Use `/agents` and prefer project-level subagents for team workflows.

Claude Code's native project-scoped subagents live in `.claude/agents/*.md`, while user-scoped subagents live in `~/.claude/agents/*.md`.

If you put agent files in a custom `.agents/` directory, Claude Code will not auto-discover them through the standard native path.

### Add a skill when...

- a workflow repeats often
- you want a reusable slash command
- the process benefits from reference files or a checklist

Store skills in `.claude/skills/<name>/SKILL.md`.

Here, "reusable slash command" does not mean a shell alias or a built-in Claude command.

It is closer to packaging a prompt you repeat often, plus its checklist and supporting files, into a command you define.

For example, if you keep saying:

```text
Review src/routes for validation, auth, error handling, and missing tests, then output findings by severity.
```

That is already a strong skill candidate. After packaging it, you can just write:

```text
/review-api src/routes
```

What you are reusing is not a short nickname. You are reusing a stable workflow. For the deeper version of this idea, continue with [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md).

### Add a hook when...

- something must happen every time, not just when Claude remembers
- you want deterministic enforcement or post-processing

Examples:

- auto-formatting after file edits
- blocking writes to sensitive paths
- logging commands or approvals

### Add MCP when...

- Claude needs external systems like GitHub, Jira, Figma, Slack, databases, or internal tools

Use `/mcp` and choose the right scope:

- personal utility -> user scope
- shared project server -> project scope
- sensitive one-off config -> local scope

---

## Headless And Automation Basics

You do not need to live entirely in the interactive UI.

Examples from Anthropic's CLI docs:

```bash
claude -p "summarize the recent changes"
```

```bash
claude --permission-mode plan -p "analyze the auth system and suggest improvements"
```

```bash
cat build.log | claude -p "find the most likely root cause"
```

These patterns are especially useful for scripts, CI helpers, and local automation.

---

## Recommended Setup Sequence For This Repo

If you want to use the tools in this repository without overcomplicating your environment:

1. Install Claude Code
2. Run `/init` in a real project
3. Improve `CLAUDE.md`
4. Configure only the permissions you actually need
5. Install `global-doc-master`
6. Install `global-review-doc`
7. Install `global-review-code`
8. Add `doc-scanner` if your repo has meaningful markdown docs
9. Add the custom status line if you want better git visibility
10. Add project-specific subagents and skills later

---

## Optional: Custom Status Line From This Repo

This repository ships a status line script at [`scripts/statusline-command.sh`](scripts/statusline-command.sh).

To use it:

```bash
cp scripts/statusline-command.sh ~/.claude/statusline-command.sh
```

Then add this to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

This is a nice quality-of-life improvement, but it is not part of the core onboarding path.

---

## Troubleshooting Shortcuts

### `claude` command not found

- run `claude doctor`
- check your shell `PATH`
- if npm install is messy, consider the native installer

### npm permission issues

- avoid `sudo npm install -g`
- use the native installer or migrate to a local installer path if needed

### repeated permission prompts

- use `/permissions` to allow safe repeated commands
- don't broadly bypass permissions unless the environment is truly safe

### login problems

Try:

1. `/logout`
2. close Claude Code
3. restart with `claude`
4. log in again

### search feels broken

Anthropic recommends installing system `ripgrep` if search and custom discovery features are incomplete.

---

## Next Guides

- [HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)
- [HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)
- [HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)
- [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)
- [docs/OFFICIAL_REFERENCE_MAP.md](docs/OFFICIAL_REFERENCE_MAP.md)
