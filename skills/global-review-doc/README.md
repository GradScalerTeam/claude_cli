# Global Review Doc

A Claude Code skill that reviews technical documents against the real codebase so your implementation plan is accurate, complete, and safe before code gets written.

---

## What It Is

`global-review-doc` is the document quality gate in this repository.

It checks whether a doc is:

- factually aligned with the repo
- complete enough for implementation
- clear enough for humans and Claude
- safe enough for the domain it touches
- specific enough to avoid avoidable rework

It is especially useful for planning docs, flow docs, issue docs, and migration specs.

---

## Where It Fits In The Workflow

```text
@global-doc-master   -> create the doc
/global-review-doc   -> inspect the doc
@global-doc-fixer    -> close the loop to READY
implement            -> build from the approved doc
```

If you want a **report only**, run this skill directly.
If you want a **review-and-fix loop**, use `global-doc-fixer`, which depends on this skill internally.

---

## When To Use It

Use this skill when:

- a new planning doc was just written
- a feature flow doc may be stale after refactors
- an issue doc needs verification against the actual code
- a migration plan might be missing edge cases
- another person wrote a spec and you want a grounded second pass

---

## How To Invoke It

### Slash command

```text
/global-review-doc docs/planning/payment-system.md
```

### Natural language

```text
Review `docs/planning/payment-system.md` against the codebase.
```

This skill runs in a forked context, which keeps the review structured and reduces noise in the main session.

---

## What It Checks

The review is organized into 9 phases:

| Phase | Focus |
|---|---|
| 0 | project context and tech-stack discovery |
| 1 | document understanding and scope extraction |
| 2 | verification against the actual codebase |
| 3 | code-quality implications of the referenced implementation |
| 4 | completeness for implementation |
| 5 | security and domain-specific risk |
| 6 | bug prediction and likely failure paths |
| 7 | edge cases and non-happy-path behavior |
| 8 | agent-readiness and ambiguity reduction |
| 9 | library/framework verification where current docs matter |

The exact checks adapt to the project stack and the kind of document being reviewed.

---

## What A Good Output Looks Like

A useful review output should tell you:

- the verdict: `READY`, `REVISE`, or `REWRITE`
- what is already strong
- what is factually wrong
- what is underspecified
- what is risky
- what should be corrected before implementation begins

The goal is not to produce vague feedback. The goal is to identify specific blockers and reduce ambiguity.

---

## Typical Use Cases

### Before implementation

```text
/global-review-doc docs/planning/subscription-billing.md
```

### After a refactor changed reality

```text
/global-review-doc docs/feature_flow/authentication.md
```

### Before handing a doc to another subagent

```text
/global-review-doc docs/planning/admin-dashboard.md
```

---

## Relationship To The Other Components

### With `global-doc-master`

The doc master creates the first structured draft.
This skill checks whether that draft actually holds up.

### With `global-doc-fixer`

The fixer repeatedly calls this skill until the document becomes implementation-ready.

### With `doc-scanner`

Once reviewed docs exist, the doc-scanner hook helps later Claude sessions discover them automatically.

---

## Installation Scope

Skills can be installed either globally or per project:

| Scope | Location | When to choose it |
|---|---|---|
| User | `~/.claude/skills/global-review-doc/` | you want the skill in every repo |
| Project | `.claude/skills/global-review-doc/` | you want a project-specific shared version |

This skill is usually a good **user-level global skill**.

---

## Install It

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and install the
Global Review Doc skill.

1. Read every file in `skills/global-review-doc/`.
2. Recreate the same folder structure at `~/.claude/skills/global-review-doc/`.
3. Copy the contents exactly.
4. After installing, read `skills/global-review-doc/README.md` and summarize what the
   skill checks, when to use it directly, and when to use `global-doc-fixer` instead.
```

Restart Claude Code after installation so the skill is loaded in fresh sessions.

---

## Check For Updates

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and compare the
latest files in `skills/global-review-doc/` with my local
`~/.claude/skills/global-review-doc/` installation.

If they differ:
1. show me the important changes,
2. update my local files,
3. explain whether the review rubric or output expectations changed.
```

---

## Final Advice

If you want faster Claude implementation, do not skip document review.

A clean planning doc is one of the cheapest places to catch a bad idea.
