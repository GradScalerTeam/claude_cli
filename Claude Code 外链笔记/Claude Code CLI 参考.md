---
title: Claude Code CLI 参考
aliases:
  - Claude Code 官方文档 - CLI参考
  - CLI 参考手册
tags:
  - claude-code
  - learning-note
  - source/official
  - topic/CLI
  - topic/命令行
  - topic/参考手册
source: https://code.claude.com/docs/zh-CN/cli-reference
source_type: 官方参考文档
created: 2026-03-17
status: 已整理
reading_priority: 高
learning_stage:
  - 入门
  - 进阶
  - 自动化
topics:
  - CLI
  - flags
  - agents
content_access: full
---

# Claude Code CLI 参考

- 来源：https://code.claude.com/docs/zh-CN/cli-reference
- 抓取时间：2026-03-17
- 类型：官方参考文档

## 核心内容

这页是 Claude Code 命令行接口的总手册，重点覆盖三类信息：

- 基础命令：启动、续接、恢复、更新、认证、MCP、subagents、remote control。
- 运行标志：权限模式、工具白名单/黑名单、模型选择、会话持久化、输出格式、MCP 配置、插件目录等。
- 高级参数：`--agents` 的 JSON 格式，以及 `--system-prompt` / `--append-system-prompt` 这类系统提示注入方式。

## 我提炼的重点

- 最常用命令是 `claude`、`claude -p`、`claude -c`、`claude -r`、`claude auth login`、`claude mcp`。
- 打脚本和自动化时，重点看 `-p`、`--output-format`、`--json-schema`、`--max-turns`、`--max-budget-usd`。
- 多目录、多工具权限控制时，重点看 `--add-dir`、`--allowedTools`、`--disallowedTools`、`--tools`、`--permission-mode`。
- 需要临时自定义代理时，`--agents` 可以直接传 JSON 定义 description、prompt、tools、model、skills、mcpServers、maxTurns。
- 官方明确建议：大多数情况下优先用 `--append-system-prompt` 或 `--append-system-prompt-file`，比直接替换整套系统提示更稳。

## 适合什么时候回看

- 忘了某个命令行参数怎么写。
- 想把 Claude Code 接到脚本、CI 或结构化输出流程里。
- 想临时定义 subagent、限制工具权限或切换会话行为。

## 相关笔记

- [[Claude Code 外链笔记/Claude Code 官方文档总览]]
- [[Claude Code 外链笔记/Claude Code 快速开始]]
