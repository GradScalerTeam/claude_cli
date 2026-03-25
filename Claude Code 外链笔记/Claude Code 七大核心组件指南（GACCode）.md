---
title: Claude Code 七大核心组件指南（GACCode）
aliases:
  - Claude Code 7大核心组件完全指南（2026）
  - GACCode 七大核心组件指南
tags:
  - claude-code
  - learning-note
  - source/community
  - topic/组件总览
  - topic/自动化
  - topic/MCP
source: https://gaccode.store/post/claude-code-seven-components-tutorial
source_type: 社区长文
created: 2026-03-17
status: 已整理
reading_priority: 高
learning_stage:
  - 进阶
  - 自动化
  - MCP
topics:
  - CLAUDE.md
  - Commands
  - Skills
  - MCP
  - Hooks
  - Subagents
  - Plugins
content_access: full
---

# Claude Code 七大核心组件指南（GACCode）

- 来源：https://gaccode.store/post/claude-code-seven-components-tutorial
- 抓取时间：2026-03-17
- 类型：社区长文

## 核心内容

这篇文章把 Claude Code 拆成 7 个组件来讲：

1. `CLAUDE.md`
2. Commands
3. Skills
4. MCP
5. Hooks
6. Subagents
7. Plugins

## 我提炼的重点

- `CLAUDE.md`：文章强调它是项目记忆系统，并给出三级配置思路：`~/.claude/CLAUDE.md`、项目根 `./CLAUDE.md`、子目录级 `./[子目录]/CLAUDE.md`。还提到可用 `/init` 自动生成初稿。
- Commands：适合做快捷指令；放在 `.claude/commands/` 目录，用 Markdown 定义。优势是轻量，局限是不能处理复杂条件分支。
- Skills：相比 Commands，Skills 才是完整工作流模块，支持多步骤、工具权限控制、条件分支和动态加载。文中还给了典型的 `SKILL.md` 目录结构。
- MCP：用于把 Claude Code 连到浏览器、数据库、API 等外部系统，配置入口是 `.claude/settings.json` 里的 `mcpServers`。
- Hooks：用于在关键节点插入自动脚本。文中点名了 `SessionStart`、`PreToolUse`、`UserPromptSubmit`、`SubagentStop` 等事件。
- Subagents：适合复杂任务并行处理，但 token 成本和协调成本都高，不适合滥用。
- Plugins：文章把它描述为一站式扩展包，能打包 Commands、Agents、Skills、Hooks、MCP 等。文中推荐的方向包括文档处理、代码审查、Git 工作流和安全提示。

## 这篇最有用的部分

- 它不是只解释“这是什么”，而是强调“什么时候该用、什么时候不要用”。
- 文末给了组件组合思路，例如技术写作、代码重构、数据分析自动化三类组合工作流。

## 需要保留的判断

- 文中夹带了订阅推广内容，这部分不要当成技术结论。
- 真正落地配置时，仍然要回到官方文档核对参数和事件名。

## 相关笔记

- [[Claude Code 外链笔记/Claude Code CLI 参考]]
- [[Claude Code 外链笔记/Claude Code 2周学习教程（GitHub）]]
- [[Claude Code 外链笔记/Claude Code 超详细完全指南（知乎）]]
