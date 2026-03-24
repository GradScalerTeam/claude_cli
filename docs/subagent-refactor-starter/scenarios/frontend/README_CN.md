# Frontend 场景样板

这是给前端项目用的子代理重构样板。

适合这些情况：

- React / Next.js / Vue / 前端 SPA
- UI 改动很多
- 你经常要检查状态管理、组件边界、交互回归、可访问性

## 这套样板包含什么

- `frontend-builder`
  负责页面与组件实现角色
- `/review-component-contract`
  负责组件 props、状态、交互和边界检查流程

## 目录

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

## 什么时候优先用这套

- 你的旧 agent 经常同时承担 UI 实现、组件审查、状态排查
- 你想把“前端实现角色”和“组件审查流程”拆开
- 你想让 UI 改动后的检查项更稳定

## 文件入口

- [frontend-builder.md](.claude/agents/frontend-builder.md)
- [review-component-contract/SKILL.md](.claude/skills/review-component-contract/SKILL.md)
- [review-component-contract/checklist.md](.claude/skills/review-component-contract/checklist.md)
