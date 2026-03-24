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

If your team uses Bedrock or Vertex, Claude Code can be configured for those too, but the simplest path is to start with a Claude.ai or Anthropic Console account.

---

## Installation Options

### Option 1: Standard npm install

```bash
npm install -g @anthropic-ai/claude-code
```

Use this if you already manage developer tooling through Node.

Important:

- Do **not** use `sudo npm install -g`
- If global npm permissions are messy on your machine, expect friction later
- Run `claude doctor` after install

### Option 2: Native installer

Anthropic also documents a native installer flow for macOS, Linux, and Windows via WSL/PowerShell.

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

This path is useful when npm permissions are painful or you want a cleaner standalone install.

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

Typical account paths:

- **Claude.ai account**: easiest for individual use
- **Anthropic Console**: usage billed by API consumption
- **AWS Bedrock / Google Vertex AI**: common in enterprise environments

Once login succeeds, you are in the interactive REPL.

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

### Add a skill when...

- a workflow repeats often
- you want a reusable slash command
- the process benefits from reference files or a checklist

Store skills in `.claude/skills/<name>/SKILL.md`.

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
