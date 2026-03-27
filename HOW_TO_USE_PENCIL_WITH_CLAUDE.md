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

## How Context Works: Pencil's Repository Selection

Pencil now lets you choose the **repository root** as the working directory, even if your `.pen` file lives in a subfolder like `design/`. This means Claude Code starts with full project context automatically:

```
/MyProject/                 ← Claude starts here (you select this in Pencil)
├── CLAUDE.md                ← Auto-loaded (project context)
├── docs/                    ← Scanned by doc-scanner hook
│   └── planning/*.md
├── frontend/src/            ← Accessible for research
├── backend/                 ← Accessible for research
└── design/
    └── screens.pen          ← The file you're designing
```

Because Claude initializes from the project root, everything works out of the box:
- `CLAUDE.md` is auto-loaded with project context
- The doc-scanner hook indexes all `.md` files
- Claude has full access to your codebase for research

No extra hooks or workarounds needed.

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

### Step 2: Open Your .pen File in Pencil

Open the `.pen` file in Pencil and **select your project root** as the repository when prompted. This ensures Claude starts with the full project as its working directory.

### Step 3: Design With Context

Now just ask Claude to design. It already knows your project:

```
"Design the dashboard page with the sidebar nav and main content area.
 Show the user's active sessions and recent activity."
```

Claude will:
1. Read your `CLAUDE.md` and planning docs for project context
2. Read `frontend/src/Pages/Dashboard/DashboardPage.jsx` to understand data flow
3. Check `docs/planning/dashboard-feature.md` if it exists
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
2. FIX         →  global-doc-fixer reviews, fixes, and repeats until READY
3. DESIGN      →  open Pencil, design screens with full context  ← NEW
4. BUILD       →  hand the doc + designs to agents
5. CODE REVIEW →  global-review-code audits the implementation
6. SHIP        →  fix findings, re-review, deploy
```

The planning doc drives both the design and the code. Claude in Pencil reads the same planning docs that the development agents will follow, ensuring designs and implementations stay aligned.

---

## Troubleshooting

### Claude doesn't have project context in Pencil
- Make sure you selected the **project root** as the repository in Pencil, not the `design/` subfolder
- Verify your project root has a `CLAUDE.md` file

### Doc scanner hook didn't run
- Make sure the doc-scanner hook is registered in `~/.claude/settings.json` under `SessionStart`
- Verify the script is executable: `chmod +x ~/.claude/doc-scanner.sh`

---

*This guide covers using Pencil with Claude Code CLI for context-aware UI design. For Pencil app documentation, visit [pencil.dev](https://www.pencil.dev/).*
