#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/sync-upstream.sh [--force] [--no-push] [upstream_branch] [branch]

Default:
  upstream_branch = main
  branch          = main

Environment variables:
  UPSTREAM_REMOTE (default: upstream)
  ORIGIN_REMOTE   (default: origin)

Examples:
  ./scripts/sync-upstream.sh
  ./scripts/sync-upstream.sh main main
  ./scripts/sync-upstream.sh --force main main
  ./scripts/sync-upstream.sh --no-push
EOF
}

die() {
  printf "Error: %s\n" "$1" >&2
  exit 1
}

FORCE_PUSH=0
NO_PUSH=0
POSITIONAL=()

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --force)
      FORCE_PUSH=1
      shift
      ;;
    --no-push)
      NO_PUSH=1
      shift
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

if [ ${#POSITIONAL[@]} -gt 0 ]; then
  set -- "${POSITIONAL[@]}"
else
  set --
fi

if [ $# -gt 2 ]; then
  usage
  die "Too many arguments."
fi

UPSTREAM_BRANCH="${1:-main}"
TARGET_BRANCH="${2:-main}"
UPSTREAM_REMOTE="${UPSTREAM_REMOTE:-upstream}"
ORIGIN_REMOTE="${ORIGIN_REMOTE:-origin}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRUNE_SCRIPT="${SCRIPT_DIR}/prune-non-chinese-md.sh"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  die "Run this inside a git repository."
fi

if [ ! -x "$PRUNE_SCRIPT" ]; then
  die "Missing executable prune script: $PRUNE_SCRIPT"
fi

if ! git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1; then
  die "Remote '$UPSTREAM_REMOTE' does not exist."
fi

if ! git remote get-url "$ORIGIN_REMOTE" >/dev/null 2>&1; then
  die "Remote '$ORIGIN_REMOTE' does not exist."
fi

if [ -n "$(git status --porcelain)" ]; then
  die "Working tree is not clean. Commit or stash your changes first."
fi

printf "Fetching %s/%s and %s/%s...\n" \
  "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH" "$ORIGIN_REMOTE" "$TARGET_BRANCH"
git fetch "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH"
git fetch "$ORIGIN_REMOTE" "$TARGET_BRANCH" || true

UPSTREAM_REF="refs/remotes/${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}"
ORIGIN_REF="refs/remotes/${ORIGIN_REMOTE}/${TARGET_BRANCH}"

if git show-ref --verify --quiet "refs/heads/${TARGET_BRANCH}"; then
  git checkout "$TARGET_BRANCH"
else
  if git show-ref --verify --quiet "$ORIGIN_REF"; then
    git checkout -b "$TARGET_BRANCH" --track "$ORIGIN_REMOTE/$TARGET_BRANCH"
  else
    git checkout -b "$TARGET_BRANCH" "$UPSTREAM_REF"
  fi
fi

if git show-ref --verify --quiet "$ORIGIN_REF"; then
  git merge --ff-only "$ORIGIN_REF" || true
fi

if git merge-base --is-ancestor "$UPSTREAM_REF" HEAD; then
  printf "Local branch already contains %s/%s.\n" "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH"
else
  printf "Merging %s/%s into %s...\n" "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH" "$TARGET_BRANCH"
  git merge --no-edit -X ours "$UPSTREAM_REF"
fi

printf "Pruning non-Chinese Markdown files...\n"
"$PRUNE_SCRIPT"

if [ -f "README.md" ]; then
  perl -0pi -e 's/\*\*\[English\]\(README_EN\.md\)\*\* \| 中文/中文/g' README.md
fi

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "chore: sync upstream and keep Chinese-only docs"
else
  printf "No new changes after sync and prune.\n"
fi

if [ "$NO_PUSH" -eq 1 ]; then
  printf "Skip push because --no-push is set.\n"
  exit 0
fi

printf "Pushing %s to %s...\n" "$TARGET_BRANCH" "$ORIGIN_REMOTE"
if [ "$FORCE_PUSH" -eq 1 ]; then
  git push --force-with-lease "$ORIGIN_REMOTE" "$TARGET_BRANCH"
else
  git push "$ORIGIN_REMOTE" "$TARGET_BRANCH"
fi

printf "Sync complete: %s/%s -> %s/%s (Chinese-only)\n" \
  "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH" "$ORIGIN_REMOTE" "$TARGET_BRANCH"
