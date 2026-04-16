# Obsidian Canvas Skill

A reference skill that teaches Claude how to correctly create and edit Obsidian Canvas (`.canvas`) JSON files. Covers the full JSON Canvas 1.0 spec, node positioning rules to prevent overlapping, color conventions, edge label standards, and layout algorithms.

## What This Does

Canvas files are JSON that Obsidian renders as visual whiteboards with cards, connections, and groups. This skill ensures Claude produces canvas files that:

- Don't have overlapping nodes
- Use proper spacing (especially for labeled edges)
- Follow color conventions for confidence levels and domains
- Use standardized edge labels for typed relationships
- Prefer vertical flow so labels render cleanly

## Context

This skill is used by the **[Local Brain Agent](../../agents/local-brain/)** to create and maintain knowledge graph canvases in an Obsidian vault. It can also be invoked standalone whenever Claude needs to work with `.canvas` files.

**For the full picture** — how canvas graphs fit into the knowledge base system, how Claude navigates them, and why they exist — read the **[Local Brain Guide](../../local-brain-guide/)**, specifically [04 — Canvas Graphs](../../local-brain-guide/04-CANVAS-GRAPHS.md).

## Install

```bash
cp -r skills/obsidian-canvas ~/.claude/skills/obsidian-canvas
```

No additional setup needed — Claude automatically uses the skill when working with `.canvas` files.

## What's Inside

`SKILL.md` contains:

| Section | What It Covers |
|---|---|
| JSON Structure | The spec — nodes array, edges array |
| Node Types | text, file, link, group — properties and sizes |
| Edges | Connections, arrow direction, labels, sides |
| Positioning & Layout | Spacing rules, grid alignment, vertical flow preference |
| Color System | Preset colors, confidence levels, domain groups |
| Edge Label Standards | Standard relationship types (depends on, alternative to, etc.) |
| Validation Checklist | Pre-write checks to catch issues |
| Examples | 3 complete working canvas JSON examples |
