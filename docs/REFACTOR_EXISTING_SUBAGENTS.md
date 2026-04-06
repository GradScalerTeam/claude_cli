# How To Refactor Existing Rough Subagents

This guide is not about creating a brand-new subagent from scratch. It is about the more common real-world situation:

- you already created a few subagents
- they feel rough, oversized, or unstable
- and now you want to make them easier to trust and easier for Claude to route correctly

The key idea is simple:

**Do not keep expanding old agent prompts. Split responsibilities first, reduce permissions second, and move repeatable procedures into skills.**

---

## First: make sure this is actually a subagent problem

Many "rough subagents" are really a layering problem.

Separate these four concepts before you refactor anything:

| What you really need | Better home |
|---|---|
| A focused specialist with its own prompt and boundaries | Subagent |
| A repeatable procedure or checklist | Skill |
| Something that must happen every time | Hook |
| A long-lived outer assistant with scheduling and memory | OpenClaw agent |

If one old agent is trying to do all of these:

- review code
- run tests
- write docs
- check inbox on a schedule
- keep long-term memory across projects

then the problem is not only wording. The agent is doing jobs from multiple layers at once.

---

## The six most common problems in rough old subagents

### 1. One agent tries to do too much

Typical phrasing:

- "handles frontend, backend, tests, deployment, and docs"
- "use this for any engineering task"

That usually leads to:

- poor auto-routing
- unstable output
- boundary violations
- lower trust

### 2. The `description` is too vague

If it only says something like:

```yaml
description: Helps with development.
```

Claude has very little signal for when to use it.

### 3. The tool scope is too large

A read-only review role often gets created with:

- edit permissions
- broad shell access
- wide file access

That makes boundaries fuzzy fast.

### 4. The prompt defines identity but not operating rules

Many older agents say:

- "You are a senior architect"
- "You are an expert full-stack engineer"

but never say:

- what to read first
- what standard matters most
- how to report results
- what not to do

### 5. A repeatable process was forced into an agent

Examples:

- API review checklist
- migration safety review
- release checklist

These are usually skills, not roles.

### 6. Project-level and user-level concerns are mixed together

If an agent encodes:

- repo architecture
- team conventions
- project commands

it is usually project-level, not a user-level global helper.

---

## The safest refactoring order

Do not rewrite ten agents at once. Refactor in this order.

### Step 1: inventory what you already have

Make a simple table for each existing agent:

| Old agent | Real responsibility | Trigger moment | Needs write access | Actually a process? |
|---|---|---|---|---|
| `super-helper` | review + tests + docs | after code changes | yes | partly |

Force yourself to answer:

- what is its single core responsibility
- when it should be triggered
- whether it really needs write access
- which parts should become skills instead

### Step 2: split the mega-agent into 2-4 narrow roles

For most repositories, the first useful set is small:

- `code-reviewer`
- `test-runner`
- `frontend-builder` or `api-builder`
- `debugger`

If docs are a major workflow, add:

- `doc-writer`

Do not start with ten agents. Start with a few high-frequency roles.

### Step 3: rewrite the `description`

The `description` is what tells Claude when the role is relevant.

A good one should say:

- what it does
- when to use it
- what it optimizes for

Bad:

```yaml
description: Helps with coding.
```

Better:

```yaml
description: Reviews changed code for correctness, edge cases, security, and missing tests. Use proactively after meaningful code changes.
```

### Step 4: reduce tool permissions

Start with the smallest viable scope:

- read-only analysis role: `Read, Grep, Glob, Bash`
- editing role: add edit tools only when needed
- no risky shell access by default unless the role truly depends on it

Smaller permissions usually produce more focused behavior.

### Step 5: turn the prompt into an operating guide

A mature agent prompt should say:

- what role it plays
- what to read first
- what standard matters most
- how to report results
- what not to do

Examples:

- read `CLAUDE.md` first
- inspect changed files before broadening scope
- preserve existing architecture patterns
- do not touch deployment unless explicitly asked

### Step 6: move repeated procedures into skills

Roles answer "who should do this."
Skills answer "what fixed procedure should be followed."

Example:

- `code-reviewer` is the role
- `/review-api` is the process
- `/check-migration-safety` is the process
- `/summarize-diff` is the process

If a block of reasoning gets repeated every time, that block probably belongs in a skill.

### Step 7: validate with real tasks

Each refactored agent should be tested against real work:

- does natural language trigger it correctly
- does explicit invocation work reliably
- does it stay inside its file and tool boundaries
- is its reporting format stable
- after 3-5 real tasks, does it still feel focused

---

## A before / after example

### Before: rough mega-agent

```markdown
---
name: super-helper
description: Helps with frontend, backend, tests, docs, deployments, and debugging.
tools: Read, Grep, Glob, Bash, Edit
---

You are a senior full-stack expert. Help with all engineering tasks.
```

Problems:

- too many responsibilities
- vague trigger conditions
- too much permission
- no clear read order, quality bar, or reporting rule

### After: roles + skills

#### Role 1: `code-reviewer`

```markdown
---
name: code-reviewer
description: Reviews changed code for correctness, security, edge cases, and missing tests. Use proactively after meaningful code changes.
tools: Read, Grep, Glob, Bash
---

You are a code review specialist for this repository.

Always:
1. Read `CLAUDE.md` first if present
2. Check the changed files before broadening scope
3. Look for correctness, regressions, and missing tests
4. Report findings in priority order with file references

Do not make code changes unless explicitly asked.
```

#### Role 2: `test-runner`

```markdown
---
name: test-runner
description: Runs the project's validation commands after meaningful code changes and helps explain failures.
tools: Read, Grep, Glob, Bash
---

You are responsible for running the smallest relevant validation command and reporting failures clearly.

Always:
1. Read `CLAUDE.md` first
2. Prefer the narrowest relevant test command
3. Report the failing command, failing area, and likely cause

Do not edit code unless explicitly asked.
```

#### Skill: `/review-api`

Move the repeatable checklist into a skill:

- validation
- auth
- error handling
- test coverage

That keeps the role small and the process reusable.

---

## Do not mix Claude CLI subagents with OpenClaw agents

If your old "agent" is really handling:

- scheduled inbox work
- long-term task tracking
- multi-channel intake
- persistent memory across projects

then it may not belong in the Claude CLI subagent layer at all.

A more stable split is usually:

- Claude CLI subagents: repository-local specialists
- OpenClaw agents: long-lived outer assistants
- OpenClaw subagents: temporary background workers for a single run

Do not collapse repository experts and long-lived assistant brains into the same layer.

---

## A practical refactor checklist

If you already have a pile of old subagents, run through this list:

1. List every existing agent.
2. Delete the broadest "do everything" one first.
3. Keep only 2-4 high-frequency roles.
4. Give each role one core responsibility.
5. Rewrite the `description`.
6. Reduce tool permissions.
7. Add "read first / do not do / report like this" guidance.
8. Move repeated procedures into skills.
9. Re-test with real tasks before adding more roles.

---

## If You Want Copy-Ready Templates

The repository now includes a minimal starter pack here:

- [subagent-refactor-starter/README.md](subagent-refactor-starter/README.md)

It includes copy-ready examples for:

- `.claude/agents/code-reviewer.md`
- `.claude/agents/test-runner.md`
- `.claude/skills/review-api/SKILL.md`
- `.claude/skills/check-migration-safety/SKILL.md`

The point is not to copy them unchanged. The point is to give you a small but realistic reference for the "roles + procedures" split.

---

## How to tell the refactor worked

You are probably moving in the right direction if:

- auto-selection gets more accurate
- you trust the default behavior more
- each role produces more stable output
- boundary violations decrease
- new repeatable work starts becoming skills instead of prompt bloat

---

## Next Reads

- [HOW_TO_CREATE_AGENTS.md](../HOW_TO_CREATE_AGENTS.md)
- [HOW_TO_CREATE_SKILLS.md](../HOW_TO_CREATE_SKILLS.md)
- [HOW_TO_START_ASSISTANT_SYSTEM.md](../HOW_TO_START_ASSISTANT_SYSTEM.md)
- [OPENCLAW_AND_CLAUDE_AGENTS.md](OPENCLAW_AND_CLAUDE_AGENTS.md)
