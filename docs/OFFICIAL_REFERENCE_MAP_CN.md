# 官方资料对照表

中文

这份文档用于说明：本仓库里重写过的 Claude Code 教程，分别参考了 Anthropic 官方的哪些文档，以及这些官方页面为什么重要。

最后核对时间：**2026-03-24**

---

## 对照表

| 仓库内教程 | 对应官方文档 | 为什么重要 |
|---|---|---|
| `CLAUDE_SETUP.md` / `CLAUDE_SETUP_CN.md` | Claude Code overview、Getting started、Quickstart、CLI reference、Built-in commands、Memory、Settings、Troubleshooting | 用来确定当前的安装、登录、命令、记忆和配置模型 |
| `HOW_TO_START_NEW_PROJECT.md` / `_CN` | Common workflows、Memory、Settings、Subagents、Skills | 支撑“先记忆、先规划、分片实现”的新项目工作流 |
| `HOW_TO_START_EXISTING_PROJECT.md` / `_CN` | Common workflows、Plan Mode guidance、Memory、Git worktree workflow | 支撑只读摸底、流程文档化，以及安全并行的既有项目工作流 |
| `HOW_TO_START_ASSISTANT_SYSTEM.md` / `_CN` | Common workflows、Memory、Settings、Subagents、Skills | 把官方的记忆、规划、子代理和技能能力改写到个人助理 / 知识系统场景里 |
| `HOW_TO_CREATE_AGENTS.md` / `_CN` | Subagents | 用当前 `/agents` 工作流替换旧的插件式说明 |
| `HOW_TO_CREATE_SKILLS.md` / `_CN` | Extend Claude with skills、Slash commands | 让仓库里的技能教程和当前 `SKILL.md` 模型保持一致 |
| `hooks/*` 文档 | Hooks guide、Hooks reference | 用来确认 hook 事件、matcher、配置结构以及安全注意事项 |
| 仓库级作用域说明 | Settings、Memory、MCP | 用来澄清 user / project / local 三种作用域，避免教程后期失真 |

---

## 建议和本仓库一起阅读的官方页面

下面这些是最值得常备在手边的官方参考资料：

1. Claude Code 总览
   https://docs.anthropic.com/en/docs/claude-code/overview
2. Claude Code 安装与上手
   https://docs.anthropic.com/en/docs/claude-code/getting-started
3. Quickstart
   https://docs.anthropic.com/en/docs/claude-code/quickstart
4. 常见工作流
   https://docs.anthropic.com/en/docs/claude-code/tutorials
5. CLI 参考
   https://docs.anthropic.com/en/docs/claude-code/cli-reference
6. 内建命令说明
   https://code.claude.com/docs/en/commands
7. Claude 的记忆系统
   https://docs.anthropic.com/en/docs/claude-code/memory
8. Claude Code 设置说明
   https://docs.anthropic.com/en/docs/claude-code/settings
9. 子代理（Subagents）
   https://docs.anthropic.com/en/docs/claude-code/sub-agents
10. 用技能扩展 Claude
    https://code.claude.com/docs/en/skills
11. Slash Commands
    https://docs.anthropic.com/en/docs/claude-code/slash-commands
12. Hooks 入门
    https://docs.anthropic.com/en/docs/claude-code/hooks-guide
13. Hooks 参考
    https://docs.anthropic.com/en/docs/claude-code/hooks
14. 通过 MCP 连接外部工具
    https://docs.anthropic.com/en/docs/claude-code/mcp
15. Troubleshooting
    https://docs.anthropic.com/en/docs/claude-code/troubleshooting
16. 成本管理
    https://docs.anthropic.com/en/docs/claude-code/costs

---

## 后续维护建议

如果 Anthropic 后续对 Claude Code 做了明显更新，建议优先重新核对以下几类内容：

1. 安装方式和最低环境要求
2. 内建 slash commands
3. memory 与 settings 的层级关系
4. 子代理创建与管理流程
5. 技能 frontmatter 和目录结构
6. hook 事件名称与配置结构
7. MCP 的作用域和授权行为

这些部分最容易让教程在短时间内显得过时。
