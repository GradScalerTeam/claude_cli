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

---

## The Workflow

This isn't just a collection of random tools. Everything here follows a specific workflow we use on every project:

```
1. PLAN        →  global-doc-master creates a planning doc
2. REVIEW      →  global-review-doc reviews the doc, finds gaps
3. ITERATE     →  fix findings, re-review until verdict is READY
4. BUILD       →  hand the doc to agents or build manually
5. CODE REVIEW →  global-review-code audits the implementation
6. SHIP        →  fix findings, re-review, deploy
```

Plan first. Review before building. Review after building. That's it. The agents and skills below are the tools that make each step fast and thorough.

---

## What's In This Repo

### Agents

Agents are autonomous workers that investigate your codebase, ask you questions, and produce complete outputs. They live at `~/.claude/agents/` and are available in every project.

| Agent | What It Does | Folder |
|---|---|---|
| **[Global Doc Master](agents/global-doc-master/)** | Creates and organizes all technical documentation — planning specs, feature flows, deployment guides, issue reports, resolved postmortems, and debug runbooks. Scans your codebase first, asks clarifying questions, and writes structured docs under `docs/`. | `agents/global-doc-master/` |

### Skills

Skills are specialized capabilities you invoke with slash commands or natural language. They run in a forked context and produce structured reports. They live at `~/.claude/skills/`.

| Skill | What It Does | Folder |
|---|---|---|
| **[Global Review Doc](skills/global-review-doc/)** | Reviews any technical document against your actual codebase. 9-phase review covering codebase verification, completeness, security, bug prediction, edge cases, and agent readiness. Produces an 11-section report with a READY / REVISE / REWRITE verdict. | `skills/global-review-doc/` |
| **[Global Review Code](skills/global-review-code/)** | Reviews actual code with a 12-phase audit covering architecture, security (OWASP + domain-specific), performance, error handling, dependencies, testing, and framework best practices. Also has a bug hunt mode that traces bugs from symptom to root cause. Adapts all checks to your detected tech stack. | `skills/global-review-code/` |

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

---

## Setup

Each agent and skill has its own README with full setup instructions. Navigate to the folder, read the README, and paste the setup prompt into your Claude CLI.

- **[Global Doc Master](agents/global-doc-master/)** — the documentation agent. Go to [agents/global-doc-master/README.md](agents/global-doc-master/README.md) for setup.
- **[Global Review Doc](skills/global-review-doc/)** — the document review skill. Go to [skills/global-review-doc/README.md](skills/global-review-doc/README.md) for setup.
- **[Global Review Code](skills/global-review-code/)** — the code review & bug hunt skill. Go to [skills/global-review-code/README.md](skills/global-review-code/README.md) for setup.

> **Important:** After installing agents or skills, quit your current Claude CLI session and start a new one. Claude only loads agents and skills at session startup — so newly installed tools won't appear in `/help` or respond to `/slash-commands` until you restart.

### Install Everything

To install all agents, skills, and the status line at once, paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install everything:

1. Read agents/global-doc-master/global-doc-master.md — create ~/.claude/agents/global-doc-master.md with the exact same content. Create the directory if it doesn't exist.

2. Read all files in skills/global-review-doc/ (SKILL.md, references/output-format.md, references/security-domains.md) — create the same structure at ~/.claude/skills/global-review-doc/ with exact content.

3. Read all files in skills/global-review-code/ (SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, references/domain-security-checks.md) — create the same structure at ~/.claude/skills/global-review-code/ with exact content.

4. Read scripts/statusline-command.sh — save it to ~/.claude/statusline-command.sh with the exact same content.

5. Read my existing ~/.claude/settings.json (create it if it doesn't exist) and add the statusLine config: { "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } }. Merge it with any existing settings — don't overwrite them.

After installing everything, read the README.md in each folder and give me a summary of what was installed and how to use each one.
```

### Install Agent Only

To install just the Global Doc Master agent:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the agent:

1. Read agents/global-doc-master/global-doc-master.md — create ~/.claude/agents/global-doc-master.md with the exact same content. Create the directory if it doesn't exist.

After installing, read agents/global-doc-master/README.md and give me a summary of what was installed and how to use it.
```

### Install Skills Only

To install just the Global Review Doc and Global Review Code skills:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the skills:

1. Read all files in skills/global-review-doc/ (SKILL.md, references/output-format.md, references/security-domains.md) — create the same structure at ~/.claude/skills/global-review-doc/ with exact content.

2. Read all files in skills/global-review-code/ (SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, references/domain-security-checks.md) — create the same structure at ~/.claude/skills/global-review-code/ with exact content.

After installing, read the README.md in each skill folder and give me a summary of what was installed and how to use each one.
```

### Install Status Line Only

To install just the custom git status line:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the status line:

1. Read scripts/statusline-command.sh — save it to ~/.claude/statusline-command.sh with the exact same content.

2. Read my existing ~/.claude/settings.json (create it if it doesn't exist) and add the statusLine config: { "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } }. Merge it with any existing settings — don't overwrite them.

Tell me when it's done and explain what the status line shows.
```

---

## Contributing

This repo is actively maintained. We add new agents, skills, and workflows as we build and refine them. If you have suggestions or want to contribute, open an issue or PR.

---

## License

MIT
