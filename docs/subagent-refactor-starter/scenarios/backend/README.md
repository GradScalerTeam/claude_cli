# Backend Scenario Starter

This variant is for backend and API-heavy repositories.

Good fit for:

- Node / Python / Go / Java backend services
- API, queue, and database-heavy work
- teams that want to separate backend implementation from job/reliability review procedures

## What It Includes

- `api-builder`
  owns the backend implementation role
- `/review-background-job`
  owns the procedure for reviewing jobs, queues, schedulers, and idempotency risk

## Layout

```text
scenarios/backend/
├── README.md
├── README_CN.md
├── CLAUDE.md
└── .claude/
    ├── agents/
    │   └── api-builder.md
    └── skills/
        └── review-background-job/
            ├── SKILL.md
            └── checklist.md
```

## Files

- [CLAUDE.md](CLAUDE.md)
- [api-builder.md](.claude/agents/api-builder.md)
- [review-background-job/SKILL.md](.claude/skills/review-background-job/SKILL.md)
- [review-background-job/checklist.md](.claude/skills/review-background-job/checklist.md)

## What `CLAUDE.md` Covers Here

This sample `CLAUDE.md` provides the minimum backend project memory these agents and skills depend on:

- project commands
- API / service / data boundaries
- contract, auth, and validation rules
- validation strategy
- agent and skill routing
