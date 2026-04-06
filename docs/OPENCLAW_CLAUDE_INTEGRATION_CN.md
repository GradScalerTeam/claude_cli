# OpenClaw 与 Claude CLI 集成实战

这篇 OpenClaw 版本的说明，已经被更通用的文档替代：

- [长期在线助理系统 + Claude CLI 集成指南](ASSISTANT_CLAUDE_INTEGRATION_CN.md)

新的版本不再假设你一定在用 OpenClaw，也不假设你一定有多台机器。
如果你只有一台电脑，或者你的外环只是一个 bot、桌面助理、cron、常驻服务，这份通用版更适合。

如果你正在用 OpenClaw，可以直接这样映射：

- **OpenClaw** = 外环助理系统
- **Claude CLI** = 仓库执行器
- **OpenClaw runtime / skills / plugins** = 助理系统侧能力
- **Claude CLI skills / subagents** = 仓库侧能力

OpenClaw 仍然是一个很好的具体实现例子，只是这份主题现在用更通用的方式来讲。

相关阅读：

- [OpenClaw Agent 与 Claude CLI Agent：异同与互补](OPENCLAW_AND_CLAUDE_AGENTS_CN.md)
- [OpenClaw 与 Claude CLI 工作流场景拆分](OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md)
