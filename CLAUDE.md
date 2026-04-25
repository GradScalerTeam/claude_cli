# Claude CLI — Workflow Guide & Knowledge Base

## What This Project Is

This is a **public knowledge-sharing repository** by [GradScaler](https://github.com/GradScalerTeam) that teaches developers how to effectively use **Claude Code CLI** for real-world software development. It's not a library or app — it's a structured, practical guide built from hands-on experience.

The goal: help developers go from "I installed Claude CLI" to "I ship entire features with Claude CLI doing most of the heavy lifting."

## Who This Is For

- Developers who want to learn Claude Code CLI beyond the basics
- Teams looking to adopt AI-assisted development workflows
- Anyone curious about how to structure projects so Claude CLI can work autonomously and effectively

## What This Repository Covers

### Core Workflow (The GradScaler Method)

This repository documents and demonstrates a specific, battle-tested workflow:

1. **Planning Phase** — Use `global-doc-master` agent to create detailed planning documents under `docs/planning/`. These are the blueprints that everything else builds on.

2. **Review & Fix** — Use the `global-doc-fixer` agent to autonomously review and fix planning docs. It runs `global-review-doc`, fixes all findings, re-reviews, and repeats until the plan is solid. No manual iteration needed. Good plans = good code.

3. **Agent-Driven Development** — Use the `agent-development` skill to scan planning docs and generate project-specific agents. These agents live in the local project and are purpose-built for the work described in the plan.

4. **Parallel Execution** — Run generated agents in parallel to build out the project. Claude CLI handles the implementation while the developer oversees and course-corrects.

5. **Code Review** — Use the `global-review-code` skill to audit the implementation. Document issues with `global-doc-master`, fix, and re-review.

6. **Test & Improve** — Test with curl (backend) or Playwright (frontend). Create new planning docs for improvements/fixes, and the cycle repeats.

### Guides

- **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** — Installing Claude CLI, authentication, VS Code setup, plugins, slash commands
- **[HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)** — Building a project from scratch using the full workflow
- **[HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)** — Bringing Claude CLI into a project you're already working on
- **[HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)** — What agents are and how to create your own
- **[HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)** — What skills are and how to create your own
- **[HOW_TO_USE_PENCIL_WITH_CLAUDE.md](HOW_TO_USE_PENCIL_WITH_CLAUDE.md)** — Using Pencil for context-aware UI design with Claude Code
- **[local-brain-guide/](local-brain-guide/)** — 6-part guide to building a personal knowledge base with Claude Code + Obsidian (concept, setup, schema, `pageindex.json` search index, agent modes, daily workflow)

### Tools

- **[agents/global-doc-master/](agents/global-doc-master/)** — Agent that creates all technical documentation (overview, tech-overview, design, planning, feature flows, deployment, issues, resolved, debug). Uses the `doc-master-assist` skill for templates and protocols
- **[agents/local-brain/](agents/local-brain/)** — Agent that manages a personal Obsidian knowledge base. Four modes: fetch (read-only lookup via `wiki/pageindex.json` LLM search index), research (explore + add), learn (extract from sessions), maintain (cleanup + freshness + pageindex rebuild). Cross-page relationships use `[[wikilinks]]` + Obsidian's built-in graph view — no separate canvas file
- **[skills/doc-master-assist/](skills/doc-master-assist/)** — Template and protocol skill used by the doc-master agent. Contains 8 reference templates for all document types
- **[skills/obsidian-canvas/](skills/obsidian-canvas/)** — General-purpose reference skill for creating and editing Obsidian Canvas (.canvas) JSON files — mind maps, planning boards, architecture sketches, flowcharts. Covers the JSON Canvas 1.0 spec, positioning rules, color conventions, edge label standards, Post-Write Verification Protocol
- **[skills/code-to-design/](skills/code-to-design/)** — Converts frontend code into pixel-accurate Pencil (.pen) design files
- **[skills/github/](skills/github/)** — GitHub CLI operations — repos, PRs, issues, branch management
- **[hooks/doc-scanner/](hooks/doc-scanner/)** — SessionStart hook that scans for `.md` files and gives Claude a documentation index at conversation start

## Project Structure

```
claude_cli/
├── CLAUDE.md                          # This file — project instructions
├── README.md                          # Public-facing repo README
├── CLAUDE_SETUP.md                    # How to install and set up Claude CLI
├── HOW_TO_START_NEW_PROJECT.md        # Guide: building from scratch
├── HOW_TO_START_EXISTING_PROJECT.md   # Guide: using Claude in an existing project
├── HOW_TO_CREATE_AGENTS.md            # Guide: creating custom agents
├── HOW_TO_CREATE_SKILLS.md            # Guide: creating custom skills
├── HOW_TO_USE_PENCIL_WITH_CLAUDE.md   # Guide: using Pencil for UI design with Claude
├── local-brain-guide/                 # 6-part guide: Obsidian + Claude Code knowledge base
│   ├── README.md                      # Overview and quick start
│   ├── 01-CONCEPT.md                  # Why this exists, compilation vs retrieval
│   ├── 02-SETUP-OBSIDIAN.md           # Install Obsidian, create vault, structure
│   ├── 03-VAULT-SCHEMA.md             # CLAUDE.md schema, frontmatter, conventions
│   ├── 04-PAGEINDEX.md                # The pageindex.json LLM search index, anatomy, fetch behavior
│   ├── 05-AGENT-MODES.md              # fetch, research, learn, maintain
│   └── 06-DAILY-WORKFLOW.md           # How to use this day-to-day
├── hooks/
│   └── doc-scanner/                   # SessionStart hook — doc awareness at conversation start
│       ├── doc-scanner.sh             # The hook script
│       └── README.md                  # Setup guide and explanation
├── scripts/
│   └── statusline-command.sh          # Custom status line script for Claude Code
├── agents/
│   ├── global-doc-master/             # Doc master agent definition + README
│   └── local-brain/                   # Local brain agent — personal knowledge base manager
└── skills/
    ├── doc-master-assist/             # Template & protocol skill for doc-master agent
    │   ├── SKILL.md                   # Skill router + shared quality protocols
    │   └── references/                # 8 document templates (loaded on demand)
    ├── obsidian-canvas/               # JSON Canvas spec + positioning rules for .canvas files
    ├── code-to-design/                # Frontend code → Pencil design files
    └── github/                        # GitHub CLI operations skill
```

## Development Instructions

### Content Creation Workflow

1. **All docs go through `global-doc-master`** — Never write docs directly. The agent investigates the codebase, follows templates, and produces consistent output.
2. **Examples must be real** — Every example in this repo should be something that actually works. No theoretical snippets.
4. **Keep it practical** — Explain the "how" and "why", not just the "what". Developers reading this should be able to copy patterns and apply them immediately.

### Writing Style

- Clear, direct language. No fluff.
- Use code blocks with file paths for every example.
- Show the workflow step-by-step — don't skip steps that seem obvious.
- Include "before and after" comparisons where useful (e.g., a bad CLAUDE.md vs a good one).
- Add comments in code examples explaining the "why".

### Git & Commits

- Descriptive commit messages — mention which guide/topic was added or updated.
- One topic per commit where possible. Don't bundle unrelated changes.

### Quality Bar

- Every guide should answer: "Can someone follow this and get it working in 15 minutes?"
- Every example should be self-contained and runnable.
- Every planning doc should be thorough enough that agents can build from it without ambiguity.
