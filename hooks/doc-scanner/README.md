# Doc Scanner

A Claude Code `SessionStart` hook that surfaces your project's markdown documentation at the beginning of a session so Claude knows what already exists before it starts working.

---

## What It Is

`doc-scanner.sh` solves a simple but expensive problem:

teams write docs, but Claude does not automatically know those docs exist unless you keep reminding it.

This hook scans the repo for markdown files and prints a compact documentation index at session start.

That means Claude begins the conversation already aware of:

- `CLAUDE.md`
- planning docs
- feature flow docs
- issue docs
- resolved docs
- debug docs
- agent and skill definitions that are stored in markdown

---

## Why It Matters

Without a doc-aware session start, the workflow often degrades into:

1. user asks Claude to work on a feature
2. Claude does not know a plan already exists
3. Claude re-plans or misses prior decisions
4. the team wastes time and drifts from documented intent

With doc scanner:

1. Claude sees the documentation index immediately
2. Claude can choose the relevant docs to read next
3. existing decisions are easier to preserve

This hook is one of the easiest ways to make documentation actually influence future Claude sessions.

---

## What It Does

At `SessionStart`, the script:

1. scans the project for `.md` files
2. skips common junk directories such as dependency, build, and git directories
3. separately picks up `.claude/agents/` and `.claude/skills/` markdown where relevant
4. prints a structured preview of the discovered docs
5. caps previews to avoid flooding the context window

The hook does **not** force Claude to read every doc. It gives Claude an index so it can decide what is relevant next.

---

## Best Use Cases

Use this hook when:

- your repo already has meaningful docs
- you use planning or flow docs heavily
- multiple people or agents work in the same repo over time
- you want Claude to preserve prior decisions instead of improvising each session

If your repository has almost no docs, this hook will be less useful until you start creating them.

---

## Recommended Scope

You can install this hook in two places:

| Scope | File | When to use it |
|---|---|---|
| User | `~/.claude/settings.json` | you want it for most projects |
| Project | `.claude/settings.json` | you want the team to share it in one repo |

If your organization relies heavily on docs, a **project-level install** is often the best choice because everyone benefits from the same behavior.

---

## Install It Manually

### Step 1: Copy the script

```bash
cp hooks/doc-scanner/doc-scanner.sh ~/.claude/doc-scanner.sh
chmod +x ~/.claude/doc-scanner.sh
```

### Step 2: Register the hook

Add this to your Claude Code settings:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/doc-scanner.sh"
          }
        ]
      }
    ]
  }
}
```

If you already have hooks configured, merge this entry instead of replacing the whole section.

### Step 3: Restart Claude Code

Start a fresh session so the hook runs on the next `SessionStart` event.

---

## Pair It With `CLAUDE.md`

This hook works best when your project or user memory tells Claude to respect existing docs.

A useful `CLAUDE.md` pattern is:

```md
## Doc-First Workflow
- At the start of a session, review the documentation index if the doc-scanner hook ran.
- Read the relevant planning or flow docs before making changes in that area.
- If code changes invalidate an existing doc, call that out and update the doc after implementation.
```

The hook provides discovery.
`CLAUDE.md` provides behavior.

---

## Customization

The script exposes a few simple tuning points:

| Setting | Why you might change it |
|---|---|
| preview line count | shorter or richer previews |
| max preview file count | control context size in very large repos |
| search depth | reduce cost in monorepos or include deeper docs |
| excluded directories | skip generated or irrelevant markdown |

If your project generates docs automatically, add those generated directories to the exclusion list.

---

## Install It Via Claude Code

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and install the
Doc Scanner hook.

1. Read `hooks/doc-scanner/doc-scanner.sh`.
2. Save it as `~/.claude/doc-scanner.sh`.
3. Make it executable.
4. Merge a `SessionStart` hook into my Claude Code settings that runs
   `bash ~/.claude/doc-scanner.sh`.
5. After installing, explain what the hook prints and how it should influence future sessions.
```

---

## Check For Updates

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and compare the
latest `hooks/doc-scanner/doc-scanner.sh` with my local `~/.claude/doc-scanner.sh`.

If they differ:
1. show me the meaningful changes,
2. update my local script,
3. explain whether the scan behavior or output shape changed.
```

---

## Final Advice

This hook is low drama and high leverage.

If your team already writes good docs, install this so Claude actually starts seeing them.
