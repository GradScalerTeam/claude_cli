#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/export-public-pr.sh [--force] [--base BRANCH] [source_branch] [public_branch]

Defaults:
  source_branch = current branch
  public_branch  = source_branch
  base_branch    = main

Behavior:
  - Pushes the selected branch to the public remote
  - Prints a gh pr create command for the public fork
EOF
}

die() {
  printf "Error: %s\n" "$1" >&2
  exit 1
}

FORCE_PUSH=0
BASE_BRANCH="main"
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
    --base)
      [ $# -ge 2 ] || die "--base requires a branch name."
      BASE_BRANCH="$2"
      shift 2
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

if [ ${#POSITIONAL[@]} -gt 2 ]; then
  usage
  die "Too many arguments."
fi

SOURCE_BRANCH="${POSITIONAL[0]:-}"
TARGET_BRANCH="${POSITIONAL[1]:-}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  die "Run this inside the private git repository."
fi

if ! git remote get-url public >/dev/null 2>&1; then
  die "Remote 'public' does not exist."
fi

if [ -z "$SOURCE_BRANCH" ]; then
  SOURCE_BRANCH="$(git branch --show-current)"
fi

if [ -z "$SOURCE_BRANCH" ]; then
  die "Detached HEAD detected. Check out a branch before exporting."
fi

if [ -z "$TARGET_BRANCH" ]; then
  TARGET_BRANCH="$SOURCE_BRANCH"
fi

if ! git show-ref --verify --quiet "refs/heads/${SOURCE_BRANCH}"; then
  die "Local branch '${SOURCE_BRANCH}' does not exist."
fi

if [ -n "$(git status --porcelain)" ]; then
  die "Working tree is not clean. Commit or stash your changes first."
fi

PUBLIC_REMOTE_URL="$(git remote get-url public)"
if [[ "$PUBLIC_REMOTE_URL" =~ github\.com[:/](.+)\.git$ ]]; then
  PUBLIC_REPO="${BASH_REMATCH[1]}"
else
  die "Could not parse GitHub repo from public remote URL: $PUBLIC_REMOTE_URL"
fi

PUBLIC_OWNER="${PUBLIC_REPO%%/*}"

printf "Pushing %s to %s/%s...\n" "$SOURCE_BRANCH" "$PUBLIC_REPO" "$TARGET_BRANCH"
if [ "$FORCE_PUSH" -eq 1 ]; then
  git push --force "public" "${SOURCE_BRANCH}:refs/heads/${TARGET_BRANCH}"
else
  git push --force-with-lease "public" "${SOURCE_BRANCH}:refs/heads/${TARGET_BRANCH}"
fi

cat <<EOF

Public fork updated.

Run this to open the PR:
gh pr create \
  --repo ${PUBLIC_REPO} \
  --base ${BASE_BRANCH} \
  --head ${PUBLIC_OWNER}:${TARGET_BRANCH} \
  --fill
EOF
