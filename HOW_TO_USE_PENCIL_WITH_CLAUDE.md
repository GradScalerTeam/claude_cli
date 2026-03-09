# How to Use Pencil with Claude Code CLI

A guide to designing UI screens in [Pencil](https://www.pencil.dev/) with full project context — so Claude designs with real routes, real data shapes, and real component structures instead of guessing.

---

## What is Pencil?

**Pencil** is a Mac-native design application that integrates Claude Code via MCP (Model Context Protocol). It provides a visual canvas for creating UI designs using `.pen` files, with AI-assisted design generation powered by Claude.

### Key Features
- Visual design canvas with component-based workflow
- AI-powered design generation (insert, update, copy, delete, replace nodes)
- Reusable component system (buttons, inputs, navbars, modals, etc.)
- Screenshot verification of generated designs
- Multi-agent parallel design (spawn designer agents for concurrent work)
- Variables and theming system

### How to Get It
- Visit [pencil.dev](https://www.pencil.dev/) to download the Mac application
- Pencil integrates Claude Code as its AI backend via MCP tools
- When you open a `.pen` file, Claude Code starts with access to both the design tools AND your full development environment (file system, bash, git, etc.)

---

## How Pencil + Claude Code Works

When you open a `.pen` file in Pencil, it launches Claude Code under the hood. Claude gets two sets of tools:

1. **Pencil MCP tools** — for reading and writing `.pen` design files (`batch_design`, `batch_get`, `get_screenshot`, `snapshot_layout`, etc.)
2. **Full Claude Code capabilities** — file system access, bash, git, web search, agents, hooks, skills

The working directory is set to wherever the `.pen` file lives. For project design files, this is typically a `design/` subfolder.

This means Claude can both **design screens** and **read your codebase** in the same session. That's what makes Pencil + Claude so powerful — designs can be driven by actual code, not guesswork.

---

## The Problem: The Context Gap

When Claude Code runs in your **terminal** (normal CLI usage), the working directory is your project root:

```
/MyProject/                 ← Claude starts here
├── CLAUDE.md                ← Auto-loaded (project context)
├── docs/                    ← Scanned by doc-scanner hook
│   └── planning/*.md
├── frontend/src/            ← Accessible for research
├── backend/                 ← Accessible for research
└── design/
    └── screens.pen
```

Claude automatically reads `CLAUDE.md`, the doc-scanner hook indexes all `.md` files, and full project context is available from the start.

But when Claude Code runs inside **Pencil**, the working directory is `design/`:

```
/MyProject/design/          ← Claude starts here
└── screens.pen              ← Only this exists

CLAUDE.md?    NOT auto-loaded (it's in the parent directory)
docs/?        NOT scanned (doc-scanner looks in pwd only)
frontend/?    NOT indexed
backend/?     NOT indexed
```

**Result**: Claude in Pencil has zero project awareness. It doesn't know about routes, user flows, data models, planning docs, or existing code. Every design session starts from scratch.

### Why This Matters

Without project context, Claude:
- Designs forms with **guessed field names** instead of actual API fields
- Creates screens without knowing the **user flow** or step progression
- Uses **placeholder content** instead of real data shapes
- Doesn't know about **Redux state**, API responses, or conditional rendering
- Has to be told about every **convention**, branding rule, and design decision

---

## The Solution: Design Context Hook

We built a **SessionStart hook** that automatically bridges project knowledge into Pencil design sessions. It generates a `design/CLAUDE.md` file that gives Claude full project awareness at ~1,600 tokens — replacing the ~15,000+ tokens of manual research that would otherwise happen in conversation context.

Full setup and technical details: **[hooks/design-context/](hooks/design-context/)**

### What the Hook Does

1. Detects when `pwd` ends with `/design` (safe no-op for all other sessions)
2. Crawls the parent project — extracts overview, user flow, routes, roles from `CLAUDE.md`
3. Indexes file paths from `docs/`, `frontend/src/Pages/`, `frontend/src/Components/`, and `backend/api/`
4. Generates a `design/CLAUDE.md` with all context + auto-research rules
5. Outputs a summary showing what was injected

### Auto-Research Rules

The generated `CLAUDE.md` includes behavioral instructions that Claude follows automatically. When you say "design the onboarding page," Claude:

1. Matches "onboarding" to the screen-to-research mapping
2. Reads `../frontend/src/Pages/Onboarding/OnboardingPage.jsx` automatically
3. Checks `../docs/planning/` for relevant planning docs
4. Uses actual field names, state shapes, and validation rules from the code
5. Designs with full knowledge — no manual prompting needed

---

## Step-by-Step: Your First Pencil + Claude Design Session

### Step 1: Set Up Your Project Structure

Your project should have a `design/` subfolder for `.pen` files:

```
my-project/
├── CLAUDE.md               ← project context (required)
├── docs/
│   └── planning/
│       └── dashboard-feature.md
├── frontend/
│   └── src/
│       ├── Pages/
│       │   ├── Dashboard/DashboardPage.jsx
│       │   └── Auth/LoginPage.jsx
│       └── Components/
│           ├── Navbar.jsx
│           └── Sidebar.jsx
├── backend/
│   └── api/
│       ├── dashboard.py
│       └── auth.py
└── design/                  ← .pen files go here
    └── app-screens.pen
```

### Step 2: Install the Design Context Hook

Follow the setup instructions in **[hooks/design-context/README.md](hooks/design-context/README.md)** — or paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the design context hook:

1. Read hooks/design-context/design-context-hook.sh — save it to ~/.claude/design-context-hook.sh with the exact same content. Make it executable (chmod +x).

2. Read my existing ~/.claude/settings.json (create it if it doesn't exist) and add a SessionStart hook that runs "bash ~/.claude/design-context-hook.sh". Merge it with any existing hooks — don't overwrite them.

After installing, tell me it's done and explain what the hook does.
```

### Step 3: Open Your .pen File in Pencil

Open the `.pen` file from your `design/` folder in the Pencil app. Claude Code will start, the SessionStart hooks will fire, and you'll see:

```
Design Context Hook
===================
Project: my-project
Parent: /Users/you/projects/my-project

Injected into design/CLAUDE.md:
  - Project overview, user flow, routes, roles from CLAUDE.md
  - 3 planning doc(s) indexed
  - 12 frontend page(s) listed
  - 5 frontend component(s) listed
  - 4 backend API route file(s) listed

  Auto-research rules active: Claude will read relevant
  docs and code automatically before designing screens.
```

### Step 4: Design With Context

Now just ask Claude to design. It already knows your project:

```
"Design the dashboard page with the sidebar nav and main content area.
 Show the user's active sessions and recent activity."
```

Claude will:
1. Check the auto-research mapping for "dashboard"
2. Read `../frontend/src/Pages/Dashboard/DashboardPage.jsx` to understand data flow
3. Check `../docs/planning/dashboard-feature.md` if it exists
4. Design the screen using actual field names, real state shapes, and correct route structure
5. Use Pencil MCP tools (`batch_design`, `batch_get`, etc.) to create the design in your `.pen` file

---

## Tips for Effective Design Sessions

### 1. Have a Good CLAUDE.md

The hook extracts sections from your project's `CLAUDE.md`. The more structured your `CLAUDE.md` is, the better context Claude gets. Key sections to include:

- `## Project Overview` — what the app does, who it's for
- `## User Flow` — step-by-step flow through the app
- `## Frontend Routes` — all routes with their components
- `## Two User Roles` (or `## User Roles`) — different user types and their access levels

### 2. Have Planning Docs

If you're designing a screen for a feature that has a planning doc under `docs/planning/`, Claude will find and read it automatically. The more detailed the planning doc, the more accurate the design.

### 3. Use the Screen-to-Research Mapping

The auto-research rules map screen topics to code paths. When you describe what you want to design, use clear terms that map to your codebase — "dashboard", "onboarding", "auth", "profile", "comparison", etc.

### 4. Verify With Screenshots

After Claude generates a design, ask for a screenshot to verify it visually:

```
"Take a screenshot of the dashboard screen we just built"
```

Pencil's `get_screenshot` tool captures the current state of any node in the `.pen` file.

### 5. Read-Only Parent Access

Claude can read any file in the parent project for research, but it cannot modify files outside `design/`. If a design reveals that code changes are needed (e.g., missing API endpoint, wrong data structure), Claude will tell you instead of making the changes.

### 6. Use Parallel Agents for Multiple Screens

For larger design tasks, you can ask Claude to spawn multiple designer agents that work on different screens simultaneously:

```
"Design all 5 onboarding screens in parallel — each agent handles one screen"
```

Each agent gets the same project context from `design/CLAUDE.md` and can independently research the code it needs.

---

## How It Fits the GradScaler Workflow

The design context hook extends the standard workflow into the design phase:

```
1. PLAN        →  global-doc-master creates a planning doc
2. REVIEW      →  global-review-doc reviews the doc
3. ITERATE     →  fix findings, re-review until READY
4. DESIGN      →  open Pencil, design screens with full context  ← NEW
5. BUILD       →  hand the doc + designs to agents
6. CODE REVIEW →  global-review-code audits the implementation
7. SHIP        →  fix findings, re-review, deploy
```

The planning doc drives both the design and the code. Claude in Pencil reads the same planning docs that the development agents will follow, ensuring designs and implementations stay aligned.

---

## Troubleshooting

### Hook didn't run
- Make sure the hook is registered in `~/.claude/settings.json` under `SessionStart`
- Verify the script is executable: `chmod +x ~/.claude/design-context-hook.sh`
- Check that your `.pen` file is inside a folder named `design/` (not `designs/`, `ui/`, etc.)

### No project context generated
- Verify the parent directory has either a `CLAUDE.md` file or a `.git` directory
- The hook requires the `design/` folder to be exactly one level below the project root

### Missing sections in design/CLAUDE.md
- The hook extracts sections by `##` heading name from your `CLAUDE.md`. If your headings don't match (e.g., `## Routes` instead of `## Frontend Routes`), edit the `awk` patterns in the script
- Sections that don't exist in your `CLAUDE.md` are simply skipped — this is normal

### design/CLAUDE.md keeps regenerating
- This is intentional. The file is regenerated every session to pick up any changes in the parent project. Don't edit it manually — edit the parent `CLAUDE.md` instead

---

*This guide covers using Pencil with Claude Code CLI for context-aware UI design. For Pencil app documentation, visit [pencil.dev](https://www.pencil.dev/).*
