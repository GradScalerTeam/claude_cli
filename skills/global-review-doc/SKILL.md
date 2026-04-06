---
name: global-review-doc
description: Universal document review skill — works across all projects and tech stacks. This skill should be used when the user asks to "review a doc", "review this feature doc", "check this planning document", "validate this spec", "review this before handing to agent", "audit this document", "is this doc ready for implementation", or wants to verify a technical document against the codebase before implementation.
argument-hint: [path-to-document]
context: fork
agent: Plan
allowed-tools: Read, Grep, Glob, Bash(ls/git log/git diff/git show/wc), WebSearch, context7
user-invocable: true
---

# Universal Document Review

Review technical documents — feature specs, planning docs, issue reports, flow docs, API specs — before handing them to a development agent. Verify every claim against the actual codebase, assess security, predict bugs, and ensure the document is agent-ready. Adapt all checks to the discovered tech stack.

**Target document**: `$ARGUMENTS`

If `$ARGUMENTS` is empty, ask the user which document to review before proceeding.

---

## Delta Review Mode (Rounds 2+)

When invoked with `round:N` (where N > 1) in the arguments, this is a **re-review after fixes were applied**. Run a lightweight delta review instead of the full 9-phase process:

**Phases to RUN in delta mode:** Phase 1 (re-read doc), Phase 2 (codebase verification — only for sections that were edited), Phase 4 (completeness — only check previously flagged areas)

**Phases to SKIP in delta mode:** Phase 0 (context already known), Phase 3 (code quality — unchanged), Phase 5 (security — unchanged), Phase 6 (bug prediction — unchanged), Phase 7 (edge cases — unchanged), Phase 8 (agent readiness — only re-check if prior round flagged it), Phase 9 (Context7 — already verified)

**Output in delta mode:** Use the **Delta Output Format** from `references/output-format.md` — only sections 1 (Executive Summary), 4 (Findings), and 11 (Final Verdict). Skip all other sections.

If delta mode discovers a **new Critical finding** that wasn't in the previous round (e.g., a fix introduced a regression), escalate back to full review for that specific area only — don't re-run all 9 phases.

---

## Phase 0: Discover Project Context

Before reviewing, understand the project:

1. Read the project's `CLAUDE.md` (and any `.claude/CLAUDE.md`) to understand architecture, conventions, tech stack, and folder structure.
2. Detect the tech stack by reading package manifests:
   - `package.json` → Node.js / TypeScript / React
   - `pyproject.toml` / `requirements.txt` → Python
   - `Cargo.toml` → Rust
   - `go.mod` → Go
   - `pubspec.yaml` → Flutter / Dart
   - `Gemfile` → Ruby
   - `pom.xml` / `build.gradle` → Java / Kotlin
   - `*.csproj` → .NET / C#
3. Note the framework, state management, database, auth pattern, and project-specific conventions.
4. Carry this context into every subsequent phase — all checks adapt to the discovered stack.

## Phase 1: Read & Understand the Document

Read the entire document. Identify:
- **Document type**: feature spec, flow doc, issue report, planning doc, API spec
- **Feature being described**: the core functionality
- **Target agent**: which agent will consume this doc
- **All technical claims**: file paths, API endpoints, code behavior assertions, dependencies, schemas
- **User journey**: the complete flow from start to finish

## Phase 2: Codebase Verification

For every technical claim in the document, verify against actual code:

**File Paths** — Verify every mentioned path exists using Glob or Read. Flag moved or missing files. Check line number accuracy.

**API Endpoints** — Search for every mentioned endpoint. Verify HTTP method, route path, middleware, and request/response schema.

**Code Behavior** — For claims about how code works ("this function returns X"), read the actual function and verify. Check logic flows match actual code paths. Verify DB collection/table names and field names against models.

**Dependencies** — Check mentioned libraries/versions against package manifests. Verify mentioned state slices, socket events, or framework-specific constructs exist. Confirm referenced configs and env vars are used.

**Feature Feasibility** — Check if proposed changes conflict with existing code. Verify files mentioned for modification exist. Check for route conflicts. Verify schema change compatibility.

## Phase 3: Code Quality Review

Go beyond "does this file exist?" — review actual quality of referenced files:

- Read each file the document references or proposes to modify
- Flag code smells: deeply nested logic, functions >50 lines, missing error handling, hardcoded values
- Note if existing code contradicts the document's assumptions
- Check for TODO/FIXME/HACK comments that might affect the feature
- Check recent git changes (`git log`) for files that might have diverged from what's documented

## Phase 4: Completeness Check

**User Flow & Requirements**
- Complete user journey step by step? All user actions and system responses defined?
- Success AND failure paths documented?
- Edge cases identified? Obvious ones missing?
- Input validation rules specified? (field lengths, formats, required vs optional)
- Expected behavior clear for every interaction?

**Technical Specifications**
- API endpoints defined? (method, path, request body, response format, status codes)
- Data models/schemas specified? (fields, types, relationships, indexes, constraints)
- Database operations described? (CRUD, queries, aggregations, migrations)
- Third-party integrations detailed? (services, APIs, SDKs, webhooks)
- Environment variables and configuration mentioned?
- Error handling specified? (error codes, messages, retry logic, fallbacks)

**Architecture & Design**
- Folder/file structure mentioned or implied?
- Component relationships clear?
- State management addressed?
- Async operations handled? (loading states, timeouts, retries)
- Caching strategy mentioned where relevant?
- Background jobs/tasks identified where needed?

**Missing Considerations**
- Accessibility (a11y) — keyboard navigation, screen readers, ARIA labels, color contrast
- Mobile/responsive behavior
- Error states — what the user sees when things fail
- Loading states — what the user sees while waiting
- Empty states — what happens when there's no data
- Browser/platform compatibility

## Phase 5: Security Deep Dive

### Core Security Areas

**Authentication & Authorization** — JWT tokens generated and validated correctly? Tokens embedded in HTTP-only cookies (Secure, SameSite, HttpOnly flags set)? Access token expiry and refresh token rotation described? Token revocation/blacklisting handled? Endpoints protected with auth middleware? RBAC defined where needed? Session invalidation handled?

**Data Security** — passwords hashed with strong algorithms (bcrypt, argon2)? Sensitive data encrypted at rest and in transit? PII identified and protected? Input sanitization? File upload validation (type, size, content)? Injection prevention (SQL/NoSQL/command)?

**API Security** — rate limiting for sensitive endpoints? CORS configured? Payload size limits? CSRF protection for cookie-based auth? API keys/secrets managed properly? Input validation at API boundary?

**Frontend Security** (if applicable) — XSS prevention (output encoding, CSP)? Sensitive routes protected with auth guards? Sensitive data out of URLs? Error messages generic (not leaking internals)?

### Domain-Adaptive Security

Apply ONLY the checklists relevant to the feature being reviewed. Consult `references/security-domains.md` for the full 11-domain checklist covering sign-up, login/auth (JWT, HTTP-only cookies, token expiry), user profiles, search, payments, messaging, matching, scheduling, document sharing, real-time/WebSocket, and AI/LLM integration.

## Phase 6: Bug Prediction

Predict likely bugs that will occur during **implementation** of the feature (code-level issues):

- **Race conditions** — concurrent async operations, double submits, stale state
- **State inconsistencies** — mismatches between frontend state, URL params, backend state
- **Error boundary gaps** — unhandled promise rejections, missing try/catch, missing error boundaries
- **Type coercion** — string/number confusion, falsy value bugs, null vs undefined
- **Encoding issues** — Unicode handling, URL encoding/decoding, base64 edge cases
- **Memory leaks** — event listeners not cleaned up, intervals not cleared, subscriptions not unsubscribed
- **Stale closures** — captured variables in callbacks/effects referencing outdated state
- **Cache invalidation** — stale data after mutations, missing cache busting
- **Timezone bugs** — date comparisons across timezones, DST transitions
- **Platform differences** — API availability, rendering differences, touch vs click

## Phase 7: Edge Cases

Check if the **document itself** addresses these 10 runtime/operational scenarios:

1. **Network failure** mid-operation — partial state, retry behavior
2. **Concurrent requests** — double submit, race conditions, optimistic updates
3. **Service outage** — database down, third-party API unavailable, degraded mode
4. **Extremely large inputs** — long text, huge files, many items in a list
5. **Empty/null/undefined values** — missing fields, empty strings, null responses
6. **Duplicate operations** — double signup, double payment, repeated submissions
7. **User navigates away** mid-flow — unsaved state, abandoned operations
8. **Expired tokens/sessions** mid-operation — graceful re-auth, data loss prevention
9. **Poor connectivity** — mobile users, slow networks, intermittent connection
10. **Internationalization** — special characters in names, RTL text, locale-specific formats

## Phase 8: Agent Readiness

Evaluate if an agent can implement from this doc without ambiguity:

- Are instructions specific and unambiguous?
- Could two different developers interpret this differently?
- Are there implicit assumptions that should be explicit?
- Is the order of implementation clear?
- Are acceptance criteria defined for each requirement?
- Are there references to existing code patterns to follow?
- Is the scope clearly bounded? (what's in vs out)

**Ambiguity Analysis** — For each ambiguous section, show two possible interpretations so the author sees exactly what could go wrong:

| Ambiguous Text | Interpretation A | Interpretation B | Risk |
|---|---|---|---|

## Phase 9: Context7 Library Verification

Use context7 to verify that referenced library APIs and patterns are current:

- Verify code examples against current library documentation
- Check if referenced API patterns are still the recommended approach
- Confirm configuration syntax and options are current
- Do NOT flag technical details as incorrect based on potentially outdated training data — always verify with context7 first

---

## Output Format

Follow the output format template in `references/output-format.md`. All 11 sections are mandatory: Executive Summary, Document Overview, What the Document Does Well, All Findings (grouped by Critical / Important / Minor), Codebase Verification Results, Code Quality Issues, Agent Readiness Assessment, Quick Wins, Copy-Paste-Ready Additions, Bug Prediction, and Final Verdict.

---

## Additional Resources

- **`references/output-format.md`** — Complete 11-section output template with severity-grouped findings and verdict format
- **`references/security-domains.md`** — Full 11-domain security checklist (sign-up, auth/JWT, profiles, search, payments, messaging, matching, scheduling, data sharing, WebSocket, AI/LLM)

---

## Rules

1. **Always discover project context first** — read CLAUDE.md and detect the tech stack before reviewing.
2. **Always verify against the codebase** — never assume a claim is correct without checking.
3. **Read actual code** — don't just check if a file exists, read the relevant sections.
4. **Be specific** — reference exact file paths, line numbers, and function names.
5. **Prioritize by severity** — Critical findings first, then Important, then Minor. Never bury critical issues.
6. **Provide copy-paste-ready additions** — not vague advice. Every suggestion includes exact text to add.
7. **Adapt security checks to the feature** — apply only relevant domain checklists from `references/security-domains.md`.
8. **Verify with context7** — don't flag library APIs as wrong based on training data. Look it up first.
9. **Never modify the document** — only review and report. Modifications require user approval.
10. **Scale to the project's stage** — don't demand enterprise patterns for an MVP.
11. **Be constructive** — the goal is to improve the doc, not criticize the author.
12. **Think like an attacker** for security, **think like a user** for UX, **think like a junior dev** for clarity.
