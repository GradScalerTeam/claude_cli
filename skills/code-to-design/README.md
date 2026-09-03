# Code to Design Skill

Converts production frontend code into pixel-accurate Pencil (`.pen`) design files. The code is the source of truth — every color, spacing value, font, and layout decision traces back to a real line of code. Works with any framework (React, Vue, Svelte, vanilla HTML/CSS) and any CSS system (Tailwind, CSS modules, styled-components, plain CSS).

## What This Does

Most "code to design" attempts are eyeballed — someone looks at a running app and rebuilds it in a design tool, drifting a few pixels at every step. This skill inverts that: it reads the actual component source, extracts the real token values, and builds the design file from those numbers.

The skill runs a 9-phase process — code analysis, token setup, screen state planning, frame sizing, build order, reference sheets, a DFS code→design verification pass, a post-build code-back-check, and real-data substitution. The two verification phases are mandatory; the skill walks the component tree in both directions to catch drift before declaring done.

## When To Use It

- Documenting an existing UI as design screens so designers can work from what actually shipped
- Producing design files for a codebase that never had them
- Capturing every state of a screen (loading, empty, error, populated) as separate frames
- Handing a developer-built UI to a designer for refinement

**Not for:** designing from scratch with no code, or generating code from a design (that's the opposite direction).

## Requirements

- **Pencil MCP server** configured in your project — see [HOW_TO_USE_PENCIL_WITH_CLAUDE.md](../../HOW_TO_USE_PENCIL_WITH_CLAUDE.md). Without it, none of the design operations work.
- An existing frontend codebase to read from.

## Install

Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the code-to-design skill:

Copy the entire skills/code-to-design/ folder to ~/.claude/skills/code-to-design/ with exact content — SKILL.md plus the references/ folder (pencil-patterns.md and ui-ux-concepts.md). Exclude README.md. Create ~/.claude/skills/ if it doesn't exist.

After installing, read skills/code-to-design/README.md and give me a summary of what this skill does, how to invoke it, and what it needs (the Pencil MCP server) before it will work.
```

Then quit your Claude CLI session and start a new one — skills only load at session startup.

## Check for Updates

Already installed and want the latest version? Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and check for updates to the code-to-design skill:

Compare skills/code-to-design/SKILL.md and everything in skills/code-to-design/references/ with my local versions at ~/.claude/skills/code-to-design/. Tell me what changed. If there are updates, ask me whether I want you to explain the changes first or pull them straight into my local files.
```

## Usage

Invoke it by describing what you want designed:

```
design the checkout page from our code
convert the dashboard components to a .pen file
create screens from src/pages/Settings.tsx — include the empty and error states
```

The skill triggers automatically on mentions of `.pen` files, Pencil designs, or code-to-design work.

## What's Inside

| File | What It Covers |
|---|---|
| `SKILL.md` | The 9-phase process — code analysis, token setup, state planning, frame dimensions, build order, reference sheets, DFS verification, code-back-check, real data. Plus canvas layout rules and framework-specific notes for React/Vue/Svelte/vanilla. |
| `references/pencil-patterns.md` | 10 known Pencil translation patterns — absolute icons → flex, `C()` descendant overrides, `fit_content` quirks, gradient fills, stroke alignment, opacity colors, placeholder workflow. |
| `references/ui-ux-concepts.md` | 11 concepts for reading design intent out of code — visual hierarchy, spacing intent, component structure, conditional states, layout direction, color intent, responsive breakpoints, fidelity principles. |
