---
name: obsidian-canvas
description: "Reference skill for creating and editing Obsidian Canvas (.canvas) JSON files — the JSON 1.0 spec, node/edge shapes, positioning rules, color conventions, and Post-Write Verification Protocol. Use this skill whenever you need to present something visually on a canvas: mind maps, brainstorm boards, project planning layouts, onboarding diagrams, architecture sketches, flowcharts, knowledge graphs, feature-plan boards, decision trees, any spatial layout. Trigger on: 'create a canvas', 'make a mind map', 'build a graph', 'draw this as a canvas', 'flowchart this', 'brainstorm board', 'plan this visually', any mention of .canvas files."
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
8. [Post-Write Verification Protocol](#post-write-verification-protocol) — MANDATORY after every canvas write
9. [Examples](#examples) — Complete working canvases

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

Adding nodes is NOT "find empty space and dump." New content may require reorganizing the entire layout. Treat every canvas write as a full layout pass.

**Step 1 — Read and understand the current layout:**
1. Read the file and parse all node positions, sizes, group memberships, and edges
2. Map which nodes are inside which groups (by bounding box containment)
3. Note which edges have labels and their current routing (fromSide/toSide)

**Step 2 — Plan the new layout holistically:**
1. Determine where new nodes logically belong (which group, near which existing nodes)
2. Check if existing nodes need to move to accommodate the new ones cleanly
3. Check if groups need to be resized — groups should fit their children tightly (80px padding on sides, 100px on top for label), not leave large empty areas
4. Check if any nodes should move OUT of a group (e.g., a shared/contextual page that multiple groups reference should float outside groups, not be trapped inside one)
5. Consider edge label space — if adding new edges with labels, ensure there's room for the labels to render without clipping (see Edge Label Space Rules below)

**Step 3 — Write the full canvas:**
When changes affect layout significantly (adding 3+ nodes, adding a new group, or restructuring), rewrite the entire canvas rather than surgically inserting. This prevents accumulated layout drift.

**Step 4 — Post-write verification (MANDATORY):**
After writing the canvas, run the full [Post-Write Verification Protocol](#post-write-verification-protocol). If any check fails, fix and rewrite.

### Edge Label Space Rules

Edge labels are the most common source of visual clutter. Follow these rules:

**Horizontal edges (left→right):**
- Minimum gap between connected nodes: `max(160px, labelLength * 9px)`
- A 10-character label like "depends on" needs ~90px, so 160px minimum gap works
- A 20-character label needs ~180px gap — increase spacing accordingly

**Vertical edges (top→bottom):**
- Labels sit beside the vertical line, so they need less gap: 100px minimum
- But if multiple vertical edges emerge from the same node's bottom side, spread the target nodes horizontally so labels don't stack on top of each other

**Multiple edges from one side:**
- If 3+ edges leave from the same node side (e.g., hub node with "bottom" edges to 3 children), the children MUST be spread out enough that the edge lines diverge visibly
- Fan-out rule: children connected from the same parent side should span at least `(childCount - 1) * 480px` horizontally

**Label truncation prevention:**
- Obsidian truncates labels when edges are too short or nodes are too close
- Always verify: would a human reading this canvas see the full label text?

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

### Suggested Semantic Color Conventions

These conventions aren't mandatory — they're a sensible default for canvases where nodes/edges carry semantic weight (knowledge maps, planning boards, decision trees). Pick something consistent per canvas.

**Node colors by confidence or status:**
| Color | Meaning |
|-------|---------|
| `"4"` green | High confidence / done / validated |
| `"3"` yellow | Medium / in progress / open to revision |
| `"1"` red | Low confidence / blocked / needs attention |
| No color | Neutral — no status signal |

**Group colors by domain** (pick any scheme; keep it consistent across the canvas):
| Color | Example Use |
|-------|--------|
| `"4"` green | Engineering / code / dev topics |
| `"6"` purple | Design / UI / visual |
| `"5"` cyan | Tools / infrastructure / ops |
| `"3"` yellow | Ideas / inspiration / exploratory |
| `"2"` orange | Provenance / sources / references |

**Edge colors:**
| Color | Meaning |
|-------|---------|
| `"1"` red | Contradicts or deprecated relationship |
| `"4"` green | Preferred / recommended path |
| `"5"` cyan | Informational / cross-group neutral relationship |
| No color | Standard relationship |

---

## Edge Label Standards

Use these standardized labels for typed relationships. Consistency matters across a single canvas — predictable labels make the canvas readable months later.

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

You can use other labels when these don't fit, but prefer these when they apply — they're a shared vocabulary for relationship-style canvases.

---

## ID Generation

IDs are 16-character lowercase hexadecimal strings. Generate them randomly and verify uniqueness within the canvas file.

```
Good: "a1b2c3d4e5f6a7b8", "0f9e8d7c6b5a4938"
Bad:  "node1", "my-node", "A1B2C3D4" (uppercase)
```

When adding to an existing canvas, collect all existing IDs first and ensure no collisions.

---

## Post-Write Verification Protocol

This is MANDATORY after every canvas write. Re-read the canvas you just wrote and verify every check. If any check fails, fix the canvas and rewrite — do not leave a broken layout.

### Structural Checks

- [ ] **Valid JSON** — Parse the output to verify structure
- [ ] **No duplicate IDs** — All `id` values across nodes and edges are unique
- [ ] **All edge references valid** — Every `fromNode` and `toNode` matches an existing node `id`
- [ ] **File nodes point to real files** — Every `file` path resolves to an actual file in the vault
- [ ] **Groups appear before children** in the `nodes` array (z-index ordering)
- [ ] **Grid-aligned** — All positions and sizes are multiples of 20

### Spatial Checks

- [ ] **No overlapping nodes** — For every pair of non-group nodes, verify bounding boxes don't intersect:
  ```
  Overlap if: nodeA.x < nodeB.x + nodeB.width
           && nodeA.x + nodeA.width > nodeB.x
           && nodeA.y < nodeB.y + nodeB.height
           && nodeA.y + nodeA.height > nodeB.y
  ```
- [ ] **Groups contain their children** — Every child node's bounding box falls within the parent group's bounds
- [ ] **Groups are tight** — No group has more than 120px of empty padding beyond its outermost child on any side. Oversized groups waste space and look broken.
- [ ] **Minimum gaps respected** — Adjacent nodes have at least 40px gap (unlabeled edges) or 160px gap (labeled horizontal edges) or 100px gap (labeled vertical edges)

### Edge Label Checks

- [ ] **Labels have room** — For every labeled edge, verify:
  - Horizontal edges: gap between connected nodes >= `max(160px, labelLength * 9px)`
  - Vertical edges: gap between connected nodes >= 100px
- [ ] **No label stacking** — If multiple labeled edges leave from the same node side, the target nodes are spread enough that labels don't overlap (fan-out rule: `(edgeCount - 1) * 480px` horizontal spread)
- [ ] **Edge sides match spatial position** — Nodes to the right connect via `fromSide: "right"` → `toSide: "left"`. Nodes below connect via `fromSide: "bottom"` → `toSide: "top"`. Wrong sides cause edges to loop around nodes awkwardly.

### Semantic Checks

- [ ] **Shared pages float outside groups** — If a page is referenced by nodes in multiple groups (via edges), it should NOT be trapped inside one group. Place it between or outside the groups it connects.
- [ ] **Hub nodes are prominent** — The core concept page for a topic cluster should be positioned at the top or center of its group, not buried among detail pages.

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

### Example 3: Domain Groups with a Cross-Domain Edge

A canvas with two domain groups and a labeled edge between members of different groups — useful for architecture sketches, mind maps that span categories, or planning boards that cross teams:

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
