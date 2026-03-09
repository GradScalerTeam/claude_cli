# Design Context — SessionStart Hook for Pencil

A **SessionStart hook** that automatically bridges your project's codebase knowledge into [Pencil](https://www.pencil.dev/) design sessions. When you open a `.pen` file in Pencil, Claude Code starts with full awareness of your project — routes, components, docs, API shapes — without you reading anything manually.

---

## Why Use It

Pencil is a Mac-native design app that runs Claude Code via MCP (Model Context Protocol). You design on a visual canvas using `.pen` files, and Claude generates UI components, layouts, and screens using Pencil's design tools.

The problem: Pencil's `.pen` files typically live in a `design/` subfolder of your project. When Claude Code starts inside Pencil, the working directory is `design/` — not the project root. That means:

- `CLAUDE.md` doesn't auto-load (it's in the parent directory)
- The doc-scanner hook finds nothing (no `.md` files in `design/`)
- Claude has zero knowledge of your routes, components, data models, or planning docs
- Every design session starts with 5-10 manual `Read` calls to understand the project

**This hook fixes that.** It detects the `design/` directory, crawls the parent project, and generates a `design/CLAUDE.md` with everything Claude needs — project overview, user flows, routes, file indexes, and auto-research rules. Claude starts every Pencil session fully context-aware.

---

## What It Does

When Claude Code starts inside a `design/` directory, the hook:

1. **Detects** that the working directory is a `design/` subfolder of a project
2. **Verifies** the parent directory is a real project (has `CLAUDE.md` or `.git`)
3. **Extracts** key sections from the parent project's `CLAUDE.md` — overview, user flow, routes, roles, conventions
4. **Indexes** file paths from `docs/`, `frontend/src/Pages/`, `frontend/src/Components/`, and `backend/api/`
5. **Generates** `design/CLAUDE.md` with all collected context + auto-research rules
6. **Outputs** a summary showing what was injected

If the working directory is NOT a `design/` folder, the hook silently exits — safe to run globally.

---

## What It Looks Like

When you open a `.pen` file in Pencil, Claude sees:

```
Design Context Hook
===================
Project: my-app
Parent: /Users/you/projects/my-app

Injected into design/CLAUDE.md:
  - Project overview, user flow, routes, roles from CLAUDE.md
  - 6 planning doc(s) indexed
  - 30 frontend page(s) listed
  - 8 frontend component(s) listed
  - 6 backend API route file(s) listed

  Auto-research rules active: Claude will read relevant
  docs and code automatically before designing screens.
```

And the generated `design/CLAUDE.md` becomes part of Claude's system prompt — always available, never compacted.

---

## The Context Window Trade-Off

This is the key design decision behind the hook. `CLAUDE.md` content loads into the **system prompt**, which has different properties than conversation context:

| Memory Space | Behavior | Used By |
|---|---|---|
| System Prompt | Fixed size, never compacted, always present | `CLAUDE.md` files |
| Conversation Context | Grows with each message, periodically compacted | Tool results, messages |

The generated `design/CLAUDE.md` costs ~1,600 tokens in the system prompt. Without the hook, Claude does 5-10 `Read` calls at the start of each session, dumping ~15,000+ tokens into conversation context that eventually gets compacted.

**With the hook**: ~1,600 tokens (fixed, permanent) replaces ~15,000+ tokens (temporary, compactable). Claude also only reads specific files on-demand when a task requires deep detail — targeted 2-3K reads instead of exploratory 15K dumps.

---

## Before vs After

### Without Hook

```
User: "Design the product comparison view"

Claude: Let me check what routes exist...
        *reads ../CLAUDE.md*                         → 3,000 tokens
        Let me find the comparison component...
        *reads ../frontend/src/Pages/Comparison/*    → 4,000 tokens
        What data does it show?
        *reads ../backend/api/products.py*           → 2,000 tokens
        What's the Redux state?
        *reads ../frontend/src/store/slices/*        → 3,000 tokens

        Total research cost: ~12,000 tokens in conversation context
        Time before designing: several minutes
```

### With Hook

```
User: "Design the product comparison view"

Claude: *already knows from system prompt:
         - route is /products/comparison/:id
         - uses ProductComparisonView.jsx
         - has 3 categories: specs/pricing/reviews
         - planning docs available at ../docs/planning/*

        *auto-research rule triggers:
         reads ComparisonView.jsx for data flow*     → 2,000 tokens

        *starts designing immediately with accurate data*

        Total research cost: ~2,000 tokens (targeted read)
        Time before designing: seconds
```

---

## How the Auto-Research Rules Work

The most powerful feature is the auto-research rules baked into the generated `CLAUDE.md`. These are behavioral instructions that Claude follows automatically:

When you say "design the onboarding page," Claude doesn't wait for you to say "read the onboarding code first." The rules instruct Claude to:

1. Match "onboarding" to the screen-to-research mapping
2. Automatically read `../frontend/src/Pages/Onboarding/OnboardingPage.jsx`
3. Automatically check if `../docs/planning/` has a relevant planning doc
4. Use the actual field names, state shapes, and validation rules from the code
5. Then design with full knowledge

This creates a **research-first design workflow** that's automatic, not manual.

The rules also enforce **read-only access** — Claude can read any parent project file for research, but is forbidden from writing, editing, or running git operations outside `design/`. If a design task reveals code changes are needed, Claude tells you instead of making them.

---

## Setup

### Prerequisites

- macOS with [Pencil](https://www.pencil.dev/) installed
- Claude Code configured (`~/.claude/` directory exists)
- A project with a `design/` subfolder containing `.pen` files

### Step 1: Copy the script

```bash
cp design-context-hook.sh ~/.claude/design-context-hook.sh
chmod +x ~/.claude/design-context-hook.sh
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
            "command": "bash ~/.claude/design-context-hook.sh"
          }
        ]
      }
    ]
  }
}
```

If you already have a `hooks` section in your settings, just add a new entry to the `SessionStart` array alongside your existing hooks. Don't replace them.

### Step 3: Set up your project

Make sure your project has a `design/` subfolder:

```
my-project/
├── CLAUDE.md           ← project context lives here
├── docs/               ← planning docs, feature specs
├── frontend/src/       ← React/Next.js pages and components
├── backend/            ← API routes
└── design/             ← your .pen files go here
    └── screens.pen
```

### Step 4: (Optional) Add to .gitignore

Since `design/CLAUDE.md` is auto-generated every session, you may want to gitignore it:

```
design/CLAUDE.md
```

Or commit it so team members without the hook can still benefit from the context.

### Step 5: Test

Open any `.pen` file in Pencil. You should see the "Design Context Hook" summary in the session output, and `design/CLAUDE.md` should appear in your `design/` folder.

---

## Install via Claude CLI

Paste this into your Claude CLI to install automatically:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the design context hook:

1. Read hooks/design-context/design-context-hook.sh — save it to ~/.claude/design-context-hook.sh with the exact same content. Make it executable (chmod +x).

2. Read my existing ~/.claude/settings.json (create it if it doesn't exist) and add a SessionStart hook that runs "bash ~/.claude/design-context-hook.sh". Merge it with any existing hooks — don't overwrite them.

After installing, tell me it's done and explain what the hook does.
```

---

## Customization

### Adapting to Your Project Structure

The hook looks for these directories by default:

| Variable | Default Path | What It Indexes |
|---|---|---|
| `DOCS_DIR` | `$PROJECT_ROOT/docs` | Planning docs, feature specs (`.md` files) |
| `FRONTEND_DIR` | `$PROJECT_ROOT/frontend/src` | Pages and components (`.jsx`/`.tsx` files) |
| `BACKEND_DIR` | `$PROJECT_ROOT/backend` | API routes (`.py`/`.js`/`.ts` files) |
| `CLAUDE_MD` | `$PROJECT_ROOT/CLAUDE.md` | Project overview, flows, routes, roles |

If your project uses different paths (e.g., `src/` instead of `frontend/src/`, or `server/` instead of `backend/`), edit the variables at the top of the script.

### Extracting Different CLAUDE.md Sections

The hook uses `awk` to extract sections by heading name. If your `CLAUDE.md` uses different heading names (e.g., `## Routes` instead of `## Frontend Routes`), update the `awk` patterns in the script to match.

### Adding More Source Directories

To index additional directories (e.g., `shared/`, `lib/`, `mobile/`), add a new block following the same pattern as the existing frontend/backend blocks:

```bash
if [ -d "$PROJECT_ROOT/mobile/src" ]; then
  MOBILE_FILES=$(find "$PROJECT_ROOT/mobile/src" \( -name "*.jsx" -o -name "*.tsx" \) -print 2>/dev/null | sort)
  if [ -n "$MOBILE_FILES" ]; then
    echo "## Mobile Screens" >> "$DESIGN_CLAUDE_MD"
    echo "" >> "$DESIGN_CLAUDE_MD"
    echo "$MOBILE_FILES" | while read -r file; do
      REL_PATH="${file#$PROJECT_ROOT/}"
      echo "- \`../$REL_PATH\`" >> "$DESIGN_CLAUDE_MD"
    done
    echo "" >> "$DESIGN_CLAUDE_MD"
  fi
fi
```

---

## Pair It With Doc Scanner

This hook works alongside the [Doc Scanner hook](../doc-scanner/). When both are registered:

1. **Doc Scanner** indexes `.md` files in the current directory (useful when `design/` has its own docs)
2. **Design Context Hook** bridges the parent project's full context into `design/CLAUDE.md`

They complement each other — doc scanner handles local awareness, design context handles cross-project awareness.

---

## How It Fits the Workflow

```
Open .pen file in Pencil
    │
    ▼
Claude Code starts (pwd = design/)
    │
    ▼
SessionStart event fires
    │
    ├──→ doc-scanner.sh (indexes local .md files)
    │
    └──→ design-context-hook.sh
          │
          ├── Detects design/ subfolder
          ├── Crawls parent project
          ├── Generates design/CLAUDE.md
          └── Prints summary
    │
    ▼
Claude reads design/CLAUDE.md into system prompt
    │
    ▼
Claude has full project context + auto-research rules
    │
    ▼
User: "Design the dashboard"
    │
    ▼
Claude auto-reads dashboard component + planning doc
    │
    ▼
Designs with accurate data, real field names, correct flows
```
