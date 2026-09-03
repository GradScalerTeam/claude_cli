# Status Line

A two-line custom status line for Claude Code CLI that shows git context on the first line and session context on the second.

---

## What It Looks Like

```
github_project_code/claude_cli | main   +2 *1 ~3  /  ↑1
[Sonnet · high]  ███░░ 23%  |  5h 41%  ·  7d 18%
```

---

## Line 1 — Workspace & Git

```
github_project_code/claude_cli | main   +2 *1 ~3  /  ↑1
└──────────────────────────────┘   └──┘   └──────┘    └──┘   └──┘
         path (2 segments)        branch  local changes  /   remote
```

| Segment | Meaning | Color |
|---|---|---|
| `path` | Last 2 directory segments of current working dir | Default |
| `branch` | Current git branch name | Cyan bold |
| `+N` | Staged files | Green underline |
| `*N` | Modified (unstaged) files | Yellow underline |
| `~N` | Untracked files | Red underline |
| `/` | Separator between local and remote | Dim |
| `↑N` | Commits ahead of remote | Blue underline |
| `↓N` | Commits behind remote | Magenta underline |

If the directory isn't a git repo, only the path is shown.

---

## Line 2 — Session Context

```
[Sonnet · high]  ███░░ 23%  |  5h 41%  ·  7d 18%
└─────────────┘  └─────────┘    └──────────────────┘
  model · effort  context bar     rate limit usage
```

### Model · Effort

`[Sonnet · high]` — model name from the JSON input, effort level read from `~/.claude/settings.json` (`effortLevel` field, written by `/effort`).

| Effort | Color |
|---|---|
| `low`, `medium` | Green |
| `high` | Yellow |
| `max` | Red |
| `auto` (default) | Dim |

### Context Bar

`███░░ 23%` — 5-character progress bar showing how full the context window is.

| Usage | Color |
|---|---|
| < 50% | Green |
| 50–79% | Yellow |
| ≥ 80% | Red |

### Rate Limit Usage

`5h 41%  ·  7d 18%` — percentage of the 5-hour and 7-day rate limits consumed. Only shown for Pro/Max plans after the first API call of the session.

| Usage | Color |
|---|---|
| < 50% | Green |
| 50–79% | Yellow |
| ≥ 80% | Red |

---

## Install

Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the status line:

1. Read scripts/statusline-command.sh and save it to ~/.claude/statusline-command.sh with the exact same content. Make it executable (chmod +x).

2. Read my existing ~/.claude/settings.json (create it if it doesn't exist) and add this statusLine config, MERGING with whatever is already in the file — do not overwrite my other settings:

   "statusLine": { "type": "command", "command": "bash ~/.claude/statusline-command.sh" }

3. Check that `jq` and `git` are installed — the script needs both. If jq is missing, tell me the install command for my platform.

The status line appears after the next assistant message — no restart needed.
```

## Check for Updates

Already installed and want the latest version? Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and check for updates to the status line script:

Compare scripts/statusline-command.sh with my local version at ~/.claude/statusline-command.sh. Tell me what changed. If there are updates, ask me whether I want you to explain the changes first or pull them straight into my local file — and re-run `chmod +x` afterwards if you replace it.
```

## Manual Setup

**1. Copy the script to `~/.claude/`:**

```bash
cp scripts/statusline-command.sh ~/.claude/statusline-command.sh
chmod +x ~/.claude/statusline-command.sh
```

**2. Add to `~/.claude/settings.json`:**

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

The status line updates after each assistant message. Changes to the script take effect on the next interaction — no restart needed.

---

## Requirements

- `jq` — used to parse JSON from Claude Code's stdin and to read `settings.json`
- `git` — for branch and change detection
- A terminal with ANSI color support
