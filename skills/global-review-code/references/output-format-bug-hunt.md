# Output Format — Bug Hunt Mode

### 1. Bug Summary

| Field | Value |
|---|---|
| **Expected Behavior** | [what should happen] |
| **Actual Behavior** | [what actually happens] |
| **Trigger** | [how to reproduce] |
| **Severity** | [Critical / High / Medium / Low] |

### 2. Investigation Trail

| # | File Explored | What Was Found | Verdict |
|---|---|---|---|
| 1 | [file:line] | [observation] | [Suspect / Cleared / Root Cause] |

### 3. Root Cause

- **File**: `[file path]`
- **Line**: [line number]
- **Function**: `[function name]`
- **Category**: [which of the 12 culprits]
- **Explanation**: [detailed step-by-step of how the bug manifests — trace the data flow from trigger to symptom]

### 4. Recommended Fix

**Before**:
```[language]
[current buggy code]
```

**After**:
```[language]
[fixed code]
```

**Why this fixes it**: [explanation]

### 5. Related Risks

Other places in the codebase with the same pattern:

| # | File | Line | Same Pattern? | Risk Level |
|---|---|---|---|---|
| 1 | [file] | [line] | [description] | High/Med/Low |

### 6. Test Case

```[language]
[test code to verify the fix and prevent regression]
```

**What this tests**: [explanation of what the test verifies]
