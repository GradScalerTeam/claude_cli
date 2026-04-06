# How to Start a New Project with Claude Code

A modern workflow for going from blank folder to implementation without turning Claude into a random code generator.

---

## The Goal

For a new project, Claude Code works best when you do these in order:

1. establish memory
2. plan before editing
3. review the plan
4. build in slices
5. review and test
6. preserve what you learned

This repository's tools are designed to strengthen each step.

---

## Step 1: Create The Project Folder And Start Claude

```bash
mkdir my-project
cd my-project
claude
```

Do not start by asking Claude to blindly scaffold everything. First create project memory.

---

## Step 2: Run `/init` And Create A Useful `CLAUDE.md`

Inside the first session:

```text
/init
```

Then improve the generated `CLAUDE.md` with:

- intended stack or decision criteria
- build/test/lint commands as they become known
- architecture constraints
- naming conventions
- risky directories
- third-party dependencies or compliance notes

For a new project, `CLAUDE.md` becomes the stable center of gravity that later agents and skills can rely on.

---

## Step 3: Use Plan Mode Before You Build

New projects invite premature coding. Resist that.

Enter Plan Mode if the project is more than a toy:

```text
/plan
```

Or start Claude in plan mode from the shell:

```bash
claude --permission-mode plan
```

Use Plan Mode to answer questions like:

- what stack best fits this project?
- what are the implementation phases?
- where are the highest-risk decisions?
- what should be in the first milestone?

Example prompt:

```text
I want to build a task management SaaS. Create a phased implementation plan,
propose a stack, list the core entities, and call out the biggest technical risks.
```

---

## Step 4: Create A Real Planning Doc With Global Doc Master

Once the direction is clear, use the documentation agent from this repo:

```text
@global-doc-master I want to build a task management SaaS. Create a planning doc
that covers requirements, user journeys, data model, APIs, milestones, testing,
and deployment assumptions.
```

Ask it to produce a plan under `docs/planning/`.

The better your planning doc, the less re-explaining you will do later.

Include:

- product scope
- user flows
- domain model
- core routes / screens / APIs
- test strategy
- non-functional requirements
- explicit out-of-scope items

---

## Step 5: Review The Plan Before You Build

Run the document review skill:

```text
/global-review-doc docs/planning/your-project-plan.md
```

You are looking for:

- vague requirements
- missing edge cases
- unsafe assumptions
- missing operational details
- implementation gaps

If the document needs tightening, either fix it manually or use the fixer agent:

```text
@global-doc-fixer docs/planning/your-project-plan.md
```

Do not treat review as optional. In new projects, the review step usually saves more time than it costs.

---

## Step 6: Decide What Should Become Local Skills Or Subagents

Do this only after the plan is stable.

Create a **project subagent** when you need a specialist role, such as:

- frontend-builder
- api-builder
- test-runner
- migration-reviewer

Create a **project skill** when you need a repeatable workflow, such as:

- `/review-api`
- `/deploy-preview`
- `/write-release-notes`

For modern Claude Code, the stable official paths are:

- subagents -> `.claude/agents/` and `/agents`
- skills -> `.claude/skills/<name>/SKILL.md`

Read the dedicated guides next:

- [HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)
- [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)

---

## Step 7: Build In Small, Reviewable Slices

Once the plan is READY, start building.

Good prompts are slice-shaped:

```text
Implement the user model, auth schema, and registration endpoint from
@docs/planning/your-project-plan.md. Update tests too.
```

```text
Build the dashboard shell and empty-state UI described in
@docs/planning/your-project-plan.md. Keep styling tokens centralized.
```

Prefer this over:

```text
Build the whole app.
```

Why:

- easier reviews
- easier testing
- easier rollback
- less context drift

Use `@file` references aggressively to anchor work to the right document or directory.

---

## Step 8: Use Permissions Deliberately

During implementation, decide how much freedom Claude should have.

Use `/permissions` when you see repeated safe prompts for the same tools.

A healthy pattern is:

- keep risky commands gated
- allow common read/search commands
- gradually allow trusted edit/test commands
- avoid broad bypass unless you are in a truly safe environment

---

## Step 9: Review The Code, Then Test The Code

After each meaningful slice:

### Review

```text
/global-review-code
```

Or target a directory:

```text
/global-review-code src/auth/
```

### Test

Ask Claude to run the real project commands, not imaginary ones:

```text
Run the test, lint, and build commands from CLAUDE.md. Fix failures one at a time.
```

The planning doc tells Claude what should exist. Tests tell you what actually works.

---

## Step 10: Parallelize Safely When The Project Grows

Anthropic's workflow docs strongly support using Git worktrees for parallel Claude Code sessions.

Once the project is real, this becomes valuable for:

- frontend and backend progressing independently
- bug fixes happening alongside feature work
- long-running refactors that should not block other work

Example:

```bash
git worktree add ../my-project-auth -b feature/auth
git worktree add ../my-project-billing -b feature/billing
```

Then run Claude in each worktree.

This is a better scaling path than stuffing every task into a single session.

---

## Step 11: Preserve Context As You Go

As the project evolves, keep the docs alive.

Use the doc master to create:

- feature flow docs
- issue docs
- resolved docs
- deployment docs
- debug docs

Examples:

```text
@global-doc-master document the authentication flow from signup to token refresh.
```

```text
@global-doc-master there's a production issue with webhook retries. Create an issue doc.
```

This is what turns one good Claude session into a sustainable Claude workflow.

---

## Summary

```text
1. Start Claude                     -> claude
2. Create project memory            -> /init
3. Plan before editing              -> /plan
4. Write planning docs              -> @global-doc-master
5. Review the docs                  -> /global-review-doc
6. Fix docs until READY             -> @global-doc-fixer
7. Add local skills/subagents       -> .claude/skills + /agents
8. Build in slices                  -> small prompts + @file references
9. Review and test                  -> /global-review-code + real test commands
10. Parallelize with worktrees      -> git worktree
11. Preserve knowledge              -> flow docs + issue docs + resolved docs
```
