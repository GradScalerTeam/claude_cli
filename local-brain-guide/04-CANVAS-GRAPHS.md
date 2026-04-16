# 4. Canvas Graphs — Visual Knowledge Navigation

This is the piece that goes beyond Karpathy's original pattern. Canvas files give your brain a **graph-based index** that both you and Claude can navigate — you visually, Claude as JSON.

## What Are Canvas Files?

Obsidian Canvas files (`.canvas`) are plain JSON following the [JSON Canvas 1.0 spec](https://jsoncanvas.org/). They store nodes (cards) and edges (connections) on an infinite spatial canvas.

```json
{
  "nodes": [
    {"id": "a1b2c3d4e5f6a7b8", "type": "file", "file": "wiki/dev/jwt-auth.md", "x": 0, "y": 0, "width": 400, "height": 300}
  ],
  "edges": [
    {"id": "b2c3d4e5f6a7b8c9", "fromNode": "...", "toNode": "...", "label": "depends on"}
  ]
}
```

**You** open this in Obsidian and see a visual graph — nodes, arrows, groups.
**Claude** reads the same file as JSON and traverses the graph programmatically.

Same data. Two interfaces.

## Why Canvas Alongside index.md?

| | `index.md` | Canvas Graph |
|---|---|---|
| Lists pages | Yes | Yes (file nodes) |
| One-line summaries | Yes | No |
| **Typed relationships** | No | **Yes — edge labels** |
| **Visual clusters** | No | **Yes — groups** |
| **Bidirectional links** | No | **Yes — arrow direction** |
| Token cost to read | ~500-2000 tokens | ~500-2000 tokens |

The index tells Claude **what exists**. The canvas tells Claude **how things connect**.

## Domain-Specific Canvases

Instead of one giant canvas, split by domain:

| Canvas File | Domain | Group Color |
|---|---|---|
| `dev-graph.canvas` | Developer knowledge | `"4"` (green) |
| `design-graph.canvas` | UI/UX design | `"6"` (purple) |
| `tools-graph.canvas` | Tools & workflows | `"5"` (cyan) |
| `inspiration-graph.canvas` | Ideas & projects | `"3"` (yellow) |

Each lives at the vault root (alongside `wiki/`, `raw/`).

## Edge Labels — Typed Relationships

Edges carry meaning through labels. Use these standard labels for consistency:

| Label | Direction | Meaning |
|---|---|---|
| `"alternative to"` | Bidirectional ◀──▶ | Either could be chosen |
| `"depends on"` | One-way ──▶ | Source requires target |
| `"extends"` | One-way ──▶ | Source builds on target |
| `"used with"` | Bidirectional ◀──▶ | Commonly paired together |
| `"contradicts"` | Bidirectional ◀──▶ | Conflicting approaches |
| `"supersedes"` | One-way ──▶ | Source replaces target |
| `"inspired by"` | One-way ──▶ | Source drew from target |
| `"part of"` | One-way ──▶ | Source is a component of target |

**Bidirectional** means `"fromEnd": "arrow"` in the JSON — arrows on both ends.

## Color Conventions

### Node Colors (Confidence)

| Color | Preset | Meaning |
|---|---|---|
| Green | `"4"` | High confidence — battle-tested |
| Yellow | `"3"` | Medium confidence — open to revision |
| Red | `"1"` | Low confidence or outdated |

### Edge Colors

| Color | Preset | Meaning |
|---|---|---|
| Red | `"1"` | Contradicts or deprecated |
| Green | `"4"` | Preferred / recommended path |
| Cyan | `"5"` | Informational — neutral |

## Layout Rules

The `obsidian-canvas` skill (included in this repo) teaches Claude these positioning rules. The key ones:

**Prefer vertical flow for labeled edges.** Edge labels render as horizontal text. On a vertical edge (top→bottom), the label sits cleanly beside the line. On a horizontal edge, labels overlap with nodes.

```
GOOD (vertical):          BAD (horizontal):

  [Auth]                  [Auth] ──used with──▶ [State]
    │                              ↑ label overlaps
    │ used with
    ▼
  [State]
```

**Minimum spacing:**
- Nodes with labeled edges between them: 160px horizontal, 80px vertical
- Nodes without labels: 40px minimum
- Groups: 80px padding on all sides, 100px on top (for the label)

**Grid alignment:** Snap all positions to 20px multiples.

## How Claude Navigates the Canvas

When you ask "what do I know about auth?", Claude:

1. Reads `wiki/index.md` — finds `jwt-authentication`, `session-auth`, `oauth-patterns`
2. Reads `dev-graph.canvas` — parses JSON, finds the auth node, follows edges:
   - `jwt-auth` ──▶ depends on ──▶ `httponly-cookies`
   - `jwt-auth` ◀──▶ alternative to ◀──▶ `session-auth`
   - `jwt-auth` ◀──▶ used with ◀──▶ `redux-toolkit`
3. Now knows the **relationship map** before reading a single wiki page
4. Reads only the pages it needs, informed by the graph

The canvas gives Claude the **map** in ~500 tokens. Without it, Claude reads the index (flat list), guesses which pages might be related, and reads more pages to discover connections.

## Example: A Real Dev Graph

```json
{
  "nodes": [
    {"id":"1000000000000001","type":"group","label":"Authentication","x":-80,"y":-100,"width":540,"height":560,"color":"4"},
    {"id":"1000000000000002","type":"file","file":"wiki/dev/jwt-authentication.md","x":0,"y":0,"width":260,"height":80,"color":"4"},
    {"id":"1000000000000003","type":"file","file":"wiki/dev/session-auth.md","x":0,"y":180,"width":260,"height":80,"color":"4"},
    {"id":"1000000000000004","type":"file","file":"wiki/dev/httponly-cookies.md","x":0,"y":360,"width":260,"height":80,"color":"4"}
  ],
  "edges": [
    {"id":"2000000000000001","fromNode":"1000000000000002","fromSide":"bottom","toNode":"1000000000000003","toSide":"top","fromEnd":"arrow","label":"alternative to"},
    {"id":"2000000000000002","fromNode":"1000000000000002","fromSide":"bottom","toNode":"1000000000000004","toSide":"top","label":"depends on"}
  ]
}
```

In Obsidian, this renders as a green "Authentication" group containing three stacked cards with labeled arrows. Claude reads the same JSON and knows JWT is an alternative to sessions and depends on httpOnly cookies.

## Installing the Canvas Skill

The `obsidian-canvas` skill teaches Claude the full JSON Canvas spec, positioning rules, and validation checklist. Install it:

```bash
# copy from this repo to your global skills
cp -r skills/obsidian-canvas ~/.claude/skills/obsidian-canvas
```

The `local-brain` agent automatically uses this skill when creating or updating canvases.

---

**Next:** [05 — Agent Modes](05-AGENT-MODES.md)
