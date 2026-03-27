# Claude CLI — Agents, Skills & Workflows

A collection of battle-tested agents, skills, and workflows for [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) — built and maintained by [GradScaler](https://github.com/GradScalerTeam).

---

## Why This Exists

Claude Code CLI is powerful, but most developers barely scratch the surface. They use it for quick edits and one-off questions. That's like buying a CNC machine and using it as a paperweight.

This repo exists because we've spent months figuring out how to actually ship features, entire projects, and production-grade code using Claude CLI as the primary driver. We built agents that write docs. Skills that review those docs. Skills that review code. Workflows that chain them together so you go from a vague idea to a deployed feature with minimal manual coding.

We're sharing everything — the actual agent definitions, skill definitions, reference files, and the workflow that ties them all together — so you can install them and immediately level up how you use Claude CLI.

---

## Who Made This

**[GradScaler](https://github.com/GradScalerTeam)** — a team that builds with Claude CLI every day and documents what works.

Created and maintained by **[Devansh Raj](https://github.com/dev-arctik)**.

---

## Getting Started

New to Claude Code CLI? Start here:

1. **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** — Install Claude CLI, set up authentication, get it running in VS Code, install recommended plugins, and learn the essential slash commands.

Then pick the guide that matches your situation:

2. **[HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)** — Building a brand new project from scratch. Covers the full workflow: planning doc → review → iterate → generate agents → build in parallel → code review → test → create local tools.

3. **[HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)** — Bringing Claude CLI into a project you're already working on. Covers: documenting feature flows → reviewing code → documenting issues → creating local tools → generating development agents.

Want to build your own agents and skills?

4. **[HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)** — Learn what agents are and how to create custom agents for your projects using the agent-development plugin.

5. **[HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)** — Learn what skills are, how they differ from agents, and how to create custom skills using the skill-development plugin.

Want Claude to automatically know about your existing docs?

6. **[Doc Scanner Hook](hooks/doc-scanner/)** — A SessionStart hook that scans your project for `.md` files and gives Claude a documentation index at the start of every conversation. No more "read the planning doc" — Claude already knows it exists.

Using Pencil for UI design?

7. **[HOW_TO_USE_PENCIL_WITH_CLAUDE.md](HOW_TO_USE_PENCIL_WITH_CLAUDE.md)** — How to use [Pencil](https://www.pencil.dev/) with Claude Code for context-aware design sessions.

---

## The Workflow

This isn't just a collection of random tools. Everything here follows a specific workflow we use on every project:

```
1. PLAN        →  global-doc-master creates a planning doc
2. FIX         →  global-doc-fixer reviews, fixes, and repeats until READY
3. BUILD       →  hand the doc to agents or build manually
4. CODE REVIEW →  global-review-code audits the implementation
5. SHIP        →  fix findings, re-review, deploy
```

Plan first. Review before building. Review after building. That's it. The agents and skills below are the tools that make each step fast and thorough.

---

## What's In This Repo

### Agents

Agents are autonomous workers that investigate your codebase, ask you questions, and produce complete outputs. They live at `~/.claude/agents/` and are available in every project.

| Agent | What It Does | Folder |
|---|---|---|
| **[Global Doc Master](agents/global-doc-master/)** | Creates and organizes all technical documentation — planning specs, feature flows, deployment guides, issue reports, resolved postmortems, and debug runbooks. Scans your codebase first, asks clarifying questions, and writes structured docs under `docs/`. | `agents/global-doc-master/` |
| **[Global Doc Fixer](agents/global-doc-fixer/)** | Autonomously reviews and fixes documents until they're implementation-ready. Runs `global-review-doc`, fixes all findings, re-reviews, and repeats — eliminating the manual review-fix loop. Asks MCQ questions only when a business logic decision is needed. | `agents/global-doc-fixer/` |

### Skills

Skills are specialized capabilities you invoke with slash commands or natural language. They run in a forked context and produce structured reports. They live at `~/.claude/skills/`.

| Skill | What It Does | Folder |
|---|---|---|
| **[Global Review Doc](skills/global-review-doc/)** | Reviews any technical document against your actual codebase. 9-phase review covering codebase verification, completeness, security, bug prediction, edge cases, and agent readiness. Produces an 11-section report with a READY / REVISE / REWRITE verdict. | `skills/global-review-doc/` |
| **[Global Review Code](skills/global-review-code/)** | Reviews actual code with a 12-phase audit covering architecture, security (OWASP + domain-specific), performance, error handling, dependencies, testing, and framework best practices. Also has a bug hunt mode that traces bugs from symptom to root cause. Adapts all checks to your detected tech stack. | `skills/global-review-code/` |

### Hooks

Hooks are scripts that run automatically in response to Claude CLI events — like starting a session, using a tool, or finishing a task. They live at `~/.claude/` and are registered in `~/.claude/settings.json`.

| Hook | What It Does | Folder |
|---|---|---|
| **[Doc Scanner](hooks/doc-scanner/)** | SessionStart hook that scans your project for `.md` files and outputs a documentation index at the start of every conversation. Claude immediately knows what planning docs, feature specs, flow docs, and agent definitions exist — and reads the relevant ones before starting work. | `hooks/doc-scanner/` |

### Status Line

| Script | What It Does | Folder |
|---|---|---|
| **[Status Line](scripts/statusline-command.sh)** | Custom Claude Code status line that shows git branch, staged/modified/untracked file counts, and ahead/behind remote — all color-coded. Copy it to `~/.claude/` and configure `settings.json` to use it. | `scripts/` |

### Guides

| Guide | What It Covers |
|---|---|
| **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** | Installing Claude CLI, authentication, VS Code setup, plugins, slash commands, custom status line |
| **[HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)** | Building a project from scratch — planning, review, agents, parallel build, code review, testing, local tools |
| **[HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)** | Using Claude CLI in an existing project — feature flows, code review, issue docs, local tools, development agents |
| **[HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)** | What agents are, how they work, and how to create your own using the agent-development plugin |
| **[HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)** | What skills are, how they differ from agents, and how to create your own using the skill-development plugin |
| **[HOW_TO_USE_PENCIL_WITH_CLAUDE.md](HOW_TO_USE_PENCIL_WITH_CLAUDE.md)** | Using [Pencil](https://www.pencil.dev/) with Claude Code for context-aware UI design — repository selection, project context, and the full design workflow |

---

## Setup

Each component has its own README with full setup instructions. Navigate to the folder and read the README for details on what it does and how to use it.

> **Important:** After installing agents or skills, quit your current Claude CLI session and start a new one. Claude only loads agents and skills at session startup — so newly installed tools won't appear in `/help` or respond to `/slash-commands` until you restart.

### Install Everything

To install all agents, skills, hooks, and scripts at once, paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install everything:

1. AGENTS: Scan the agents/ folder. For each subfolder, find the .md file that is NOT README.md — that's the agent definition. Copy it to ~/.claude/agents/<filename> with the exact same content. Create ~/.claude/agents/ if it doesn't exist.

2. SKILLS: Scan the skills/ folder. For each subfolder, copy the entire folder structure (SKILL.md + references/) to ~/.claude/skills/<skill-name>/ with exact content. Exclude README.md files.

3. HOOKS: Scan the hooks/ folder. For each subfolder, find the .sh file — that's the hook script. Copy it to ~/.claude/<filename> with exact content. Make it executable (chmod +x). Then read my existing ~/.claude/settings.json (create if needed) and add a SessionStart hook entry for each .sh file that runs "bash ~/.claude/<filename>". Merge with existing hooks — don't overwrite.

4. SCRIPTS: Scan the scripts/ folder. Copy each .sh file to ~/.claude/<filename> with exact content. For statusline-command.sh specifically, also add the statusLine config to settings.json: { "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } }. Merge with existing settings — don't overwrite.

After installing everything, read the README.md in each folder and give me a summary of what was installed and how to use each one.
```

### Install Agents Only

To install just the agents:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the agents:

Scan the agents/ folder. For each subfolder, find the .md file that is NOT README.md — that's the agent definition. Copy it to ~/.claude/agents/<filename> with the exact same content. Create ~/.claude/agents/ if it doesn't exist.

After installing, read the README.md in each agent folder and give me a summary of what was installed and how to use each one.
```

### Install Skills Only

To install just the skills:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the skills:

Scan the skills/ folder. For each subfolder, copy the entire folder structure (SKILL.md + references/) to ~/.claude/skills/<skill-name>/ with exact content. Exclude README.md files.

After installing, read the README.md in each skill folder and give me a summary of what was installed and how to use each one.
```

### Install Hooks Only

To install just the hooks:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the hooks:

Scan the hooks/ folder. For each subfolder, find the .sh file — that's the hook script. Copy it to ~/.claude/<filename> with exact content. Make it executable (chmod +x). Then read my existing ~/.claude/settings.json (create if needed) and add a SessionStart hook entry for each .sh file that runs "bash ~/.claude/<filename>". Merge with existing hooks — don't overwrite.

After installing, start a new session and confirm the hooks run.
```

### Install Scripts Only

To install just the scripts (status line, etc.):

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the scripts:

Scan the scripts/ folder. Copy each .sh file to ~/.claude/<filename> with exact content. For statusline-command.sh specifically, also add the statusLine config to my ~/.claude/settings.json: { "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } }. Merge with existing settings — don't overwrite.

Tell me when it's done and explain what each script does.
```

### Check for Updates

Already have everything installed and want to check for newer versions? Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and check for updates to everything I have installed:

1. AGENTS: Scan the agents/ folder. For each subfolder, find the .md file that is NOT README.md. Compare it with my local version at ~/.claude/agents/<filename>. Skip any that don't exist locally.

2. SKILLS: Scan the skills/ folder. For each subfolder, compare all non-README files (SKILL.md + everything in references/) with my local versions at ~/.claude/skills/<skill-name>/. Skip any that don't exist locally.

3. HOOKS: Scan the hooks/ folder. For each subfolder, find the .sh file. Compare it with ~/.claude/<filename>. Skip any that don't exist locally.

4. SCRIPTS: Scan the scripts/ folder. Compare each .sh file with ~/.claude/<filename>. Skip any that don't exist locally.

For each component, tell me if there are any differences. If updates are found, ask me whether I want you to explain what changed first or directly pull the new updates into my local files.
```

---

## Contributing

This repo is actively maintained. We add new agents, skills, and workflows as we build and refine them. If you have suggestions or want to contribute, open an issue or PR.

---

## License

MIT
