# Local Brain — Build a Personal Knowledge Base with Claude Code + Obsidian

A step-by-step guide to building a **persistent, cross-project knowledge base** that Claude reads at the start of every session. Your developer preferences, design opinions, tool workflows, and inspiration — compiled into a structured wiki that compounds over time.

Inspired by [Andrej Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) concept.

---

## The Problem

Every new project, you re-teach Claude the same things:

- "I prefer JWT in httpOnly cookies, not localStorage"
- "Use Redux Toolkit, not raw Redux"
- "I like atomic design for component structure"
- "Error boundaries at route level, not component level"

Claude's per-project memory (`~/.claude/projects/`) is siloed. Knowledge from Project A doesn't exist in Project B. You're starting from zero every time.

## The Solution

A **single Obsidian vault** that stores your generalized knowledge as structured markdown. Claude Code reads it, navigates it via a graph index, and updates it as you learn new things. Knowledge compounds instead of resetting.

```
You work on Project A → correct Claude on auth → "learn from this"
    → Knowledge saved to your brain
        → Start Project B → Claude already knows your auth preference
```

## What You'll Build

| Component | Purpose |
|---|---|
| **Obsidian vault** | Folder of markdown files — your knowledge base |
| **CLAUDE.md schema** | Rules for how Claude maintains the wiki |
| **Domain canvases** | Visual knowledge graphs (`.canvas` JSON files) Claude navigates |
| **`local-brain` agent** | 4-mode agent that manages everything |
| **`obsidian-canvas` skill** | Teaches Claude to create clean canvas layouts |
| **Global CLAUDE.md trigger** | "learn from this" works in any project |

## Guide Structure

Read in order if you're setting up from scratch. Jump to a specific section if you need it.

| # | Guide | What It Covers |
|---|---|---|
| 1 | **[Concept](01-CONCEPT.md)** | Why this exists, how it differs from RAG, the "compilation over retrieval" insight |
| 2 | **[Setup Obsidian](02-SETUP-OBSIDIAN.md)** | Install Obsidian, create vault, folder structure, git init, recommended plugins |
| 3 | **[Vault Schema](03-VAULT-SCHEMA.md)** | The CLAUDE.md schema, frontmatter template, naming conventions, wikilink rules |
| 4 | **[Canvas Graphs](04-CANVAS-GRAPHS.md)** | Knowledge graph canvases, how Claude navigates them, edge types, positioning |
| 5 | **[Agent Modes](05-AGENT-MODES.md)** | The 4 modes — fetch, research, learn, maintain — with real examples |
| 6 | **[Daily Workflow](06-DAILY-WORKFLOW.md)** | How to actually use this day-to-day, when to ingest, when to learn, tips |

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and working
- macOS, Linux, or Windows with terminal access
- ~15 minutes for initial setup

## Quick Start

If you want Claude to set everything up for you:

```
Read the local-brain-guide/ folder in the claude_cli repo. Set up a local brain
for me — install Obsidian, create the vault, install the agent and skill, and
configure my global CLAUDE.md. Walk me through each step.
```

Claude will read these guides and walk you through the entire setup interactively.
