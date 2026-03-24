# Migration Safety Checklist

Use this checklist to review schema or migration changes before rollout.

## Compatibility

- Can old app code still run safely against the new schema?
- Can new app code still run safely during a rolling deployment?
- Are renamed or dropped columns handled in stages?

## Rollout Risk

- Does this change require a strict deploy order?
- Could it lock large tables or block traffic?
- Is there any data backfill or reindexing risk?

## Rollback

- Is rollback possible without manual repair?
- Would rollback fail after data is written in the new format?
- Are irreversible destructive operations called out explicitly?

## Evidence

- migration files
- schema definitions
- affected reads/writes in application code
