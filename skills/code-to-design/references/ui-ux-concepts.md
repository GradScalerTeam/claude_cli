# UI/UX Concepts for Code-to-Design Translation

This reference teaches you how to **read** UI intent from code so you can faithfully replicate it in a design file. No hardcoded values — everything comes from the code itself.

---

## 1. Reading Visual Hierarchy from Code

Code contains hierarchy signals. Learn to spot them so you translate the right emphasis:

**How to identify hierarchy level:**
- Larger font size + heavier weight + heading font = highest hierarchy
- Smaller font size + lighter weight + body font + muted color = lowest hierarchy
- The CSS framework's naming often hints: `text-4xl` > `text-xl` > `text-base` > `text-sm` > `text-xs`

**What to do:** Read the exact `fontSize`, `fontWeight`, `fontFamily`, and `color` from each text element's classes. Don't interpolate — if the code says `text-sm text-gray-500`, translate exactly that.

**Common mistake:** Assuming all headings are bold italic in a heading font. Some headings use the body font with just `font-bold`. Read the actual classes.

---

## 2. Understanding Spacing Intent from Code

Spacing in code is never random. Every gap, padding, and margin exists because a developer chose it. Your job is to replicate it exactly.

**How spacing is expressed in code:**
- `gap-*` / `space-y-*` / `space-x-*` — spacing between sibling elements
- `p-*` / `px-*` / `py-*` — internal breathing room of a container
- `m-*` / `mb-*` / `mt-*` — external spacing between an element and its neighbors
- Negative margins (`-mt-2`) — intentionally pulling an element closer than its siblings' gap allows

**What to do:** Translate each spacing class to its pixel value using Context7 or WebSearch if unsure. In Pencil, `gap` maps directly, `padding` maps directly, but negative margins need workarounds (usually reducing the parent's gap for that section).

**Common mistake:** Guessing "looks like about 32px" instead of reading the actual class. `p-6` is 24px, not 32px. `p-8` is 32px. Always verify.

---

## 3. Reading Component Structure from Code

Every UI component in code has a predictable anatomy. Learn to read it:

**Container → Content pattern:**
```
Outer wrapper (provides spacing, border, shadow, background)
  └── Inner content (provides padding, layout direction, gap)
       ├── Child 1
       ├── Child 2
       └── Child N
```

**How to identify the pattern:**
- The outermost `div`/element with `border`, `rounded`, `shadow`, `bg-*` = the visual container
- The inner element with `p-*`, `flex`, `gap-*` = the content layout
- Children are whatever's inside

**What to do:** Build the Pencil frame matching the outer wrapper's visual properties (corner radius, border, shadow, fill), then set the inner layout properties (padding, gap, direction), then add children.

**Common mistake:** Conflating the container and content layers — putting padding on the wrong frame, or applying border-radius to an inner element instead of the outer.

---

## 4. Reading Conditional UI States from Code

Every `if`, ternary, `&&`, `v-if`, or `{#if}` in the markup is a potential design state.

**How to catalogue states:**
1. Read the component top-to-bottom
2. Every time you see a conditional, ask: "What does the user see when this is true? When it's false?"
3. Each distinct visual outcome = one design frame

**State types to look for:**
- **Boolean toggles** (`isEditing`, `showPassword`, `isExpanded`) — two visual states
- **Status switches** (`status === "loading"` / `"succeeded"` / `"failed"`) — multiple visual states
- **Data presence** (`items.length > 0` vs `items.length === 0`) — populated vs empty
- **User role** (`isMediator` vs `isParent`) — different content for different users
- **Multi-step** (`step === 0` / `1` / `2`) — progressive disclosure

**What to do:** List ALL states before building anything. Present the list to the user. Then build each state as a separate design frame.

**Common mistake:** Only designing the "happy path" default state and missing error states, empty states, or loading states that the code explicitly handles.

---

## 5. Reading Layout Direction from Code

CSS flexbox and grid in code tell you exactly how elements are arranged:

**Flex direction signals:**
- `flex-col` / `flex-direction: column` → Pencil `layout: "vertical"`
- `flex-row` (or just `flex`) → Pencil `layout: "horizontal"`
- `items-center` → `alignItems: "center"` (cross-axis)
- `justify-between` → `justifyContent: "space_between"` (main-axis)
- `justify-center` → `justifyContent: "center"`

**Grid signals:**
- `grid grid-cols-2` → two equal-width columns. In Pencil, use a horizontal frame with two `fill_container` children
- `grid grid-cols-1 lg:grid-cols-2` → responsive. Design the desktop (2-column) variant

**What to do:** Read the flex/grid classes, translate to Pencil layout properties. The code tells you everything — don't guess the layout.

---

## 6. Reading Color Intent from Code

Colors in code serve specific purposes. Understanding intent helps you verify accuracy:

**Color sources (in priority order):**
1. **Custom theme tokens** (`text-primary`, `bg-light-bg`) — defined in the project's CSS config
2. **Framework palette** (`text-blue-600`, `bg-green-100`) — standard palette colors
3. **Inline hex** (`style={{ color: "#2d6a4f" }}`) — direct values
4. **Opacity variants** (`text-white/90`, `bg-black/40`) — alpha channel modifications

**What to do:**
- For custom tokens: read the project's CSS config to find the hex value
- For framework palette: use Context7 or WebSearch to verify the exact hex
- For inline hex: use the value directly
- For opacity: convert to 8-digit hex (e.g., `white/90` = `#ffffffe6`, `black/40` = `#00000066`)

**Common mistake:** Using a "close enough" green from memory instead of the exact hex. `#15803d` and `#166534` are both "dark green" but they're different colors from different Tailwind scales. Always verify.

---

## 7. Reading Icon Usage from Code

Icons in code have exact names, sizes, and colors:

**How icons appear in code:**
- Import: `import { Eye, ChevronRight, AlertCircle } from "lucide-react"` — the import name IS the icon name
- Usage: `<Eye size={20} />` — the `size` prop gives you width AND height
- Color: `className="text-primary"` or `style={{ color: "#2d6a4f" }}` — read the exact color
- Some icons are conditionally rendered: `{isExpanded ? <EyeOff /> : <Eye />}` — pick the state you're designing

**What to do:** Use the exact icon name from the import (converted to kebab-case for Pencil: `AlertCircle` → `alert-circle`). Set width and height from the `size` prop. Set fill from the color class/style.

**Common mistake:**
- Using the wrong icon name (Pencil icon fonts may use slightly different names — verify with Context7)
- Including icons that are wrapped in comments (`{/* <Eye /> */}`) — these don't render
- Guessing icon color instead of reading the className

---

## 8. Reading Absolute/Relative Positioning from Code

Many UI frameworks use `position: absolute` for overlaid elements (icons inside inputs, floating buttons, tooltips). Design tools like Pencil use flexbox layout instead.

**The pattern in code:**
```
<div className="relative">        ← parent creates positioning context
  <input className="pr-12" />     ← input has extra right padding for the icon
  <button className="absolute right-3 top-1/2 -translate-y-1/2">  ← icon floats over input
    <Icon />
  </button>
</div>
```

**How to translate:** The `relative` parent + `absolute` child pattern becomes a single flex frame with `justifyContent: "space_between"`. The icon becomes a flex sibling of the text, not an overlaid element. The `right-*` value from the absolute positioning becomes the right padding of the container.

**What to do:** Read the `right-*` or `left-*` value and use it as padding. Read the icon's `size` prop. Build one frame with `space_between` containing text + icon.

---

## 9. Reading Responsive Breakpoints from Code

Code often has responsive classes. For design files, you're building the **desktop** variant.

**How to identify which variant to design:**
- `lg:flex-row` → on desktop it's a row (design this)
- `hidden lg:flex` → only visible on desktop (include in design)
- `lg:w-1/2` → half-width on desktop (include)
- `sm:hidden` → hidden on desktop (exclude from design)
- `max-w-*` → content width constraint (center it in the frame)

**What to do:** Read the largest breakpoint variant of each class. That's what appears on the desktop-width design. Ignore mobile-first defaults if a `lg:` or `xl:` override exists.

---

## 10. Reading Data Rendering from Code

How code renders data tells you what the design should show:

**Markdown/rich text rendering:**
- If code has a `formatMessageText()` or similar function, read it to understand HOW text is rendered (headings become styled elements, bullets become cards or lists, bold becomes `<strong>`)
- The design must match the RENDERED output, not the raw markdown

**List rendering (`map`):**
- `items.map(item => <Card />)` — show 2-3 realistic items in the design
- The data distribution matters: if the real data has mixed statuses, show mixed statuses

**Conditional rendering within lists:**
- `{item.status === "complete" && <Badge />}` — some items show the badge, some don't
- Design should show the realistic mix, not all items identical

**What to do:** Read the rendering function. Understand the output format. Design what the user actually sees on screen — the rendered result, not the raw data.

---

## 11. Fidelity Principles

### Design what the code renders
If the code has a bug (misaligned element, wrong color), design the bug. The design file documents reality. Flag the issue separately.

### Never add what the code doesn't have
If the code doesn't have a hover state, don't design one. If the code doesn't have an icon, don't add one. The design matches the code, not your idea of what it should look like.

### Never remove what the code does have
If the code has a subtle 1px border, include it. If the code has a shadow, include it. These small details are intentional design decisions.

### Verify everything
Use Context7 for framework/library lookups. Use WebSearch for CSS value verification. Use the project's own CSS config for custom tokens. Never rely on memory for any value.
