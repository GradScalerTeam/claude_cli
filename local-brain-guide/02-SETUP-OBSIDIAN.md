# 2. Setup Obsidian — Install, Create Vault, Structure

## Step 1: Install Obsidian

**macOS (Homebrew):**
```bash
brew install --cask obsidian
```

**Or download directly:** [obsidian.md](https://obsidian.md) — free for personal use.

## Step 2: Create the Vault

Choose a location outside any project directory. This is your personal brain — it doesn't belong to any single project.

```bash
# create the parent folder
mkdir -p ~/Projects/obsidian_notes

# Obsidian will create the vault when you open it
```

Open Obsidian → "Create new vault" → name it something memorable (we use `cortex`, but pick what fits you) → point it to `~/Projects/obsidian_notes/your-vault-name`.

## Step 3: Create the Folder Structure

After Obsidian creates the vault, build out the full structure. You can do this manually or ask Claude:

```bash
cd ~/Projects/obsidian_notes/your-vault-name

# raw sources — immutable, LLM reads but never modifies
mkdir -p raw/articles raw/projects raw/notes

# wiki — LLM-owned knowledge
mkdir -p wiki/dev wiki/design wiki/tools wiki/inspiration wiki/comparisons wiki/sources

# outputs — generated artifacts (optional)
mkdir -p outputs
```

Your vault should now look like:

```
your-vault-name/
├── .obsidian/          ← Obsidian internal config (auto-created)
├── raw/
│   ├── articles/       ← web articles, blog posts
│   ├── projects/       ← cool projects you discover
│   └── notes/          ← quick brain dumps
├── wiki/
│   ├── dev/            ← developer knowledge
│   ├── design/         ← UI/UX, visual trends
│   ├── tools/          ← tool workflows
│   ├── inspiration/    ← ideas, projects
│   ├── comparisons/    ← X vs Y analysis
│   └── sources/        ← summaries of ingested material
└── outputs/            ← generated artifacts
```

## Step 4: Create Core Wiki Files

These three files are the backbone of the wiki:

### `wiki/index.md`

The master routing table. The LLM reads this first to find relevant pages.

```markdown
---
title: Master Index
type: index
updated: 2026-04-16
---

# Knowledge Base — Master Index

## Dev
<!-- Developer knowledge — patterns, preferences, architecture -->

## Design
<!-- UI/UX, visual trends, design systems -->

## Tools
<!-- Tools, workflows, CLI setups -->

## Inspiration
<!-- Projects, ideas, concepts discovered -->

## Comparisons
<!-- X vs Y analysis pages -->

## Sources
<!-- Summaries of ingested raw material -->
```

### `wiki/overview.md`

High-level synthesis of the entire knowledge base. Updated as the wiki grows.

```markdown
---
title: Knowledge Base Overview
type: overview
updated: 2026-04-16
---

# Knowledge Base — Overview

## Current State

- **Total pages:** 0
- **Domains covered:** None yet
- **Strongest areas:** TBD
- **Gaps to fill:** TBD
```

### `wiki/log.md`

Chronological activity log. Append-only.

```markdown
---
title: Activity Log
type: log
updated: 2026-04-16
---

# Knowledge Base — Activity Log

---

## 2026-04-16

- **Wiki initialized** — Created folder structure, schema, index, overview, and log.
```

## Step 5: Initialize Git

Version control lets you track every change, roll back mistakes, and see how your knowledge evolved.

```bash
cd ~/Projects/obsidian_notes/your-vault-name
git init
```

Create a `.gitignore`:

```
# Obsidian workspace state — changes every time you open the app
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/plugins/
.obsidian/themes/
.trash/

# OS files
.DS_Store
```

First commit:

```bash
git add -A
git commit -m "Initialize knowledge base — folder structure, core wiki files, gitignore"
```

## Step 6: Recommended Obsidian Settings

### Enable Core Plugins

Go to Settings → Core Plugins and enable:

- **Bases** — turns your wiki pages into queryable database views using frontmatter
- **Canvas** — spatial whiteboard for knowledge graphs (should be on by default)
- **Backlinks** — shows what pages link TO the current page
- **Graph view** — visual graph of all connections
- **Tags** — tag-based organization

### Optional Community Plugins

Settings → Community Plugins → Browse:

- **Dataview** — powerful query language for frontmatter (backup for when Bases can't handle a query)
- **Obsidian Web Clipper** — browser extension to save articles directly to `raw/articles/`

## Step 7: Verify in Obsidian

Open the vault in Obsidian. You should see:

- `raw/`, `wiki/`, `outputs/` folders in the sidebar
- `wiki/index.md`, `wiki/overview.md`, `wiki/log.md` files
- Empty graph view (no pages with links yet)
- Bases plugin available (you'll create Bases after adding wiki pages)

The vault is ready. Next step: create the CLAUDE.md schema that teaches the LLM how to maintain it.

---

**Next:** [03 — Vault Schema](03-VAULT-SCHEMA.md)
