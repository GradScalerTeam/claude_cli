# Output Format — Code Review Mode

Structure the review with ALL sections below. Every section is mandatory.

---

### 1. Executive Summary

```
PROJECT: [project name]
HEALTH: [Excellent / Good / Needs Work / Critical]
FINDINGS: X total — Critical: N | Important: N | Minor: N

TOP 3 ISSUES:
1. [F-XX] <most critical finding>
2. [F-XX] <second critical finding>
3. [F-XX] <third critical finding>
```

### 2. Project Overview

| Field | Value |
|---|---|
| **Path** | [reviewed path] |
| **Tech Stack** | [detected stack + versions] |
| **Framework(s)** | [detected frameworks] |
| **File Count** | [number of files reviewed] |
| **Lines of Code** | [approximate LOC] |
| **Architecture** | [pattern: MVC, feature-based, layered, etc.] |
| **Project Stage** | [MVP / Growing / Mature] |
| **Docs Found** | [list of docs discovered in Phase 0] |
| **Linting/CI Enforced** | [what's already automated — these checks were skipped] |

### 3. What is Done Well

Acknowledge good patterns before listing problems:

- [Specific positive finding with file:line reference]
- [Another positive finding]

### 4. All Findings

Every finding gets a globally unique ID. Findings are grouped by severity. **Never omit findings — list every one.**

#### Critical
> Security vulnerabilities, data loss risks, or crashes. Must fix immediately.

1. **[F-01] [Finding Title]**
   - **Issue**: [what's wrong — explain clearly]
   - **Location**: `[file:line]`
   - **Recommendation**: [specific fix]

2. **[F-02] [Finding Title]**
   - **Issue**: [what's wrong]
   - **Location**: `[file:line]`
   - **Recommendation**: [specific fix]

#### Important
> Will cause bugs, performance issues, or maintenance burden. Fix soon.

1. **[F-XX] [Finding Title]**
   - **Issue**: [what's wrong]
   - **Location**: `[file:line]`
   - **Recommendation**: [specific fix]

#### Minor
> Improves quality, readability, or robustness. Fix when possible. Includes polish and nice-to-haves.

1. **[F-XX] [Finding Title]**
   - **Issue**: [what's wrong]
   - **Location**: `[file:line]`
   - **Recommendation**: [specific fix]

If a severity group has no findings, write "None found." under it.

### 5. Architecture & Structure Assessment

Current directory structure (relevant portion):
```
[tree output]
```

Issues found:
- [structural issues with recommendations]

Recommended structure changes (if needed):
```
[proposed structure]
```

### 6. Security Findings (Expanded)

For each security finding from the main table, provide expanded detail:

#### F-XX: [Finding Title]

- **OWASP Category**: [e.g., A01:2021 — Broken Access Control]
- **Attack Scenario**: [how an attacker would exploit this]
- **Current Code**: [file:line — what's vulnerable]
- **Recommended Fix**: [specific code change]
- **Severity Justification**: [why this priority level]

### 7. Performance Findings (Expanded)

For each performance finding:

#### F-XX: [Finding Title]

- **Estimated Impact**: [High / Medium / Low — with reasoning]
- **Current Code**: [file:line — what's slow]
- **Recommended Fix**: [specific code change]
- **How to Measure**: [how to verify the improvement]

### 8. Quick Wins

Easy fixes that take <5 minutes each:

| # | Finding ID | What to Do | Time |
|---|---|---|---|
| 1 | F-XX | [specific quick action] | ~2 min |
| 2 | F-XX | [specific quick action] | ~3 min |

### 9. Before/After Code Examples

Provide 3-5 concrete refactoring suggestions with exact code:

#### Example 1: [Title] (Addresses F-XX)

**File**: `[file path]`

**Before**:
```[language]
[current code]
```

**After**:
```[language]
[improved code]
```

**Why**: [brief explanation of the improvement]

### 10. Bug Predictions

| # | Predicted Bug | Trigger | Likelihood | Files at Risk | Prevention |
|---|---|---|---|---|---|
| 1 | [bug] | [when it happens] | High/Med/Low | [file:line] | [how to prevent] |

### 11. Final Verdict

**Health**: [Excellent / Good / Needs Work / Critical]

**Summary**: [2-3 sentence final assessment]

**Immediate Actions** (do now):
1. [Critical fixes]

**Short-term Actions** (this sprint):
1. [Important fixes]

**Long-term Actions** (backlog):
1. [Minor improvements]

---

### 12. Issue Documentation (Optional)

> This section appears ONLY if the user opted to document issues via Phase 12. If the user declined, omit this section entirely.

**Documentation Method:** [Local doc master agent | Global doc master agent | Direct creation (no agent found)]
**Issues Documented:** [N findings]
**Location:** `docs/issues/`

| # | Finding ID | Severity | File Created |
|---|---|---|---|
| 1 | F-XX | Critical | `docs/issues/YYYY-MM-DD-<slug>.md` |
| 2 | F-XX | Important | `docs/issues/YYYY-MM-DD-<slug>.md` |
