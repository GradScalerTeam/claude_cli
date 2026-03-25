# Claude Code Playbook — Agents, Skills, Hooks & Workflows

English | **[中文](README.md)**

A practical playbook for getting real work done with Claude Code: project memory, subagents, skills, hooks, MCP, and the documentation-first workflow in this repo.

This fork refreshes the tutorial path against Anthropic's current Claude Code docs as of **March 24, 2026**.

---

## Start Here

Pick the path that matches where you are right now:

1. **[10-minute setup](CLAUDE_SETUP.md)** — install Claude Code, log in, create your first `CLAUDE.md`, learn the few commands that matter most.
2. **[New project workflow](HOW_TO_START_NEW_PROJECT.md)** — go from idea to plan to implementation using the tools in this repository.
3. **[Existing project workflow](HOW_TO_START_EXISTING_PROJECT.md)** — retrofit Claude Code into a codebase that already exists.
4. **[Personal assistant / knowledge system workflow](HOW_TO_START_ASSISTANT_SYSTEM.md)** — use Claude Code for a personal assistant, reflection system, or knowledge workflow instead of only software delivery.
5. **[assistant-os starter templates](docs/assistant-os-starter/README.md)** — copy-ready `reference_manifest.md` and protocol templates for the smallest usable system.
6. **[Create subagents](HOW_TO_CREATE_AGENTS.md)** — build project-specific specialists with `/agents`.
7. **[Create skills](HOW_TO_CREATE_SKILLS.md)** — package repeatable prompts and workflows in `SKILL.md`.
8. **[Refactor rough existing subagents](docs/REFACTOR_EXISTING_SUBAGENTS.md)** — shows how to split old mega-agents into narrow roles and move repeated procedures into skills.
9. **[Subagent refactor starter](docs/subagent-refactor-starter/README.md)** — copy-ready `.claude/agents/` and `.claude/skills/` examples for a minimal role split.
10. **[OpenClaw vs Claude agents](docs/OPENCLAW_AND_CLAUDE_AGENTS.md)** — a detailed comparison of OpenClaw agents, OpenClaw subagents, and Claude CLI subagents, plus recommended complementarity patterns.
11. **[OpenClaw + Claude CLI integration guide](docs/OPENCLAW_CLAUDE_INTEGRATION.md)** — explains how OpenClaw hands work into Claude CLI repo workflows and what “sharing MCP” should mean in practice.
12. **[OpenClaw + Claude CLI workflow scenarios](docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md)** — breaks the model into concrete choices: outer loop, inner loop, bridge artifacts, or repo-only work.
13. **[OpenClaw Inbox Triage + Claude CLI Repo Executor](docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md)** — keeps only the most practical “intake, classify, route, execute in repo” pattern.
14. **[Assistant team patterns](docs/ASSISTANT_TEAM_PATTERNS.md)** — practical patterns for splitting work, life, and reflection assistants.
15. **[Official reference map](docs/OFFICIAL_REFERENCE_MAP.md)** — see which Anthropic docs back each guide in this repo.

---

## What Changed In This Tutorial Refresh

The original docs were useful, but parts of the onboarding path had drifted away from the current Claude Code experience. This refresh focuses on:

- **Modern official entry points**: `/init`, `/agents`, `/memory`, `/permissions`, `/mcp`, `/hooks`, and Plan Mode.
- **Stable mental models**: `CLAUDE.md` for memory, subagents for specialists, skills for reusable workflows, hooks for deterministic automation.
- **Safer execution**: plan first for risky work, keep permissions explicit, and use hooks only when you need behavior that must always run.
- **Better team onboarding**: clearer learning paths, project-vs-user scope guidance, and stronger documentation on when to create local tools.

---

## Core Concepts In 60 Seconds

| Concept | What it is | Use it when |
|---|---|---|
| `CLAUDE.md` | Shared memory for a project | You want Claude to consistently remember commands, architecture, conventions, and risks |
| Subagents | Specialized workers in `.claude/agents/` or `~/.claude/agents/` | A task benefits from a dedicated role with a focused prompt and tool set |
| Skills | Reusable capabilities in `.claude/skills/<name>/SKILL.md` | You want a repeatable workflow, custom command, or domain-specific playbook |
| Hooks | Deterministic automation in `settings.json` | Something must always happen before or after a tool event |
| MCP | External tools and data sources | Claude needs access to GitHub, Jira, Figma, databases, internal services, or other tool servers |
| Plan Mode | Read-only planning mode | You want Claude to analyze safely before it edits or runs commands |

If you're new, do not start with custom hooks or a pile of agents. Start with `CLAUDE.md`, a clean workflow, and one or two focused extensions.

---

## Recommended Baseline For Every Repository

Before you install any extra tooling, set up this baseline:

1. Run `claude` in the project root.
2. Run `/init` and create a useful `CLAUDE.md`.
3. Record the real commands Claude should use: build, test, lint, format, dev server, and deployment notes.
4. Add architecture notes, naming conventions, and risky directories.
5. Use `/permissions` to reduce repetitive approvals only after you know which commands are safe.
6. Use Plan Mode for larger refactors or unfamiliar code.
7. Add subagents only for recurring specialist roles.
8. Add skills only for workflows you repeat often.
9. Add hooks only when you need deterministic enforcement, not just advice.

This repository's agents and skills work best on top of that baseline.

---

## Suggested Learning Path

### Path A — Brand New To Claude Code

1. Read [CLAUDE_SETUP.md](CLAUDE_SETUP.md)
2. Create a `CLAUDE.md` with `/init`
3. Try a few small tasks in a real repo
4. Read [HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)
5. Install one component from this repo, not all of them at once

### Path B — You Already Use Claude Code But Want Better Workflows

1. Read [HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)
2. Install `global-doc-master`
3. Install `global-review-doc` and `global-review-code`
4. Add `doc-scanner` if your projects are doc-heavy
5. Add project-specific subagents and skills only after patterns stabilize

### Path C — You Want To Build Your Own Extensions

1. Read [HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)
2. Read [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)
3. Study the examples in `agents/`, `skills/`, and `hooks/`
4. Version project-level tools with the repo and keep user-level tools personal

### Path D — You Want A Personal Assistant Or Knowledge System

1. Read [CLAUDE_SETUP.md](CLAUDE_SETUP.md)
2. Read [HOW_TO_START_ASSISTANT_SYSTEM.md](HOW_TO_START_ASSISTANT_SYSTEM.md)
3. Start from the templates in [docs/assistant-os-starter/README.md](docs/assistant-os-starter/README.md)
4. Then read [docs/ASSISTANT_TEAM_PATTERNS.md](docs/ASSISTANT_TEAM_PATTERNS.md)
5. Start with a small working system, not a mega-assistant
6. Add subagents and skills only after the rhythm becomes stable

---

## Workflow This Repo Teaches

```text
1. Capture context   ->  /init + CLAUDE.md + existing docs
2. Plan the change   ->  doc master + Plan Mode + review
3. Build in slices   ->  focused prompts, skills, and subagents
4. Review the code   ->  global-review-code
5. Test and iterate  ->  run commands, inspect results, document fixes
6. Preserve context  ->  flow docs, issue docs, resolved docs
```

This is intentionally documentation-first. Claude gets better when the project has durable memory and explicit workflows.

---

## If You Want A More Detailed Workflow

If the direction is clear but the exact operating flow still feels too abstract, go straight to one of these:

1. **Existing repo workflow**: read [HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)
   Best when you already have a codebase and want to add `CLAUDE.md`, flow docs, review loops, skills, and subagents gradually.
2. **New project workflow**: read [HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)
   Best when you are still in planning and want to go documentation first, then review, then implement in slices.
3. **OpenClaw outer loop + Claude CLI inner loop**: read [docs/OPENCLAW_CLAUDE_INTEGRATION.md](docs/OPENCLAW_CLAUDE_INTEGRATION.md)
   Best when you want a long-lived assistant to handle intake, reminders, and routing, while Claude CLI handles concrete repo execution.
4. **How to choose a concrete scenario**: read [docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md](docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md)
   Best when you want a quick decision tree for outer loop, inner loop, bridge docs, or repo-only work.
5. **Just the intake-to-execution path**: read [docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md](docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md)
   Best when you only care about the most common and stable outer-loop / inner-loop split.

If your main question is simply whether OpenClaw agents and Claude CLI subagents are the same thing, read:

- [docs/OPENCLAW_AND_CLAUDE_AGENTS.md](docs/OPENCLAW_AND_CLAUDE_AGENTS.md)

---

## What's In This Repo

### Agents

| Agent | What it does | Folder |
|---|---|---|
| **[Global Doc Master](agents/global-doc-master/)** | Creates structured docs such as planning specs, feature flows, issue docs, deployment notes, and debug docs. | `agents/global-doc-master/` |
| **[Global Doc Fixer](agents/global-doc-fixer/)** | Re-runs document review and fixes docs until they are implementation-ready. | `agents/global-doc-fixer/` |

### Skills

| Skill | What it does | Folder |
|---|---|---|
| **[Global Review Doc](skills/global-review-doc/)** | Reviews docs against the real codebase and highlights missing detail, risks, ambiguity, and agent-readiness gaps. | `skills/global-review-doc/` |
| **[Global Review Code](skills/global-review-code/)** | Reviews code for architecture, security, correctness, testing, and maintainability. | `skills/global-review-code/` |

### Hooks

| Hook | What it does | Folder |
|---|---|---|
| **[Doc Scanner](hooks/doc-scanner/)** | Session-start hook that surfaces markdown docs to Claude early. | `hooks/doc-scanner/` |
| **[Design Context](hooks/design-context/)** | Pencil-focused hook that bridges app context into design sessions. | `hooks/design-context/` |

### Utility Script

| Script | What it does | Folder |
|---|---|---|
| **[Status Line](scripts/statusline-command.sh)** | Displays branch and change state in Claude Code's status line. | `scripts/` |

---

## Install Order

Recommended order if you want to adopt this repo gradually:

1. Setup Claude Code and `CLAUDE.md`
2. Install **Global Doc Master**
3. Install **Global Review Doc**
4. Install **Global Review Code**
5. Install **Doc Scanner**
6. Install **Status Line**
7. Install **Design Context** only if you use Pencil

Each component has its own README with setup instructions and copy-ready install prompts.

---

## Important Scope Rules

- Put **team-shared** tools in `.claude/` and commit them.
- Put **personal defaults** in `~/.claude/`.
- Put **project-specific memory** in `CLAUDE.md`.
- Put **personal project notes** in imports from your home directory rather than relying on deprecated local-memory patterns.
- Prefer **skills** for repeatable workflows and **subagents** for specialists.
- Prefer **hooks** only for deterministic behavior that must always run.

---

## Next Reads

- [CLAUDE_SETUP.md](CLAUDE_SETUP.md)
- [HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)
- [HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)
- [HOW_TO_START_ASSISTANT_SYSTEM.md](HOW_TO_START_ASSISTANT_SYSTEM.md)
- [HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)
- [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)
- [docs/OPENCLAW_AND_CLAUDE_AGENTS.md](docs/OPENCLAW_AND_CLAUDE_AGENTS.md)
- [docs/OPENCLAW_CLAUDE_INTEGRATION.md](docs/OPENCLAW_CLAUDE_INTEGRATION.md)
- [docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md](docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md)
- [docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md](docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md)
- [docs/ASSISTANT_TEAM_PATTERNS.md](docs/ASSISTANT_TEAM_PATTERNS.md)
- [docs/OFFICIAL_REFERENCE_MAP.md](docs/OFFICIAL_REFERENCE_MAP.md)
