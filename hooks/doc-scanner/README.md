# Doc Scanner — SessionStart Hook

A **SessionStart hook** that automatically scans your project for `.md` documentation files every time you start a new Claude CLI conversation. It gives Claude immediate awareness of your existing docs — planning specs, feature flows, agent definitions, README files, and anything else written in markdown.

---

## Why Use It

Most projects accumulate documentation over time — planning docs, feature specs, flow diagrams, issue reports, debug guides, README files, and CLAUDE.md files. The problem is that Claude starts every conversation with zero knowledge of what docs exist in your project. You have to manually say "read the planning doc" or "check the docs folder" every time.

This hook fixes that. At the start of every conversation, Claude automatically receives a **documentation index** — a list of every `.md` file in your project with a preview of the first 15 lines. Claude knows what docs exist, what they're about, and can read the relevant ones before starting any work.

**The result:** Claude works with your existing plans and decisions instead of starting from scratch. If you have a planning doc for a feature, Claude follows it. If you have a flow doc describing how authentication works, Claude reads it before touching auth code. Your documentation becomes a living part of every conversation.

---

## What It Does

When you start a new Claude CLI session inside any project, the hook:

1. **Scans** your entire project (up to 6 levels deep) for `.md` files
2. **Skips** irrelevant directories — `node_modules`, `.venv`, `.git`, `dist`, `build`, `.next`, `coverage`, and other common junk
3. **Separately scans** `.claude/agents/` and `.claude/skills/` to pick up agent and skill definitions
4. **Outputs a structured index** with the file path and first 15 lines of each file
5. **Caps the output** at 25 file previews to avoid overwhelming the context — remaining files are listed with just their title

Claude sees this index in the conversation context and uses it to understand what documentation exists before doing any work.

---

## What It Looks Like

When you start a session, Claude sees output like this:

```
Project Documentation Index
===========================
Found 8 documentation file(s) in: /Users/you/projects/my-app

Use this index to understand what docs exist before starting work.
Read relevant docs fully when they relate to the user's task.

--- CLAUDE.md ---
# My App
Project instructions and conventions...
  ... (+45 more lines)

--- README.md ---
# My App
A brief description of the project...
  ... (+30 more lines)

--- docs/planning/auth-feature.md ---
# Feature: Authentication System
| Status | Complete |
| Type | Planning |
Detailed auth implementation plan...
  ... (+200 more lines)

--- .claude/agents/backend-builder.md ---
---
name: backend-builder
description: "Builds backend features..."
---
  ... (+80 more lines)
```

---

## Setup

### Step 1: Copy the script

Copy `doc-scanner.sh` to your Claude CLI config directory:

```bash
cp doc-scanner.sh ~/.claude/doc-scanner.sh
chmod +x ~/.claude/doc-scanner.sh
```

### Step 2: Register the hook

Open `~/.claude/settings.json` (create it if it doesn't exist) and add the `SessionStart` hook:

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

If you already have a `hooks` section in your settings, just add the `SessionStart` array alongside your existing hooks. Don't replace them.

### Step 3: Restart Claude

Quit your current Claude CLI session and start a new one. The doc scanner will run automatically.

---

## Install via Claude CLI

Paste this into your Claude CLI to install automatically:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the doc scanner hook:

1. Read hooks/doc-scanner/doc-scanner.sh — save it to ~/.claude/doc-scanner.sh with the exact same content. Make it executable.

2. Read my existing ~/.claude/settings.json (create it if it doesn't exist) and add a SessionStart hook that runs "bash ~/.claude/doc-scanner.sh". Merge it with any existing hooks — don't overwrite them.

After installing, start a new session and confirm the doc scanner runs.
```

---

## Pair It With CLAUDE.md

The doc scanner gives Claude the **index**. To make Claude actually **use** it properly, add this to your global `~/.claude/CLAUDE.md`:

```markdown
## Doc-First Workflow
- At the start of every session, a **SessionStart hook** (`doc-scanner.sh`) automatically scans the project for `.md` files and outputs a documentation index with the first 15 lines of each file.
- **ALWAYS review this index** at the beginning of a conversation. It tells you what planning docs, feature specs, flow docs, agent definitions, and other documentation already exist.
- Before starting ANY work — feature development, bug fixes, refactoring, or new additions — **read the relevant docs fully** if they relate to the task. Existing docs contain decisions, conventions, architectural context, and prior work that MUST be understood before making changes.
- If the user asks to build something and a planning doc already exists for it, **follow that doc** as the source of truth. Don't re-plan from scratch.
- If changes you're making affect something that's already documented, **flag it** — suggest updating the doc after the work is done.
- When no docs exist for a feature/area, suggest creating one before jumping into code (unless the task is trivially small).
```

This combination — the hook provides the data, the CLAUDE.md instruction tells Claude how to use it — ensures every conversation starts doc-aware.

---

## Customization

The script has three variables you can adjust at the top:

| Variable | Default | What It Controls |
|---|---|---|
| `PREVIEW_LINES` | `15` | Number of lines shown per file. Increase for more context, decrease to keep output shorter. |
| `MAX_PREVIEW_FILES` | `25` | Files beyond this count only show their title, not a preview. Prevents context overflow in large projects. |
| `-maxdepth 6` | `6` | How deep the scanner searches. Reduce for large monorepos, increase if docs are deeply nested. |

### Adding More Excluded Directories

If your project has directories that generate `.md` files you don't want scanned (like auto-generated API docs), add them to the prune list in the `find` command:

```bash
-o -name "your-directory" \
```

Add it inside the `\( ... \) -prune` block.

---

## How It Fits the Workflow

```
Session Start
    │
    ▼
doc-scanner.sh runs automatically
    │
    ▼
Claude receives documentation index
    │
    ▼
User asks to work on something
    │
    ▼
Claude checks index → reads relevant docs fully
    │
    ▼
Claude works with full context of existing plans and decisions
```

This is the missing piece between "having docs" and "Claude actually knowing about them." Without it, your planning docs sit in `docs/` and Claude doesn't know they exist unless you tell it every time. With it, Claude starts every conversation already aware of what's been planned, decided, and documented.
