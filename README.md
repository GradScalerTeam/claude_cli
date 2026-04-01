# Claude Code 实战手册 — 代理、技能、钩子与工作流

**[English](README_EN.md)** | 中文

这是一个面向 Claude Code 的实战教程仓库，重点不是"多装几个工具"，而是把围绕 Claude CLI 构建的项目记忆、子代理、技能、钩子、MCP 和文档优先工作流真正串起来。

---

## 🌟 初学者特别推荐：GStack 结构化角色

如果你是 **Claude Code 初学者**，强烈推荐先了解 **GStack** — 一个革命性的工作流工具，提供 **31 个专家角色** 和 **结构化认知模式**，避免空白提示的困境。

### 为什么 GStack 适合初学者？

**问题**: 初学者使用 Claude Code 时，通常面临：
1. 不知道如何开始 - 空白的提示让人不知所措
2. 缺乏结构化思维 - 不知道应该问什么
3. 没有角色意识 - 把 AI 当成万能工具
4. 低质量输出 - 得到泛泛而谈的回答

**解决方案**: GStack 提供 **31 个专家角色**，每个角色都有明确的职责和认知模式

### 快速开始 (30 秒)

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

### 6 个核心角色 (初学者必知)

1. **`/office-hours`** - 产品办公室时间 (重新思考产品)
2. **`/plan-ceo-review`** - CEO / 创始人 (规划产品方向)
3. **`/plan-eng-review`** - 工程经理 (设计架构)
4. **`/review`** - 高级工程师 (代码审查)
5. **`//qa`** - QA 负责人 (测试应用)
6. **`/ship`** - 发布工程师 (发布代码)

### 完整指南

📖 **[GStack 整合指南](docs/GSTACK_INTEGRATION.md)**

**核心价值**：
- ✅ **结构化角色** - 不是空白提示，而是明确的认知模式
- ✅ **31 个专家角色** - 覆盖完整开发周期
- ✅ **经过验证** - 600,000 LOC/60 天的生产力证明 (Garry Tan, YC CEO)
- ✅ **完全开源** - MIT License

---

## Quick Start: Claude CLI 工作流入口

如果你只想先看 OpenClaw inbox triage + Claude CLI repo executor 的最短路径，直接从 [OpenClaw Inbox Triage 执行清单](docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md) 开始。

这个分支已按 **2026 年 3 月 24 日** 可访问的 Anthropic Claude Code 官方文档重新整理教程路径。
