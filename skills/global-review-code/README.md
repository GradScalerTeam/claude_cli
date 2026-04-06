# Global Review Code

A Claude Code skill for auditing real code changes, finding likely regressions, and investigating bugs with a structured review process.

---

## What It Is

`global-review-code` is the code quality and bug-hunt skill in this repository.

Use it when you want Claude to review the actual implementation, not just the plan.

It is designed for two primary modes:

1. **Code review mode**: audit the codebase or a target path for correctness, security, maintainability, and testing gaps
2. **Bug hunt mode**: trace a symptom to likely root cause and propose a fix path

---

## Where It Fits In The Workflow

```text
plan the work                -> docs + review docs
implement                    -> Claude + project tools
/global-review-code          -> inspect the actual implementation
fix findings                 -> targeted edits
re-run review                -> confirm quality improved
```

This skill is usually most valuable **after implementation** or **when a bug is already present**.

---

## When To Use It

Use it when:

- a feature was just built
- a refactor touched important paths
- you want a pre-merge quality pass
- you suspect architecture drift or hidden risks
- a bug report exists and you want structured root-cause analysis

---

## How To Invoke It

### Review a whole repo

```text
/global-review-code
```

### Review a specific area

```text
/global-review-code src/auth/
```

### Bug-hunt style request

```text
Use `global-review-code` in bug-hunt mode for the intermittent token refresh failure.
```

Natural-language invocation also works well when you describe the target path or the symptom clearly.

---

## What It Checks In Review Mode

The review mode is organized around these concerns:

| Focus area | What it looks for |
|---|---|
| Project intelligence | stack, conventions, risk areas, architecture shape |
| Architecture | cohesion, boundaries, structure drift |
| Code quality | readability, duplication, hidden complexity |
| Security | auth, validation, secrets, domain-specific risks |
| Performance | unnecessary work, query inefficiency, rendering costs, async issues |
| Error handling | missing guards, poor resilience, bad failure behavior |
| Dependencies | config drift, outdated or misused packages, env hazards |
| Testing | missing tests, weak coverage, fragile patterns |
| Framework best practices | stack-specific correctness and style |
| Bug prediction | likely failures based on observed patterns |
| Current docs verification | library and framework behavior when recency matters |

---

## What It Does In Bug Hunt Mode

Bug-hunt mode is more investigative.

It should help you answer:

- what is the symptom really?
- where does the data flow diverge from expectations?
- which files are the strongest suspects?
- what is the likely root cause?
- what fix is least risky?
- what test would stop this regression from returning?

This is especially helpful when the bug is intermittent or spread across multiple layers.

---

## Good Prompts

### Whole-feature review

```text
/global-review-code apps/web/src/features/billing/
```

### Pre-merge pass

```text
Review the auth changes with `global-review-code` and focus on correctness,
security, and missing tests.
```

### Bug hunt

```text
Use `global-review-code` in bug-hunt mode for the issue where users are sometimes
logged out right after refreshing the page.
```

---

## What A Good Output Looks Like

A useful review should give you:

- the highest-priority findings first
- exact file references
- concrete explanations of why something is risky
- specific suggested fixes
- a sense of what can wait and what cannot

A useful bug hunt should give you:

- a ranked suspect trail
- the most likely root cause
- the minimal safe fix direction
- a regression test idea

---

## Relationship To The Other Components

### With planning docs

A reviewed planning doc reduces bad implementation decisions early.
This skill then verifies whether the built code actually matches quality expectations.

### With `global-doc-master`

If review finds an important incident or systemic issue, doc master can capture it as an issue or resolved doc.

### With project subagents

Project-specific builders create the code.
This skill provides an independent quality pass afterward.

---

## Installation Scope

| Scope | Location | When to choose it |
|---|---|---|
| User | `~/.claude/skills/global-review-code/` | you want it everywhere |
| Project | `.claude/skills/global-review-code/` | you want a repo-specific shared variant |

This is usually a strong **user-level global skill**.

---

## Install It

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and install the
Global Review Code skill.

1. Read every file in `skills/global-review-code/`.
2. Recreate the same folder structure at `~/.claude/skills/global-review-code/`.
3. Copy the contents exactly.
4. After installing, read `skills/global-review-code/README.md` and summarize the
   two main modes, the kinds of findings it produces, and how it fits after coding.
```

Restart Claude Code after installation so the skill is available in fresh sessions.

---

## Check For Updates

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and compare the
latest files in `skills/global-review-code/` with my local
`~/.claude/skills/global-review-code/` installation.

If they differ:
1. show me the important changes,
2. update my local files,
3. explain whether the review rubric, security checks, or output expectations changed.
```

---

## Final Advice

Use this skill after meaningful code changes, not only when something is already on fire.

The cheapest place to find a regression is before it ships.
