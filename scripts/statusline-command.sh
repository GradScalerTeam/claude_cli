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

# Session fields — used in line 2
MODEL=$(echo "$input" | jq -r '.model.display_name // "Claude"')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

# Shorten path to last 2 segments
short_path=$(echo "$cwd" | awk -F/ '{if(NF>1) print $(NF-1)"/"$NF; else print $NF}')

# ── LINE 1: Location + Git status ─────────────────────────────────────────────

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

    # Print line 1 — path | bold cyan branch [stats]
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

# ── LINE 2: Model · Effort  +  context bar ────────────────────────────────────

# Read effort level from settings.json — written by /effort command
EFFORT=$(jq -r '.effortLevel // "auto"' ~/.claude/settings.json 2>/dev/null || echo "auto")

# Color-code effort: low/medium = green (efficient), high = yellow, max = red, auto = dim
case "$EFFORT" in
  low|medium) EFFORT_COLOR="$GREEN" ;;
  high)       EFFORT_COLOR="$YELLOW" ;;
  max)        EFFORT_COLOR="$RED" ;;
  *)          EFFORT_COLOR="$DIM" ;;  # auto or unknown
esac

PCT_INT=${PCT:-0}

# Color-code context bar: green < 50%, yellow 50–79%, red 80%+
if [ "$PCT_INT" -ge 80 ]; then BAR_COLOR="$RED"
elif [ "$PCT_INT" -ge 50 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

# Build 5-char progress bar
FILLED=$((PCT_INT / 20))
EMPTY=$((5 - FILLED))
BAR=""
[ "$FILLED" -gt 0 ] && printf -v FILL "%${FILLED}s" && BAR="${FILL// /█}"
[ "$EMPTY" -gt 0 ] && printf -v PAD "%${EMPTY}s" && BAR="${BAR}${PAD// /░}"

# Rate limit used — only present for Pro/Max after first API call
# Color scale: green < 50%, yellow 50–79%, red 80%+
quota_5h_used=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty' 2>/dev/null)
quota_7d_used=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty' 2>/dev/null)

quota_str=""
if [ -n "$quota_5h_used" ]; then
  used_5h=$(echo "$quota_5h_used" | awk '{printf "%d", $1}')
  if [ "$used_5h" -ge 80 ]; then Q5_COLOR="$RED"
  elif [ "$used_5h" -ge 50 ]; then Q5_COLOR="$YELLOW"
  else Q5_COLOR="$GREEN"; fi
  quota_str="${DIM}5h${RESET} ${Q5_COLOR}${used_5h}%${RESET}"
fi
if [ -n "$quota_7d_used" ]; then
  used_7d=$(echo "$quota_7d_used" | awk '{printf "%d", $1}')
  if [ "$used_7d" -ge 80 ]; then Q7_COLOR="$RED"
  elif [ "$used_7d" -ge 50 ]; then Q7_COLOR="$YELLOW"
  else Q7_COLOR="$GREEN"; fi
  [ -n "$quota_str" ] && quota_str="${quota_str} ${DIM}·${RESET} "
  quota_str="${quota_str}${DIM}7d${RESET} ${Q7_COLOR}${used_7d}%${RESET}"
fi

line2="${DIM}[${RESET}${CYAN}${MODEL}${RESET} ${DIM}·${RESET} ${EFFORT_COLOR}${EFFORT}${RESET}${DIM}]${RESET}  ${BAR_COLOR}${BAR}${RESET} ${DIM}${PCT_INT}%${RESET}"
[ -n "$quota_str" ] && line2="${line2} ${DIM}|${RESET} ${quota_str}"
printf "%s\n" "$line2"
