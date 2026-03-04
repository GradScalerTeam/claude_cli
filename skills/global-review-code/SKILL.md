---
name: global-review-code
description: This skill should be used when the user asks to "review code", "audit a file or project", "check code quality", "find security issues", "look for bugs", "do a code review", "check for performance problems", or "review this codebase". Covers architecture, security, clean code, performance, error handling, dependencies, testing, and framework best practices. Dual mode — full code review (default) or bug investigation (triggered by "bug:" prefix or natural language bug descriptions). Adapts all checks to the detected tech stack. After review, offers to document findings as formal issue docs using a doc master agent.
argument-hint: [path-or-folder-or-bug-description]
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Glob, Bash(ls/git log/git diff/git show/wc/find/mkdir -p), AskUserQuestion, Task, Write, context7
user-invocable: true
---

# Universal Code Review

Perform a comprehensive code audit in two possible modes, adapting all checks to the detected tech stack.

**Input**: `$ARGUMENTS`

If `$ARGUMENTS` is empty, review the entire project starting from the current working directory.

---

## Mode Detection

Determine which mode to run based on the input:

- **Code Review Mode** (default) — input is a file path, folder path, or no argument (review entire project). Runs the full 12-phase audit, then offers to document findings as issue docs (Phase 12).
- **Bug Hunt Mode** — input is a natural language bug description or starts with `bug:`. Runs the 5-step investigation.

If ambiguous, default to Code Review Mode.

---

# CODE REVIEW MODE

## Phase 0: Project Intelligence

Before reviewing any code, build a comprehensive mental model of the project.

### Step 1: Discover All Markdown Docs

Glob for all `**/*.md` files. Categorize them:

| Category | Examples | Action |
|---|---|---|
| **Must-Read** | CLAUDE.md, .claude/CLAUDE.md, README.md, ARCHITECTURE.md | Read fully |
| **High-Value** | docs/*, planning/*, specs/*, CONTRIBUTING.md | Read fully |
| **Scan for Relevance** | Any other .md in src/ or app/ | Read first 50 lines, continue if relevant |
| **Skip** | CHANGELOG.md, LICENSE.md, node_modules/**/*, .git/**/*, dist/**/* | Ignore |

### Step 2: Extract Context from Each Relevant Doc

For each document, extract:
- Architecture patterns and conventions
- Tech stack details
- Domain-specific terminology
- Gotchas and known issues
- Coding style rules

### Step 3: Read Non-Markdown Intelligence

Read these files if they exist — they reveal enforced rules, stack details, and project maturity:

**Package Manifests** (detect stack + dependencies):
- `package.json` → Node.js / TypeScript / React
- `pyproject.toml` / `requirements.txt` → Python
- `Cargo.toml` → Rust
- `go.mod` → Go
- `pubspec.yaml` → Flutter / Dart
- `Gemfile` → Ruby
- `pom.xml` / `build.gradle` → Java / Kotlin
- `*.csproj` → .NET / C#

**Linter Configs** (already-enforced rules — don't duplicate these checks):
- `.eslintrc*`, `.prettierrc*`, `biome.json`
- `ruff.toml`, `pyproject.toml [tool.ruff]`, `.flake8`, `.pylintrc`
- `rustfmt.toml`, `.golangci.yml`

**Type Configs**:
- `tsconfig.json`, `jsconfig.json`
- `mypy.ini`, `pyproject.toml [tool.mypy]`

**Build Configs**:
- `vite.config.*`, `webpack.config.*`, `next.config.*`, `nuxt.config.*`
- `Makefile`, `CMakeLists.txt`

**CI/CD**:
- `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`
- `Dockerfile`, `docker-compose.yml`

**Other**:
- `.env.example`, `.env.sample` (env var patterns — never read actual .env files)
- Test configs: `jest.config.*`, `vitest.config.*`, `pytest.ini`, `conftest.py`
- `.gitignore` (reveals what's generated vs authored)

### Step 4: Build the Project Mental Model

Summarize internally:
- **What it does** — purpose and domain
- **How it's built** — stack, architecture pattern, key frameworks
- **What rules exist** — from CLAUDE.md, linter configs, CI checks
- **What's already enforced** — by linters/CI (skip these in review)
- **Project stage** — MVP / growing / mature (calibrate expectations accordingly)

---

## Phase 1: Codebase Mapping

Map the structure of the code under review:

1. **Directory tree** — `ls` the target path and its subdirectories (2 levels deep)
2. **Entry points** — identify main files, index files, route definitions, app bootstrapping
3. **Hot paths** — `git log --oneline -20 -- <path>` to see recently changed files (most likely to have issues)
4. **Uncommitted changes** — `git diff --stat` and `git diff --staged --stat` for pending work
5. **File counts** — `wc -l` on key files to understand code volume
6. **Key relationships** — which files import what, major dependency flows

---

## Phase 2: Architecture & Structure

| Check | What to Look For |
|---|---|
| Separation of concerns | Business logic mixed with UI? Data access in controllers? |
| Organization pattern | Feature-based vs layer-based? Consistent? |
| Naming conventions | Files, folders, functions, variables — consistent and descriptive? |
| Nesting depth | Files >3 folders deep? Components deeply nested unnecessarily? |
| Module boundaries | Clear boundaries between modules? Circular dependencies? |
| Entry points | Clean bootstrapping? Clear request flow? |

---

## Phase 3: Code Quality

| Check | What to Look For |
|---|---|
| DRY violations | Same logic in multiple places? Copy-pasted code? |
| Single Responsibility | Functions/classes doing too many things? Files >300 lines? |
| Function length | Functions >50 lines? Complex nested logic? |
| Naming | Descriptive names? Consistent style (camelCase, snake_case)? |
| Type safety | TypeScript `any` overuse? Missing type annotations on public APIs? Python without type hints on critical paths? |
| Dead code | Unused imports, unreachable branches, commented-out code? |
| Magic values | Hardcoded strings/numbers that should be constants? |
| Consistency | Similar operations done differently in different places? |

---

## Phase 4: Security Audit

### Core OWASP Checks

| Category | What to Look For |
|---|---|
| **Secrets** | API keys, tokens, passwords in code or config files? .env committed? |
| **Injection** | SQL/NoSQL injection, command injection, template injection? |
| **XSS** | Unsanitized user input rendered in HTML? `dangerouslySetInnerHTML`? `v-html`? |
| **Authentication** | JWT token validation correct? Tokens embedded in HTTP-only cookies (Secure, SameSite, HttpOnly flags)? Access token expiry and refresh rotation? Token revocation/blacklisting? |
| **Authorization** | Missing role checks? Direct object reference vulnerabilities? |
| **CORS** | Overly permissive origins? `*` in production? |
| **Rate limiting** | Missing on auth endpoints, file uploads, expensive operations? |
| **File uploads** | Missing type/size validation? Path traversal possible? |

### Domain-Adaptive Security

Apply ONLY the checklists relevant to the detected feature domains. Consult `references/domain-security-checks.md` for the full 9-domain checklist covering auth flows (JWT, HTTP-only cookies, token expiry/rotation), payments, WebSocket, AI/LLM, file handling, user data, search, messaging, and scheduling.

---

## Phase 5: Performance & Efficiency

| Check | What to Look For |
|---|---|
| N+1 queries | Database queries inside loops? Missing eager loading? |
| Re-renders | React: missing memoization on expensive components? Unnecessary state in parent? |
| Bundle size | Large dependencies for small features? Tree-shaking blockers? |
| Memory leaks | Event listeners not cleaned up? Intervals not cleared? Subscriptions not unsubscribed? |
| Algorithm complexity | O(n²) or worse where O(n) is possible? Large dataset operations? |
| Caching | Missing caching on expensive computations? HTTP cache headers? |
| Lazy loading | Large components/routes loaded eagerly? Images without lazy loading? |
| Async patterns | Unnecessary sequential awaits? Missing Promise.all for independent operations? |

---

## Phase 6: Error Handling & Resilience

| Check | What to Look For |
|---|---|
| Unhandled rejections | Promises without catch? Async functions without try/catch? |
| Error boundaries | React: missing ErrorBoundary around critical sections? |
| Logging | Errors swallowed silently? Missing context in error logs? |
| Retry logic | Network calls without retry for transient failures? |
| Graceful degradation | What happens when a service is down? Fallback UI? |
| Timeouts | API calls without timeouts? Database queries without limits? |
| User feedback | Errors shown to users with helpful messages? Loading states? |
| Cleanup | Resources released on error paths? Transactions rolled back? |

---

## Phase 7: Dependencies & Configuration

| Check | What to Look For |
|---|---|
| Outdated packages | Major version behind? Known vulnerabilities? |
| Unused dependencies | Listed in manifest but never imported? |
| Lock file | Lock file exists and committed? Consistent with manifest? |
| Peer dependencies | Missing or conflicting peer deps? |
| Environment variables | Undocumented env vars? Missing from .env.example? |
| Secrets management | Secrets in code or committed config? Proper vault/secret manager usage? |
| Config organization | Config scattered across files? Environment-specific config handled? |

---

## Phase 8: Testing Assessment

| Check | What to Look For |
|---|---|
| Test existence | Do tests exist at all? Test file naming convention? |
| Coverage gaps | Critical paths without tests? Edge cases untested? |
| Test quality | Tests actually asserting behavior? Not just snapshot tests? |
| Test patterns | Consistent patterns? Proper setup/teardown? Mocking strategy? |
| Missing categories | Unit tests? Integration tests? E2E tests? API tests? |
| Flakiness risks | Timing-dependent tests? External service dependencies? Random data? |
| Test data | Hardcoded test data? Factories/fixtures? Data cleanup? |

---

## Phase 9: Framework Best Practices

Apply ONLY the checklists for the detected tech stack. Skip all others. Consult `references/framework-best-practices.md` for detailed per-framework checklists covering:

- **Frontend**: React, Next.js, Vue, Angular
- **Backend**: Express/Fastify, FastAPI, Django/DRF, Flask
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Mobile**: Flutter/Dart
- **Database/ORM**: SQLAlchemy, Prisma, TypeORM
- **Languages**: Python, Node.js/TypeScript

For unlisted frameworks, apply language-level best practices and use context7 to look up the framework's documented patterns.

---

## Phase 10: Bug Prediction

Based on the actual code reviewed, predict likely production bugs:

| Pattern | What to Check |
|---|---|
| **Race conditions** | Concurrent async operations, shared mutable state, double submits |
| **Stale closures** | Callbacks/effects capturing outdated variables |
| **Type coercion** | String/number confusion, falsy value bugs (0, "", null, undefined) |
| **Encoding issues** | Unicode handling, URL encoding/decoding, base64 edge cases |
| **Memory leaks** | Uncleared intervals, uncleaned event listeners, growing caches |
| **Cache invalidation** | Stale data after mutations, missing cache busting |
| **Off-by-one** | Array indexing, pagination, boundary conditions |
| **Null propagation** | Optional chaining missing, undefined access, null reference |
| **Timing issues** | Component mount/unmount order, API response ordering |
| **Environment mismatches** | Dev vs prod config differences, missing env vars |
| **Concurrency** | Database write conflicts, optimistic locking missing |
| **State desync** | Frontend/backend state divergence, stale UI after mutations |

---

## Phase 11: Context7 Verification

Before finalizing findings that reference library APIs or framework patterns:

1. Use context7 `resolve-library-id` for each major library in the project
2. Use context7 `query-docs` to verify:
   - API patterns flagged as incorrect are actually wrong per current docs
   - Deprecated usage is confirmed deprecated in latest version
   - Recommended alternatives are actually current best practices
3. Do NOT flag technical details as incorrect based on potentially outdated training data — always verify with context7 first
4. If context7 doesn't have docs for a library, note it as "unverified" rather than flagging

---

## Phase 12: Issue Documentation Offer

After completing the full review output (sections 1-11), offer to document the findings as formal issue docs.

**This phase applies ONLY to Code Review Mode, NOT Bug Hunt Mode.**

### Step 1: Ask the User

Use AskUserQuestion to ask:

- **Question**: "Would you like me to document the issues found in this review as formal issue docs under docs/issues/?"
- **Header**: "Document"
- **Options**:
  1. Label: "Yes — Critical & Important only", Description: "Create issue docs for all Critical and Important severity findings"
  2. Label: "Yes — all findings", Description: "Create issue docs for every finding including Minor"
  3. Label: "No", Description: "Skip documentation — review is complete"

If the user selects "No", the review is complete. Stop here.

### Step 2: Find a Documentation Agent

Search for a doc master agent in this priority order:

1. **Local project agent**: Glob for `.claude/agents/*doc*master*` in the current project root. If found, Read the file and extract the agent name from its YAML frontmatter `name:` field.

2. **Global agent**: Read `~/.claude/agents/global-doc-master.md`. If it exists and is readable, use `global-doc-master` as the agent name.

3. **Direct fallback**: If neither local nor global doc master agent is found, you will create issue docs directly in Step 3.

### Step 3: Create Issue Documentation

**If a doc master agent was found (local or global):**

Use the Task tool to launch the doc master agent:
- `subagent_type`: the agent name found in Step 2 (e.g., the local agent's `name` field, or `global-doc-master` for the global agent)
- `description`: "Document review findings as issues"
- `prompt`: Pass all findings the user chose to document, formatted as:

> Create issue documentation under docs/issues/ for the following code review findings. Each finding should become a separate issue document following your issue template.
>
> Project: [project name/path]
> Review Date: [today's date]
>
> Findings to document:
> - Finding ID: F-XX | Title: [title] | Severity: [level] | Location: [file:line] | Issue: [description] | Recommendation: [fix] | Code: [before/after if available]
> (repeat for each finding)

**If no doc master agent was found (direct fallback):**

1. Create the directory: `mkdir -p docs/issues`
2. For each finding to document, create a file named `docs/issues/YYYY-MM-DD-<finding-slug>.md` with these sections:

| Section | Content |
|---|---|
| **Title** | `# Issue: [Finding Title]` |
| **Metadata** | Date Reported (today), Status: `Identified`, Severity (Critical/Important/Minor), Review Finding ID (F-XX) |
| **Problem** | The issue description from the review finding |
| **Location** | File path with line number, function/component name if known |
| **Recommendation** | The fix recommendation from the review finding |
| **Code** | Before (current problematic code) and After (recommended fix) — use language-appropriate code blocks |

Use the same slug and date conventions as the doc master templates: `YYYY-MM-DD-<lowercase-hyphenated-slug>.md`

### Step 4: Confirmation

After documentation is complete, summarize:
- How many issues were documented
- Where the docs are located (`docs/issues/`)
- Which method was used: **local doc master** / **global doc master** / **direct creation**

---

# BUG HUNT MODE

When input is a bug description (natural language or `bug:` prefix):

## Step 1: Understand the Bug

Parse the bug description to identify:
- **Expected behavior** — what should happen
- **Actual behavior** — what actually happens
- **Trigger conditions** — when/how it occurs (specific actions, timing, data conditions)
- **Affected area** — which part of the app (if mentioned)
- **Frequency** — always, sometimes, only under specific conditions

## Step 2: Identify Suspects

1. **Search for related code** — Grep/Glob for keywords from the bug description (function names, component names, route paths, error messages)
2. **Check recent changes** — `git log --oneline -30` and `git log --oneline -10 -- <suspected-files>` for recent modifications
3. **Build suspect list** — rank files by relevance (directly mentioned > recently changed > related by import)
4. **Read each suspect** — fully read each file in the suspect list

## Step 3: Trace Data Flow

Follow the data through the system from trigger to symptom:

1. **Trigger point** — where does the user action or event enter the system?
2. **Handler** — what function processes it?
3. **State changes** — what state is modified? (database, in-memory, Redux, context)
4. **Side effects** — what else happens? (API calls, events emitted, cache updates)
5. **Render / Output** — how does the result reach the user?

Map this flow and identify where the actual behavior diverges from expected.

## Step 4: Narrow the Cause

Check these 12 common culprits against the suspect code:

| # | Culprit | What to Look For |
|---|---|---|
| 1 | **Stale closure** | Callback captures old variable value instead of current |
| 2 | **Race condition** | Two async operations finish in unexpected order |
| 3 | **Type coercion** | String "0" treated as falsy, number compared to string |
| 4 | **Encoding mismatch** | UTF-8 vs Latin-1, URL encoding double-applied or missing |
| 5 | **Timing issue** | Component renders before data loads, event fires before listener attached |
| 6 | **Cache staleness** | Cached data served after mutation, missing invalidation |
| 7 | **Environment mismatch** | Works in dev, fails in prod — different config, missing env var |
| 8 | **Null / undefined** | Missing null check, optional chaining needed, undefined property access |
| 9 | **Off-by-one** | Array index, pagination offset, boundary condition |
| 10 | **Import / module** | Wrong import path, circular dependency, missing re-export |
| 11 | **Async error** | Unhandled promise rejection, missing await, swallowed error |
| 12 | **State mutation** | Direct state mutation instead of immutable update, shared reference |

## Step 5: Recommend Fix

Provide a complete fix recommendation:

1. **Root cause** — exact file:line, function name, what's wrong and why
2. **Category** — which of the 12 culprits (or other)
3. **Detailed explanation** — step-by-step how the bug manifests
4. **Before/After code** — exact code change needed
5. **Related risks** — other places in the codebase with the same pattern (Grep for similar code)
6. **Test case** — code to verify the fix works and prevent regression

---

## Output Formats

- **Code Review Mode**: Follow the 11-section output template in `references/output-format-code-review.md`. All sections are mandatory: Executive Summary, Project Overview, What is Done Well, All Findings (grouped by Critical / Important / Minor), Architecture Assessment, Security Findings (Expanded), Performance Findings (Expanded), Quick Wins, Before/After Code Examples, Bug Predictions, and Final Verdict. After outputting all 11 sections, proceed to Phase 12 (Issue Documentation Offer) to ask the user about documenting findings.

- **Bug Hunt Mode**: Follow the 6-section output template in `references/output-format-bug-hunt.md`. All sections are mandatory: Bug Summary, Investigation Trail, Root Cause, Recommended Fix, Related Risks, and Test Case.

---

## Additional Resources

- **`references/output-format-code-review.md`** — Complete 11-section output template for code reviews with severity-grouped findings and verdict format
- **`references/output-format-bug-hunt.md`** — Complete 6-section output template for bug investigations
- **`references/framework-best-practices.md`** — Per-framework checklists for React, Next.js, Vue, Angular, Express, FastAPI, Django, Flask, Redux, Tailwind, Flutter, SQLAlchemy, Prisma, TypeORM, Python, and Node.js/TypeScript
- **`references/domain-security-checks.md`** — 9-domain security checklist covering auth/JWT, payments, WebSocket, AI/LLM, file handling, user data, search, messaging, and scheduling

---

## Rules

1. **Always discover project context first** — read ALL relevant docs, manifests, configs, and linter rules — not just CLAUDE.md.
2. **Always read actual code** — never assume or guess what code does. Read it.
3. **Be specific** — file:line for every finding. No vague references.
4. **Prioritize by severity** — Critical findings first, then Important, then Minor. Never bury critical issues.
5. **Show before/after code** — for every fixable issue, provide concrete code examples.
6. **Adapt framework checks to detected stack** — only apply relevant checklists from `references/framework-best-practices.md`.
7. **Verify with context7** — don't flag library APIs as wrong based on training data. Look it up first.
8. **Never modify code** — only review and report. No code changes without explicit user approval.
9. **Scale to project stage** — don't demand enterprise patterns for MVPs. Calibrate expectations.
10. **Be constructive** — acknowledge good work before listing problems. Goal is improvement, not criticism.
11. **Think like an attacker** (security), **think like a user** (UX), **think like a maintainer** (quality).
12. **Check what's already enforced** — don't duplicate linter/CI checks. Note what's automated and skip it.
13. **Global finding IDs** — every finding gets a unique F-XX identifier, referenced consistently throughout the review.
14. **One finding per issue** — keep findings discrete and individually actionable. Don't bundle multiple issues.
15. **Documentation is optional** — always ask via AskUserQuestion before creating issue docs. Never auto-generate documentation without explicit user consent.
16. **Doc master priority** — when documenting issues, always check for a local project doc master agent first (`.claude/agents/`), then the global agent (`~/.claude/agents/global-doc-master.md`), then create directly as a last resort.
