# OpenClaw Inbox Triage + Claude CLI Repo Executor

这篇文档只讲一条最实用的链路：

- OpenClaw 先收件、分类、路由
- Claude CLI 再进入目标仓库执行

如果你关心的是“长期在线助理怎么把事情交给仓库工作流”，这就是最推荐的模式。

相关阅读：

- [OpenClaw 与 Claude CLI 集成实战](OPENCLAW_CLAUDE_INTEGRATION_CN.md)
- [OpenClaw 与 Claude CLI 工作流场景拆分](OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md)
- [OpenClaw Inbox Triage 执行清单](OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md)

---

## 这条链路适合什么

适合：

- issue / inbox / webhook 触发的任务
- 任务最终要落到某个具体仓库
- 需要把“收件”和“执行”分开

不适合：

- 纯本地开发
- 只是在仓库里写代码的短流程
- 还没想清楚该去哪个仓库的模糊任务

---

## 推荐分工

### OpenClaw 负责

- 收件
- 去重
- 分类
- 选仓库
- 生成简短任务摘要
- 产出桥接文档
- 把结果发回 inbox / channel / memory

### Claude CLI 负责

- 读取仓库上下文
- 结合 `CLAUDE.md` 和项目文档理解任务
- 调用项目级 skills / subagents
- 修改代码、补文档、跑测试
- 输出可审查的结果摘要

---

## 标准流程

1. OpenClaw 收到消息。
2. OpenClaw 判断这件事是否值得进入仓库工作流。
3. OpenClaw 选定目标仓库。
4. OpenClaw 写一份桥接文档，例如 issue 摘要或 triage note。
5. OpenClaw 在目标仓库里启动 Claude CLI。
6. Claude CLI 读取本仓库的上下文和约束。
7. Claude CLI 完成修改、验证和总结。
8. OpenClaw 把结果回写到原始渠道。

---

## 桥接文档建议写什么

桥接文档不需要长，但要能让 Claude CLI 少猜。

建议至少包含：

- 问题是什么
- 属于哪个仓库
- 期望结果是什么
- 哪些文件或区域可能相关
- 验证标准是什么
- 需要人工确认什么

一个最小模板可以是：

```md
# Task Brief

## Problem
...

## Repo
...

## Expected Outcome
...

## Relevant Files
...

## Verification
...

## Manual Follow-up
...
```

---

## 何时该分流

如果一个任务只是：

- 看一眼
- 做个判断
- 跟进提醒

那多半留在 OpenClaw 就够了。

如果一个任务需要：

- 进入仓库
- 对照代码
- 改文件
- 跑验证

那就该交给 Claude CLI。

---

## 一个简单判断句

先问自己两个问题：

1. 这件事是不是已经明确落到某个仓库？
2. 这件事是不是需要改动或验证仓库内容？

如果两个答案都是“是”，就走这条链路。
