# Monorepo Scenario Starter

This variant is for monorepos with multiple apps or packages.

Good fit for:

- multiple packages or applications in one workspace
- shared libraries across frontend and backend
- recurring questions about cross-package impact, ownership, and validation scope

## What It Includes

- `workspace-boundary-reviewer`
  owns the role for cross-package boundary review
- `/summarize-cross-package-impact`
  owns the procedure for mapping impact across packages and validation scope

## Layout

```text
scenarios/monorepo/
├── README.md
├── README_CN.md
└── .claude/
    ├── agents/
    │   └── workspace-boundary-reviewer.md
    └── skills/
        └── summarize-cross-package-impact/
            ├── SKILL.md
            └── checklist.md
```

## Files

- [workspace-boundary-reviewer.md](.claude/agents/workspace-boundary-reviewer.md)
- [summarize-cross-package-impact/SKILL.md](.claude/skills/summarize-cross-package-impact/SKILL.md)
- [summarize-cross-package-impact/checklist.md](.claude/skills/summarize-cross-package-impact/checklist.md)
