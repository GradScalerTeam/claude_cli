# Backend 场景样板

这是给后端 / API 项目用的子代理重构样板。

适合这些情况：

- Node / Python / Go / Java 后端
- 你经常处理 API、队列、任务、数据库写入
- 你想把“后端实现角色”和“接口/任务检查流程”拆开

## 这套样板包含什么

- `api-builder`
  负责后端接口与服务实现角色
- `/review-background-job`
  负责后台任务、队列、定时 job 的安全性与幂等性检查

## 目录

```text
scenarios/backend/
├── README.md
├── README_CN.md
└── .claude/
    ├── agents/
    │   └── api-builder.md
    └── skills/
        └── review-background-job/
            ├── SKILL.md
            └── checklist.md
```

## 文件入口

- [api-builder.md](.claude/agents/api-builder.md)
- [review-background-job/SKILL.md](.claude/skills/review-background-job/SKILL.md)
- [review-background-job/checklist.md](.claude/skills/review-background-job/checklist.md)
