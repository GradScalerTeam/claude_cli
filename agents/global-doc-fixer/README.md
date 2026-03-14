# Global Doc Fixer Agent

The **Global Doc Fixer** is an autonomous doc-fixing agent for Claude Code CLI. It eliminates the manual review-fix loop — instead of you running `global-review-doc`, reading findings, fixing them, re-reviewing, fixing again (often 5-10+ times per document), this agent does the entire cycle for you. You point it at a document and it reviews, fixes, re-reviews, and repeats until the document is implementation-ready.

---

## Why Use It

- **Eliminates manual iteration** — No more running `/global-review-doc`, reading findings, manually editing, then reviewing again. The agent handles the full cycle autonomously.
- **Knows when to ask** — Auto-fixes factual errors (wrong file paths, line numbers, function names, outdated references) without bothering you. Only asks when there's a real decision to make — business logic, scope, architecture trade-offs.
- **MCQ-only questions** — When the agent does need your input, it asks structured multiple-choice questions with clear options and a "Let me explain" escape hatch. No vague open-ended questions.
- **Self-correcting** — After every fix, it verifies the edit didn't introduce new issues. It tracks whether each round has fewer findings than the last and stops if it detects oscillation.
- **Handles cascading fixes** — When one fix (e.g., removing a file reference) means updating tables, dependency sections, and commands throughout the doc, the agent catches all of them in one pass.

---

## When to Use It

**After `global-doc-master` creates a document.** The workflow is:

1. You tell `global-doc-master` to create a planning doc (or feature flow, issue doc, etc.)
2. The agent writes the document under `docs/`
3. You run `global-doc-fixer` on that document
4. The fixer agent reviews it, fixes all issues, re-reviews, and repeats until the verdict is **READY**
5. Only then do you hand the document to an agent for implementation

Previously, steps 3-4 were manual — you'd run `/global-review-doc`, read the findings, fix them yourself or ask `global-doc-master` to fix them, then re-review. This agent automates that entire loop.

**You should also use it when:**
- You have an existing doc that needs to be brought up to date before handing it to a development agent
- A doc was written by someone else and you want to verify and fix it against the codebase without doing it manually
- You want to make a doc "implementation-ready" — meaning an AI agent can build from it without asking questions

---

## How to Use It

There are two ways to invoke the agent:

1. **Using `@` mention** — type `@global-doc-fixer` followed by the document path
2. **Natural language** — say "use global doc fixer" and describe which document to fix

**Examples:**

```
@global-doc-fixer docs/planning/payment-system.md
```

```
@global-doc-fixer fix up the auth migration plan
```

```
@global-doc-fixer make docs/planning/user-analytics.md implementation-ready
```

The agent handles everything — runs the review, categorizes findings, fixes what it can, asks you MCQ questions for decisions, re-reviews, and repeats until done.

---

## How It Works

### The Review-Fix Cycle

```
Round 1: Review → 10-20 findings → fix most → re-review
Round 2: Review → 3-8 findings (some new from shifted content) → fix → re-review
Round 3: Review → 0-3 findings → fix → re-review
Round 4: Review → 0 Critical/Important → done
```

Typical documents converge in 2-4 rounds. The agent caps at 8 rounds — if it hasn't converged by then, something is structurally wrong and it flags it to you.

### What It Fixes Automatically

- Wrong file paths, line numbers, function names, class names, import paths
- Outdated code references (files that were renamed, functions that changed)
- Internal contradictions within the document
- Formatting issues and typos
- Missing guards or validations that the codebase already has

### What It Asks You About

- Business logic decisions (e.g., "should this endpoint require auth?")
- Architectural trade-offs (e.g., "REST vs WebSocket for notifications?")
- Scope decisions (e.g., "should admin dashboard be in v1 or v2?")
- Feature behavior choices where the doc is ambiguous

Every question is structured as multiple-choice with a "Let me explain" option so you can provide context the agent didn't anticipate.

### Completion Report

When done, the agent reports:
- Total rounds completed
- Summary of what was fixed (grouped by type)
- Any business logic decisions you made during the process
- Any remaining Minor items left as-is
- Final verdict: "Document is implementation-ready" or "Document needs X more decisions"

---

## Setup

### Prerequisite

The Global Doc Fixer depends on the **Global Review Doc** skill (`global-review-doc`). It uses this skill internally to run the 9-phase review on each cycle. Without it, the agent has nothing to review with and will not work.

Make sure you have it installed first — see the [Global Review Doc setup](../../skills/global-review-doc/README.md) for instructions.

### Fresh Install

To set up the Global Doc Fixer as a global agent in your Claude Code CLI, paste this prompt directly into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and read the file at agents/global-doc-fixer/global-doc-fixer.md — copy its entire content and create a new agent file at ~/.claude/agents/global-doc-fixer.md with the exact same content. Create the ~/.claude/agents/ directory if it doesn't exist. After installing, read the README.md in the same folder (agents/global-doc-fixer/README.md) and give me a summary of what this agent does and how to use it.
```

That's it. The agent is now available in every project you work on with Claude Code CLI.

### Check for Updates

Already have the Global Doc Fixer set up and want to check if there's a newer version? Paste this into your Claude CLI:

```
Fetch the latest version of global-doc-fixer.md from the GitHub repo https://github.com/GradScalerTeam/claude_cli at agents/global-doc-fixer/global-doc-fixer.md — compare it with my local version at ~/.claude/agents/global-doc-fixer.md. If there are any differences, show me what changed, update my local file to match the latest version, and give me a summary of what was updated and why it matters.
```
