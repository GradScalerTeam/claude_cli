# Obsidian Canvas Skill

A reference skill that teaches Claude how to correctly create and edit Obsidian Canvas (`.canvas`) JSON files. Covers the full JSON Canvas 1.0 spec, node positioning rules to prevent overlapping, color conventions, edge label standards, layout algorithms, and a Post-Write Verification Protocol.

## What This Does

Canvas files are JSON that Obsidian renders as visual whiteboards with cards, connections, and groups. This skill ensures Claude produces canvas files that:

- Don't have overlapping nodes
- Use proper spacing (especially for labeled edges)
- Follow consistent color conventions for status / domain / relationship type
- Use standardized edge labels for typed relationships
- Prefer vertical flow so labels render cleanly

## When To Use It

Whenever you need to present something **visually on a canvas** — the skill is general-purpose, not tied to any single workflow:

- Mind maps and brainstorm boards
- Project planning layouts and sprint boards
- Architecture sketches and system diagrams
- Onboarding diagrams for new team members
- Flowcharts and decision trees
- Knowledge graphs (manually curated, for a specific topic — the [local-brain agent](../../agents/local-brain/) does **not** use canvas files for its main knowledge graph; it uses Obsidian's built-in graph view powered by wikilinks and `related:` frontmatter)
- Feature-plan boards that span multiple workstreams

## Install

Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the obsidian-canvas skill:

Copy skills/obsidian-canvas/SKILL.md to ~/.claude/skills/obsidian-canvas/SKILL.md with exact content. Exclude README.md. Create ~/.claude/skills/obsidian-canvas/ if it doesn't exist.

After installing, give me a summary of what this skill does and when it triggers.
```

Then quit your Claude CLI session and start a new one — skills only load at session startup.

No further setup needed. Claude uses the skill automatically when working with `.canvas` files or when you ask for a mind map, flowchart, or planning board.

## Check for Updates

Already installed and want the latest version? Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and check for updates to the obsidian-canvas skill:

Compare skills/obsidian-canvas/SKILL.md with my local version at ~/.claude/skills/obsidian-canvas/SKILL.md. Tell me what changed. If there are updates, ask me whether I want you to explain the changes first or pull them straight into my local file.
```

## What's Inside

`SKILL.md` contains:

| Section | What It Covers |
|---|---|
| JSON Structure | The spec — nodes array, edges array |
| Node Types | text, file, link, group — properties and standard sizes |
| Edges | Connections, arrow direction, labels, sides |
| Positioning & Layout | Spacing rules, grid alignment, vertical flow preference, layout patterns |
| Color System | Preset colors and suggested semantic conventions (confidence/status/domain) |
| Edge Label Standards | Standard relationship types (depends on, alternative to, etc.) |
| Post-Write Verification Protocol | Mandatory structural, spatial, and semantic checks after every write |
| Examples | 3 complete working canvas JSON examples |
