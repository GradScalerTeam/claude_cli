# Monorepo 场景样板

这是给 monorepo 用的子代理重构样板。

适合这些情况：

- 多 package / 多 app
- 前后端或多个服务共用 workspace
- 你经常需要判断“这次改动会影响哪些包、哪些测试、哪些发布边界”

## 这套样板包含什么

- `workspace-boundary-reviewer`
  负责跨包边界与依赖影响审查角色
- `/summarize-cross-package-impact`
  负责跨 package 影响面汇总流程

## 目录

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

## 文件入口

- [workspace-boundary-reviewer.md](.claude/agents/workspace-boundary-reviewer.md)
- [summarize-cross-package-impact/SKILL.md](.claude/skills/summarize-cross-package-impact/SKILL.md)
- [summarize-cross-package-impact/checklist.md](.claude/skills/summarize-cross-package-impact/checklist.md)
