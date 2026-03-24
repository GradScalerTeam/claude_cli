# Output Format — Document Review

**CRITICAL: Always present ALL Critical and Important findings as a detailed numbered list. Never summarize or omit Critical/Important findings — the full All Findings section (section 4) MUST appear in your response.**

**Minor Findings Cap:** When there are more than 10 Minor findings, list the first 5 in full detail and summarize the rest as a count with one-line descriptions (e.g., "Plus 8 additional Minor findings: 3 formatting, 3 wording, 2 typos"). This prevents token bloat on docs with many cosmetic issues while preserving full detail for findings that matter.

Structure the review with ALL sections below. Every section is mandatory.

---

### 1. Executive Summary

The executive summary provides a quick overview, but it is NOT a substitute for the full findings in section 5. Always present both.

```
FINDINGS: X total — Critical: N | Important: N | Minor: N
VERDICT: [READY / REVISE / REWRITE]

TOP 3 MUST-FIX:
1. [F-XX] <most critical finding — include brief description>
2. [F-XX] <second critical finding — include brief description>
3. [F-XX] <third critical finding — include brief description>
```

### 2. Document Overview

| Field | Value |
|---|---|
| **Document** | [filename] |
| **Feature** | [identified feature] |
| **Tech Stack** | [discovered stack] |
| **Document Type** | [feature spec / flow doc / issue / plan / API spec] |
| **Target Agent** | [which agent consumes this] |

### 3. What the Document Does Well

- [Specific positive finding — acknowledge good work]

### 4. All Findings

**This section MUST be included in full — never summarize, truncate, or omit findings.** Each finding must show its ID, what's wrong, and how to fix it.

Every finding gets a globally unique ID. Findings are grouped by severity.

#### Critical
> Blocks implementation or creates security vulnerability. Must fix before handing to agent.

1. **[F-01] [Finding Title]**
   - **Issue**: [what's wrong — explain clearly]
   - **Evidence**: `[file:line or doc quote]`
   - **Recommendation**: [specific fix]

2. **[F-02] [Finding Title]**
   - **Issue**: [what's wrong]
   - **Evidence**: `[file:line or doc quote]`
   - **Recommendation**: [specific fix]

#### Important
> Will cause bugs or significant rework. Should fix before handing to agent.

1. **[F-XX] [Finding Title]**
   - **Issue**: [what's wrong]
   - **Evidence**: `[file:line or doc quote]`
   - **Recommendation**: [specific fix]

#### Minor
> Improves quality or robustness. Fix when possible. Includes polish and nice-to-haves.

1. **[F-XX] [Finding Title]**
   - **Issue**: [what's wrong]
   - **Evidence**: `[file:line or doc quote]`
   - **Recommendation**: [specific fix]

If a severity group has no findings, write "None found." under it.

### 5. Codebase Verification Results

**Verified Claims**

| # | Claim | Status | Evidence |
|---|---|---|---|
| 1 | [claim from doc] | VERIFIED | [file:line] |

**Failed Verifications**

| # | Claim | Status | What's Actually True |
|---|---|---|---|
| 1 | [claim from doc] | FAILED | [what code actually shows] |

**Outdated References**

| # | Reference | What Changed |
|---|---|---|
| 1 | [file path or endpoint] | [what's different now] |

### 6. Code Quality Issues in Referenced Files

| # | File | Issue | Severity | Impact on Feature |
|---|---|---|---|---|
| 1 | [file:line] | [code quality issue] | [High/Med/Low] | [how it affects this feature] |

### 7. Agent Readiness Assessment

| Check | Status | Notes |
|---|---|---|
| Unambiguous instructions | PASS/FAIL | [detail] |
| Clear implementation order | PASS/FAIL | [detail] |
| Acceptance criteria defined | PASS/FAIL | [detail] |
| Scope clearly bounded | PASS/FAIL | [detail] |
| No implicit assumptions | PASS/FAIL | [detail] |
| References to existing patterns | PASS/FAIL | [detail] |

**Ambiguity Analysis:**

| Ambiguous Text | Interpretation A | Interpretation B | Risk |
|---|---|---|---|
| "[quote]" | [reading 1] | [reading 2] | [what goes wrong] |

### 8. Quick Wins

Easy fixes that take <5 minutes each:

| # | Finding ID | What to Do | Time |
|---|---|---|---|
| 1 | F-XX | [specific quick action] | ~2 min |

### 9. Copy-Paste-Ready Additions

Exact text blocks to add to the document:

#### Addition 1: [Title]
> **Where to add**: [section of the document]
> **Addresses**: [F-XX]
>
> ```markdown
> [exact markdown text to add]
> ```

### 10. Bug Prediction

| # | Predicted Bug | Trigger Condition | Likelihood | Prevention |
|---|---|---|---|---|
| 1 | [bug description] | [when it happens] | High/Med/Low | [how to prevent] |

### 11. Final Verdict

**Recommendation**: [Ready to hand to agent / Revise and re-review / Major rewrite needed]

**Summary**: [2-3 sentence final assessment]

---

# Delta Output Format (Rounds 2+)

**Use this format when the review is invoked with `round:N` where N > 1.** This is a re-review after fixes — the full 11-section report is unnecessary. Only output these 3 sections:

### 1. Delta Summary

```
ROUND: N (delta review — checking fixes from round N-1)
FINDINGS: X remaining — Critical: N | Important: N | Minor: N
PREVIOUS ROUND: Y findings → now X findings
TREND: [Converging ✓ / Stable / Oscillating ✗]
VERDICT: [READY / REVISE / REWRITE]
```

### 2. Remaining Findings

Only list findings that **still exist** or were **newly introduced** by the fixes. Do not re-list findings that were fixed.

- **New findings** (introduced by fixes): mark with `[NEW]`
- **Persisting findings** (not fixed from prior round): mark with `[PERSISTS]`

Use the same format as section 4 of the full review (severity-grouped, with ID/Issue/Evidence/Recommendation). Apply the Minor Findings Cap here too.

If no findings remain, write: "All prior findings resolved. No new issues introduced."

### 3. Verdict

**Recommendation**: [Ready / Revise / Rewrite]

**Summary**: [1-2 sentences — what's left, if anything]
