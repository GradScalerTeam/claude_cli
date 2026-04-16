# 5. Agent Modes — fetch, research, learn, maintain

The `local-brain` agent has 4 modes. Each serves a different moment in your workflow.

## Installing the Agent

```bash
# copy from this repo to your global agents
cp -r agents/local-brain ~/.claude/agents/local-brain
```

**Important:** After copying, open `~/.claude/agents/local-brain/local-brain.md` and update the vault path to match your setup:

```markdown
# find this line:
**Vault location:** `<VAULT_PATH>`

# change to your vault path:
**Vault location:** `~/Projects/obsidian_notes/your-vault-name/`
```

Also update the CLAUDE.md schema path in the same file.

---

## Mode: fetch

**Read-only.** Look up what you already know without modifying anything.

**When to use:**
- Starting a new project and want your stored preferences
- Need to recall a decision you documented months ago
- Want to check if you have knowledge on a topic before researching

**How it works:**

```
You: "what do I know about state management?"

Claude:
1. Reads wiki/index.md → finds redux-toolkit, zustand, context-api
2. Reads dev-graph.canvas → finds edges:
   redux-toolkit ◀──▶ alternative to ◀──▶ zustand
   redux-toolkit ──▶ extends ──▶ redux
3. Reads those wiki pages
4. Synthesizes: "You prefer Redux Toolkit for complex apps (high confidence)
   and Zustand for simpler cases (medium confidence). You moved away from
   Context API after finding re-render issues."
```

**Key rule:** Never writes anything. If it finds a gap, it mentions it: "You don't have a page on Jotai yet — want me to research it?"

---

## Mode: research

**Explore a new topic and add it to your wiki.**

**When to use:**
- Found an interesting article or project
- Want to deep-dive into a topic you don't know yet
- Someone sent you a URL worth saving
- Saw something cool on Instagram/Twitter/HN

**How it works:**

```
You: "research CSS anchor positioning — I saw it's shipping in browsers now"

Claude:
1. Web searches for CSS anchor positioning
2. Saves key sources to raw/articles/2026-04-16-css-anchor-positioning.md
3. Discusses findings: "Here's what's new — anchor() function, position-area,
   inset-area. This changes how you do popovers and tooltips."
4. You: "cool, add it — medium confidence, I haven't used it yet"
5. Creates wiki/dev/css-anchor-positioning.md with proper frontmatter
6. Adds node to dev-graph.canvas, creates edge to wiki/dev/css-positioning.md
7. Updates index.md and log.md
```

**Also works with URLs:**

```
You: "research this — https://example.com/some-interesting-article"

Claude: fetches the article, saves to raw/, discusses, compiles into wiki pages.
```

**And project discoveries:**

```
You: "I saw mempalace on Instagram — it's a spatial memory app, really cool UI"

Claude: saves to raw/projects/, creates wiki/inspiration/mempalace.md,
adds to inspiration-graph.canvas.
```

---

## Mode: learn

**Extract generalized knowledge from a work session.**

This is the most powerful mode. You've been working on a project for hours — correcting Claude, showing your preferences, making design decisions. At the end:

**When to use:**
- After a coding session where you taught Claude something
- When you want persistent preferences across all future projects
- After discovering a pattern that applies beyond the current project

**How it works:**

```
You (after 2 hours on a client project): "learn from this and update my brain"

Claude (in the project session):
1. Distills the conversation:
   - "User prefers React Query over useEffect for data fetching"
   - "User structures folders by feature, not by type"
   - "User corrected: never use inline styles for responsive, use Tailwind"
   - "User likes glassmorphism cards with backdrop-filter"
2. Strips project-specific details:
   ✗ "The /api/users endpoint..."  → stripped
   ✗ "Client X uses Supabase..."   → generalized to pattern
   ✓ "For SPAs, prefer React Query for server state"
3. Invokes local-brain agent in learn mode with the distilled learnings

Agent:
4. Categorizes: data-fetching → wiki/dev/, glassmorphism → wiki/design/
5. Checks existing pages — updates if exists, creates if new
6. Documents evolution: "Previously no opinion on data fetching libraries.
   Now: prefer React Query for server state, confirmed after building
   3 projects with it (2026-04-16)."
7. Updates canvas, index, log
```

**What gets captured vs stripped:**

| Captured (generalized) | Stripped (project-specific) |
|---|---|
| "Prefers React Query over useEffect" | "The /api/users endpoint returns paginated results" |
| "JWT in httpOnly cookies for SPAs" | "Client X uses Supabase for auth" |
| "Feature-based folder structure" | "The dashboard/ folder has 12 components" |
| "Glassmorphism: backdrop-filter + subtle border" | API keys, env vars, database schemas |

---

## Mode: maintain

**Audit the wiki for structural issues AND check if knowledge is outdated.**

Combines cleanup with freshness verification in one pass.

**When to use:**
- Periodically (weekly/monthly) to keep the wiki healthy
- Before starting a new project to ensure knowledge is current
- When the wiki feels messy or you suspect stale content

**How it works:**

```
You: "maintain my wiki"

Claude:
1. STRUCTURAL AUDIT:
   - Scans all wiki pages for valid frontmatter
   - Finds orphan pages (no inbound wikilinks)
   - Finds missing concepts (wikilinks to pages that don't exist)
   - Checks index.md completeness
   - Scans canvas files for dead nodes, orphan nodes, missing edges

2. FRESHNESS CHECK:
   - Identifies pages referencing libraries/frameworks with versions
   - Flags pages with old `updated` dates on fast-moving topics
   - Web searches for updates: "Redux Toolkit — any major changes?"

3. REPORT:
   ┌─────────────────────────────────────────────┐
   │ BROKEN (fix now):                           │
   │ - wiki/dev/old-page.md: dead wikilink to    │
   │   [[deleted-concept]]                       │
   │                                             │
   │ OUTDATED:                                   │
   │ - wiki/dev/nextjs-app-router.md: v14 info,  │
   │   v15 is out with breaking changes          │
   │                                             │
   │ STALE:                                      │
   │ - wiki/dev/graphql-patterns.md: low          │
   │   confidence, not updated in 4 months       │
   │                                             │
   │ MISSING:                                    │
   │ - [[zustand]] mentioned but no page exists  │
   │                                             │
   │ SUGGESTIONS:                                │
   │ - Merge jwt-auth.md and token-auth.md       │
   │   (80% overlap)                             │
   └─────────────────────────────────────────────┘

4. Asks before fixing — never auto-fixes silently
5. Applies approved fixes, updates log.md
```

---

## Configuring the Global Trigger

For `learn` mode to work from any project, add this to your global `~/.claude/CLAUDE.md`:

```markdown
## Local Brain — Shared Knowledge Base

I maintain a personal Obsidian vault at ~/Projects/obsidian_notes/your-vault-name/
that stores generalized developer knowledge across all projects.

**"Learn from this" / "Update my brain" / "Update shared brain"** — When I say
any of these phrases during or after a work session:
1. Distill the conversation into generalized, reusable learnings
2. Strip ALL project-specific details: no client names, file paths, API keys,
   business logic, code snippets from the specific project
3. Generalize: "In this project auth uses X" → "For apps with requirement Y,
   auth pattern X works because..."
4. Invoke the `local-brain` agent in `learn` mode, passing the distilled learnings

This wiki will be open-sourced — everything stored must be safe to share publicly.

Agent definition: ~/.claude/agents/local-brain.md
```

---

**Next:** [06 — Daily Workflow](06-DAILY-WORKFLOW.md)
