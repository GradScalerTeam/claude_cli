# 3. Vault Schema — The CLAUDE.md That Runs Your Brain

The `CLAUDE.md` at the root of your vault is the most important file. It tells Claude Code how to read, write, and maintain your knowledge base. Without it, Claude treats your vault as a random folder of markdown.

## Creating the Schema

Create `CLAUDE.md` in your vault root (alongside `raw/`, `wiki/`, etc.):

```markdown
# [Your Brain Name] — Personal Knowledge Base

## What This Is

This is a personal knowledge base — a local wiki maintained by Claude Code
and viewed in Obsidian. It stores developer preferences, design knowledge,
tool workflows, and research across all projects.

**Core principle: knowledge is compiled, not retrieved.** New information
gets synthesized into the wiki once, cross-referenced, and kept current —
so every future project benefits from everything learned before.

## Three-Layer Architecture

### Layer 1: Raw Sources (`raw/`) — Immutable
- `raw/articles/` — web articles, blog posts, tutorials
- `raw/projects/` — cool projects discovered online
- `raw/notes/` — quick brain dumps, rough thoughts

**Rules:**
- Claude reads but NEVER modifies files in `raw/`
- Every raw file should have a source URL or origin note at the top
- Filenames: `YYYY-MM-DD-descriptive-name.md`

### Layer 2: The Wiki (`wiki/`) — LLM-Owned
- `wiki/dev/` — developer knowledge
- `wiki/design/` — UI/UX trends, design systems, visual patterns
- `wiki/tools/` — tools and workflows
- `wiki/inspiration/` — projects, ideas, concepts
- `wiki/comparisons/` — "X vs Y" analysis pages
- `wiki/sources/` — one-page summaries of each ingested raw source
- `wiki/index.md` — master catalog (one-line per page) — **for humans**
- `wiki/pageindex.json` — LLM search index (tags, summary, related per page) — **for Claude**, rebuilt automatically
- `wiki/overview.md` — high-level synthesis of the entire knowledge base
- `wiki/log.md` — chronological, append-only activity log

**Rules:**
- Claude owns this layer — creates, updates, and cross-references pages
- Every page must have proper frontmatter (see below) — including non-empty `tags:` (mandatory; the search index depends on it)
- Every new/updated page must be reflected in `wiki/index.md` AND `wiki/pageindex.json` (the agent rebuilds the JSON index after every write)
- Every session that modifies the wiki must append to `wiki/log.md`
- Use `[[wikilinks]]` for all cross-references between pages — Obsidian's graph view renders these automatically

### Layer 3: Outputs (`outputs/`) — Generated Artifacts
- Slide decks, summaries, compiled guides generated from wiki content

## Page Frontmatter Standard

Every wiki page MUST have this frontmatter:

---
title: Page Title
type: concept | entity | source-summary | comparison | inspiration
domain: dev | design | tools | inspiration | general
tags:
  - relevant-tag        # MANDATORY — non-empty. The pageindex.json search relies on tags.
sources:
  - "[[source-page]]" or URL
related:
  - "[[related-page]]"  # cross-references; Obsidian graph view + pageindex.json both consume this
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: high | medium | low
---

**Why tags are mandatory:** They're the strongest match signal for `fetch` mode. A page without tags can only be found by title substring, which fails the moment you search with a synonym. `maintain` mode flags any page with empty tags. See [04 — Page Index](04-PAGEINDEX.md) for the full picture.

### Confidence Levels

- `high` — well-tested, used in production, strongly held opinion
- `medium` — reasonable belief, some experience, open to revision
- `low` — early impression, heard about it, needs more research

## Naming Conventions

- Page filenames: `kebab-case.md` (e.g., `jwt-authentication.md`)
- Raw filenames: `YYYY-MM-DD-descriptive-name.md`
- No spaces in filenames

## Important Rules

- Never modify `raw/` files
- Always update `index.md` when creating new pages
- Always append to `log.md` when making changes
- Always use `[[wikilinks]]` for cross-references
- When updating a page, update the `updated:` date in frontmatter
- When a belief changes, note the evolution — don't silently overwrite
- Prefer updating existing pages over creating new ones for the same topic
```

## Why Each Section Matters

### Frontmatter → Bases Queries

Every frontmatter field becomes a queryable column in Obsidian Bases:

| Field | What Bases Can Do With It |
|---|---|
| `type` | Filter: show only concept pages, or only comparisons |
| `domain` | Group: see all dev knowledge vs all design knowledge |
| `confidence` | Filter: find low-confidence pages that need research |
| `updated` | Sort: find stale pages, see recent activity |
| `tags` | Filter: find everything related to "auth" or "react" |

### Wikilinks → Graph Navigation

Every `[[wikilink]]` creates an edge in Obsidian's built-in graph view AND populates the `related[]` neighbors that Claude uses for hop-1 lookups in `fetch` mode. More links = richer graph = better navigation. No separate canvas/graph file is needed — Obsidian renders the graph from wikilinks automatically.

### Log → Audit Trail

The `wiki/log.md` is append-only — it tracks what changed and when. Combined with git history, you have full traceability.

## Customizing the Schema

The schema above is a starting point. Adapt it to your needs:

**Add domains:** If you work in data science, add `wiki/data/` and update the schema. If you track books, add `wiki/reading/`.

**Add frontmatter fields:** Need to track which project inspired a learning? Add `origin_project:` (but keep it generalized — no client names).

**Change confidence levels:** Some people prefer numeric (1-5) over categorical (high/medium/low). Pick what you'll actually use.

The key constraint: whatever you change, update the `CLAUDE.md` schema so Claude knows the new conventions.

## Connecting to Claude Code

For Claude to read your vault at the start of every project, add this to your **global** `~/.claude/CLAUDE.md`:

```markdown
## Local Brain — Shared Knowledge Base

I maintain a personal Obsidian vault at ~/Projects/obsidian_notes/your-vault-name/
that stores generalized developer knowledge, design preferences, tool workflows,
and inspiration across all projects.

**"Learn from this" / "Update my brain"** — When I say these phrases:
1. Distill the conversation into generalized, reusable learnings
2. Strip ALL project-specific details: no client names, file paths, API keys
3. Invoke the `local-brain` agent in `learn` mode, passing the distilled learnings

Agent definition: ~/.claude/agents/local-brain.md
```

This ensures every Claude session in every project knows about your brain and how to update it.

---

**Next:** [04 — Page Index](04-PAGEINDEX.md)
