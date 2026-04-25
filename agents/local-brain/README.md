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

Open `~/.claude/agents/local-brain/local-brain.md` and replace **both occurrences** of `<VAULT_PATH>` with your actual vault path:

```markdown
# find these lines:
**Your first action in every invocation:** Read the vault's schema at `<VAULT_PATH>/CLAUDE.md` ...
**Vault location:** `<VAULT_PATH>`

# change to your vault path:
**Your first action in every invocation:** Read the vault's schema at `~/Projects/obsidian_notes/my-brain/CLAUDE.md` ...
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

## How It Works (No Canvas Required)

The brain uses two indices and Obsidian's built-in graph view:

- **`wiki/index.md`** — flat human-readable catalog (one line per page)
- **`wiki/pageindex.json`** — purpose-built LLM search index with tags, summaries, and `related[]` neighbors. The agent reads this first to score candidate pages by tag match, title match, and summary keyword. Rebuilt automatically by `maintain` mode and after every write.
- **Cross-page relationships** live as `[[wikilinks]]` in page bodies and `related:` entries in frontmatter — Obsidian's built-in **graph view** renders these visually with no separate file to maintain.

> **Note:** Earlier versions of this agent used a `wiki/index.canvas` file as the graph index. That's been removed — `pageindex.json` is faster for the agent to traverse, and Obsidian's native graph view already covers the human-visualization side. If you want a canvas for something else (architecture sketch, planning board), the [obsidian-canvas skill](../../skills/obsidian-canvas/) is available standalone.

## Usage

```
"what do I know about auth?"           → fetch mode
"research CSS anchor positioning"      → research mode
"learn from this and update my brain"  → learn mode
"maintain my wiki"                     → maintain mode
```

## Full Guide

See the **[Local Brain Guide](../../local-brain-guide/)** for the complete setup walkthrough, page index explanation, and daily workflow tips.
