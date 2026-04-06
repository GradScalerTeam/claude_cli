# How to Create Skills in Claude Code

This guide uses Claude Code's current skill model: a `SKILL.md` file plus optional supporting files in `.claude/skills/<skill-name>/` or `~/.claude/skills/<skill-name>/`.

---

## What A Skill Is

A skill is a reusable capability that Claude can apply automatically or that you can invoke directly with `/skill-name`.

Skills are the right tool when you want:

- a repeatable workflow
- a reusable slash command
- structured instructions for a recurring task
- supporting files such as templates, examples, or checklists

Anthropic's current docs also note that custom commands have effectively merged into the skill system. Old `.claude/commands/` files still work, but skills are the modern, more capable path.

---

## What "A Reusable Slash Command" Actually Means

This does not mean "make a shell alias." It means packaging a prompt workflow you repeat often into a Claude command you can reuse.

For example, imagine you keep typing:

```text
Review the API routes in src/routes for validation, auth, error handling, and missing tests. Output findings by severity.
```

If you say that all the time, it is already a good skill candidate. Once you turn it into a skill, you can just write:

```text
/review-api src/routes
```

What you are reusing is not just a short command. You are reusing:

- a stable goal: review API routes
- a stable checklist: validation, auth, error handling, tests
- a stable output format: findings by severity
- a variable input: which path to inspect this time

The easiest confusion is between these four things:

| Problem you are solving | Better fit |
|---|---|
| I keep repeating a long prompt | Skill |
| I need a specialist with its own role and tool scope | Subagent |
| I need something to happen every time automatically | Hook |
| I only want to shorten a shell command | shell alias or script |

So a "reusable slash command" is better understood as a Claude workflow command, not an operating-system command alias.

---

## When To Use A Skill vs A Subagent vs A Hook

| Use this | When you need |
|---|---|
| Skill | a repeatable workflow, custom command, or structured prompt |
| Subagent | a specialist role with its own prompt and optional tool limits |
| Hook | deterministic automation that must always execute |

Rule of thumb:

- **process** -> skill
- **specialist** -> subagent
- **guaranteed behavior** -> hook

---

## Where Skills Live

| Scope | Location | Use it for |
|---|---|---|
| Project | `.claude/skills/<name>/SKILL.md` | team-shared skills for one repo |
| Personal | `~/.claude/skills/<name>/SKILL.md` | your personal skills across projects |

Claude Code can also discover skills from nested `.claude/skills/` directories, which is useful in monorepos.

---

## A Minimal Skill

Example:

```markdown
---
name: explain-code
description: Explains code with analogies and diagrams. Use when teaching how code works.
---

When explaining code:
1. Start with a plain-language summary
2. Use a small diagram when helpful
3. Walk the reader through the control flow
4. Call out one common gotcha
```

This already gives you a `/explain-code` skill.

### A More Realistic Example

You can think of a skill as the upgrade path from a repeated prompt to a reusable slash command.

Handwritten prompt:

```text
Check the routes in src/api for input validation, auth, error handling, and missing tests.
```

Skill invocation:

```text
/review-api src/api
```

The `SKILL.md` is doing two jobs for you:

1. It freezes the review standard that should stay the same every time.
2. It leaves only the changing input, such as the target path, as an argument.

That is the biggest value of a skill: it turns repeated thinking into a reusable team workflow.

---

## Step-By-Step: Create A Good Skill

### Step 1: Decide Whether It Should Auto-Trigger Or Manual-Trigger

If the skill is general knowledge or a lightweight pattern, automatic invocation can be helpful.

If it is a deliberate workflow, such as deploys or migrations, make it manual:

```yaml
disable-model-invocation: true
```

### Step 2: Decide Whether It Should Run Inline Or In Forked Context

Use inline execution for lightweight guidance.

Use forked context for heavier workflows:

```yaml
context: fork
```

You can also specify an agent type to run the skill in a subagent context.

### Step 3: Write A Strong Description

The description teaches Claude when the skill is relevant.

Good descriptions say:

- what the skill does
- when to use it
- what kind of output or behavior to expect

### Step 4: Add Supporting Files If The Skill Is Complex

Skills can include:

- templates
- examples
- checklists
- scripts
- reference docs

Example structure:

```text
my-skill/
├── SKILL.md
├── template.md
├── examples/
│   └── sample.md
└── scripts/
    └── validate.sh
```

This is one of the biggest reasons to prefer skills over old-style custom commands.

### Step 5: Restrict Tool Access If Needed

If a skill should only read and analyze, keep tools narrow:

```yaml
allowed-tools: Read, Grep, Glob
```

If it needs shell access, be explicit.

### Step 6: Test It Both Ways

Test automatic invocation with a natural prompt.

Test direct invocation with:

```text
/my-skill-name args
```

If it never triggers automatically, the description is probably too vague.

---

## Useful Frontmatter Fields

These are the fields most worth knowing from Anthropic's current skills docs:

| Field | What it does |
|---|---|
| `name` | skill name and slash command |
| `description` | tells Claude when the skill should be used |
| `argument-hint` | shows expected arguments in autocomplete |
| `disable-model-invocation` | prevents automatic triggering |
| `user-invocable` | hide or show in the slash menu |
| `allowed-tools` | narrows tool access |
| `model` | overrides the model when the skill runs |
| `effort` | overrides the reasoning effort |
| `context` | set `fork` for forked execution |
| `agent` | choose which subagent type to use in forked execution |
| `hooks` | attach hook behavior to the skill lifecycle |

---

## Example: Manual Review Skill

```markdown
---
name: review-api
description: Reviews API routes for consistency, validation, and security.
argument-hint: [path-to-routes]
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
context: fork
---

Review `$ARGUMENTS` for:
1. input validation
2. auth and authorization
3. error handling consistency
4. response shape consistency
5. missing tests

Output findings by severity with file references.
```

This is a strong pattern for project skills because it is reusable, reviewable, and explicit.

If you look back at the earlier example, this is just a formalized version of a sentence you might say all the time:

```text
Review these API routes for me.
```

The difference is that it becomes a shared, auditable, parameterized `/review-api` command instead of a one-off chat instruction.

---

## Best Practices That Actually Matter

- Start with one repeated workflow that already hurts
- Prefer skills over one-off giant prompts
- Use supporting files instead of bloating `SKILL.md`
- Be explicit about invocation style: automatic or manual
- Use `context: fork` for heavy or noisy workflows
- Keep project-specific skills in the repo
- Keep personal habits in `~/.claude/skills/`

---

## Common Mistakes

### Treating every prompt as a skill

If the task is rare, keep it as a normal prompt until it repeats.

### Writing a vague description

Then Claude won't know when to trigger it.

### Stuffing everything into one `SKILL.md`

Use supporting files. That's what they are for.

### Confusing skills with hooks

A skill is optional and prompt-driven. A hook is deterministic and event-driven.

---

## Good Starter Skills For Most Teams

1. `review-api`
2. `release-checklist`
3. `triage-bug`
4. `write-changelog`
5. `deploy-preview`

Pick the one workflow your team repeats most often and start there.

---

## Next Guide

Once skills and subagents exist, make sure your day-to-day workflow actually uses them:

- [HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)
- [HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)
