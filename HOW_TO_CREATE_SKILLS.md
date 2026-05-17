# How to Create Skills in Claude CLI

A guide to understanding what skills are, how they differ from agents, and how to create your own.

---

## What is a Skill?

A skill in Claude CLI is a specialized capability that Claude can use — either when you invoke it directly with a slash command, or automatically when Claude decides it's relevant.

Think of it like a recipe. An agent is a chef who works independently. A skill is a recipe that any chef can follow. When you create a skill, you're defining a structured process — steps to follow, what to check, what output to produce — that Claude executes whenever the situation calls for it.

**In short: a skill is a reusable capability with a defined process. You invoke it with `/skill-name` and it runs a structured workflow.**

---

## What "A Reusable Slash Command" Actually Means

This does not mean "make a shell alias." It means packaging a prompt workflow you repeat often into a Claude command you can reuse.

For example, imagine you keep typing:

```text
Review the API routes in src/routes for validation, auth, error handling, and missing tests. Output findings by severity.
```

If you say that all the time, it is already a strong skill candidate. Once you turn it into a skill, you can just write:

```text
/review-api src/routes
```

What you are reusing is not just a shorter command. You are reusing:

- a stable goal
- a stable checklist
- a stable output format
- a variable input, such as which path to inspect

The easiest confusion is between these four things:

| Problem you are solving | Better fit |
|---|---|
| I keep repeating a long prompt | Skill |
| I need a specialist with its own role and tool scope | Agent |
| I need something to happen every time automatically | Hook |
| I only want to shorten a shell command | shell alias or script |

So a "reusable slash command" is better understood as a Claude workflow command, not an operating-system command alias.

---

## Skills vs Agents — When to Use Which

| | **Agent** | **Skill** |
|---|---|---|
| **Invoked with** | `@agent-name` | `/skill-name` or automatically |
| **Runs in** | Main context or background | Forked context (doesn't affect your conversation) |
| **Best for** | Building things — writing code, creating files, making changes | Analyzing things — reviewing, auditing, investigating, reporting |
| **Output** | Changes to your codebase | A structured report or analysis |
| **Autonomy** | Works independently, makes decisions | Follows a defined process step-by-step |
| **Examples** | Frontend builder, DB architect, test writer | Code reviewer, doc reviewer, security auditor |

**Rule of thumb**: if it produces code or files → agent. If it produces analysis or reports → skill.

---

## Where Skills Live

Skills are folders containing a `SKILL.md` file and optional reference files.

- **Global skills** live at `~/.claude/skills/` — available in every project
- **Local skills** live at `.claude/skills/` inside a specific project — only available in that project

```
~/.claude/skills/
└── my-skill/
    ├── SKILL.md              # Main skill definition
    └── references/           # Optional supporting files
        ├── checklist.md
        └── output-format.md
```

---

## How to Invoke a Skill

Once a skill exists, you invoke it with a slash command:

```
/my-skill-name path/to/target
```

Or describe what you need in natural language — Claude will detect the relevant skill and use it automatically if the skill's description matches your request.

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

## Prerequisites

To create skills easily, install the **plugin-dev** plugin which includes the skill-development skill. Inside a Claude CLI session:

```
/plugin
```

Browse the marketplace and install **plugin-dev**. This gives you the `/skill-development` skill that guides you through creating skills.

---

## Creating a Skill

### Step 1: Decide What the Skill Should Do

Before you type anything, be clear about:
- What specific process does this skill perform?
- What does it analyze or review?
- What are the phases or steps of the process?
- What does the output look like? (Report format, sections, severity levels)
- Does it need reference files? (Checklists, templates, output formats)

### Step 2: Use /skill-development

Inside your Claude CLI session, type:

```
/skill-development
```

Then describe what you want the skill to do in detail. The more specific you are about the process and output, the better the skill will be.

**Example — creating an API review skill:**
```
/skill-development

Create a skill called review-api. It should review API endpoints in this project
for consistency, security, and best practices. It should check that every endpoint
has proper input validation with Zod, uses the correct HTTP methods, returns
consistent response formats, has rate limiting where needed, and follows our naming
conventions. The output should be a report grouped by severity — Critical, Important,
and Minor — with exact file:line references for each finding.
```

**Example — creating a dependency audit skill:**
```
/skill-development

Create a skill called audit-deps. It should analyze our package.json, check for
outdated dependencies, known vulnerabilities, unused packages, and missing peer
dependencies. It should use context7 to verify that we're using current API patterns
for our major dependencies. The output should list each issue with the package name,
current version, recommended action, and risk level.
```

**Example — creating a migration review skill:**
```
/skill-development

Create a skill called review-migration. It should review database migrations before
they're run. It should check for destructive operations (dropping columns/tables),
missing indexes on foreign keys, data type changes that might lose data, and
operations that could lock tables for too long in production. Each finding should
include the migration file, the specific operation, the risk, and a recommendation.
```

**Example — creating a performance audit skill:**
```
/skill-development

Create a skill called audit-performance. It should analyze code for performance
issues — N+1 queries, missing database indexes, unnecessary re-renders in React
components, large bundle imports, missing lazy loading, synchronous operations that
should be async, and memory leaks from uncleared listeners or intervals. Output
should be a report with estimated impact (High/Medium/Low) and before/after code
examples for each fix.
```

### Step 3: Review and Refine

The skill development process will generate:
- A `SKILL.md` file with YAML frontmatter and the full skill definition
- Optional reference files (checklists, output templates)

Review it:
- Does the description accurately describe when to use this skill?
- Are all the phases/steps covered?
- Is the output format clear and structured?
- Are the right tools listed? (Read, Grep, Glob for analysis. Bash for git commands.)
- Is the context set to `fork`? (Skills should usually run in forked context)

If something's off, tell Claude what to adjust. Iterate until you're happy.

### Step 4: Use It

Once the skill folder is created, you can immediately use it:

```
/review-api src/routes/
```

```
/audit-deps
```

```
/review-migration prisma/migrations/20240115_add_notifications/
```

```
/audit-performance src/
```

---

## Skill File Structure

For reference, here's what a skill definition looks like:

```markdown
---
name: review-api
description: "Reviews API endpoints for consistency, security, and best practices. Use when you want to audit API routes before merging or deploying."
argument-hint: [path-to-api-routes]
context: fork
agent: Plan
allowed-tools: Read, Grep, Glob, Bash(ls/git log/git diff), context7
user-invocable: true
---

# API Review Skill

Review API endpoints for consistency, security, and best practices.

**Target**: `$ARGUMENTS`

## Phase 1: Discover API Structure
- Find all route files
- Map endpoints (method, path, handler)
- Identify middleware chain

## Phase 2: Validation Check
- Every endpoint has input validation?
- Zod schemas match expected request body?
- Query params validated?

## Phase 3: Security Check
- Rate limiting on sensitive endpoints?
- Auth middleware applied correctly?
- No sensitive data in URLs?

## Phase 4: Consistency Check
- Response format consistent across endpoints?
- Status codes correct and consistent?
- Error response format standardized?

## Output Format
[structured report template]
```

You don't have to write this manually — `/skill-development` generates it for you. But understanding the structure helps you refine it.

---

## Using Reference Files

Skills can have reference files that keep the main `SKILL.md` clean while providing detailed checklists, output templates, or domain-specific checks.

```
my-skill/
├── SKILL.md
└── references/
    ├── output-format.md        # Detailed output template
    ├── security-checklist.md   # Domain-specific checks
    └── framework-patterns.md   # Framework best practices
```

In your `SKILL.md`, reference them like:
```
Follow the output format in `references/output-format.md`.
Apply the security checks in `references/security-checklist.md`.
```

This keeps the main skill file focused on the process while reference files hold the details.

---

## Tips

- **Skills are for analysis, agents are for action** — if your skill starts wanting to modify files, it should probably be an agent instead
- **Define the output format clearly** — the more structured your output template, the more consistent and useful the skill's reports will be
- **Use `context: fork`** — skills should run in a forked context so they don't clutter your main conversation
- **Keep the main SKILL.md focused** — put detailed checklists and templates in reference files
- **Start broad, then specialize** — create a general review skill first, then create specialized ones for specific areas as you learn what matters most in your project
- **Local skills > global skills for project-specific checks** — if the skill checks against project conventions, make it local so it knows your specific patterns
