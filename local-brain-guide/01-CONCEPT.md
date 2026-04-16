# 1. The Concept — Compilation Over Retrieval

## Where This Came From

In April 2026, [Andrej Karpathy](https://x.com/karpathy) posted about shifting from using LLMs for code to using them for **knowledge management**. His key insight:

> "The shift is from retrieval to compilation."

He released an [idea file](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (not code — just the pattern) describing how to build a personal wiki maintained by an LLM. The idea went viral — 16M+ views, 5,000+ stars.

## Why Not Just Use RAG?

RAG (Retrieval-Augmented Generation) is stateless:

1. You upload documents
2. At query time, the LLM retrieves relevant chunks
3. It generates an answer
4. Everything resets — no accumulation

The problem: **the LLM rediscovers knowledge from scratch on every question.** If answering your question requires synthesizing across 5 documents, it has to find and piece together fragments every single time.

## What "Compilation" Means

Instead of retrieving and re-deriving answers each time, the LLM **compiles** knowledge once into a structured wiki:

| RAG | Compiled Wiki |
|---|---|
| Processes at query time | Processes at ingest time |
| Cross-references discovered ad-hoc | Cross-references pre-built |
| Contradictions often missed | Contradictions flagged during ingest |
| No accumulation — resets per query | Compounds continuously |
| Data often in provider systems | Fully local on your machine |
| Ephemeral chat responses | Durable, versionable markdown |

When you add a new article to your wiki, the LLM doesn't just store it — it reads it, creates a summary, updates related concept pages, adds cross-references, and maintains an index. That's compilation.

## The Three-Layer Architecture

Every local brain has three layers:

### Layer 1: Raw Sources (Immutable)

```
raw/
├── articles/      ← web articles, blog posts
├── projects/      ← cool projects you discover
└── notes/         ← quick brain dumps
```

The LLM reads these but **never modifies** them. They're your permanent source of truth.

### Layer 2: The Wiki (LLM-Owned)

```
wiki/
├── dev/           ← developer knowledge
├── design/        ← UI/UX, visual patterns
├── tools/         ← tool workflows
├── inspiration/   ← ideas, projects
├── comparisons/   ← "X vs Y" decisions
├── sources/       ← summaries of ingested raw material
├── index.md       ← master routing table
├── overview.md    ← high-level synthesis
└── log.md         ← chronological activity log
```

The LLM **owns** this layer — creating pages, updating them, maintaining cross-references. You rarely edit it directly.

### Layer 3: The Schema (Configuration)

A `CLAUDE.md` file at the vault root that tells the LLM:
- How to structure pages (frontmatter template)
- Naming conventions
- When and how to update the index
- What to log
- Rules about what never to store (secrets, project-specific details)

## Why Obsidian?

Obsidian is optional — the LLM works with raw markdown files. But Obsidian adds value for the **human** side:

- **Graph view** — visually see how your knowledge connects
- **Backlinks** — see what pages link TO a page
- **Bases** — query your frontmatter like a database (filter by confidence, domain, date)
- **Canvas** — spatial workspace for visualizing relationships
- **Web Clipper** — save articles from browser directly to `raw/`
- **Zero lock-in** — it's just a folder of markdown files. Drop Obsidian anytime.

## The Canvas Innovation

Beyond Karpathy's original pattern, we add **knowledge graph canvases** — `.canvas` files that store typed relationships between concepts:

```json
{
  "nodes": [
    {"type": "file", "file": "wiki/dev/jwt-auth.md"},
    {"type": "file", "file": "wiki/dev/session-auth.md"}
  ],
  "edges": [
    {"fromNode": "...", "toNode": "...", "label": "alternative to", "fromEnd": "arrow"}
  ]
}
```

This gives the LLM a **graph-based index** alongside the flat `index.md`:
- `index.md` tells the LLM **what pages exist**
- Canvas tells the LLM **how they relate** ("alternative to", "depends on", "contradicts")

The LLM reads the canvas JSON to navigate relationships. You see the same data as a visual graph in Obsidian. Same file, two interfaces.

## Open-Source by Default

The local brain is designed to be shared. Everything stored must be:
- **Generalized** — patterns and preferences, not client-specific details
- **Secret-free** — no API keys, passwords, connection strings
- **Safe to publish** — nothing that identifies specific client engagements

This means your brain can be a public artifact — your accumulated developer knowledge, open for others to learn from.

---

**Next:** [02 — Setup Obsidian](02-SETUP-OBSIDIAN.md)
