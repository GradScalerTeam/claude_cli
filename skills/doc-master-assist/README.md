# Doc Master Assist Skill

The template and protocol engine behind the [Global Doc Master agent](../../agents/global-doc-master/). It holds 8 document templates and the quality protocols that make every doc in a project come out consistent.

> **This skill is half of a bundle, not a standalone install.** It ships with the [Global Doc Master agent](../../agents/global-doc-master/) and is marked `user-invocable: false` — only that agent calls it. Neither half does anything alone. Install them together using [the agent's install prompt](../../agents/global-doc-master/README.md#install).

## What This Does

The Doc Master agent knows *how to investigate* a codebase. This skill knows *what the finished document should look like*. Splitting them means the agent definition stays small and only the one template it needs gets loaded into context per run — a planning doc never pays the token cost of the 673-line design template.

It also carries the shared quality protocols that apply to every doc type: codebase investigation before writing, Context7 verification for any external library API referenced, an uncertainty-handling rule (ask, don't guess), a self-reflection pass, and a final quality checklist.

## The 8 Templates

| Doc Type | Template | Lands At |
|---|---|---|
| `overview` | Project overview — problem, users, journeys, business rules, revenue model | `docs/overview.md` |
| `tech-overview` | Architecture, stack rationale, DB design, auth model, patterns, deployment | `docs/tech-overview.md` |
| `design` | Visual identity, color system, typography, spacing, components, motion, a11y | `docs/design-overview.md` |
| `planning` | Requirements, technical design, phases, testing strategy, risks | `docs/planning/<slug>.md` |
| `feature-flow` | End-to-end trace with diagrams and real `file:line` references | `docs/feature_flow/<slug>-flow.md` |
| `issue` | Bug report — repro steps, affected components, root cause, recommended fix | `docs/issues/YYYY-MM-DD-<slug>.md` |
| `deployment` | Setup steps, env vars, build commands, service architecture, troubleshooting | `docs/deployment/<slug>.md` |
| `debug` | The developer's debugging mental model, turned into a runbook | `docs/debug/<slug>-debug.md` |

## Install

**Use the [Global Doc Master install prompt](../../agents/global-doc-master/README.md#install).** It installs the agent and this skill in one go, which is the only combination that works.

If you already have the agent and somehow ended up without the templates, this repairs it:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and repair my doc-master-assist install:

Copy the entire skills/doc-master-assist/ folder to ~/.claude/skills/doc-master-assist/ with exact content — SKILL.md plus all 8 template files in the references/ folder. Exclude README.md.

Then confirm ~/.claude/agents/global-doc-master.md also exists. If it doesn't, install it too from agents/global-doc-master/global-doc-master.md — the two only work as a pair.
```

Then quit your Claude CLI session and start a new one — skills only load at session startup.

## Check for Updates

**Use the [Global Doc Master update prompt](../../agents/global-doc-master/README.md#check-for-updates).** It checks the agent and all 8 templates together, so the two halves never drift apart.

## Usage

You never invoke this skill yourself. Use the agent:

```
@global-doc-master I need a planning doc for adding Stripe payments
```

The agent picks the doc type, calls this skill with that type as the argument, and the skill loads the matching template.

## What's Inside

| File | What It Covers |
|---|---|
| `SKILL.md` | Router (doc type → template file → output path) plus the 7 shared steps: template load, codebase investigation, Context7 verification, uncertainty handling, writing rules, self-reflection protocol, quality checklist. |
| `references/template-*.md` | The 8 templates above. Each carries its own section structure and a doc-type-specific investigation protocol. Only the requested one is read per invocation. |
