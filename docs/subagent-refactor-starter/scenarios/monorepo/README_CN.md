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
├── CLAUDE.md
└── .claude/
    ├── agents/
    │   └── workspace-boundary-reviewer.md
    └── skills/
        └── summarize-cross-package-impact/
            ├── SKILL.md
            └── checklist.md
```

## 文件入口

- [CLAUDE.md](CLAUDE.md)
- [workspace-boundary-reviewer.md](.claude/agents/workspace-boundary-reviewer.md)
- [summarize-cross-package-impact/SKILL.md](.claude/skills/summarize-cross-package-impact/SKILL.md)
- [summarize-cross-package-impact/checklist.md](.claude/skills/summarize-cross-package-impact/checklist.md)

## `CLAUDE.md` 在这里负责什么

这份样板里的 `CLAUDE.md` 主要负责 monorepo 最容易混乱的项目记忆：

- workspace 结构
- package / app 边界
- 公共 contract 的稳定性要求
- validation scope 的收敛规则
- agent / skill 路由
