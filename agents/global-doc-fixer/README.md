# Global Doc Fixer

A global Claude Code subagent that turns document review from a manual loop into an automated convergence cycle.

---

## What It Is

`global-doc-fixer` is the document-hardening companion to `global-doc-master`.

Instead of manually repeating this loop:

1. run `/global-review-doc`
2. read findings
3. edit the doc
4. review again
5. repeat until it is finally READY

this subagent handles the loop for you.

It repeatedly reviews, fixes, re-reviews, and asks you only when a real decision boundary appears.

---

## Where It Fits In The Workflow

```text
@global-doc-master   -> create the document
/global-review-doc   -> evaluate quality and correctness
@global-doc-fixer    -> drive the document to READY
build the feature    -> implement from the approved doc
/global-review-code  -> review the implementation
```

This agent is most useful **after** the first draft of a document exists and **before** implementation begins.

---

## When To Use It

Use `global-doc-fixer` when:

- a planning doc exists but is not implementation-ready yet
- a feature flow doc is missing detail or contains stale references
- an issue doc needs to be grounded in the real codebase
- a doc written by another teammate needs structured correction
- you want Claude to converge on a READY verdict without manual babysitting

This is especially valuable when the doc will later be consumed by another Claude subagent or skill.

---

## What It Does Automatically

`global-doc-fixer` is good at fixing:

- stale file paths
- wrong file references
- outdated function or module names
- internal contradictions inside a doc
- missing implementation detail that can be inferred from the codebase
- wording that is too vague for an implementation agent
- copy drift after refactors

---

## What It Should Ask You About

This subagent should still pause for decisions like:

- ambiguous business logic
- version or scope choices
- conflicting product behaviors
- unresolved architecture tradeoffs
- unclear rollout or migration strategy

That is an important boundary. The fixer should close factual gaps on its own, but it should not invent business decisions silently.

---

## Good Prompts

```text
@global-doc-fixer docs/planning/payment-system.md
```

```text
@global-doc-fixer Make `docs/planning/auth-migration.md` implementation-ready.
```

```text
@global-doc-fixer Review and fix the checkout flow doc until the verdict is READY.
```

---

## What A Good Fix Cycle Looks Like

Typical convergence:

```text
Round 1 -> many findings, broad cleanup
Round 2 -> fewer findings, sharper corrections
Round 3 -> only edge cases or missing decisions
Round 4 -> READY, or blocked on one real product choice
```

If the document keeps oscillating or new findings keep replacing old ones, that usually means the document itself is structurally confused or missing a product decision.

---

## What Makes It Effective

This subagent works best when:

- `global-review-doc` is installed and available
- the repo has a useful `CLAUDE.md`
- the source document is already in roughly the right place under `docs/`
- the feature scope is not changing wildly every round

---

## Relationship To `global-review-doc`

`global-review-doc` is the reviewer.
`global-doc-fixer` is the closer.

Use the skill alone when you want a one-off review report.
Use the fixer when you want Claude to keep going until the document is genuinely usable.

---

## Installation Scope

| Scope | Location | When to choose it |
|---|---|---|
| User | `~/.claude/agents/global-doc-fixer.md` | you want it available everywhere |
| Project | `.claude/agents/global-doc-fixer.md` | you want a repo-specific version committed to git |

For most people, this works well as a **user-level global subagent**.

---

## Prerequisite

Install `global-review-doc` first.

This subagent depends on that skill to run the actual document review loop.

See [skills/global-review-doc/README.md](/Volumes/PS1008/Github/claude_cli/skills/global-review-doc/README.md).

---

## Install It

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and install the
Global Doc Fixer subagent.

1. Read `agents/global-doc-fixer/global-doc-fixer.md`.
2. Create `~/.claude/agents/global-doc-fixer.md` with the exact same content.
3. Create the `~/.claude/agents/` directory if it does not exist.
4. After installing, read `agents/global-doc-fixer/README.md` and summarize what the
   subagent does, when to use it, and its dependency on `global-review-doc`.
```

Restart Claude Code after installation so the subagent is loaded in new sessions.

---

## Check For Updates

Paste this into Claude Code:

```text
Visit the GitHub repo https://github.com/srxly888-creator/claude_cli and compare the
latest `agents/global-doc-fixer/global-doc-fixer.md` with my local
`~/.claude/agents/global-doc-fixer.md`.

If they differ:
1. show me the important changes,
2. update my local file,
3. explain whether the review/fix workflow changed.
```

---

## Final Advice

If `global-doc-master` creates the first draft, let `global-doc-fixer` be the quality gate before implementation.

That pairing is one of the most valuable workflow upgrades in this repository.
