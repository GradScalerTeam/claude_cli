# How to Create Subagents in Claude Code

This guide uses the current Claude Code model: specialized **subagents** managed through `/agents` and stored as Markdown files with YAML frontmatter.

---

## What A Subagent Is

A subagent is a specialist Claude can delegate to for a certain kind of task.

Use a subagent when you want:

- a focused role
- a reusable system prompt
- narrower tool access
- cleaner main-session context

Examples:

- code reviewer
- test runner
- migration reviewer
- frontend builder
- release manager

A subagent is **not** the right tool for every repeated prompt. If the problem is a reusable workflow or command, a skill is often better.

---

## When To Use A Subagent vs A Skill vs A Hook

| Use this | When you need |
|---|---|
| Subagent | a specialist role with its own prompt, context, and optional tool limits |
| Skill | a repeatable workflow, custom command, or knowledge playbook |
| Hook | deterministic automation that must run every time |

Rule of thumb:

- **role** -> subagent
- **workflow** -> skill
- **guarantee** -> hook

---

## Recommended Path: Use `/agents`

Anthropic's current subagent docs recommend `/agents` as the main management interface.

Inside Claude Code:

```text
/agents
```

From there you can:

- create a new subagent
- choose user scope or project scope
- edit the system prompt
- configure tool access
- delete or update existing subagents

This is better than manually hand-editing files for most people because the interface makes tool configuration and scope more obvious.

---

## Choose The Right Scope

| Scope | Location | Use it for |
|---|---|---|
| Project | `.claude/agents/` | team-shared specialists for one repo |
| User | `~/.claude/agents/` | personal specialists you want everywhere |

Project subagents take precedence when names conflict.

If a subagent encodes project architecture or conventions, it should usually be project-scoped and committed to git.

---

## Step-By-Step: Create A Good Subagent

### Step 1: Define One Clear Responsibility

Bad:

- "does frontend, backend, testing, and deployment"

Good:

- "reviews changed code for correctness and maintainability"
- "runs tests after meaningful code changes"
- "implements React UI that matches our design system"

Focused subagents are easier to trust and easier for Claude to delegate correctly.

### Step 2: Write A Strong Description

The description tells Claude when the subagent should be used.

Good description qualities:

- names the job clearly
- says when to use it
- says what it optimizes for
- can include phrases like "use proactively" if you want automatic delegation to happen more often

Example:

```yaml
description: Reviews recent code changes for correctness, security, and maintainability. Use proactively after any meaningful code change.
```

### Step 3: Limit Tools To What It Needs

If the subagent only reviews code, it might only need:

- `Read`
- `Grep`
- `Glob`
- `Bash`

If it edits files, then add edit tools deliberately.

Smaller tool sets improve safety and reduce unnecessary behavior.

### Step 4: Put Project Context In The Prompt

A good subagent prompt includes:

- what the role is
- where to look first
- what standards matter most
- how to report results
- what not to do

Example guidance:

- read `CLAUDE.md` first
- focus on changed files before broad exploration
- preserve existing architecture patterns
- do not change deployment files without explicit confirmation

### Step 5: Test Both Invocation Paths

A subagent should work:

- when Claude chooses it automatically
- when you invoke it explicitly

Example explicit invocation:

```text
Use the code-reviewer subagent to inspect my recent auth changes.
```

If automatic delegation never happens, the description is usually too vague.

---

## Example Subagent File

You can manage subagents through `/agents`, but it helps to understand the file format.

```markdown
---
name: code-reviewer
description: Reviews changed code for correctness, security, and maintainability. Use proactively after meaningful code changes.
tools: Read, Grep, Glob, Bash
---

You are a senior code review specialist for this project.

Always:
1. Read `CLAUDE.md` first if present
2. Check the changed files before broadening scope
3. Look for correctness, security, edge cases, and missing tests
4. Report findings in priority order with file references

Do not make code changes unless explicitly asked.
```

---

## Best Practices That Actually Matter

- Start with one specialist, not ten
- Use project subagents for project-specific conventions
- Keep responsibilities narrow
- Keep descriptions action-oriented and specific
- Limit tool access where practical
- Check subagents into version control if the team should share them
- Revisit prompts after real use, not just after initial creation

---

## Common Mistakes

### Making a "god agent"

One giant agent that supposedly does everything is harder to trigger correctly and harder to trust.

### Writing a vague description

If the description is generic, Claude will not know when to delegate.

### Forgetting `CLAUDE.md`

Subagents work much better when the project memory is already strong.

### Giving unnecessary tools

Don't hand edit or shell access to an agent that only needs to review.

---

## Good Starter Subagents For Most Teams

If you are not sure where to start, these usually pay off first:

1. `code-reviewer`
2. `test-runner`
3. `frontend-builder` or `api-builder`
4. `debugger`

Create them only after you see the repeated need in real sessions.

---

## Next Guide

Once you have a few roles in place, create skills for the workflows that repeat inside those roles:

- [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)
