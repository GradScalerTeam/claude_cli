---
name: codex-image-bridge
description: Generate raster images (hero images, mockups, textures, sprites, illustrations, logos, product shots, backgrounds) by delegating to the Codex CLI's built-in image_gen tool, without leaving the Claude Code session. Use when the user asks to generate, create, or make an image, PNG, or visual asset for a project. Do not use for SVG, icons, diagrams, or anything better built directly in HTML/CSS.
---

<!-- ~/.claude/skills/codex-image-bridge/SKILL.md
     Bridges Codex's native image_gen tool into any Claude Code session.
     Keeps image work in one session instead of forcing a switch to the Codex CLI. -->

# Codex imagegen bridge

Generates images via `codex exec`, which runs Codex's bundled `imagegen` skill and its native
`image_gen` tool (`gpt-image-2`, billed to the ChatGPT subscription — no `OPENAI_API_KEY`).

## Requirements — check these before promising anything

This skill does not generate images itself. It shells out to the Codex CLI, so on a machine
without Codex installed and signed in, nothing here works.

`scripts/gen.sh` enforces this itself and exits early with instructions:

| Exit | Meaning | Fix to give the user |
|------|---------|----------------------|
| `127` | `codex` not installed or not on PATH | `npm install -g @openai/codex` (needs Node 18.18+) |
| `126` | Codex installed but not signed in | `codex login` |
| `2`   | Wrong arguments | See usage below |
| `1`   | Ran, but no image was written | Scratch folder kept for recovery; check the log |

To check the machine before starting a batch, or when a user asks whether this will work:

```bash
command -v codex && codex --version && codex login status
```

Auth is a ChatGPT plan (Plus, Pro, Business, Edu, Enterprise). `OPENAI_API_KEY` is neither
required nor used — never ask the user for one.

### Never install Codex for the user

If Codex is missing or logged out, **stop and tell them**. Do not run `npm install -g
@openai/codex`, `codex login`, or any other setup command on their behalf, and do not offer to.
Print the command, say what it does, and let them decide and run it themselves.

This holds even if the user seems to want the image badly, even if they previously approved a
different install, and even in a permission mode that would technically allow it. Installing
global packages and initiating an auth flow changes machine state well outside the scope of
"make me a PNG", and the person whose machine it is gets to make that call.

`scripts/gen.sh` already behaves this way: its error text is inside a quoted heredoc, so the
install command is printed and never executed. Keep it that way.

## Usage

Always invoke by absolute path. This skill is installed globally, so a relative path will not
resolve from an arbitrary working directory.

```bash
~/.claude/skills/codex-image-bridge/scripts/gen.sh <output.png> "<prompt>" [size]
```

The output path may be relative to the current directory or absolute; the script resolves it.
Size defaults to `1024x1024`.

## Always run it in the background

One image is a full Codex agent turn: **4–6 minutes**. Launch with `run_in_background: true`,
then collect the result when the task notification arrives. Multiple images can be launched
concurrently — cleanup is scoped per Codex session, so parallel runs do not interfere.

## Size rules (gpt-image-2)

Both edges must be multiples of 16, max edge 3840, long:short ratio at most 3:1, total pixels
between 655,360 and 8,294,400. Square renders fastest.

Common valid sizes: `1024x1024`, `1536x1024`, `1024x1536`, `2048x2048`, `2048x1152`, `3840x2160`.

## Writing the prompt

Codex reshapes the prompt through its own spec schema, so feeding it a structured brief rather
than a bare sentence measurably improves the result. Cover, in order: use case, asset type,
subject, composition and framing, lighting and mood, colour palette, then constraints.

Two techniques that matter:

- **Verbatim text must be spelled letter by letter** — write `M-E-R-I-D-I-A-N` as well as the
  plain word. Without this, longer words on packaging and signage come back misspelled.
- **State negative space by side and purpose** — "the LEFT third must stay dark and empty so
  overlaid white headline text stays readable". Models centre the subject by default.

Always include explicit negatives: `no text, no logos, no watermark` unless text is wanted.

## Reviewing the output — do not skip

Nothing in this pipeline judges whether the image is *correct*. The script only verifies that a
file was written. Codex self-grades its own output as matching every time, so that is not a gate.

After each run:

1. Read the PNG and actually look at it against the original brief.
2. If text was requested, verify the spelling character by character.
3. If the image sits behind text, measure worst-case WCAG contrast rather than eyeballing it.
4. If several assets feed one layout, **render the page and look at the composite** — asset and
   layout can each be correct while mismatching each other, which is invisible per-image.

Regenerate with a single targeted prompt change rather than a full rewrite.

## Storage

Codex writes candidates into `$CODEX_HOME/generated_images/<session-id>/` at roughly 2 MB each.
On success the script deletes only its own session folder, so nothing accumulates. On failure it
leaves the folder intact so the image can be recovered by hand.
