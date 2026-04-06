# OpenClaw 与 Claude CLI 工作流场景拆分

这篇文档把前面的集成说明拆成更具体的场景。

如果你已经读过总览，这里回答的是：

- 哪种任务该用哪种工作流？

相关阅读：

- [长期在线助理系统 + Claude CLI 集成指南](ASSISTANT_CLAUDE_INTEGRATION_CN.md)
- [OpenClaw Inbox Triage + Claude CLI Repo Executor](OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md)

---

## 场景 1：OpenClaw 做外环，Claude CLI 做仓库执行器

如果你只想看这一个模式，直接看：

- [OpenClaw Inbox Triage + Claude CLI Repo Executor](OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md)

适合：

- inbox、webhook、提醒触发的任务
- 明确落在某个仓库里的工作
- 需要仓库上下文和验证

流程：

1. OpenClaw 收到任务。
2. OpenClaw 做 triage 并选定仓库。
3. OpenClaw 先写一份简短任务摘要或 issue 文档。
4. OpenClaw 在目标仓库里启动 `claude -p`。
5. Claude CLI 读取 `CLAUDE.md`、文档、技能和子代理。
6. Claude CLI 返回简洁结果摘要。
7. OpenClaw 把结果发回原渠道。

适合做：

- issue 处理
- 代码审查
- 文档维护
- 仓库范围内修复

---

## 场景 2：人工使用 Claude CLI，OpenClaw 只负责路由和提醒

适合：

- 你想要轻量集成
- 你已经在仓库里工作
- 不希望 OpenClaw 直接接管执行链路

流程：

1. OpenClaw 收集信息或做提醒。
2. 你手动打开目标仓库。
3. 你自己运行 Claude CLI。
4. Claude CLI 负责实现和验证。

适合做：

- 本地开发
- 聚焦功能开发
- 一次性调查

---

## 场景 3：只用 Claude CLI

如果任务就是纯仓库任务，其实不必再加一层外环。

适合直接用：

- 代码修改
- 测试
- 文档
- 审查

适合做：

- 小型维护
- 独立开发
- 快速修补

---

## 场景 4：OpenClaw + 中间桥接文档

当任务太模糊时，不要直接扔给 Claude CLI。

先产出桥接产物：

- issue 摘要
- triage report
- spec
- next-actions note

再让 Claude CLI 消费这些产物。

适合做：

- 大一点的工作项
- 多步骤变更
- 之后还要回看审查的工作

---

## 实用规则

如果问题在问：

- 工作从哪里来
- 什么时候执行
- 结果回哪里

那是 OpenClaw 的事。

如果问题在问：

- 仓库里该改什么
- 怎么验证
- 怎么调用仓库内的专家角色

那是 Claude CLI 的事。
