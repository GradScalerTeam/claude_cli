---
name: obsidian-canvas
description: "Reference skill for creating and editing Obsidian Canvas (.canvas) JSON files. Use this skill whenever you need to create a canvas, edit a canvas, add nodes or edges to a canvas, build a knowledge graph canvas, or generate any .canvas file for an Obsidian vault. Also use when the local-brain agent needs to create or update domain graph canvases (dev-graph.canvas, design-graph.canvas, etc.). Trigger on: 'create a canvas', 'update the canvas', 'add to the graph', 'build a knowledge graph', 'make a mind map', any mention of .canvas files, or when working with the cortex wiki's graph layer."
---

# Obsidian Canvas — JSON Canvas 1.0 Reference

You are creating or editing Obsidian Canvas files (`.canvas`). These are plain JSON files that Obsidian renders as infinite spatial whiteboards with cards, connections, and groups. Getting the JSON right is important — but getting the **layout right** is what makes it actually usable in Obsidian.

This skill covers the spec, positioning rules, and conventions. Read the section you need — you don't have to load everything every time.

---

## Table of Contents

1. [JSON Structure](#json-structure) — The spec
2. [Node Types](#node-types) — text, file, link, group
3. [Edges](#edges) — Connections between nodes
4. [Positioning & Layout](#positioning--layout) — How to place nodes so nothing overlaps
5. [Color System](#color-system) — What colors mean
6. [Edge Label Standards](#edge-label-standards) — Typed relationships
7. [ID Generation](#id-generation)
8. [Validation Checklist](#validation-checklist) — Run before writing
9. [Cortex Wiki Conventions](#cortex-wiki-conventions) — Domain canvases
10. [Examples](#examples) — Complete working canvases

---

## JSON Structure

Every `.canvas` file has this shape:

```json
{
  "nodes": [],
  "edges": []
}
```

Both arrays are optional (an empty canvas is `{}`), but in practice you'll always have nodes. The array order matters for z-index — first item is bottom, last is top.

---

## Node Types

All nodes share these base properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique 16-char lowercase hex |
| `type` | string | Yes | `text`, `file`, `link`, or `group` |
| `x` | integer | Yes | X position in pixels (can be negative) |
| `y` | integer | Yes | Y position in pixels (can be negative) |
| `width` | integer | Yes | Width in pixels |
| `height` | integer | Yes | Height in pixels |
| `color` | string | No | Preset `"1"`–`"6"` or `"#RRGGBB"` |

### Text Node

A standalone markdown card that lives only within the canvas.

```json
{
  "id": "a1b2c3d4e5f6a7b8",
  "type": "text",
  "text": "This supports **markdown** and [[wikilinks]]",
  "x": 0, "y": 0,
  "width": 250, "height": 60
}
```

| Extra Property | Type | Required |
|---------------|------|----------|
| `text` | string | Yes — markdown content |

**Standard size:** 250×60 for short text, 300×120 for paragraph-length.

### File Node

Embeds an existing file from the vault. Obsidian renders a live preview.

```json
{
  "id": "b2c3d4e5f6a7b8c9",
  "type": "file",
  "file": "wiki/dev/jwt-authentication.md",
  "x": 300, "y": 0,
  "width": 400, "height": 300
}
```

| Extra Property | Type | Required | Description |
|---------------|------|----------|-------------|
| `file` | string | Yes | Path relative to vault root |
| `subpath` | string | No | `#heading` or `#^block-id` |

**Standard size:** 400×300 for wiki pages, 400×400 for long documents.

The `file` path must point to an actual file in the vault — the [Validation Checklist](#validation-checklist) catches dead references.

### Link Node

Embeds a live webpage via URL.

```json
{
  "id": "c3d4e5f6a7b8c9d0",
  "type": "link",
  "url": "https://example.com",
  "x": 0, "y": 400,
  "width": 400, "height": 300
}
```

| Extra Property | Type | Required |
|---------------|------|----------|
| `url` | string | Yes |

### Group Node

A colored container that visually groups other nodes. Nodes are "inside" a group when their x,y falls within the group's bounding box.

```json
{
  "id": "d4e5f6a7b8c9d0e1",
  "type": "group",
  "label": "Authentication",
  "x": -80, "y": -80,
  "width": 760, "height": 460,
  "color": "4"
}
```

| Extra Property | Type | Required | Description |
|---------------|------|----------|-------------|
| `label` | string | No | Group title shown in Obsidian |
| `background` | string | No | Path to background image |
| `backgroundStyle` | string | No | `cover`, `ratio`, or `repeat` |

**Sizing rule:** A group must be large enough to contain all its child nodes. Calculate from child positions + padding (see [Positioning](#positioning--layout)).

**Z-index:** Groups must appear **before** their child nodes in the `nodes` array so children render on top.

---

## Edges

Edges are connections (arrows/lines) between nodes.

```json
{
  "id": "e5f6a7b8c9d0e1f2",
  "fromNode": "a1b2c3d4e5f6a7b8",
  "toNode": "b2c3d4e5f6a7b8c9",
  "fromSide": "right",
  "toSide": "left",
  "toEnd": "arrow",
  "label": "depends on"
}
```

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | string | Yes | — | Unique 16-char hex |
| `fromNode` | string | Yes | — | Source node ID |
| `toNode` | string | Yes | — | Target node ID |
| `fromSide` | string | No | auto | `top`, `right`, `bottom`, `left` |
| `toSide` | string | No | auto | `top`, `right`, `bottom`, `left` |
| `fromEnd` | string | No | `"none"` | `"none"` or `"arrow"` |
| `toEnd` | string | No | `"arrow"` | `"none"` or `"arrow"` |
| `color` | string | No | — | Preset `"1"`–`"6"` or hex |
| `label` | string | No | — | Text shown on the connection |

### Arrow Direction

- **One-way (default):** Arrow points from → to. `fromEnd: "none"`, `toEnd: "arrow"`.
- **Bidirectional:** Arrows on both ends. Set `"fromEnd": "arrow"`.
- **No arrows:** Set `"toEnd": "none"` (line only, no arrowheads).

### Side Selection

Choose `fromSide`/`toSide` based on spatial position to keep lines clean:
- Nodes to the **right** → connect `fromSide: "right"` to `toSide: "left"`
- Nodes **below** → connect `fromSide: "bottom"` to `toSide: "top"`
- When omitted, Obsidian auto-routes (usually fine for simple layouts)

---

## Positioning & Layout

This section prevents overlapping nodes. Canvas coordinates use pixels where (0,0) is the center of the viewport. Negative values go up and left.

### Fundamental Rules

1. **Snap to 20px grid** — All x, y, width, height values should be multiples of 20
2. **Prefer vertical flow for labeled edges** — Edge labels render as horizontal text (left to right). On a vertical edge (top→bottom), the label sits cleanly beside the line with no overlap. On a horizontal edge (left→right), the label competes for space between nodes and easily overlaps. **Default to arranging connected nodes vertically when edges have labels.** Use horizontal only when there's plenty of space (160px+ gap) or the edge has no label.
3. **Minimum gap between nodes:**
   - **No edge or unlabeled edge:** 40px minimum
   - **Labeled horizontal edge:** 160px minimum — the label text needs room between nodes
   - **Labeled vertical edge:** 80px minimum — labels sit beside the line and need less space
4. **Read before writing** — When adding to an existing canvas, read current node positions first and calculate where to place new nodes without overlapping

### Standard Node Sizes

| Node Type | Width | Height | Use Case |
|-----------|-------|--------|----------|
| Text (short) | 260 | 60 | Labels, short notes |
| Text (paragraph) | 300 | 120 | Longer descriptions |
| File embed | 400 | 300 | Wiki pages, documents |
| File embed (large) | 400 | 400 | Long documents |
| Link embed | 400 | 300 | Webpages |
| Group (small) | 600 | 400 | 2-3 nodes inside |
| Group (medium) | 900 | 500 | 4-6 nodes inside |
| Group (large) | 1200 | 600 | 7+ nodes inside |

### Layout Patterns

#### Horizontal Flow
Nodes placed left to right at the same y-level. Good for sequences and timelines.

```
Without labeled edges: 300px on x-axis (260px node + 40px gap)
With labeled edges:    420px on x-axis (260px node + 160px gap)

Same y for all nodes in a row.
Rows spaced 200px apart on y-axis (with labels) or 120px (without).

Example positions for 260×80 text nodes WITH labeled edges:
  Row 1: (0, 0), (420, 0), (840, 0)
  Row 2: (0, 280), (420, 280), (840, 280)
```

#### Vertical Flow
Nodes stacked top to bottom. Good for hierarchies and dependencies.

```
Without labeled edges: 120px on y-axis (60px node + 60px gap)
With labeled edges:    240px on y-axis (80px node + 160px gap)

Same x for all nodes in a column.

Example positions for 260×80 text nodes WITH labeled edges:
  Column 1: (0, 0), (0, 240), (0, 480)
  Column 2: (420, 0), (420, 240), (420, 480)
```

#### Cluster Layout (with Groups)
Group node acts as a container. Child nodes are placed inside with padding.

```
Group padding: 80px on all sides (top needs 100px to clear the group label)

To calculate group bounds from children:
  group.x = min(child.x) - 80
  group.y = min(child.y) - 100   (extra 20px for label)
  group.width = max(child.x + child.width) - group.x + 80
  group.height = max(child.y + child.height) - group.y + 80

Example: Two 260×80 nodes at (0,0) and (420,0) inside a group:
  Group: x=-80, y=-100, width=840, height=260
  Node 1: x=0, y=0
  Node 2: x=420, y=0
```

#### Radial Layout
Central node with related nodes arranged in a circle. Good for showing a concept's relationships.

```
Center node at (0, 0)
Related nodes at radius 400px, evenly spaced by angle.

For N related nodes, each at angle = (360/N) * i degrees:
  x = centerX + radius * cos(angle) - nodeWidth/2
  y = centerY + radius * sin(angle) - nodeHeight/2

Round to nearest 20px grid point.
```

### Adding Nodes to an Existing Canvas

When modifying an existing canvas:

1. Read the file and parse all node positions
2. Calculate the bounding box of all existing nodes:
   ```
   minX = min(node.x for all nodes)
   maxX = max(node.x + node.width for all nodes)
   minY = min(node.y for all nodes)
   maxY = max(node.y + node.height for all nodes)
   ```
3. Place new nodes outside this bounding box + 80px gap
4. Preferred placement: below existing content (y = maxY + 80) or to the right (x = maxX + 80)
5. If adding a node that logically belongs near an existing node, place it adjacent with 40px gap and verify no overlap with other nodes

---

## Color System

### Preset Colors

| Preset | Color | Hex |
|--------|-------|-----|
| `"1"` | Red | #fb464c |
| `"2"` | Orange | #e9973f |
| `"3"` | Yellow | #e0de71 |
| `"4"` | Green | #44cf6e |
| `"5"` | Cyan | #53dfdd |
| `"6"` | Purple | #a882ff |

### Cortex Knowledge Base Color Conventions

**Node colors (confidence level):**
| Color | Meaning |
|-------|---------|
| `"4"` green | High confidence — battle-tested, strong opinion |
| `"3"` yellow | Medium confidence — reasonable belief, open to revision |
| `"1"` red | Low confidence or outdated — needs attention |
| No color | Default — neutral, no confidence signal |

**Group colors (domain):**
| Color | Domain |
|-------|--------|
| `"4"` green | Dev — developer knowledge |
| `"6"` purple | Design — UI/UX, visual patterns |
| `"5"` cyan | Tools — workflows, CLI, infrastructure |
| `"3"` yellow | Inspiration — projects, ideas, concepts |

**Edge colors:**
| Color | Meaning |
|-------|---------|
| `"1"` red | Contradicts or deprecated relationship |
| `"4"` green | Preferred / recommended path |
| `"5"` cyan | Informational — neutral relationship |
| No color | Default — standard relationship |

---

## Edge Label Standards

Use these standardized labels for typed relationships. Consistency matters — the local-brain agent and LLM navigation depend on predictable labels.

| Label | Direction | Arrow Config | Description |
|-------|-----------|-------------|-------------|
| `"alternative to"` | Bidirectional | `fromEnd: "arrow"` | Either could be chosen |
| `"depends on"` | One-way | default | Source requires target |
| `"extends"` | One-way | default | Source builds on target |
| `"used with"` | Bidirectional | `fromEnd: "arrow"` | Commonly paired together |
| `"contradicts"` | Bidirectional | `fromEnd: "arrow"`, `color: "1"` | Conflicting approaches |
| `"supersedes"` | One-way | default | Source replaces target |
| `"inspired by"` | One-way | default | Source drew from target |
| `"part of"` | One-way | default | Source is a component of target |

You can use other labels when these don't fit, but prefer these when they apply — they're the vocabulary the knowledge graph is built on.

---

## ID Generation

IDs are 16-character lowercase hexadecimal strings. Generate them randomly and verify uniqueness within the canvas file.

```
Good: "a1b2c3d4e5f6a7b8", "0f9e8d7c6b5a4938"
Bad:  "node1", "my-node", "A1B2C3D4" (uppercase)
```

When adding to an existing canvas, collect all existing IDs first and ensure no collisions.

---

## Validation Checklist

Run through this before writing any `.canvas` file:

- [ ] **No overlapping nodes** — For every pair of nodes, verify bounding boxes don't intersect:
  ```
  Overlap if: nodeA.x < nodeB.x + nodeB.width
           && nodeA.x + nodeA.width > nodeB.x
           && nodeA.y < nodeB.y + nodeB.height
           && nodeA.y + nodeA.height > nodeB.y
  ```
- [ ] **All edge references valid** — Every `fromNode` and `toNode` matches an existing node `id`
- [ ] **File nodes point to real files** — Every `file` path resolves to an actual file in the vault
- [ ] **Groups contain their children** — Child nodes' bounding boxes fall within the group's bounds
- [ ] **Groups appear before children** in the `nodes` array (z-index ordering)
- [ ] **No duplicate IDs** — All `id` values across nodes and edges are unique
- [ ] **Grid-aligned** — All positions and sizes are multiples of 20
- [ ] **Valid JSON** — Parse the output before writing to verify structure

---

## Knowledge Base Conventions

Your Obsidian vault uses domain-specific canvases (see the [Local Brain Guide](https://github.com/GradScalerTeam/claude_cli/tree/main/local-brain-guide) for full setup):

| Canvas File | Domain | Group Color | Contains |
|-------------|--------|-------------|----------|
| `dev-graph.canvas` | Developer knowledge | `"4"` green | wiki/dev/ pages |
| `design-graph.canvas` | UI/UX design | `"6"` purple | wiki/design/ pages |
| `tools-graph.canvas` | Tools & workflows | `"5"` cyan | wiki/tools/ pages |
| `inspiration-graph.canvas` | Ideas & projects | `"3"` yellow | wiki/inspiration/ pages |

Each canvas lives at the vault root (alongside `wiki/`, `raw/`, etc.).

When adding a wiki page to a domain canvas:
1. Create a file node pointing to the wiki page
2. Set node color based on the page's `confidence` frontmatter
3. Create edges to related pages (check the page's `related:` frontmatter)
4. Use appropriate edge labels and direction
5. Place the node near its most-related existing node, or in a new area if it's a new cluster

---

## Examples

### Example 1: Simple Two-Node Canvas with Connection

Two concepts with a one-way dependency:

```json
{
  "nodes": [
    {
      "id": "a1b2c3d4e5f6a7b8",
      "type": "file",
      "file": "wiki/dev/jwt-authentication.md",
      "x": 0, "y": 0,
      "width": 400, "height": 300,
      "color": "4"
    },
    {
      "id": "b2c3d4e5f6a7b8c9",
      "type": "file",
      "file": "wiki/dev/httponly-cookies.md",
      "x": 480, "y": 0,
      "width": 400, "height": 300,
      "color": "4"
    }
  ],
  "edges": [
    {
      "id": "f6a7b8c9d0e1f2a3",
      "fromNode": "a1b2c3d4e5f6a7b8",
      "fromSide": "right",
      "toNode": "b2c3d4e5f6a7b8c9",
      "toSide": "left",
      "label": "depends on"
    }
  ]
}
```

### Example 2: Grouped Cluster with Bidirectional Edges

A dev domain group containing three related concepts:

```json
{
  "nodes": [
    {
      "id": "1000000000000001",
      "type": "group",
      "label": "State Management",
      "x": -60, "y": -80,
      "width": 980, "height": 460,
      "color": "4"
    },
    {
      "id": "1000000000000002",
      "type": "file",
      "file": "wiki/dev/redux-toolkit.md",
      "x": 0, "y": 0,
      "width": 400, "height": 300,
      "color": "4"
    },
    {
      "id": "1000000000000003",
      "type": "file",
      "file": "wiki/dev/zustand.md",
      "x": 480, "y": 0,
      "width": 400, "height": 300,
      "color": "3"
    },
    {
      "id": "1000000000000004",
      "type": "text",
      "text": "**Decision:** Use RTK for complex apps with lots of middleware. Zustand for simpler cases.",
      "x": 0, "y": 340,
      "width": 880, "height": 60
    }
  ],
  "edges": [
    {
      "id": "2000000000000001",
      "fromNode": "1000000000000002",
      "fromSide": "right",
      "toNode": "1000000000000003",
      "toSide": "left",
      "fromEnd": "arrow",
      "label": "alternative to"
    }
  ]
}
```

### Example 3: Multi-Domain Canvas with Cross-References

Nodes from different domains connected across groups:

```json
{
  "nodes": [
    {
      "id": "3000000000000001",
      "type": "group",
      "label": "Dev",
      "x": -60, "y": -80,
      "width": 520, "height": 460,
      "color": "4"
    },
    {
      "id": "3000000000000002",
      "type": "file",
      "file": "wiki/dev/component-architecture.md",
      "x": 0, "y": 0,
      "width": 400, "height": 300,
      "color": "4"
    },
    {
      "id": "3000000000000003",
      "type": "group",
      "label": "Design",
      "x": 560, "y": -80,
      "width": 520, "height": 460,
      "color": "6"
    },
    {
      "id": "3000000000000004",
      "type": "file",
      "file": "wiki/design/glassmorphism.md",
      "x": 620, "y": 0,
      "width": 400, "height": 300,
      "color": "3"
    }
  ],
  "edges": [
    {
      "id": "4000000000000001",
      "fromNode": "3000000000000002",
      "fromSide": "right",
      "toNode": "3000000000000004",
      "toSide": "left",
      "fromEnd": "arrow",
      "label": "used with",
      "color": "5"
    }
  ]
}
```
