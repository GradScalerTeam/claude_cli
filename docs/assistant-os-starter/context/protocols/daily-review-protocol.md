# Daily Review Protocol

## Purpose

- Turn one day of activity into a usable reflection record.
- Separate raw events from interpretation.
- Produce clear next actions without over-promoting temporary conclusions.

## Required Inputs

- `context/manifests/reference_manifest.md`
- `memory/daily/{YYYY-MM-DD}.md` if a day file already exists
- New `inbox/` material
- Relevant summaries from `work/exported/` and `life/exported/`
- Open tasks or carry-over items from the previous day when available

## Default Write Target

- Write or update `memory/daily/{YYYY-MM-DD}.md`

## Safety Rules

- Prefer concrete observations over mood-based generalizations.
- Distinguish facts, interpretations, and recommendations.
- Do not write stable rules into `MEMORY.md` from a single day unless explicitly confirmed.

## Workflow

1. Read the manifest and the daily file if it already exists.
2. Review new inbox items and same-day summaries from work and life domains.
3. Extract the most relevant events, unfinished loops, and notable shifts.
4. Separate signal from noise:
   - facts: what actually happened
   - significance: why it mattered
   - change: what seems different from previous days
   - next actions: what should happen next
5. Mark anything uncertain as a risk or open question instead of presenting it as settled.
6. If a pattern looks durable, mark it as a `Memory Candidate` rather than promoting it immediately.

## Output Format

```md
# Daily Review

## What Happened
- key events, completed items, unresolved items

## What Matters
- why the day mattered
- which items deserve attention tomorrow

## Risks
- ambiguity, drift, overload, missed commitments, emotional spillover

## What Changed
- possible new pattern or changed assumption

## Next Actions
- concrete next steps

## Memory Candidates
- possible long-term rule or decision to validate later

## Evidence
- `inbox/...`
- `work/exported/...`
- `life/exported/...`
```

## Promotion Rules

- Daily review may add candidate next actions.
- Daily review may nominate memory candidates.
- Daily review should not finalize long-term decisions unless the same conclusion is already supported elsewhere or the user explicitly confirms it.
