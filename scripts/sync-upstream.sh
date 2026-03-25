#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/sync-upstream.sh [--force] [upstream_branch] [origin_branch]

Default:
  upstream_branch = main
  origin_branch   = main

Environment variables:
  UPSTREAM_REMOTE (default: upstream)
  ORIGIN_REMOTE   (default: origin)

Examples:
  ./scripts/sync-upstream.sh
  ./scripts/sync-upstream.sh main main
  ./scripts/sync-upstream.sh --force main main
EOF
}

die() {
  printf "Error: %s\n" "$1" >&2
  exit 1
}

FORCE_PUSH=0
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
ORIGIN_BRANCH="${2:-main}"
UPSTREAM_REMOTE="${UPSTREAM_REMOTE:-upstream}"
ORIGIN_REMOTE="${ORIGIN_REMOTE:-origin}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  die "Run this inside a git repository."
fi

if ! git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1; then
  die "Remote '$UPSTREAM_REMOTE' does not exist."
fi

if ! git remote get-url "$ORIGIN_REMOTE" >/dev/null 2>&1; then
  die "Remote '$ORIGIN_REMOTE' does not exist."
fi

printf "Fetching %s/%s...\n" "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH"
git fetch "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH"

SRC_REF="refs/remotes/${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}"
DST_REF="refs/heads/${ORIGIN_BRANCH}"
PUSH_DESC="${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH} -> ${ORIGIN_REMOTE}/${ORIGIN_BRANCH}"

printf "Pushing %s...\n" "$PUSH_DESC"
if [ "$FORCE_PUSH" -eq 1 ]; then
  git push --force-with-lease "$ORIGIN_REMOTE" "${SRC_REF}:${DST_REF}"
else
  git push "$ORIGIN_REMOTE" "${SRC_REF}:${DST_REF}"
fi

printf "Sync complete: %s\n" "$PUSH_DESC"
