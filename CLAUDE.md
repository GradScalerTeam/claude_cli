# Claude CLI — Workflow Guide & Knowledge Base

## What This Project Is

This is a **public knowledge-sharing repository** by [GradScaler](https://github.com/gradscaler) that teaches developers how to effectively use **Claude Code CLI** for real-world software development. It's not a library or app — it's a structured, practical guide built from hands-on experience.

The goal: help developers go from "I installed Claude CLI" to "I ship entire features with Claude CLI doing most of the heavy lifting."

## Who This Is For

- Developers who want to learn Claude Code CLI beyond the basics
- Teams looking to adopt AI-assisted development workflows
- Anyone curious about how to structure projects so Claude CLI can work autonomously and effectively

## What This Repository Covers

### Core Workflow (The GradScaler Method)

This repository documents and demonstrates a specific, battle-tested workflow:

1. **Planning Phase** — Use `global-doc-master` agent to create detailed planning documents under `docs/planning/`. These are the blueprints that everything else builds on.

2. **Review & Iterate** — Use the `global-review-doc` skill to review planning docs. Incorporate feedback, re-review, and repeat until the plan is solid. Good plans = good code.

3. **Agent-Driven Development** — Use the `agent-development` skill to scan planning docs and generate project-specific agents. These agents live in the local project and are purpose-built for the work described in the plan.

4. **Parallel Execution** — Run generated agents in parallel to build out the project. Claude CLI handles the implementation while the developer oversees and course-corrects.

5. **Test & Improve** — Developer tests the output, creates new planning docs for improvements/fixes, and the cycle repeats.

### Topics & Guides

- **CLAUDE.md Authoring** — How to write effective project instructions that shape Claude's behavior
- **Custom Agents** — Creating, configuring, and running project-specific agents
- **Custom Skills** — Building reusable skills for common workflows
- **Hooks** — Event-driven automation (PreToolUse, PostToolUse, Stop, etc.)
- **Plugins** — Structuring and publishing Claude Code plugins
- **MCP Servers** — Integrating external tools and services
- **Slash Commands** — Custom commands for repetitive tasks
- **Planning-First Development** — Why planning docs matter and how to write them well
- **Doc Review Loops** — Iterative document refinement before coding begins
- **Parallel Agent Workflows** — Running multiple agents simultaneously for speed

## Project Structure

```
claude_cli/
├── CLAUDE.md                  # This file — project instructions
├── docs/
│   ├── planning/              # Planning docs for each guide/topic
│   ├── feature_flow/          # How features/workflows connect
│   └── guides/                # Finished, polished guides
├── examples/
│   ├── claude-md/             # Example CLAUDE.md files for different project types
│   ├── agents/                # Example agent definitions
│   ├── skills/                # Example skill definitions
│   ├── hooks/                 # Example hook configurations
│   ├── plugins/               # Example plugin structures
│   ├── commands/              # Example slash commands
│   └── workflows/             # End-to-end workflow examples
└── templates/
    ├── planning-doc.md        # Template for planning documents
    ├── agent-definition.md    # Template for agent definitions
    └── skill-definition.md    # Template for skill definitions
```

## Development Instructions

### Content Creation Workflow

1. **All docs go through `global-doc-master`** — Never write docs directly. The agent investigates the codebase, follows templates, and produces consistent output.
2. **All docs get reviewed** — Use `global-review-doc` skill before finalizing any document.
3. **Examples must be real** — Every example in this repo should be something that actually works. No theoretical snippets.
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
