# Reference Manifest

## Purpose

- Define what each directory is for.
- Define what Claude should read first.
- Define which locations are read-only, append-only, or writable.
- Define the source-of-truth rules for long-term memory, summaries, and protocols.

## Read Order

1. `CLAUDE.md`
2. `MEMORY.md`
3. `context/manifests/reference_manifest.md`
4. Relevant file in `context/protocols/`
5. `context/user_profile/profile.md`
6. Exported summaries in `work/exported/` and `life/exported/`
7. Raw inbox or journal files only when summaries are missing, stale, or insufficient

## Global Operating Rules

- Prefer summaries before raw material.
- Treat health, relationships, and finances as high-sensitivity topics.
- Do not delete or rewrite raw capture files without explicit confirmation.
- Keep raw records and derived conclusions in separate files.
- Promote information into long-term memory only when it is stable, repeatable, or explicitly confirmed.

## Directory Map

| Path | Purpose | Read Policy | Write Policy |
|---|---|---|---|
| `inbox/` | Raw capture and unprocessed inputs | Read when triaging or when no summary exists | Append-only by default |
| `memory/daily/` | Day-level records and daily reviews | Primary source for recent reflection | Create or update the current day file |
| `memory/weekly/` | Weekly synthesis and patterns | Read for trend analysis and planning | Write during weekly review only |
| `memory/decisions/` | Stable decisions and rules | Read before making recurring recommendations | Write only for durable conclusions |
| `work/exported/` | Work-domain summaries | Prefer before raw work materials | Write derived summaries, not raw notes |
| `life/exported/` | Life-domain summaries | Prefer before raw life materials | Write derived summaries, not raw notes |
| `reflection/` | Cross-domain reflection and planning | Read when generating reviews or plans | Write synthesized outputs only |
| `context/user_profile/` | User preferences and constraints | Read when personalization matters | Update only when the user confirms profile changes |
| `context/manifests/` | Maps, indexes, and access rules | Read before broad file exploration | Update when directory meaning changes |
| `context/protocols/` | Task-specific operating procedures | Read before executing recurring workflows | Update when workflow rules change |

## Source Of Truth

- Long-lived operating rules: `MEMORY.md`
- Directory meaning and access policy: `context/manifests/reference_manifest.md`
- Workflow rules: files in `context/protocols/`
- Day-level facts and observations: `memory/daily/{YYYY-MM-DD}.md`
- Week-level patterns: `memory/weekly/{YYYY-WW}.md`
- Stable decisions: files in `memory/decisions/`

## Summary-First Policy

- For work and life domains, read exported summaries before raw material.
- Read raw files only when a summary is missing, stale, ambiguous, or needs evidence-level verification.
- If a summary conflicts with raw data, correct the summary and cite the raw evidence.

## Write Controls

- `inbox/` is append-only unless the user explicitly asks for cleanup or archiving.
- `memory/daily/` may contain triage notes, daily review output, and confirmed next actions for the current date.
- `memory/weekly/` should only contain synthesized weekly output, not raw daily notes pasted together.
- `memory/decisions/` must not store temporary moods, one-off frustrations, or speculative conclusions.
- `work/exported/` and `life/exported/` should contain summaries or action-ready outputs, not private raw reflection unless explicitly requested.

## Confirmation Gates

- Confirm before publishing, sending, sharing, or syncing anything externally.
- Confirm before deleting or bulk-renaming raw personal records.
- Confirm before promoting emotionally charged or one-off content into long-term memory.
- Confirm before writing from one domain into another when the boundary is unclear.

## Update Rules

- When a protocol changes its read order, write target, or permission assumptions, update this manifest.
- Keep this file aligned with the actual directory structure.
- Prefer small, explicit edits over broad rewrites.
