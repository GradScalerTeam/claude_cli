# Codex Image Bridge Skill

Generate raster images from inside Claude Code by delegating to the Codex CLI's built-in `image_gen` tool. Hero images, product mockups, textures, sprites, illustrations, backgrounds — without switching to another CLI and re-explaining your project context.

## What This Does

Claude Code cannot generate images. Codex can, and it does it well — but using it means leaving your session, opening Codex, and describing the whole task again. That context switch is the actual friction, not image quality.

This skill removes it. You ask for an image in the session you're already in, and a wrapper shells out to `codex exec` in the background. Codex runs its own bundled `imagegen` skill, generates the image with `gpt-image-2`, and writes it to the exact path you asked for. The wrapper then cleans up Codex's scratch files so nothing accumulates on disk.

Images are billed to your **ChatGPT plan**, not an API key. No `OPENAI_API_KEY` is required or used.

## Requirements

This skill is a wrapper. It does nothing on a machine without Codex.

- **Codex CLI**, installed and signed in — `npm install -g @openai/codex` then `codex login`
- **Node.js 18.18+** (Codex's requirement)
- A **ChatGPT plan**: Plus, Pro, Business, Edu, or Enterprise

The script checks both conditions before it starts and exits with instructions if either fails. **It will never install Codex or run a login flow for you** — it prints the command and leaves the decision to you.

| Exit | Meaning |
|---|---|
| `127` | Codex not installed or not on PATH |
| `126` | Codex installed but not signed in |
| `2` | Wrong arguments |
| `1` | Ran, but no image was written (scratch folder kept for recovery) |

## When To Use It

- A landing page needs a hero image, and you want it composed for overlaid text
- Product mockups, packaging shots, or e-commerce card images
- Section backgrounds and textures that have to sit behind readable copy
- Sprites, illustrations, or concept art for a game or app
- Placeholder imagery that looks real enough to design against

**Not for:** SVG or vector icons, diagrams, charts, or anything better built directly in HTML/CSS. Those belong in code, not in a bitmap.

## Install

Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the codex-image-bridge skill:

Copy the entire skills/codex-image-bridge/ folder to ~/.claude/skills/codex-image-bridge/ with exact content — SKILL.md plus scripts/gen.sh. Exclude README.md. Create ~/.claude/skills/ if it doesn't exist.

CRITICAL: run `chmod +x ~/.claude/skills/codex-image-bridge/scripts/gen.sh` afterwards. This skill ships an executable and silently fails without it.

Then run the preflight for me: check whether the Codex CLI is installed (`codex --version`) and signed in. If either fails, tell me the exact command to fix it — do NOT install Codex or run a login flow yourself.
```

Then quit your Claude CLI session and start a new one — skills only load at session startup.

## Check for Updates

Already installed and want the latest version? Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and check for updates to the codex-image-bridge skill:

Compare skills/codex-image-bridge/SKILL.md and skills/codex-image-bridge/scripts/gen.sh with my local versions at ~/.claude/skills/codex-image-bridge/. Tell me what changed. If there are updates, ask me whether I want you to explain the changes first or pull them straight into my local files — and re-run `chmod +x` on scripts/gen.sh afterwards if you replace it.
```

## Usage

Claude invokes it for you when you ask for an image. Directly:

```bash
~/.claude/skills/codex-image-bridge/scripts/gen.sh <output.png> "<prompt>" [size]
```

The output path can be relative or absolute; it resolves against your current directory. Size defaults to `1024x1024`.

**Always run it in the background.** One image is a full Codex agent turn — 4 to 6 minutes. Several can run concurrently; cleanup is scoped per Codex session so parallel runs don't interfere with each other.

## What's Inside

| File | What It Covers |
|---|---|
| `SKILL.md` | Requirements and preflight, usage, gpt-image-2 size rules, prompt-writing guidance, the review checklist, storage behaviour |
| `scripts/gen.sh` | The wrapper — preflight, path resolution, `codex exec` invocation, session-scoped cleanup |

## Notes From Building It

Things that turned out to matter, documented so you don't rediscover them:

- **Spell in-image text letter by letter.** Writing `M-E-R-I-D-I-A-N` alongside the plain word reliably fixes the misspelling failure mode on packaging and signage. Without it, longer words come back garbled.
- **State negative space by side and purpose.** "The LEFT third must stay dark and empty so overlaid white headline text stays readable" works; "leave some space" does not. Models centre the subject by default.
- **Nothing here judges whether the image is correct.** The script verifies a file was written, and Codex self-grades its own output as matching every single time. The only real quality gate is a human looking at the result — and at the rendered page, because an asset and a layout can each be correct while mismatching each other.
- **`workspace-write` is the right sandbox**, not `danger-full-access`. It grants full disk read, which is what's needed to pull the image out of `$CODEX_HOME`, while confining writes to the output directory.
