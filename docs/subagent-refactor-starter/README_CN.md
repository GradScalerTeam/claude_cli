# 子代理重构起步样板

**[English](README.md)** | 中文

这套样板对应的是“如何把一个粗糙的万能 agent，拆成几个窄职责角色，并把固定流程下沉成 skill”。

它不是完整框架，而是一个最小可用参考：

- 2 个项目级子代理
- 2 个项目级技能
- 1 个 checklist 辅助文件

目标是让你可以直接复制这些文件到自己的仓库里，再按项目实际情况微调。

## 目录

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

## 这套样板演示什么

### 子代理层

- `code-reviewer`
  负责“代码审查这个角色”
- `test-runner`
  负责“运行最小相关验证并解释失败”

### 技能层

- `/review-api`
  负责 API 审查流程
- `/check-migration-safety`
  负责 migration 风险检查流程

也就是说：

- agent 负责“谁来做”
- skill 负责“怎么按固定流程做”

## 怎么用

1. 把这里的 `.claude/` 目录复制到你的项目根目录。
2. 根据你的技术栈修改命令、路径和检查项。
3. 在 `CLAUDE.md` 里写清项目命令、目录边界和危险区域。
4. 先跑几次真实任务，再继续微调 `description`、权限和 checklist。

## 什么时候该改这些文件

你通常至少要改这几处：

- `code-reviewer.md`
  改成符合你项目的审查标准
- `test-runner.md`
  改成你项目真实存在的测试/验证命令
- `review-api/checklist.md`
  改成你的 API 风格、鉴权方式和错误处理约定
- `check-migration-safety/checklist.md`
  改成你项目数据库、ORM 和迁移发布策略

## 文件入口

- [code-reviewer.md](.claude/agents/code-reviewer.md)
- [test-runner.md](.claude/agents/test-runner.md)
- [review-api/SKILL.md](.claude/skills/review-api/SKILL.md)
- [review-api/checklist.md](.claude/skills/review-api/checklist.md)
- [check-migration-safety/SKILL.md](.claude/skills/check-migration-safety/SKILL.md)
- [check-migration-safety/checklist.md](.claude/skills/check-migration-safety/checklist.md)

## 对应文档

- [REFACTOR_EXISTING_SUBAGENTS_CN.md](../REFACTOR_EXISTING_SUBAGENTS_CN.md)
- [HOW_TO_CREATE_AGENTS_CN.md](../../HOW_TO_CREATE_AGENTS_CN.md)
- [HOW_TO_CREATE_SKILLS_CN.md](../../HOW_TO_CREATE_SKILLS_CN.md)
