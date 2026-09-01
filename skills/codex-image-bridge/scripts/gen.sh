#!/usr/bin/env bash
# ~/.claude/skills/codex-image-bridge/scripts/gen.sh
# Wraps `codex exec` so images can be generated without leaving a Claude Code session.
# Codex writes the final image straight to the destination path; this script then removes
# only the scratch folder belonging to its own Codex session, so parallel runs are safe.

set -euo pipefail
set -o pipefail

CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
GEN_DIR="$CODEX_HOME/generated_images"

[ $# -ge 2 ] || { echo "usage: gen.sh <output.png> <prompt> [size]" >&2; exit 2; }

# --- preflight -------------------------------------------------------------
# This skill is only a wrapper. If Codex is absent or logged out, say so here in plain
# terms rather than letting it surface as an opaque failure part-way into a run.

if ! command -v codex >/dev/null 2>&1; then
  cat >&2 <<'MSG'
ERROR: the `codex` CLI is not installed, or not on PATH.

This skill generates images by delegating to Codex. It cannot work without it.

  Install:  npm install -g @openai/codex
  Sign in:  codex login
  Verify:   codex --version

Requires Node.js 18.18+ and a ChatGPT plan (Plus, Pro, Business, Edu or Enterprise).
MSG
  exit 127
fi

if ! codex login status >/dev/null 2>&1; then
  cat >&2 <<'MSG'
ERROR: `codex` is installed but not signed in.

  Run:  codex login

Image generation uses Codex's built-in image_gen tool, which is gated to ChatGPT auth.
No OPENAI_API_KEY is required or used.
MSG
  exit 126
fi
# ---------------------------------------------------------------------------

DEST_ARG=$1
PROMPT=$2
SIZE=${3:-1024x1024}

# Absolute paths only. A relative dest would resolve against Codex's cwd, not ours.
mkdir -p "$(dirname "$DEST_ARG")"
DEST_DIR=$(cd "$(dirname "$DEST_ARG")" && pwd)
DEST="$DEST_DIR/$(basename "$DEST_ARG")"

LOG=$(mktemp)

# workspace-write is deliberate: it grants full disk READ (needed to pull the image out of
# CODEX_HOME) while confining writes to DEST_DIR. danger-full-access buys nothing here.
codex exec \
  --sandbox workspace-write \
  --skip-git-repo-check \
  -C "$DEST_DIR" \
  "Use the imagegen skill with the built-in image_gen tool. Generate one image at size ${SIZE}. Prompt: ${PROMPT}. Save the final selected image to ${DEST} and print that exact path when done. Do not ask for an OPENAI_API_KEY and do not use the CLI fallback." \
  2>&1 | tee "$LOG"

# Codex prints `session id: <uuid>` in its header, and names its scratch folder after it.
# Scoping cleanup to this id is what makes concurrent runs safe.
SESSION_ID=$(grep -m1 -E '^session id: ' "$LOG" | awk '{print $3}' || true)
rm -f "$LOG"

if [ ! -f "$DEST" ]; then
  echo "FAILED: $DEST was not created." >&2
  echo "Leaving $GEN_DIR intact so the generated image can be recovered manually." >&2
  exit 1
fi

if [ -n "$SESSION_ID" ] && [ -d "$GEN_DIR/$SESSION_ID" ]; then
  rm -rf "$GEN_DIR/$SESSION_ID"
else
  echo "NOTE: could not resolve this run's session folder; skipping cleanup." >&2
fi

echo "OK: $DEST"
ls -lh "$DEST"
