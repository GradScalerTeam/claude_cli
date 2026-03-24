# Subagent Refactor Starter

English | **[中文](README_CN.md)**

This starter pack shows the smallest practical version of a subagent refactor:

- split one rough mega-agent into focused roles
- move repeatable procedures into skills
- keep the result copyable and easy to adapt

It is intentionally small:

- 2 project-level subagents
- 2 project-level skills
- 2 checklist helper files

## Layout

```text
docs/subagent-refactor-starter/
├── README.md
├── README_CN.md
└── .claude/
    ├── agents/
    │   ├── code-reviewer.md
    │   └── test-runner.md
    └── skills/
        ├── review-api/
        │   ├── SKILL.md
        │   └── checklist.md
        └── check-migration-safety/
            ├── SKILL.md
            └── checklist.md
```

## What This Starter Demonstrates

### Subagent layer

- `code-reviewer`
  owns the review role
- `test-runner`
  owns the validation-and-failure-explanation role

### Skill layer

- `/review-api`
  owns the API review procedure
- `/check-migration-safety`
  owns the migration risk checklist

In other words:

- agents decide who should do the work
- skills define the fixed procedure for how it should be done

## How To Use It

1. Copy the `.claude/` folder into your project root.
2. Replace the commands, file paths, and checklists with your real stack details.
3. Make sure `CLAUDE.md` defines commands, directory boundaries, and risky areas.
4. Run a few real tasks before fine-tuning descriptions, permissions, and checklist content.

## What You Will Usually Need To Edit

- `code-reviewer.md`
  adapt review standards to your project
- `test-runner.md`
  replace commands with real validation commands from your repo
- `review-api/checklist.md`
  adapt auth, validation, and error-handling expectations
- `check-migration-safety/checklist.md`
  adapt database, ORM, and deploy strategy checks

## Files

- [code-reviewer.md](.claude/agents/code-reviewer.md)
- [test-runner.md](.claude/agents/test-runner.md)
- [review-api/SKILL.md](.claude/skills/review-api/SKILL.md)
- [review-api/checklist.md](.claude/skills/review-api/checklist.md)
- [check-migration-safety/SKILL.md](.claude/skills/check-migration-safety/SKILL.md)
- [check-migration-safety/checklist.md](.claude/skills/check-migration-safety/checklist.md)

## Related Guides

- [REFACTOR_EXISTING_SUBAGENTS.md](../REFACTOR_EXISTING_SUBAGENTS.md)
- [HOW_TO_CREATE_AGENTS.md](../../HOW_TO_CREATE_AGENTS.md)
- [HOW_TO_CREATE_SKILLS.md](../../HOW_TO_CREATE_SKILLS.md)
