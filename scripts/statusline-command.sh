#!/bin/bash

# ANSI codes — $'...' so bash resolves escapes at assignment time
BOLD=$'\033[1m'
UNDERLINE=$'\033[4m'
CYAN=$'\033[36m'
GREEN=$'\033[32m'
YELLOW=$'\033[33m'
BLUE=$'\033[34m'
MAGENTA=$'\033[35m'
RED=$'\033[31m'
DIM=$'\033[90m'
RESET=$'\033[0m'

# Read JSON input from stdin
input=$(cat)
cwd=$(echo "$input" | jq -r '.workspace.current_dir')

# Shorten path to last 2 segments
short_path=$(echo "$cwd" | awk -F/ '{if(NF>1) print $(NF-1)"/"$NF; else print $NF}')

# Check if in a git repository
if git -C "$cwd" rev-parse --git-dir > /dev/null 2>&1; then
  branch=$(git -C "$cwd" --no-optional-locks branch --show-current 2>/dev/null)

  if [ -n "$branch" ]; then
    local_info=""
    remote_info=""

    # Staged file count — green + underlined
    staged_count=$(git -C "$cwd" --no-optional-locks diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')
    if [ "$staged_count" -gt 0 ]; then
      [ -n "$local_info" ] && local_info="${local_info} "
      local_info="${local_info}${UNDERLINE}${GREEN}+${staged_count}${RESET}"
    fi

    # Unstaged/modified file count — yellow + underlined
    modified_count=$(git -C "$cwd" --no-optional-locks diff --numstat 2>/dev/null | wc -l | tr -d ' ')
    if [ "$modified_count" -gt 0 ]; then
      [ -n "$local_info" ] && local_info="${local_info} "
      local_info="${local_info}${UNDERLINE}${YELLOW}*${modified_count}${RESET}"
    fi

    # Untracked (new) file count — red + underlined
    untracked_count=$(git -C "$cwd" --no-optional-locks ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')
    if [ "$untracked_count" -gt 0 ]; then
      [ -n "$local_info" ] && local_info="${local_info} "
      local_info="${local_info}${UNDERLINE}${RED}~${untracked_count}${RESET}"
    fi

    # Ahead/behind remote — blue/magenta + underlined
    # Try configured upstream first, fall back to origin/<branch>
    upstream=$(git -C "$cwd" --no-optional-locks rev-parse --abbrev-ref @{upstream} 2>/dev/null)
    if [ -z "$upstream" ]; then
      git -C "$cwd" --no-optional-locks rev-parse "origin/${branch}" >/dev/null 2>&1 && upstream="origin/${branch}"
    fi
    if [ -n "$upstream" ]; then
      counts=$(git -C "$cwd" --no-optional-locks rev-list --left-right --count HEAD..."${upstream}" 2>/dev/null)
      if [ -n "$counts" ]; then
        ahead=$(echo "$counts" | awk '{print $1}')
        behind=$(echo "$counts" | awk '{print $2}')
        if [ "$ahead" -gt 0 ]; then
          [ -n "$remote_info" ] && remote_info="${remote_info} "
          remote_info="${remote_info}${UNDERLINE}${BLUE}↑${ahead}${RESET}"
        fi
        if [ "$behind" -gt 0 ]; then
          [ -n "$remote_info" ] && remote_info="${remote_info} "
          remote_info="${remote_info}${UNDERLINE}${MAGENTA}↓${behind}${RESET}"
        fi
      fi
    fi

    # Combine: local stats / remote stats
    git_stats=""
    [ -n "$local_info" ] && git_stats="${local_info}"
    [ -n "$remote_info" ] && git_stats="${git_stats} ${DIM}/${RESET} ${remote_info}"

    # Print — default color dir | bold cyan branch [stats]
    if [ -n "$git_stats" ]; then
      printf "%s ${DIM}|${RESET} ${BOLD}${CYAN}%s${RESET} %s\n" "$short_path" "$branch" "$git_stats"
    else
      printf "%s ${DIM}|${RESET} ${BOLD}${CYAN}%s${RESET}\n" "$short_path" "$branch"
    fi
  else
    printf "%s\n" "$short_path"
  fi
else
  printf "%s\n" "$short_path"
fi
