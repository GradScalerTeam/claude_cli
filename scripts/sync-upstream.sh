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

cleanup_macos_metadata() {
  find . -name '._*' -delete 2>/dev/null || true
}

remove_non_chinese_assets() {
  local extra_paths=(
    ".github/workflows/i18n-check.yml"
    "scripts/check-locale-sync.js"
    "locales/en.json"
  )

  local extra_path
  for extra_path in "${extra_paths[@]}"; do
    if git ls-files --error-unmatch "$extra_path" >/dev/null 2>&1; then
      git rm -f -- "$extra_path"
    elif [ -e "$extra_path" ]; then
      rm -f -- "$extra_path"
    fi
  done
}

normalize_chinese_docs() {
  while IFS= read -r -d '' markdown_file; do
    perl -0pi \
      -e 's/\*\*\[English\]\([^)]+\)\*\* \| 中文/中文/g' \
      -e 's/> \*\*中文版\*\* \| \[English\]\([^)]+\)/> **中文版**/g' \
      "$markdown_file"
  done < <(find . -type f -name "*.md" ! -path "./.git/*" -print0)
}

should_keep_markdown() {
  local rel_path="$1"
  local base_name
  base_name="$(basename "$rel_path")"

  if [[ "$rel_path" == "README.md" ]]; then
    return 0
  fi
  if [[ "$rel_path" == "中文入口.md" ]]; then
    return 0
  fi
  if [[ "$base_name" == *_CN.md ]]; then
    return 0
  fi
  if [[ "$rel_path" == "Claude Code 外链笔记/"* ]]; then
    return 0
  fi
  if [[ "$rel_path" == "docs/cn/"* ]]; then
    return 0
  fi

  return 1
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

cleanup_macos_metadata

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
  if ! git merge --no-edit -X ours "$UPSTREAM_REF"; then
    printf "Auto-resolving conflicts with Chinese-only policy...\n"

    unresolved_files=()
    while IFS= read -r conflict_file; do
      if [ -n "$conflict_file" ]; then
        unresolved_files+=("$conflict_file")
      fi
    done < <(git diff --name-only --diff-filter=U)

    if [ "${#unresolved_files[@]}" -eq 0 ]; then
      die "Merge failed but no conflict files were detected."
    fi

    for conflict_file in "${unresolved_files[@]}"; do
      if [[ "$conflict_file" == *.md ]]; then
        if should_keep_markdown "$conflict_file"; then
          git checkout --ours -- "$conflict_file"
          git add -- "$conflict_file"
        else
          git rm -f -- "$conflict_file"
        fi
      else
        git checkout --ours -- "$conflict_file"
        git add -- "$conflict_file"
      fi
    done

    if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
      die "Unresolved merge conflicts remain after auto-resolution."
    fi

    git commit --no-edit
  fi
fi

printf "Pruning non-Chinese Markdown files...\n"
"$PRUNE_SCRIPT"

printf "Removing non-Chinese support assets...\n"
remove_non_chinese_assets
normalize_chinese_docs
cleanup_macos_metadata

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
