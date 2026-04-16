# Pencil Design Tool — Common Translation Patterns

Solutions to common challenges when translating web UI code into Pencil `.pen` files.

---

## 1. Absolute-Positioned Icons → Flex Layout

**Problem:** Code uses `position: absolute` to overlay icons inside inputs. Pencil uses flexbox only.

**Code pattern:**
```jsx
<div className="relative">
  <input className="px-6 py-4 pr-12" />
  <button className="absolute right-3 top-1/2 -translate-y-1/2">
    <Icon size={20} />
  </button>
</div>
```

**Pencil translation:** Single frame with `justifyContent: "space_between"`. The icon is a flex sibling, not overlaid. Use the `right-*` value as right padding.

**Key insight:** The `right-*` CSS value becomes the frame's right padding. Don't calculate or guess — read it from the code.

---

## 2. Icon + Multi-Line Text Alignment

**Problem:** An icon next to multi-line text appears pinned to the top of the row.

**Code pattern:** `items-start` with `mt-0.5` on the icon.

**Pencil translation:** Wrap the icon in a small frame with `padding: [4, 0]` (top padding). This nudges the icon down to align with the first line of text.

**When to use:** Any time you see an icon sitting beside text that could wrap to multiple lines, especially in feature lists and bullet points.

---

## 3. C() Descendants Override — Include Full Styles

**Problem:** Overriding a text node via `C()` `descendants` with only `{type, content}` wipes all style properties.

**Solution:** Always include every style property when overriding descendants:
```javascript
// First: read the original node with batch_get to get its properties
// Then: include ALL of them in the override

descendants: {
  "path/to/textNode": {
    type: "text",
    content: "New text",
    fontFamily: "...",    // copy from original node
    fontSize: 18,          // copy from original node
    fill: "#...",          // copy from original node
    lineHeight: 1.625     // copy from original node
  }
}
```

**Rule:** Read the original node's properties with `batch_get` before writing any descendant override. Copy every style property — don't assume defaults.

---

## 4. fit_content Sizing Quirks

**`fit_content(N)` fallback:**
- The `N` value is a fallback for when the frame has **zero children**
- If children exist but total less than `N`, the frame sizes to the children — NOT to `N`
- This means `fit_content(900)` does NOT enforce a 900px minimum height

**For minimum height enforcement:**
- Set an explicit `height: 900` on the frame
- Use `height: "fill_container"` on the content wrapper inside so it stretches

---

## 5. Text Sizing in Pencil

**`textGrowth` is required for text wrapping:**
- `auto` (default) — text never wraps, width/height auto-calculated. Don't set width/height.
- `fixed-width` — text wraps at the given width, height auto-calculated. Must set `width`.
- `fixed-width-height` — text wraps, both dimensions fixed. Must set both.

**For body text inside cards/containers:** Use `textGrowth: "fixed-width"` with `width: "fill_container"` so text wraps to the parent's width.

**For short labels/buttons:** Leave `textGrowth` unset (defaults to `auto`) — text stays on one line.

**Common mistake:** Setting `width` without `textGrowth` — the width is ignored and text won't wrap.

---

## 6. Gradient Fills

**Tailwind gradient → Pencil gradient:**
```javascript
// Read the gradient colors from the code's from-[...] and to-[...] classes
fill: {
  type: "gradient",
  gradientType: "linear",
  rotation: 135,  // for bg-gradient-to-br (see direction mapping below)
  colors: [
    { color: "#startColor", position: 0 },  // from-[#startColor]
    { color: "#endColor", position: 1 }      // to-[#endColor]
  ]
}
```

**Direction mapping (verify via Context7/WebSearch if unsure):**
- `to-r` = left to right
- `to-b` = top to bottom
- `to-br` = top-left to bottom-right
- `to-tr` = bottom-left to top-right

---

## 7. Stroke Alignment

CSS `border` renders **inside** the element by default. In Pencil, stroke defaults to **center**.

**Always set:** `stroke: { align: "inside", fill: "#color", thickness: N }`

Using `outside` or `center` alignment changes the visual position of the border and can cause layout differences.

---

## 8. Opacity Colors

Code often uses opacity modifiers (`text-white/90`, `bg-black/40`). Convert to 8-digit hex:

- `white/90` = `#FFFFFFE6` (90% opacity = E6 in hex)
- `white/60` = `#FFFFFF99`
- `black/40` = `#00000066`
- `white/20` = `#FFFFFF33`
- `white/30` = `#FFFFFF4D`

Formula: opacity percentage × 255 → round → convert to hex → append to 6-digit color.

---

## 9. Canvas Organization

**Row spacing:** Compute from the tallest frame in each row — don't use a fixed gap. After building, verify with `snapshot_layout` that no frames overlap.

**Section separation:** Use larger gaps between logical sections (e.g., admin vs user flows).

**Overlap audit:** After all screens are built, check every row's bottom edge vs the next row's y position. Fix any overlaps by moving lower rows down.

---

## 10. Placeholder Workflow

**Always use `placeholder: true`** on frames you're actively building. This prevents Pencil from auto-calculating layout during construction.

**Remove placeholders** as soon as each frame is complete — never leave them on finished screens.

**Build order:** Create the frame with placeholder → add children section by section → screenshot to verify → remove placeholder.
