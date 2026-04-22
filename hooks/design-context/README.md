# Design Context

A Claude Code `SessionStart` hook for Pencil that gives design sessions awareness of the parent application's routes, docs, components, and architectural context.

---

## What It Is

When Claude Code runs inside a Pencil `.pen` workspace, the working directory is usually `design/`, not the project root.

That causes a context gap:

- the parent `CLAUDE.md` may not auto-load
- planning docs may not be visible
- component and route context may be missing
- Claude may waste the first part of the session rediscovering the app

`design-context-hook.sh` bridges that gap by generating a `design/CLAUDE.md` from the parent project context.

---

## Who This Is For

Use this hook if:

- you use [Pencil](https://www.pencil.dev/)
- your `.pen` files live in a `design/` folder inside an app repo
- you want Claude to design with knowledge of the actual product instead of designing in isolation

If you do not use Pencil, you can safely skip this hook.

---

## What It Does

When Claude Code starts inside a qualifying `design/` directory, the hook:

1. detects the parent project
2. verifies the parent looks like a real repo
3. reads key context from the parent `CLAUDE.md`
4. indexes important docs and source locations
5. writes a generated `design/CLAUDE.md`
6. prints a short summary of what context was injected

If the session is not inside a Pencil design workspace, the hook exits quietly.

---

## Why It Matters

Without this hook, a design session often starts with avoidable exploratory reads just to answer:

- what routes exist?
- what screens already exist?
- which docs describe this flow?
- what backend APIs or data shapes matter?

With the hook, Claude begins the session with a compact but durable context layer and can spend more of the session actually designing.

---

## Safety Boundary

This hook is most useful when it preserves a clear boundary:

- read parent-project context for research
- write only inside the `design/` workspace
- do not silently edit the application code outside `design/`

That boundary keeps Pencil sessions useful without turning them into uncontrolled app-wide coding sessions.

---

## Recommended Project Layout

```text
my-project/
├── CLAUDE.md
├── docs/
├── frontend/
├── backend/
└── design/
    └── screens.pen
```

The hook assumes a design workspace nested inside a real project.

---

## Recommended Scope

| Scope | File | When to use it |
|---|---|---|
| User | `~/.claude/settings.json` | you use Pencil across many projects |
| Project | `.claude/settings.json` | your team shares a Pencil-based design workflow in one repo |

If Pencil is central to the repo's workflow, a project-level hook can make sense. If it is a personal tool, user-level is usually cleaner.

---

## Install It Manually

### Step 1: Copy the script

```bash
cp hooks/design-context/design-context-hook.sh ~/.claude/design-context-hook.sh
chmod +x ~/.claude/design-context-hook.sh
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
            "command": "bash ~/.claude/design-context-hook.sh"
          }
        ]
      }
    ]
  }
}
```

Merge it into any existing hooks configuration.

### Step 3: Open a Pencil design session

On the next qualifying session, the hook should generate `design/CLAUDE.md` automatically.

---

## Install It Via Claude Code

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and install the
Design Context hook.

1. Read `hooks/design-context/design-context-hook.sh`.
2. Save it as `~/.claude/design-context-hook.sh`.
3. Make it executable.
4. Merge a `SessionStart` hook into my Claude Code settings that runs
   `bash ~/.claude/design-context-hook.sh`.
5. After installing, explain what parent-project context the hook injects and what
   write boundary it should respect.
```

---

## What To Customize

You may want to adapt:

| Area | Why customize it |
|---|---|
| parent source directories | your frontend/backend folders use different names |
| extracted `CLAUDE.md` sections | your headings differ from the script's assumptions |
| indexed source file types | you use different extensions or extra directories |
| gitignore behavior | you want `design/CLAUDE.md` committed or ignored |

If your repo structure differs from the default assumptions, edit the variables near the top of the script before rolling it out widely.

---

## Pair It With Doc Scanner

These two hooks do different jobs:

- `doc-scanner` helps ordinary coding sessions discover docs
- `design-context` helps Pencil sessions inherit app context from the parent project

If you use both, Claude is much less likely to design screens that ignore existing implementation reality.

See [../doc-scanner/README.md](../doc-scanner/README.md).

---

## Check For Updates

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and compare the
latest `hooks/design-context/design-context-hook.sh` with my local
`~/.claude/design-context-hook.sh`.

If they differ:
1. show me the meaningful changes,
2. update my local script,
3. explain whether the injected context, project detection, or safety boundary changed.
```

---

## Final Advice

Install this only if Pencil is part of your real workflow.

When it is, this hook removes a large amount of repetitive context gathering from every design session.
