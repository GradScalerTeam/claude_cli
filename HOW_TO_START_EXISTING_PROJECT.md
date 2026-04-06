# How to Use Claude Code In An Existing Project

A workflow for introducing Claude Code into a real codebase without losing control, duplicating work, or forcing Claude to rediscover the same context every day.

---

## The Main Idea

Existing projects already have history, conventions, bugs, undocumented flows, and operational landmines.

So the job is not "let Claude read the repo." The job is:

1. capture the project's durable context
2. map the important flows
3. review the risky parts
4. create local tools only where they add leverage
5. keep the docs and memory fresh over time

---

## Step 1: Start Claude In The Real Project Root

```bash
cd my-existing-project
claude
```

If the repo is a monorepo, start from the root unless you intentionally want a package-scoped session.

---

## Step 2: Build Project Memory Early

Run:

```text
/init
```

Then turn `CLAUDE.md` into a real onboarding document for both humans and Claude.

Add:

- canonical build, test, lint, and format commands
- service boundaries
- package or app layout
- environments and secrets caveats
- risky directories
- key external dependencies
- release process notes

If you already have strong docs, import them rather than duplicating everything in `CLAUDE.md`.

---

## Step 3: Ask Claude For A Read-Only Map First

Before you ask Claude to change anything, ask it to explain the repo.

Good starting prompts:

```text
Give me a high-level architecture overview of this repository.
```

```text
Which directories are the highest risk to edit?
```

```text
What commands should be used for build, test, lint, and local development?
```

For bigger or unfamiliar repos, use Plan Mode:

```text
/plan
```

This helps Claude inspect safely before touching the code.

---

## Step 4: Create Feature Flow Docs For The Important Paths

Now use the documentation agent from this repo to capture how the existing system works.

Examples:

```text
@global-doc-master document the authentication flow from login to token refresh.
```

```text
@global-doc-master document the checkout flow from cart to payment confirmation.
```

```text
@global-doc-master document the background job pipeline for invoice generation.
```

Aim for the flows that matter operationally or change frequently.

Good flow docs save Claude from re-tracing the entire code path every session.

---

## Step 5: Review The Codebase For Risks And Debt

Once the major flows are documented, review the real code:

```text
/global-review-code
```

Or target specific zones:

```text
/global-review-code apps/web/
/global-review-code packages/api/
/global-review-code src/auth/
```

Use the findings to create structured issue docs when something deserves durable tracking:

```text
@global-doc-master there's a security issue in the auth flow. Create an issue doc.
```

```text
@global-doc-master there's a performance problem in the dashboard query path. Create an issue doc.
```

This gives you a searchable backlog rather than a one-off chat thread.

---

## Step 6: Tighten Permissions Based On Reality

Do not blindly switch to overly permissive modes on day one.

Instead:

1. watch which approvals repeat
2. use `/permissions` to allow the safe ones
3. keep production-sensitive commands gated
4. revisit permissions as trust increases

Claude becomes more useful when approvals are less noisy, but only after you understand the repo's risk surface.

---

## Step 7: Add Local Subagents Only After Patterns Stabilize

If your project repeatedly needs the same specialists, create project subagents with `/agents`.

Good candidates:

- frontend-agent
- backend-agent
- db-agent
- test-agent
- release-agent

These should live in `.claude/agents/` so the whole team can share them.

Do not create ten agents up front. Start with one or two roles that clearly pay for themselves.

---

## Step 8: Add Local Skills For Repeatable Workflows

If the same workflow keeps repeating, capture it as a skill.

Good examples:

- `/review-api`
- `/release-checklist`
- `/migrate-config`
- `/triage-bug`

Put project skills in `.claude/skills/` and keep them close to the codebase conventions they depend on.

Unlike a one-off prompt, a skill gives your team a reusable, reviewable workflow definition.

---

## Step 9: Use `@file` References And Memory To Keep Context Tight

In existing projects, context bloat is the silent killer.

Prefer prompts like:

```text
Update the validation logic in @src/auth/login.ts and make sure it still matches
@docs/feature_flow/authentication.md.
```

Over prompts like:

```text
Fix auth stuff.
```

Using `@file` references, `CLAUDE.md`, and flow docs together keeps Claude grounded in the right context.

---

## Step 10: Use Git Worktrees For Parallel High-Risk Work

Anthropic's workflow docs recommend Git worktrees for parallel Claude Code sessions.

This matters even more in existing repositories because you often need to:

- fix a production bug while a feature is in flight
- compare two solution paths
- isolate a risky migration

Example:

```bash
git worktree add ../project-hotfix -b hotfix/auth-timeout
git worktree add ../project-refactor -b refactor/session-model
```

Open Claude in each worktree instead of mixing everything into one branch and one session.

---

## Step 11: Keep Documentation And Memory Alive

Existing projects drift unless you update the docs when the code changes.

Use the doc master to maintain:

- feature flow docs
- issue docs
- resolved docs
- deployment docs
- debug docs

Examples:

```text
@global-doc-master update the payments flow doc to reflect the new retry logic.
```

```text
@global-doc-master the webhook duplication issue is fixed. Move it to resolved.
```

This is how Claude gets better over months instead of only being good in the current session.

---

## Summary

```text
1. Start Claude in the repo           -> claude
2. Create durable project memory      -> /init + CLAUDE.md
3. Map the codebase safely            -> overview prompts + /plan
4. Document the important flows       -> @global-doc-master
5. Review risky areas                 -> /global-review-code
6. Track durable issues               -> issue docs
7. Add subagents for specialist roles -> /agents
8. Add skills for repeated workflows  -> .claude/skills
9. Keep prompts anchored              -> @file + docs + memory
10. Parallelize safely                -> git worktree
11. Update docs continuously          -> flow docs + resolved docs
```
