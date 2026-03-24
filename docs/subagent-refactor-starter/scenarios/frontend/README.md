# Frontend Scenario Starter

This variant is for frontend-heavy repositories.

Good fit for:

- React / Next.js / Vue / SPA work
- frequent UI implementation
- repeated checks around state, component boundaries, interaction regressions, and accessibility

## What It Includes

- `frontend-builder`
  owns the UI implementation role
- `/review-component-contract`
  owns the procedure for checking props, state, interaction, and boundary behavior

## Layout

```text
scenarios/frontend/
├── README.md
├── README_CN.md
└── .claude/
    ├── agents/
    │   └── frontend-builder.md
    └── skills/
        └── review-component-contract/
            ├── SKILL.md
            └── checklist.md
```

## Files

- [frontend-builder.md](.claude/agents/frontend-builder.md)
- [review-component-contract/SKILL.md](.claude/skills/review-component-contract/SKILL.md)
- [review-component-contract/checklist.md](.claude/skills/review-component-contract/checklist.md)
