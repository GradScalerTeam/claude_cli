# Inbox Triage Protocol

## Purpose

- Process raw inbox material without losing information.
- Convert unstructured capture into routing decisions, follow-ups, and review inputs.
- Keep inbox cleanup separate from long-term memory promotion.

## Required Inputs

- `context/manifests/reference_manifest.md`
- `context/user_profile/profile.md` when user preferences affect routing
- New or unresolved items in `inbox/`
- The current day file in `memory/daily/{YYYY-MM-DD}.md` if it exists

## Default Write Target

- Preferred: append an `Inbox Triage` section to `memory/daily/{YYYY-MM-DD}.md`
- Do not delete the original inbox content unless explicitly instructed

## Safety Rules

- Preserve raw input.
- Do not silently merge multiple items if the original meaning would be lost.
- Do not turn one-off emotional statements into long-term memory.
- Do not route sensitive content across domains without clear justification.

## Triage Categories

- `work`
- `life`
- `reflection`
- `reference`
- `someday`
- `unclear`

## Workflow

1. Read the manifest and confirm the current write boundaries.
2. Scan new inbox items and extract the minimum useful metadata:
   - timestamp if available
   - source if available
   - one-line gist
3. Group obvious duplicates or near-duplicates, but preserve links to the original items.
4. Assign each item to one triage category.
5. For each item, decide one of the following actions:
   - route to work summary or work task list
   - route to life summary or life task list
   - keep for daily review
   - keep as reference only
   - defer to someday/maybe
   - mark unclear and ask for confirmation
6. Record open questions instead of guessing when meaning, ownership, or sensitivity is ambiguous.

## Output Format

Use this structure in the daily file:

```md
## Inbox Triage

### Routed
- [item] -> work | life | reflection | reference | someday

### Needs Clarification
- [item] -> what is unclear

### Candidate Next Actions
- [action]

### Evidence
- `inbox/...`
```

## Promotion Rules

- Inbox triage may create candidate next actions.
- Inbox triage must not directly create long-term decisions unless the user explicitly asks for it.
- Stable memory candidates should be passed to daily review or weekly review for a second pass.
