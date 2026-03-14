# Global Review Doc Skill

The **Global Review Doc** is a document review skill for Claude Code CLI. It's the quality gate between writing a doc and handing it to an agent for implementation. You give it any technical document — planning spec, feature flow, issue report, API spec — and it tears it apart against your actual codebase, checks security, predicts bugs, and tells you exactly what to fix.

---

## Why Use It

- **Catches issues before code is written** — a bug found in a planning doc costs 0 lines of code to fix. A bug found after implementation costs hours.
- **Verifies against real code** — the skill reads your actual codebase, not just the document. If a file path is wrong, it tells you. If an API endpoint changed, it catches it.
- **Security by default** — every doc gets a security review adapted to its domain. Payment features get payment security checks. Auth features get auth security checks.
- **Agent-ready output** — the agent readiness check ensures your doc is unambiguous enough for an AI agent to implement without asking questions.
- **Actionable feedback** — every finding includes a specific recommendation and copy-paste-ready text. No vague "consider improving this".

---

## When to Use It

**Right after Global Doc Master creates a document.** The workflow is:

1. You tell `global-doc-master` to create a planning doc (or feature flow, issue doc, etc.)
2. The agent writes the document under `docs/`
3. You run `@global-doc-fixer` on the document — it uses this skill internally, fixes all findings, re-reviews, and repeats until the verdict is **READY**
4. Only then do you hand the document to an agent for implementation

The `global-doc-fixer` agent automates the review-fix loop — it calls this skill, fixes findings, re-reviews, and repeats. You can still run `/global-review-doc` manually if you want a one-off review without automatic fixes, but for the full iteration cycle, use the fixer agent.

**You should also use it when:**
- Reviewing any existing technical document before handing it to a development agent
- Checking if a doc is still accurate after codebase changes (refactors, new features, dependency updates)
- Validating a spec written by someone else before your team starts building from it
- Auditing old planning docs to see if they still match reality

---

## How to Use It

There are two ways to invoke the skill:

1. **Using `/global-review-doc`** — type the slash command followed by the path to the document
2. **Natural language** — say "review this doc" or "check this planning doc" and provide the path

The skill runs in a forked context (doesn't affect your main conversation) and uses the Plan agent for structured analysis.

**Example:**
```
/global-review-doc docs/planning/payment-system.md
```

---

## What It Does

The review runs through **9 phases**, each building on the previous:

### Phase 0: Discover Project Context

Before looking at the document, the skill reads your `CLAUDE.md`, detects your tech stack from package manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.), and understands your project's conventions. Every subsequent check adapts to your specific stack.

### Phase 1: Read & Understand the Document

Identifies the document type, the feature being described, the target agent, all technical claims, and the complete user journey.

### Phase 2: Codebase Verification

This is where it gets serious. For **every technical claim** in your document, the skill verifies against actual code:

- **File paths** — does the file actually exist? Are line numbers accurate?
- **API endpoints** — correct HTTP method, route, middleware, request/response schema?
- **Code behavior** — does the function actually do what the doc says it does?
- **Dependencies** — are mentioned libraries/versions in your package manifest?
- **Feature feasibility** — do proposed changes conflict with existing code?

### Phase 3: Code Quality Review

Goes beyond verification — reads the actual files your document references and flags code smells, deeply nested logic, missing error handling, hardcoded values, and recent git changes that might have made the doc outdated.

### Phase 4: Completeness Check

Checks if the document covers everything needed for implementation:
- Complete user journey with success AND failure paths
- API endpoints with full specs (method, path, request/response, status codes)
- Data models with fields, types, relationships, constraints
- Error handling, loading states, empty states
- Accessibility, mobile behavior, internationalization

### Phase 5: Security Deep Dive

Runs a full security review adapted to the feature being documented:
- Authentication & authorization (JWT, tokens, RBAC, session management)
- Data security (hashing, encryption, PII, input sanitization)
- API security (rate limiting, CORS, CSRF, payload limits)
- Frontend security (XSS, CSP, auth guards)

Plus **domain-specific security checklists** — if your doc is about payments, it checks idempotency, webhook signatures, refund flows. If it's about messaging, it checks encryption, content moderation, delivery guarantees. The skill applies only the relevant domain checklists from its 11-domain security reference.

### Phase 6: Bug Prediction

Predicts bugs that will likely occur during implementation:
- Race conditions, state inconsistencies, error boundary gaps
- Type coercion bugs, encoding issues, memory leaks
- Stale closures, cache invalidation problems
- Timezone bugs, platform differences

### Phase 7: Edge Cases

Checks if the document addresses 10 critical runtime scenarios:
1. Network failure mid-operation
2. Concurrent requests / double submit
3. Service outage / degraded mode
4. Extremely large inputs
5. Empty/null/undefined values
6. Duplicate operations
7. User navigates away mid-flow
8. Expired tokens/sessions mid-operation
9. Poor connectivity
10. Internationalization / special characters

### Phase 8: Agent Readiness

Evaluates whether an agent can implement from this doc without ambiguity. Includes an **ambiguity analysis table** showing two possible interpretations for unclear sections — so you see exactly what could go wrong.

### Phase 9: Context7 Library Verification

Verifies that any referenced library APIs and patterns are current by checking against live documentation via Context7. No outdated examples slip through.

---

## Output Format

Every review produces an **11-section report**:

1. **Executive Summary** — finding count by severity, verdict, top 3 must-fix items
2. **Document Overview** — feature, tech stack, document type, target agent
3. **What the Document Does Well** — acknowledges good work
4. **All Findings** — grouped by Critical / Important / Minor, each with issue, evidence, and recommendation
5. **Codebase Verification Results** — verified claims, failed verifications, outdated references
6. **Code Quality Issues** — problems in referenced files that affect the feature
7. **Agent Readiness Assessment** — pass/fail checks with ambiguity analysis table
8. **Quick Wins** — easy fixes under 5 minutes each
9. **Copy-Paste-Ready Additions** — exact text blocks to add to the document
10. **Bug Prediction** — predicted bugs with trigger conditions and prevention strategies
11. **Final Verdict** — Ready / Revise / Rewrite

---

## Skill Structure

```
skills/global-review-doc/
├── SKILL.md                          # Main skill definition (the 9-phase review process)
├── README.md                         # This file
└── references/
    ├── output-format.md              # 11-section output template
    └── security-domains.md           # 11-domain security checklist
```

---

## Setup

### Fresh Install

To set up the Global Review Doc skill in your Claude Code CLI, paste this prompt directly into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and read all files in the skills/global-review-doc/ folder — SKILL.md, references/output-format.md, and references/security-domains.md. Create the same folder structure at ~/.claude/skills/global-review-doc/ and copy each file's content exactly. Create any directories that don't exist. After installing, read the README.md in the same folder (skills/global-review-doc/README.md) and give me a summary of what this skill does and how to use it.
```

That's it. The skill is now available in every project you work on with Claude Code CLI.

### Check for Updates

Already have the Global Review Doc skill set up and want to check if there's a newer version? Paste this into your Claude CLI:

```
Fetch the latest versions of all files in the skills/global-review-doc/ folder from the GitHub repo https://github.com/GradScalerTeam/claude_cli — compare each file (SKILL.md, references/output-format.md, references/security-domains.md) with my local versions at ~/.claude/skills/global-review-doc/. If there are any differences, show me what changed, update my local files to match the latest versions, and give me a summary of what was updated and why it matters.
```
