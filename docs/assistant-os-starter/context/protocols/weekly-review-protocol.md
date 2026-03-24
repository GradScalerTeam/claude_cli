# Weekly Review Protocol

## Purpose

- Synthesize one week of activity into patterns, risks, and priorities.
- Detect repeated issues that daily notes alone do not make obvious.
- Decide what deserves promotion into longer-lived memory or decisions.

## Required Inputs

- `context/manifests/reference_manifest.md`
- Daily files in `memory/daily/` for the target week
- The previous weekly file in `memory/weekly/` if it exists
- Relevant summaries from `work/exported/` and `life/exported/`
- Open commitments that rolled over across multiple days

## Default Write Target

- Write `memory/weekly/{YYYY-WW}.md`

## Safety Rules

- Focus on recurring evidence, not isolated incidents.
- Keep work, life, and reflection boundaries explicit.
- Do not promote a pattern into long-term memory unless it appears durable or is explicitly confirmed.

## Workflow

1. Read the manifest and collect the week's daily files.
2. Identify repeated themes across the week:
   - recurring wins
   - recurring blockers
   - boundary conflicts
   - dropped or delayed commitments
3. Compare the current week with the previous week when available.
4. Distinguish:
   - what was completed
   - what remains open
   - what keeps repeating
   - what should be stopped, reduced, or redesigned
5. Produce priorities for the next week.
6. Evaluate whether any `Memory Candidate` should become:
   - a stable rule in `MEMORY.md`
   - a decision in `memory/decisions/`
   - or remain provisional

## Output Format

```md
# Weekly Review

## Week Summary
- high-level summary of the week

## Repeated Patterns
- recurring wins, failures, constraints, or habits

## Risks And Tensions
- overload, drift, conflicts, unclosed loops, weak boundaries

## Completed
- what was actually closed this week

## Still Open
- what rolled forward and why

## Next Week Priorities
- top priorities and what to reduce or remove

## Memory Decisions
- promote / defer / reject

## Evidence
- `memory/daily/...`
- `work/exported/...`
- `life/exported/...`
```

## Promotion Rules

- Promote to long-term memory only when the pattern is supported by multiple observations or clear user confirmation.
- If evidence is mixed, defer and keep the item in weekly review instead of finalizing it.
- When a weekly review changes a stable operating rule, update `MEMORY.md` and any affected protocol or manifest.
