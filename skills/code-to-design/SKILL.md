---
name: code-to-design
description: "Convert frontend code into pixel-accurate Pencil (.pen) design files. Use this skill when the user asks to 'design a page', 'create screens from code', 'convert UI to design', 'make a design file for this component', 'replicate this page in Pencil', 'code to design', or references any code-to-.pen workflow. Also trigger when the user mentions Pencil design files, .pen files, or wants to document existing UI as design screens. Works with any frontend framework (React, Vue, Svelte, HTML/CSS) and any CSS system (Tailwind, CSS modules, styled-components, vanilla CSS)."
---

# Code → Design: Frontend Code to Pencil Design Files

You are converting production frontend code into pixel-accurate Pencil `.pen` design files. The code is the source of truth — every color, spacing value, font, and layout decision must trace back to a real line of code.

This skill works with any frontend framework and CSS system. The process is the same regardless of stack.

---

## Prerequisites

### Pencil MCP Server

This skill requires the **Pencil MCP server** to be configured in your project. Pencil is a design tool accessed via Model Context Protocol (MCP) — it provides tools for creating and editing `.pen` design files programmatically.

If the Pencil MCP is not available, check the project's `.mcp.json` or ask the user to configure it. Without it, none of the design operations will work.

### Key Pencil MCP Tools

Always start by calling `get_editor_state(include_schema: true)` — this returns the current `.pen` file, existing frames, and the full schema for all node types.

| Tool | Purpose | When to use |
|------|---------|------------|
| `get_editor_state` | Get active file, selection, and schema | First call — always include schema on first use |
| `batch_get` | Read node properties by ID or search pattern | Before editing — understand existing structure |
| `batch_design` | Insert, copy, update, replace, move, delete nodes | All design operations (max 25 ops per call) |
| `get_screenshot` | Visual screenshot of a node | After building — visual verification |
| `snapshot_layout` | Get computed layout rectangles | Verify heights, check for overlaps |
| `set_variables` | Set design token variables | Token setup phase |
| `get_variables` | Read existing variables | Check what tokens already exist |
| `find_empty_space_on_canvas` | Find placement for new frames | Before creating new screens |
| `open_document` | Open a specific .pen file or create new | When switching files or starting fresh |

The Pencil MCP provides detailed operation syntax in the `batch_design` tool description. Read it carefully — operations like `I()` (insert), `C()` (copy), `U()` (update), `R()` (replace), `D()` (delete), `M()` (move), and `G()` (generate image) each have specific syntax requirements.

---

## Before Starting

### 1. Discover the project's design context

Check if the project has an existing approach doc or design conventions:
```
Glob: **/approach.md, **/design/*.pen, **/CLAUDE.md
```

If an `approach.md` exists, read it first — it contains project-specific patterns, known fixes, and naming conventions that override the generic process below. If not, this skill provides the full methodology.

### 2. Check for existing .pen files

If `.pen` files already exist, use `get_editor_state` and `batch_get` to understand what's already designed before creating new screens. Never duplicate work.

### 3. Identify the CSS system

| CSS System | Where tokens live | How to extract |
|-----------|------------------|----------------|
| Tailwind v4 | `global.css` `@theme` block | Read `@theme` for custom tokens, use standard Tailwind palette for utility classes |
| Tailwind v3 | `tailwind.config.js` | Read `theme.extend.colors` |
| CSS Variables | `:root` in stylesheets | Read `--variable-name` declarations |
| Styled-components | Theme provider file | Read the theme object |
| SCSS/LESS | Variables files (`_variables.scss`) | Read variable declarations |
| Vanilla CSS | Inline in stylesheets | Extract from class definitions |

---

## Phase 1: Code Analysis (Before Opening Pencil)

Read these in order before touching the design tool:

### 1a. Page Component
- Read the page JSX/Vue template/Svelte markup
- Identify: layout structure, conditional states, what's shown in the default state
- Note: flex direction, max-widths, padding/gap values
- **Catalogue ALL screen states** — every conditional block (`if`, ternary, `&&`, `v-if`, `{#if}`) that changes visible UI becomes a separate design frame
- **Read all validation functions** — extract exact error message strings verbatim

### 1b. Shared Components
- Read every component the page imports
- Note exact values: corner radius, padding, font size, border style, shadow
- These become reusable patterns in the design

### 1c. Sub-Component Config Objects (Critical)
- Read every config/map/enum that defines labels, colors, icons for badges, statuses, variants
- **Never infer these values** — read the exact strings and hex colors from the config object
- **Check for commented-out code** — JSX wrapped in `{/* */}`, HTML in `<!-- -->`, or `v-if="false"` means the element does NOT render. Do not include it in the design.

### 1d. CSS Tokens
- Read the CSS token source (see table above) and extract all color and font variables
- Map every alias to its hex value
- Note: standard Tailwind palette colors (blue-100, green-800, etc.) are NOT the same as custom `@theme` tokens

### 1e. Verify Values with External Sources

**Never rely on memory for CSS values.** When unsure about a Tailwind class-to-hex mapping, a spacing value, or a framework-specific pattern, verify using these sources:

1. **Context7 (MCP)** — Use `resolve-library-id` + `query-docs` to look up exact values:
   - `resolve-library-id("tailwindcss")` → then `query-docs` for specific classes
   - `resolve-library-id("react")` → for React rendering behavior questions
   - Works for any npm package: lucide-react icons, framer-motion, date-fns, etc.

2. **WebSearch** — For questions Context7 can't answer:
   - "tailwindcss text-yellow-800 hex value" — verify exact color codes
   - "tailwind bg-gradient-to-br css equivalent" — verify gradient directions
   - "lucide-react icon names list" — verify icon availability

3. **WebFetch** — For official documentation:
   - Tailwind docs: fetch the colors page for exact palette values
   - Framework docs: check rendering behavior for conditional patterns

**When to verify:**
- Any Tailwind color class you haven't used before in this project
- Gradient directions (easy to confuse `to-br` rotation 135 vs 315)
- Icon names (lucide icon names sometimes differ from what you'd expect)
- Font size / line-height defaults (they vary between Tailwind versions)
- Framework-specific rendering patterns (e.g., does `v-show` render the DOM element or not?)

### UI/UX Design Concepts Reference
For design principles, layout patterns, and common UI component anatomy, read `references/ui-ux-concepts.md`. This helps translate code patterns into design-accurate representations — spacing rhythms, visual hierarchy, component anatomy, responsive breakpoints, and accessibility considerations.

---

## Phase 2: Token Setup

Before designing any screen:
1. Extract all color variables from the CSS system
2. Set them as Pencil variables via `set_variables` (or `get_variables` to check existing ones)
3. Document font families — note the heading font, body font, and mono font

---

## Phase 3: Screen State Planning

Before building anything, present a state plan to the user:

```
I found N states for this page:
- S1   Default state (page load)
- S1b  Step 2 (after valid step 1)
- S1c  Error state — "Email is required."
- S1d  Success state
Build all N? Or just default first?
```

### State Categories
1. **Flow states** — progressive disclosure, multi-step forms
2. **Error states** — validation failures (extract exact error strings from code)
3. **Loading states** — spinners, skeleton screens
4. **Empty states** — no data available
5. **Success states** — confirmation banners, redirects
6. **Popup/modal states** — overlays with dark backgrounds

### Naming Convention
Format: `[Prefix][Number][Variant] — [Context] [Page Name] ([State])`
- Use role/context prefix to prevent naming conflicts (e.g., `A` for admin, `U` for user, `P` for public)
- Variants: `b`, `c`, `d`... for subsequent states of the same page
- Be descriptive in parentheses: `(Default)`, `(With Data)`, `(Loading)`, `(Error State)`, `(Edit Mode)`

---

## Phase 4: Frame Dimensions

### Target Screen Size
- Ask the user what target device/resolution they want, or default to a standard desktop viewport
- Width: match the app's outermost max-width container (read from code — e.g., `max-w-7xl`, `max-w-[80rem]`)
- Height: set a minimum that represents one viewport height for the target device

### Height Rules
- **Fixed height** for screens where content fits within one viewport (auth pages, loading states, empty states)
- **fit_content** for screens where content exceeds the viewport (data-heavy pages, long forms)
- `fit_content(N)` fallback only works when a frame has ZERO children — it does NOT enforce a minimum when children exist
- For short-content screens needing a minimum height: set height explicitly and use `fill_container` on the content wrapper to stretch
- **Always verify** computed heights with `snapshot_layout` after building — never assume

---

## Phase 5: Build Order

Always build outer → inner, using `placeholder: true` during construction:

1. Create screen frame + major layout zones (placeholder: true)
2. Fill each zone section by section
3. Screenshot after each major section
4. Fix any issues
5. Remove placeholder flags when done

**Max 25 operations per `batch_design` call.** Split by section.

---

## Phase 6: Component & Token Reference Sheets

Keep all reference material in **2 off-canvas frames** — never create additional frames:

1. **Components frame** (x offset from main screens): Document every component with all its states/variants
2. **Tokens frame** (further x offset): Document all color palettes, typography scales, and specialized color sets

When you build a new component type, add it to the Components frame. When you use a new color, add it to the Tokens frame.

---

## Phase 7: Code → Design Verification (Required)

**Never say "looks fine" after a screenshot.** Screenshots only catch gross layout errors. Every node must be compared property-by-property against the code.

### DFS Traversal Process
```
For each element in the markup (depth-first):
  1. READ the code (className, style, children, conditionals)
  2. TRANSLATE to expected Pencil properties
  3. READ the actual Pencil node (batch_get with readDepth:2)
  4. COMPARE property by property:
     - layout (horizontal/vertical)
     - gap, padding
     - fill (background + text color)
     - fontSize, fontWeight, fontFamily
     - cornerRadius
     - content (exact strings)
     - children count and types
     - conditional elements (shown/hidden correctly)
  5. FLAG any mismatch immediately
  6. RECURSE into children
```

### Anti-Patterns
- Never take a screenshot and call it verified
- Never infer badge labels — read the config object
- Never assume CSS color values from memory — translate each class
- Never include commented-out code in the design
- Never copy structure from old designs without re-reading current code

---

## Phase 8: Post-Build Code-Back-Check (Required)

After designing all frames for a page, re-read the source components fresh and compare against the finished design. This catches drift from multi-step builds.

```
For each page designed:
  1. Re-read the page component (fresh, not from memory)
  2. Re-read every sub-component
  3. Compare config/map objects against design nodes
  4. Check for commented-out JSX not in design
  5. Verify column/section structure matches markup
  6. Fix all mismatches
```

The design is only "done" when Phase 8 passes with zero mismatches.

---

## Phase 9: Use Real Data (When Available)

Designs look better with real data. If the project has a database:
1. Write a quick script to fetch representative data
2. Replace placeholder text with trimmed real content
3. Match the actual data distribution (don't invent unrealistic distributions)
4. Update names consistently across all screens
5. Delete temporary data files after use

---

## Canvas Layout Rules

### Row Spacing
- Screens in a row: 100px horizontal gap
- Between rows: **compute from tallest frame** — never use a fixed gap
- After building: `snapshot_layout` to check actual heights, verify no overlaps

### Overlap Prevention
Tall screens (scrollable pages, data-heavy views) can exceed the viewport height. Always:
1. Check the tallest frame in each row after building
2. Set next row y = tallest bottom edge + 100px minimum
3. Re-verify after content updates (text changes grow frame height)

### Section Separation
Use larger gaps (~1500px) between logical sections (e.g., admin vs user flows) for visual clarity on the canvas.

---

## Known Pencil Patterns

Read `references/pencil-patterns.md` for solutions to common translation challenges:
- Absolute-positioned icons → flex layout with `space_between`
- Icon + multi-line text alignment → wrapper frame with top padding
- `C()` descendants override → always include full style properties
- `fit_content` sizing quirks

---

## Framework-Specific Notes

### React (JSX)
- Conditional rendering: `{condition && <Component />}`, ternaries
- State: `useState`, Redux selectors
- Config objects: often at top of file or in separate config files

### Vue
- Conditional rendering: `v-if`, `v-show`, `v-else`
- State: `ref()`, `computed()`, Pinia stores
- Props/emits define component variants

### Svelte
- Conditional rendering: `{#if}`, `{:else}`
- State: reactive declarations (`$:`)
- Slots for component composition

### Vanilla HTML/CSS
- No conditional rendering in markup — document all states as separate pages
- CSS classes define all styling — read stylesheets thoroughly
