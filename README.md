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

Want a persistent memory that follows you across projects?

8. **[Local Brain Guide](local-brain-guide/)** — Build a personal knowledge base with Claude Code + Obsidian. Your preferences, design opinions, and learnings persist across every project. Inspired by [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

---

## The Workflow

This isn't just a collection of random tools. Everything here follows a specific workflow we use on every project:

```
1. PLAN        →  global-doc-master creates a planning doc
2. BUILD       →  hand the doc to agents or build manually
3. REVIEW      →  Claude reviews code inline during self-analysis
4. SHIP        →  fix findings, deploy
```

Plan first. Build with agents. Claude reviews as it goes. Ship.

---

## What's In This Repo

### Agents

Agents are autonomous workers that investigate your codebase, ask you questions, and produce complete outputs. They live at `~/.claude/agents/` and are available in every project.

| Agent | What It Does | Folder |
|---|---|---|
| **[Global Doc Master](agents/global-doc-master/)** | Creates and organizes all technical documentation — project overviews, tech overviews, design specs, planning docs, feature flows, deployment guides, issue reports, resolved postmortems, and debug runbooks. Uses the `doc-master-assist` skill for templates and protocols. Scans your codebase first, asks clarifying questions, and writes structured docs under `docs/`. | `agents/global-doc-master/` |
| **[Local Brain](agents/local-brain/)** | Manages a personal Obsidian knowledge base that persists across all projects. Four modes: `fetch` (read-only lookup via `pageindex.json` LLM search index), `research` (explore new topics + add to wiki), `learn` (extract generalized preferences from work sessions), `maintain` (audit for orphans/staleness/outdated knowledge + rebuild the search index). Cross-page relationships use `[[wikilinks]]` and Obsidian's built-in graph view — no separate canvas file required. Inspired by [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). | `agents/local-brain/` |

> **Removed: Global Doc Fixer** — Previously this repo included a `global-doc-fixer` agent that autonomously reviewed and fixed documents in a loop (review → fix → re-review → repeat). We removed it because it consumed excessive tokens per run — the iterative review-fix loop often burned through significant context on minor formatting issues. If you already have it installed and want to remove it: `rm ~/.claude/agents/global-doc-fixer.md`

### Skills

Skills are specialized capabilities you invoke with slash commands or natural language. They run in a forked context and produce structured reports. They live at `~/.claude/skills/`.

| Skill | What It Does | Folder |
|---|---|---|
| **[Doc Master Assist](skills/doc-master-assist/)** | Template and protocol skill used by the Doc Master agent. Contains 8 reference templates (overview, tech-overview, design, planning, feature-flow, issue, deployment, debug) with their specific protocols. Loaded on demand — only the relevant template is read per invocation. | `skills/doc-master-assist/` |
| **[Obsidian Canvas](skills/obsidian-canvas/)** | General-purpose reference skill for creating and editing Obsidian Canvas (`.canvas`) JSON files — mind maps, brainstorm boards, planning layouts, architecture sketches, flowcharts, decision trees. Covers the full JSON Canvas 1.0 spec, node positioning rules, color conventions, edge label standards, layout algorithms, and a Post-Write Verification Protocol. | `skills/obsidian-canvas/` |
| **[Code to Design](skills/code-to-design/)** | Converts frontend code into pixel-accurate Pencil (`.pen`) design files. Works with any frontend framework (React, Vue, Svelte, HTML/CSS) and any CSS system (Tailwind, CSS modules, styled-components). | `skills/code-to-design/` |
| **[GitHub](skills/github/)** | GitHub CLI operations — creating repos, pushing, PRs, issues, branch management. Wraps `gh` commands with proper conventions. | `skills/github/` |

> **Removed: Global Review Doc & Global Review Code** — Previously this repo included dedicated review skills (9-phase doc review, 12-phase code audit). We removed them because they consumed excessive tokens per invocation — the multi-phase review pipelines added significant overhead without proportional value. Claude's built-in self-analysis during coding already catches issues effectively. If you already have them installed and want to remove them: `rm -rf ~/.claude/skills/global-review-doc ~/.claude/skills/global-review-code`

### Hooks

Hooks are scripts that run automatically in response to Claude CLI events — like starting a session, using a tool, or finishing a task. They live at `~/.claude/` and are registered in `~/.claude/settings.json`.

| Hook | What It Does | Folder |
|---|---|---|
| **[Doc Scanner](hooks/doc-scanner/)** | SessionStart hook that scans your project for `.md` files and outputs a documentation index at the start of every conversation. Claude immediately knows what planning docs, feature specs, flow docs, and agent definitions exist — and reads the relevant ones before starting work. | `hooks/doc-scanner/` |

### Status Line

A two-line custom status line that keeps git and session context always visible at the bottom of Claude Code.

```
github_project_code/claude_cli | main   +2 *1 ~3  /  ↑1
[Sonnet · high]  ███░░ 23%  |  5h 41%  ·  7d 18%
```

**Line 1** — workspace & git: path, branch, staged (`+`), modified (`*`), untracked (`~`), ahead (`↑`), behind (`↓`)

**Line 2** — session context: model + effort level (color-coded by intensity) · 5-char context window bar · 5h/7d rate limit usage (Pro/Max only)

| Script | Folder |
|---|---|
| **[Status Line](scripts/statusline-command.sh)** — see [scripts/README.md](scripts/README.md) for full setup and color coding reference | `scripts/` |

### Guides

| Guide | What It Covers |
|---|---|
| **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** | Installing Claude CLI, authentication, VS Code setup, plugins, slash commands, custom status line |
| **[HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)** | Building a project from scratch — planning, review, agents, parallel build, code review, testing, local tools |
| **[HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)** | Using Claude CLI in an existing project — feature flows, code review, issue docs, local tools, development agents |
| **[HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)** | What agents are, how they work, and how to create your own using the agent-development plugin |
| **[HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)** | What skills are, how they differ from agents, and how to create your own using the skill-development plugin |
| **[HOW_TO_USE_PENCIL_WITH_CLAUDE.md](HOW_TO_USE_PENCIL_WITH_CLAUDE.md)** | Using [Pencil](https://www.pencil.dev/) with Claude Code for context-aware UI design — repository selection, project context, and the full design workflow |
| **[Local Brain Guide](local-brain-guide/)** | Build a personal knowledge base with Claude Code + Obsidian. Covers the concept (Karpathy's LLM Wiki), Obsidian setup, vault schema, the `pageindex.json` LLM search index, agent modes, and daily workflow. 6-part guide. |

---

## Setup

Each component has its own README with full setup instructions. Navigate to the folder and read the README for details on what it does and how to use it.

> **Important:** After installing agents or skills, quit your current Claude CLI session and start a new one. Claude only loads agents and skills at session startup — so newly installed tools won't appear in `/help` or respond to `/slash-commands` until you restart.

### Install Everything

To install all agents, skills, hooks, and scripts at once, paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install everything:

1. AGENTS: Scan the agents/ folder. For each subfolder, check if it contains only a single agent .md file (+ README.md) or a folder-based agent with sub-files. For single-file agents (like global-doc-fixer), copy the .md file (NOT README.md) to ~/.claude/agents/<filename>. For folder-based agents (like global-doc-master which contains only global-doc-master.md + README.md), copy the entire folder to ~/.claude/agents/<folder-name>/ excluding README.md. Create ~/.claude/agents/ if it doesn't exist.

2. SKILLS: Scan the skills/ folder. For each subfolder, copy the entire folder structure (SKILL.md + references/) to ~/.claude/skills/<skill-name>/ with exact content. Exclude README.md files.

3. HOOKS: Scan the hooks/ folder. For each subfolder, find the .sh file — that's the hook script. Copy it to ~/.claude/<filename> with exact content. Make it executable (chmod +x). Then read my existing ~/.claude/settings.json (create if needed) and add a SessionStart hook entry for each .sh file that runs "bash ~/.claude/<filename>". Merge with existing hooks — don't overwrite.

4. SCRIPTS: Scan the scripts/ folder. Copy each .sh file to ~/.claude/<filename> with exact content. For statusline-command.sh specifically, also add the statusLine config to settings.json: { "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } }. Merge with existing settings — don't overwrite.

After installing everything, read the README.md in each folder and give me a summary of what was installed and how to use each one.

IMPORTANT for local-brain agent: After copying, open ~/.claude/agents/local-brain/local-brain.md and replace <VAULT_PATH> with my actual Obsidian vault path. Also read the local-brain-guide/ folder for setup steps — I need an Obsidian vault with the right folder structure and a CLAUDE.md schema before the agent works. Walk me through the full setup if I don't have a vault yet.
```

### Install Agents Only

To install just the agents:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the agents:

Scan the agents/ folder. For each subfolder, check if it contains only a single agent .md file (+ README.md) or a folder-based agent. For single-file agents, copy the .md file (NOT README.md) to ~/.claude/agents/<filename>. For folder-based agents, copy the entire folder to ~/.claude/agents/<folder-name>/ excluding README.md. Create ~/.claude/agents/ if it doesn't exist.

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
