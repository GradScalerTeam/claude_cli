# UI Kit Generator Agent

The **UI Kit Generator** is a Claude Code CLI agent that turns a style brief — an image, a description, a color palette, or any combination — into a complete, self-contained HTML UI kit reference. The output goes at the project root and becomes the single visual contract for any frontend project the user builds.

---

## Why Use It

- **Consistency** — Every project starts from the same component taxonomy (Material Design 3, 36 components in 6 categories). The aesthetic changes; the coverage doesn't.
- **Framework-agnostic** — The kit is plain HTML/CSS/JS. Once generated, your developers translate it into React, Vue, Svelte, Flutter, or native — but they all reference the same source of truth.
- **WCAG AA verified** — The agent runs a Python contrast audit on every text/background pair (in both light and dark modes) and refuses to deliver until everything passes.
- **Dark mode built in** — Floating bottom-right toggle with `localStorage` persistence. Both modes audited.
- **Live interactivity** — Buttons hover, switches toggle, sliders drag, text fields are editable, tabs switch active state. The kit isn't a static screenshot — it's a working reference.
- **Style portable** — Want the same components in brutalism, glassmorphism, neumorphism, swiss, cyberpunk, retro? Generate one kit per style; component IDs match, so they're directly comparable side by side.

---

## When to Use It

**Before you start the frontend.** The kit is the visual handshake between design and code. Generate it first, get sign-off on the aesthetic, then build the actual app — every component you write in your real codebase has a reference rendering in the kit.

The workflow is:

1. You describe a style — give it a screenshot, a Figma link, a brand palette, or just a name ("brutalism", "neumorphism", "Stripe-clean")
2. The agent reads `M3_UI_KIT_REFERENCE.md` (the M3 component taxonomy), then generates the HTML kit at root
3. The agent runs a WCAG AA contrast audit and fixes any failing token combinations before declaring done
4. You open the file in a browser, click around, toggle dark mode, and confirm the aesthetic is what you wanted
5. From there, the kit is the reference for every screen you build — same colors, same shapes, same spacing, same component variants

**You should also use it when:**
- You're prototyping multiple aesthetics for a brand presentation
- You need to onboard a new designer/developer to the project's visual language
- You want a starting point for a custom design system
- You're translating an existing UI to a new framework and want a static reference

---

## How to Invoke

```
@uikit-generator <your style brief>
```

### Examples

**With an image:**
```
@uikit-generator generate a UI kit matching the style of this Stripe dashboard screenshot
```

**With a style name:**
```
@uikit-generator create a UI kit in neumorphism style — soft shadows, off-white surfaces
```

**With colors only:**
```
@uikit-generator make a UI kit using #FF6B35 (orange), #004E89 (deep blue), #F7F7F2 (cream) — modern and clean
```

**Mixed:**
```
@uikit-generator brutalism style. Colors: black, hot pink #FF1F8B, electric green #00FF66.
Reference: see this swissmiss.com screenshot
```

---

## What You Get

A single HTML file at `m3-ui-kit-<style-slug>.html` (e.g., `m3-ui-kit-neumorphism.html`) containing:

| Section | Content |
|---|---|
| **Header** | Big-type display, meta tiles (component count, category count, variant cells, style note) |
| **TOC** | 6 cards linking to each category section |
| **Foundations** | Color swatches, type scale, shape scale (None / XS / S / M / L / XL / Full), elevation levels, 4dp spacing |
| **Actions** (8) | Common buttons, FAB, Extended FAB, FAB menu, Icon buttons, Segmented buttons, Split button, Button groups |
| **Communication** (4) | Badges, Loading indicator, Progress indicators, Snackbar |
| **Containment** (8) | Bottom sheets, Cards, Carousel, Dialogs, Divider, Lists, Side sheets, Tooltips |
| **Navigation** (7) | App bars, Navigation bar, Navigation drawer, Navigation rail, Search, Tabs, Toolbars |
| **Selection** (8) | Checkbox, Chips, Date pickers, Menus, Radio button, Sliders, Switch, Time pickers |
| **Text inputs** (1) | Text fields (Filled & Outlined × 5 states + slot variants) |

Each component shows:
- A short description
- An instruction badge ("CLICK to toggle…", "PASSIVE — reference only", etc.)
- Variant rows (Style × Size × Shape) with live-rendered components
- Working interactivity wired up

Plus:
- Dark mode toggle (floating bottom-right)
- WCAG AA contrast verified for every text/bg pair in both modes

---

## Reference

- **Component taxonomy:** [`M3_UI_KIT_REFERENCE.md`](../../M3_UI_KIT_REFERENCE.md) at the project root
- **Existing example kits** (the agent uses these as structural templates):
  - [`m3-ui-kit-brutalism.html`](../../m3-ui-kit-brutalism.html)
  - [`m3-ui-kit-glassmorphism.html`](../../m3-ui-kit-glassmorphism.html)

---

## Design Decisions

- **Why Material 3?** It's the most exhaustive and best-maintained component taxonomy. Anthropic's design language, Apple's, Microsoft's Fluent — they all converge to roughly the same 30–40 primitives. M3 happens to publish them with public token files, so the dp values are verifiable.
- **Why one HTML file?** Portability. No build step, no framework lock-in. A designer opens it in Safari, a backend dev opens it in Chrome, a Flutter dev opens it on their phone — same artifact.
- **Why WCAG AA enforced?** Because most kits skip this step and ship the contrast bugs. The audit takes 30 seconds; refusing to deliver without it eliminates a whole class of regressions.
- **Why dark mode required?** Same reason — most kits ship light-only and patch dark mode later, when the bugs are 10× harder to find. Building both at the same time forces token discipline.
