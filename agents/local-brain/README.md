# Local Brain Agent

A personal knowledge base manager that maintains an Obsidian vault across all your projects. Four modes: **fetch** (read-only lookup), **research** (explore + add), **learn** (extract from sessions), **maintain** (cleanup + freshness).

## Prerequisites

This agent works with an **Obsidian vault** set up as a structured knowledge base. Before installing:

1. **Read the [Local Brain Guide](../../local-brain-guide/)** — it walks you through the full concept, Obsidian setup, vault structure, and daily workflow
2. **Create your Obsidian vault** following [02 — Setup Obsidian](../../local-brain-guide/02-SETUP-OBSIDIAN.md)
3. **Create the CLAUDE.md schema** in your vault following [03 — Vault Schema](../../local-brain-guide/03-VAULT-SCHEMA.md)

## Install

```bash
# copy agent to global agents
cp -r agents/local-brain ~/.claude/agents/local-brain
```

## Setup (Required)

**1. Set your vault path in the agent:**

Open `~/.claude/agents/local-brain/local-brain.md` and replace `<VAULT_PATH>` with your actual vault path:

```markdown
# find this line:
**Vault location:** `<VAULT_PATH>`

# change to your vault path:
**Vault location:** `~/Projects/obsidian_notes/my-brain/`
```

**2. Add the trigger to your global CLAUDE.md:**

Add this to `~/.claude/CLAUDE.md` so "learn from this" works in every project:

```markdown
## Local Brain — Shared Knowledge Base

I maintain a personal Obsidian vault at ~/Projects/obsidian_notes/my-brain/
that stores generalized developer knowledge across all projects.

**"Learn from this" / "Update my brain"** — When I say these phrases:
1. Distill the conversation into generalized, reusable learnings
2. Strip ALL project-specific details: no client names, file paths, API keys
3. Invoke the `local-brain` agent in `learn` mode, passing the distilled learnings

Agent definition: ~/.claude/agents/local-brain.md
```

**3. Install the obsidian-canvas skill** (required — the agent uses it for knowledge graphs):

```bash
cp -r skills/obsidian-canvas ~/.claude/skills/obsidian-canvas
```

## Usage

```
"what do I know about auth?"           → fetch mode
"research CSS anchor positioning"      → research mode
"learn from this and update my brain"  → learn mode
"maintain my wiki"                     → maintain mode
```

## Full Guide

See the **[Local Brain Guide](../../local-brain-guide/)** for the complete setup walkthrough, canvas graph explanation, and daily workflow tips.
