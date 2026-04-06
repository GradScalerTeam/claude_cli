# Assistant Team Patterns

Practical patterns for structuring Claude-powered assistant teams without turning your entire digital life into one giant shared context.

---

## The Core Principle

Do not start with one mega-assistant that can read everything.

A better default is to separate:

1. execution teams
2. orchestration teams
3. reflection teams

This keeps prompts cleaner, permissions safer, and context more relevant.

---

## Recommended Three-Layer Setup

### 1. Work assistant team

Use this for:

- projects
- meetings
- specs
- PRs
- issue triage
- release workflows

Typical write scope:

- `work/`
- company project repositories
- work docs

### 2. Life assistant team

Use this for:

- personal planning
- routines
- health tracking
- finances
- learning goals
- household coordination

Typical write scope:

- `life/`
- personal journals
- habit trackers
- personal planning files

### 3. Daily reflection assistant

This should usually be a **separate personal operating system project**, not part of work or life directly.

Its job is:

- summarize
- ask reflection questions
- surface tradeoffs
- identify drift
- suggest priorities for tomorrow

Its job is **not** to deeply execute work tasks or rewrite your source material.

---

## Should Work And Life Be Separate?

In most cases, yes.

A split setup is better when:

- you want clean boundaries
- you handle sensitive work files
- work and personal prompts have very different styles
- you do not want every assistant to see every domain

One combined setup is only better if:

- your work and personal systems are intentionally merged
- you are comfortable with broader context sharing
- privacy boundaries are not a concern

For most people, **two execution teams plus one reflection layer** is the healthier long-term structure.

---

## Two Good Operating Modes

### Mode A: Strict separation

Best for privacy and focus.

Pattern:

- work team reads and writes only work files
- life team reads and writes only life files
- reflection assistant reads only exported summaries from each side

Example contract:

- `work/daily-summary.md`
- `life/daily-summary.md`
- `reflection/journal/2026-03-24.md`

This is the safest default.

### Mode B: Unified overview

Best for people who want holistic planning.

Pattern:

- work and life teams remain separate for execution
- reflection assistant gets read-only access to both trees
- reflection assistant does not directly edit source files in either domain

This can work well, but only if you are comfortable with broader visibility.

---

## Recommended Permission Design

### Work team

- read/write inside work scope
- no life scope access

### Life team

- read/write inside life scope
- no work scope access

### Reflection team

- read-only by default
- prefer summary files over raw project trees
- do not modify work or life source files directly

If the reflection assistant needs to suggest changes, let it write into its own folder, then let the work or life team apply the changes.

---

## Suggested Directory Layout

```text
assistant-os/
├── work/
│   ├── CLAUDE.md
│   ├── daily-summary.md
│   └── projects/
├── life/
│   ├── CLAUDE.md
│   ├── daily-summary.md
│   └── domains/
└── reflection/
    ├── CLAUDE.md
    ├── inbox/
    ├── journal/
    └── weekly-review/
```

You can also keep `work/` and `life/` as fully separate repos and let `reflection/` import only their summary outputs.

---

## What The Reflection Assistant Should Read

Prefer these inputs:

- work summary
- life summary
- unfinished commitments
- today's calendar snapshot
- a small backlog of open loops

Avoid giving it unrestricted access to:

- entire source repositories
- private archives it does not need
- sensitive company directories

Reflection gets better from **good distilled inputs**, not maximum raw context.

---

## What The Reflection Assistant Should Output

Good outputs:

- what mattered today
- what is slipping
- what needs closure
- what should happen tomorrow
- tension between work and life goals

Bad outputs:

- direct edits across both domains
- silent modification of your original notes
- deeply operational work execution

---

## Best Practice Summary

1. Split work and life execution by default
2. Make reflection a separate layer
3. Prefer summary files over broad raw access
4. Keep reflection read-only unless there is a clear reason otherwise
5. Let execution teams apply changes in their own domains

This structure scales better, protects context quality, and keeps boundaries understandable.
