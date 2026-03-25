#!/usr/bin/env bash

set -euo pipefail

die() {
  printf "Error: %s\n" "$1" >&2
  exit 1
}

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  die "Run this inside a git repository."
fi

to_delete=()

while IFS= read -r -d '' file_path; do
  rel_path="${file_path#./}"
  base_name="$(basename "$rel_path")"
  keep=0

  if [[ "$rel_path" == "README.md" ]]; then
    keep=1
  fi
  if [[ "$rel_path" == "中文入口.md" ]]; then
    keep=1
  fi
  if [[ "$base_name" == *_CN.md ]]; then
    keep=1
  fi
  if [[ "$rel_path" == "Claude Code 外链笔记/"* ]]; then
    keep=1
  fi
  if [[ "$rel_path" == "docs/cn/"* ]]; then
    keep=1
  fi

  if [[ "$keep" -eq 0 ]]; then
    to_delete+=("$rel_path")
  fi
done < <(find . -type f -name "*.md" ! -path "./.git/*" -print0)

if [[ "${#to_delete[@]}" -eq 0 ]]; then
  printf "No non-Chinese Markdown files found.\n"
  exit 0
fi

git rm -f -- "${to_delete[@]}"
printf "Removed %s non-Chinese Markdown files.\n" "${#to_delete[@]}"
