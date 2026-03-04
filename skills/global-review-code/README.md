# Global Review Code Skill

The **Global Review Code** is a code review and bug investigation skill for Claude Code CLI. It performs a comprehensive audit of your actual code — not docs, not specs, but the real files in your project. It checks architecture, security, performance, error handling, dependencies, testing, and framework-specific best practices. It also has a dedicated bug hunt mode that traces bugs from symptoms to root cause.

---

## Why Use It

- **Reads everything first** — before reviewing a single line, the skill reads your CLAUDE.md, README, docs, package manifests, linter configs, CI pipelines, and build configs. It knows your stack, your conventions, and what's already enforced.
- **Doesn't duplicate linters** — if ESLint or Ruff already catches something, the skill skips it. It focuses on what automated tools miss: architecture, logic, security, and patterns.
- **Adapts to your stack** — React gets React checks. FastAPI gets FastAPI checks. Flutter gets Flutter checks. It only applies what's relevant from its framework best practices library.
- **Predicts bugs before they happen** — based on actual code patterns, it predicts race conditions, stale closures, type coercion bugs, memory leaks, and more.
- **Two modes in one** — full code review for auditing, bug hunt for investigating specific issues. Same skill, different triggers.
- **Context7 verified** — never flags a library pattern as wrong based on stale training data. Always checks against current docs first.

---

## When to Use It

**After your code is written and you want it reviewed before merging or deploying.** This is the code-level companion to `global-review-doc` (which reviews documents).

Typical workflow:
1. `global-doc-master` creates the planning doc
2. `global-review-doc` reviews the planning doc until it's solid
3. You (or agents) build the feature from the plan
4. **`global-review-code` reviews the actual code** — catches security issues, performance problems, architecture drift, and bugs
5. You fix the findings and re-review if needed

**You should also use it when:**
- You want a full audit of an existing project or module you inherited
- You're about to merge a large PR and want a thorough review beyond what GitHub's review UI shows
- You're onboarding onto a codebase and want to understand its health, patterns, and problem areas
- A bug is reported and you want to trace it systematically instead of guessing — use bug hunt mode

**Bug Hunt Mode triggers when:**
- Your input starts with `bug:` (e.g., `bug: users can't upload files larger than 5MB`)
- Your input is a natural language bug description instead of a file/folder path

---

## How to Use It

There are two ways to invoke the skill:

1. **Using `/global-review-code`** — type the slash command followed by a path or bug description
2. **Natural language** — say "review this code" or "find this bug" and provide the target

**Code Review examples:**
```
/global-review-code src/auth/
/global-review-code src/components/PaymentForm.tsx
/global-review-code
```
No argument reviews the entire project.

**Bug Hunt examples:**
```
/global-review-code bug: users get a blank screen after login on mobile Safari
/global-review-code bug: payment webhook fires but order status doesn't update
```

---

## What It Does

### Code Review Mode (12 Phases)

#### Phase 0: Project Intelligence

Discovers everything about your project before looking at code. Reads all markdown docs, package manifests, linter configs, type configs, build configs, CI/CD files, env examples, test configs, and `.gitignore`. Builds a complete mental model of what the project does, how it's built, what rules exist, and what's already enforced by automation.

#### Phase 1: Codebase Mapping

Maps the structure of what's being reviewed — directory tree, entry points, recently changed files (most likely to have issues), uncommitted changes, file sizes, and key import relationships.

#### Phase 2: Architecture & Structure

Checks separation of concerns, organization patterns, naming conventions, nesting depth, module boundaries, and entry point cleanliness.

#### Phase 3: Code Quality

Hunts for DRY violations, single responsibility breaches, long functions, naming issues, type safety gaps (`any` overuse, missing annotations), dead code, magic values, and inconsistencies.

#### Phase 4: Security Audit

Runs core OWASP checks (secrets, injection, XSS, auth, authorization, CORS, rate limiting, file uploads) plus domain-specific security checklists. If your code handles payments, it checks idempotency and webhook signatures. If it handles WebSockets, it checks connection auth and event injection. Only relevant domains are checked.

#### Phase 5: Performance & Efficiency

Checks for N+1 queries, unnecessary re-renders, bundle size bloat, memory leaks, algorithm complexity, missing caching, lazy loading gaps, and suboptimal async patterns.

#### Phase 6: Error Handling & Resilience

Checks for unhandled promise rejections, missing error boundaries, swallowed errors, missing retry logic, no graceful degradation, missing timeouts, poor user feedback, and resource cleanup failures.

#### Phase 7: Dependencies & Configuration

Checks for outdated packages, unused dependencies, lock file integrity, peer dependency conflicts, undocumented env vars, exposed secrets, and scattered config.

#### Phase 8: Testing Assessment

Evaluates test existence, coverage gaps, test quality (not just snapshot tests), test patterns, missing test categories (unit/integration/E2E), flakiness risks, and test data management.

#### Phase 9: Framework Best Practices

Applies framework-specific checklists for the detected stack: React, Next.js, Vue, Angular, Express/Fastify, FastAPI, Django/DRF, Flask, Redux Toolkit, Tailwind CSS, Flutter/Dart, SQLAlchemy, Prisma, TypeORM, Python, and Node.js/TypeScript. Only relevant frameworks are checked.

#### Phase 10: Bug Prediction

Predicts production bugs based on actual code patterns — race conditions, stale closures, type coercion, encoding issues, memory leaks, cache invalidation, off-by-one errors, null propagation, timing issues, environment mismatches, concurrency conflicts, and state desync.

#### Phase 11: Context7 Verification

Before finalizing any finding that references a library API or framework pattern, verifies against current documentation via Context7. Doesn't flag something as wrong based on potentially outdated training data.

### Bug Hunt Mode (5 Steps)

1. **Understand the Bug** — parses expected vs actual behavior, trigger conditions, affected area, frequency
2. **Identify Suspects** — searches for related code, checks recent git changes, builds a ranked suspect list, reads each file
3. **Trace Data Flow** — follows data from trigger point through handler, state changes, side effects, to render/output. Finds where actual diverges from expected
4. **Narrow the Cause** — checks 12 common culprits: stale closure, race condition, type coercion, encoding mismatch, timing issue, cache staleness, environment mismatch, null/undefined, off-by-one, import/module issue, async error, state mutation
5. **Recommend Fix** — exact root cause with file:line, before/after code, related risks in the codebase, and a test case to prevent regression

---

## Output Format

**Code Review Mode** produces an **11-section report**:

1. **Executive Summary** — project health rating, finding count by severity, top 3 issues
2. **Project Overview** — path, tech stack, frameworks, file count, LOC, architecture, project stage, docs found, what's already enforced
3. **What is Done Well** — positive findings with file:line references
4. **All Findings** — grouped by Critical / Important / Minor, each with issue, location, and recommendation
5. **Architecture Assessment** — directory structure review with recommendations
6. **Security Findings (Expanded)** — OWASP category, attack scenario, vulnerable code, fix
7. **Performance Findings (Expanded)** — impact estimate, slow code, fix, how to measure improvement
8. **Quick Wins** — easy fixes under 5 minutes each
9. **Before/After Code Examples** — 3-5 concrete refactoring suggestions with exact code
10. **Bug Predictions** — predicted bugs with triggers, likelihood, files at risk, prevention
11. **Final Verdict** — health rating, summary, immediate/short-term/long-term actions

**Bug Hunt Mode** produces a **6-section report**:

1. **Bug Summary** — expected vs actual behavior, trigger, severity
2. **Investigation Trail** — every file explored, what was found, verdict (suspect/cleared/root cause)
3. **Root Cause** — exact file, line, function, culprit category, step-by-step explanation
4. **Recommended Fix** — before/after code with explanation
5. **Related Risks** — other places in the codebase with the same pattern
6. **Test Case** — code to verify the fix and prevent regression

---

## Skill Structure

```
skills/global-review-code/
├── SKILL.md                                  # Main skill definition (12-phase review + 5-step bug hunt)
├── README.md                                 # This file
└── references/
    ├── output-format-code-review.md          # 11-section output template for code reviews
    ├── output-format-bug-hunt.md             # 6-section output template for bug investigations
    ├── framework-best-practices.md           # Per-framework checklists (React, Next.js, Vue, etc.)
    └── domain-security-checks.md             # 9-domain security checklist
```

---

## Setup

### Fresh Install

To set up the Global Review Code skill in your Claude Code CLI, paste this prompt directly into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and read all files in the skills/global-review-code/ folder — SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, and references/domain-security-checks.md. Create the same folder structure at ~/.claude/skills/global-review-code/ and copy each file's content exactly. Create any directories that don't exist. After installing, read the README.md in the same folder (skills/global-review-code/README.md) and give me a summary of what this skill does and how to use it.
```

That's it. The skill is now available in every project you work on with Claude Code CLI.

### Check for Updates

Already have the Global Review Code skill set up and want to check if there's a newer version? Paste this into your Claude CLI:

```
Fetch the latest versions of all files in the skills/global-review-code/ folder from the GitHub repo https://github.com/GradScalerTeam/claude_cli — compare each file (SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, references/domain-security-checks.md) with my local versions at ~/.claude/skills/global-review-code/. If there are any differences, show me what changed, update my local files to match the latest versions, and give me a summary of what was updated and why it matters.
```
