# How to Start a Personal Assistant or Knowledge System with Claude Code

This guide is for projects that are not trying to ship an app, but to build a durable personal assistant, reflection system, knowledge workflow, or personal operating system.

The biggest failure modes in this kind of project are usually not bad code. They are:

- blurry context boundaries
- one giant assistant trying to do everything
- raw inputs, summaries, and conclusions mixed together
- no separation between work, life, and reflection
- no explicit privacy rules for sensitive material

So the stable path is not to start with more tools. It is to define read/write paths, roles, summary layers, and privacy boundaries first.

---

## The Goal

For a personal assistant or knowledge system, Claude Code usually works best in this order:

1. define the boundaries
2. define where things are read and written
3. define summary and indexing layers
4. then define subagents and skills
5. then add automation gradually
6. keep distilling raw material into durable knowledge

This is closer to building a long-running personal operating system than generating a pile of files once.

---

## Step 1: Decide What Kind Of System You Actually Want

Answer these questions first:

- what is this system mainly for: life management, work support, study and research, reflection, or a mix
- what language should it default to
- which directories may it write to, and which ones are off limits
- should it read raw material directly, or prefer summaries first
- should this be one unified system, or a layered work / life / reflection system

If you are not sure yet, the safest default is:

1. a work execution layer
2. a life execution layer
3. a reflection layer

For a deeper explanation of that shape, read:

- [docs/ASSISTANT_TEAM_PATTERNS.md](docs/ASSISTANT_TEAM_PATTERNS.md)

---

## Step 2: Create The Project Folder And A Minimal Structure

```bash
mkdir assistant-os
cd assistant-os
claude
```

Do not overdesign the directory tree on day one. Start with a small structure that can grow cleanly.

Recommended starting layout:

```text
assistant-os/
├── CLAUDE.md
├── inbox/
├── memory/
│   ├── daily/
│   ├── weekly/
│   └── decisions/
├── context/
│   ├── user_profile/
│   ├── manifests/
│   └── protocols/
├── work/
│   └── exported/
├── life/
│   └── exported/
└── reflection/
    ├── journal/
    ├── plans/
    └── weekly-review/
```

The logic behind this is:

- `inbox/` holds unprocessed inputs
- `memory/` holds distilled daily memory and decisions
- `context/` holds rules, manifests, profiles, and protocols
- `work/` and `life/` hold exported summaries from the execution domains
- `reflection/` holds cross-domain synthesis, reviews, and next-step planning

If boundaries matter a lot to you, `work/` and `life/` can also be separate repositories, and this system can read only their exported summaries.

---

## Step 3: Run `/init`, Then Rewrite `CLAUDE.md` As A System Manual

Start with:

```text
/init
```

Then do not mechanically keep the standard software template with `build / test / lint`.

In this kind of project, `CLAUDE.md` should answer:

- what this system is for
- what Claude should read first
- which files are the source of truth
- which requests should route to which subagents
- where thoughts, plans, and reviews should be written
- which topics are high-sensitivity by default
- what every output must include

Recommended sections:

- `Project Purpose`
- `Read Order`
- `Source of Truth`
- `Agent Routing`
- `Write Destinations`
- `Privacy Rules`
- `Output Protocol`
- `Update Rules`

You can structure this in two ways:

- when the system is still small, keep long-term rules directly inside `CLAUDE.md`
- when it grows, keep `CLAUDE.md` as the entry point and move durable memory into a separate `MEMORY.md` or protocol docs

The example below uses the second pattern: `CLAUDE.md` routes the system, while `MEMORY.md` holds stable long-term memory.

Example:

```md
# Project Purpose
- This is a personal assistant and knowledge workflow. Default output language is Chinese.
- Its job is to help with capture, organization, reflection, and action routing.

# Read Order
- This file is the entry point
- Then read `MEMORY.md`
- Then read `context/user_profile/profile.md`
- Read `context/manifests/reference_manifest.md` when paths are needed
- For reflection, prefer `work/exported/daily-summary.md` and `life/exported/daily-summary.md`

# Source of Truth
- Long-term rules live in `MEMORY.md`
- Directory meaning lives in `context/manifests/reference_manifest.md`
- Process rules live under `context/protocols/`

# Agent Routing
- quick capture -> `@thought-recorder`
- daily review -> `@daily-reflection-mentor`
- weekly review -> `@weekly-reviewer`
- research organization -> `@knowledge-gardener`

# Write Destinations
- raw thoughts go to `inbox/`
- daily logs go to `memory/daily/{YYYY-MM-DD}.md`
- weekly reviews go to `memory/weekly/{YYYY-WW}.md`
- stable decisions go to `memory/decisions/`

# Privacy Rules
- health, relationships, and finances are high-sensitivity by default
- do not send, publish, or share externally without confirmation
- do not bulk rewrite or delete raw material

# Output Protocol
- handoffs must include `State / Alerts / Next Actions / Evidence`
- reviews must include `What Happened / What Matters / What Changed / What To Do Next`

# Update Rules
- keep raw records and distilled conclusions separate
- only stable patterns belong in long-term memory
- update manifests when protocols change
```

The point of this `CLAUDE.md` is to make the system boundary explicit up front so you do not keep re-explaining it.

---

## Step 4: Build Manifests And Protocols Before You Expose Everything

Knowledge systems become unstable when the main session gets direct access to too much raw material.

A better pattern is to create two kinds of files first:

1. `reference_manifest.md`
2. protocol documents

### `reference_manifest.md` tells Claude:

- what each directory is for
- which files are sources of truth
- which directories are read-only
- which directories are append-only
- when to read summaries first and when raw material is justified

### Protocol docs tell Claude:

- how inbox triage works
- how daily review works
- how weekly review works
- what may enter long-term memory
- which items should route back into work or life execution

You can use the documentation agent in this repo to draft these:

```text
@global-doc-master Create a reference manifest for my assistant-os that explains
directory responsibilities, read order, read-only areas, writable areas, and
sources of truth.
```

```text
@global-doc-master Create a daily review protocol, weekly review protocol,
and inbox triage protocol for my assistant-os.
```

The point is not to produce lots of docs. It is to make the system rules legible.

If you want copy-ready starter files instead of drafting these from scratch, see:

- [docs/assistant-os-starter/README.md](docs/assistant-os-starter/README.md)

---

## Step 5: Use Plan Mode To Design The Three Core Flows

For this kind of project, process design usually matters more than stack choice.

Use Plan Mode to design these three flows:

1. capture flow: how inputs enter the system
2. distillation flow: how raw notes become summaries, conclusions, and actions
3. return flow: how reflection outputs feed back into work or life

Enter Plan Mode:

```text
/plan
```

Useful prompts:

```text
Given this assistant-os structure, design an inbox -> daily summary -> reflection ->
next actions workflow. Call out which steps should require manual confirmation and
which ones are good candidates for skills.
```

```text
Design rules for turning raw thoughts into structured notes and then into long-term
memory, while avoiding the mistake of promoting short-term emotions into stable conclusions.
```

This step helps you avoid premature automation in the wrong places.

---

## Step 6: Create Subagents By Domain Responsibility, Not By Unlimited Scope

Only add subagents after the protocols are stable.

Common subagents for this kind of project:

- `thought-recorder`: quickly organizes new inputs into the right place
- `inbox-triager`: classifies, deduplicates, and routes inbox material
- `daily-reflection-mentor`: runs the daily review and extracts priorities
- `weekly-reviewer`: synthesizes patterns and risks at the weekly level
- `knowledge-gardener`: turns scattered material into structured knowledge
- `travel-assistant`: handles travel and itinerary planning as a bounded domain

Creation rules:

- each subagent should own one kind of job
- each subagent should have a clear write scope
- reflection agents should prefer summaries before scanning raw material
- do not start with a mega-assistant that can read every directory

If you have not created subagents before, read:

- [HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)

---

## Step 7: Turn Repeated Routines Into Skills

In personal assistant and knowledge systems, the best reusable unit is often the workflow, not the persona.

Good candidates for skills:

- `/capture-thought`
- `/triage-inbox`
- `/daily-review`
- `/weekly-review`
- `/summarize-reading`
- `/convert-notes-to-actions`

Skills work especially well for tasks with:

- predictable inputs
- repeatable steps
- a stable output format

For example, a `daily-review` skill can fix:

- which summaries to read first
- which unfinished items to check
- what output template to use
- where the result should be written
- when to suggest changes instead of editing directly

If you want to build skills next, read:

- [HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)

---

## Step 8: Make Privacy Boundaries Explicit

In this kind of project, the biggest risk is often not broken code. It is broken boundaries.

Define rules like these early:

- health, relationships, and finances are high-sensitivity by default
- external sending, posting, sharing, and syncing require confirmation
- raw journals, chat excerpts, and raw thoughts should usually be append-only
- the reflection layer should prefer summaries before reading all raw material
- cross-domain writes between work and life should usually be proposed first, then confirmed

You can encode these in:

- `CLAUDE.md`
- subagent prompts
- protocol docs inside skills

Do not rely on the model to guess where caution is needed. Write the boundary down.

---

## Step 9: Build A Stable Daily Rhythm Before Complex Automation

A healthy default rhythm often looks like this:

### During the day

- small inputs go into `inbox/`
- transient thoughts get captured before they are interpreted
- clear tasks get routed into work or life

### In the evening

- run `daily-review`
- generate a daily summary
- extract next-day actions
- promote only stable patterns into long-term memory

### Weekly

- run `weekly-review`
- compare unfinished loops across work and life
- identify repeated problems
- produce next-week priorities

Example prompts:

```text
Read today's inbox, work summary, life summary, and unfinished items, then run a
daily review. Output What Happened / What Matters / Risks / Next Actions and write
the result into today's daily file.
```

```text
Review this week's daily files and create a weekly review. Focus on repeated delay
patterns, work-life boundary conflicts, and low-value commitments that should be removed next week.
```

Get the rhythm stable first. Then decide whether more hooks, MCP tools, or automation are worth it.

---

## Step 10: Make Knowledge Rise Up Instead Of Piling Up

If the system only stores inputs, it will eventually become a closet full of boxes.

You need three layers of distillation:

1. raw input -> summary
2. summary -> conclusion
3. conclusion -> long-term rule, decision, or checklist

Suggested destinations:

- daily results go to `memory/daily/`
- weekly patterns go to `memory/weekly/`
- stable rules go to `MEMORY.md`
- important judgments go to `memory/decisions/`
- manifest and protocol changes stay synced in `context/manifests/` and `context/protocols/`

A simple test for whether something belongs in long-term memory:

- it is not a one-off emotion
- it is not a conclusion that only happened to be true today
- it will help with future decisions more than once

---

## Step 11: When The System Grows, Split Layers Or Split Repositories

If Claude can see everything but performance and clarity are getting worse, the problem is usually not the model. The system boundary needs an upgrade.

Two common upgrade paths:

### Option A: Layered structure inside one repo

- `work/`
- `life/`
- `reflection/`

Use summaries and protocols to limit scope.

### Option B: Multiple repositories with hard separation

- `work-assistant/`
- `life-assistant/`
- `reflection-os/`

In this shape, `reflection-os/` reads only exported summaries from the other two.

If you are reaching this point, revisit:

- [docs/ASSISTANT_TEAM_PATTERNS.md](docs/ASSISTANT_TEAM_PATTERNS.md)

---

## A Minimal Version That Is Actually Likely To Work

If you do not want to overdesign up front, start with this:

1. create one `assistant-os/`
2. write a real `CLAUDE.md`
3. create `inbox/`, `memory/daily/`, and `context/manifests/`
4. write one `daily review protocol`
5. create one `daily-reflection-mentor`
6. use it for 7 days
7. then decide whether work and life need to split
8. then decide whether a `weekly-review` skill is worth adding

This is much more likely to become a real system than a beautiful design that never runs.

---

## Summary

```text
1. Define system boundaries          -> decide whether work / life / reflection should split
2. Build a small directory skeleton  -> inbox + memory + context
3. Rewrite CLAUDE.md                 -> read/write rules, routing, privacy, output protocol
4. Write manifests and protocols     -> make indexing and process explicit
5. Use Plan Mode for core flows      -> capture / distill / return
6. Use subagents for domain roles    -> capture / reflection / knowledge
7. Use skills for repeated routines  -> daily review / inbox triage
8. Write privacy rules explicitly    -> sensitivity, read-only, confirmation gates
9. Run a steady rhythm first         -> daily review, weekly review, action routing
10. Distill long-term knowledge      -> summary -> decisions -> memory
11. Split layers when needed         -> summary-driven scope instead of full exposure
```

Short version: software projects document how to build and test; personal assistant and knowledge systems should document what to read first, where to write, how work is routed, how material is distilled, and which boundaries must never be crossed.
