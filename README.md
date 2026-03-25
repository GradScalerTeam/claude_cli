# Claude Code 实战手册 — 代理、技能、钩子与工作流

**[English](README_EN.md)** | 中文

这是一个面向 Claude Code 的实战教程仓库，重点不是“多装几个工具”，而是把围绕 Claude CLI 构建的项目记忆、子代理、技能、钩子、MCP 和文档优先工作流真正串起来。

## Quick Start: Claude CLI 工作流入口

如果你只想先看 OpenClaw inbox triage + Claude CLI repo executor 的最短路径，直接从 [OpenClaw Inbox Triage 执行清单](docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md) 开始。

这个分支已按 **2026 年 3 月 24 日** 可访问的 Anthropic Claude Code 官方文档重新整理教程路径。

---

## 从哪里开始

按你现在的阶段来选：

1. **[10 分钟上手](CLAUDE_SETUP_CN.md)** — 安装 Claude Code、登录、创建第一份 `CLAUDE.md`，掌握最重要的几个命令。
2. **[新项目工作流](HOW_TO_START_NEW_PROJECT_CN.md)** — 从想法、规划、审查到实现，完整跑通一遍。
3. **[现有项目工作流](HOW_TO_START_EXISTING_PROJECT_CN.md)** — 把 Claude Code 稳定接入已有代码库。
4. **[个人助理 / 知识系统工作流](HOW_TO_START_ASSISTANT_SYSTEM_CN.md)** — 把 Claude Code 用在个人助理、反思系统和知识整理项目，而不只是写程序。
5. **[assistant-os 起步模板](docs/assistant-os-starter/README_CN.md)** — 直接复制 `reference_manifest.md` 和 3 份 protocol 模板开始跑最小系统。
6. **[创建子代理](HOW_TO_CREATE_AGENTS_CN.md)** — 用 `/agents` 创建项目专属专家。
7. **[创建技能](HOW_TO_CREATE_SKILLS_CN.md)** — 用 `SKILL.md` 封装可复用的流程和命令。
8. **[重构已有粗糙子代理](docs/REFACTOR_EXISTING_SUBAGENTS_CN.md)** — 讲清楚怎么把旧的万能 agent 拆成窄职责角色，并把重复流程下沉成技能。
9. **[子代理重构起步样板](docs/subagent-refactor-starter/README_CN.md)** — 直接抄一套 `.claude/agents/` 和 `.claude/skills/` 样板，跑最小角色拆分方案。
10. **[OpenClaw 与 Claude agent 对比](docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md)** — 专门解释 OpenClaw agent、OpenClaw subagent 和 Claude CLI 子代理的异同，以及如何分层互补。
11. **[OpenClaw + Claude CLI 集成实战](docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md)** — 专门回答 OpenClaw 如何把任务送进 Claude CLI 仓库工作流，以及 MCP 到底该怎么共享。
12. **[OpenClaw + Claude CLI 工作流场景拆分](docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md)** — 把外环 / 内环 / 桥接文档 / 纯仓库模式拆成具体可选方案。
13. **[OpenClaw Inbox Triage + Claude CLI Repo Executor](docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md)** — 只保留最实用的“收件、分类、路由、进仓库执行”单独专题。
14. **[OpenClaw Inbox Triage 执行清单](docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md)** — 再压缩成能直接照着跑的最小操作手册。
15. **[助理团架构模式](docs/ASSISTANT_TEAM_PATTERNS_CN.md)** — 了解工作、生活、每日反思如何分层设计。
16. **[官方资料对照表](docs/OFFICIAL_REFERENCE_MAP_CN.md)** — 查看本仓库教程分别对应 Anthropic 官方哪一页文档。

---

## 这次教程刷新，重点修了什么

原来的资料有价值，但部分内容和当前 Claude Code 的官方体验已经有些脱节。这次主要补强：

- **对齐官方入口**：`/init`、`/agents`、`/memory`、`/permissions`、`/mcp`、`/hooks`、Plan Mode。
- **统一心智模型**：`CLAUDE.md` 负责记忆，子代理负责专项角色，技能负责复用流程，钩子负责确定性自动化。
- **更安全的执行方式**：大改动先计划，权限按需放开，钩子只做“必须每次都执行”的事。
- **更适合团队上手**：补清了用户级与项目级范围、何时创建本地工具、何时不该过度定制。

---

## 60 秒理解核心概念

| 概念 | 它是什么 | 什么时候该用 |
|---|---|---|
| `CLAUDE.md` | 项目共享记忆 | 你希望 Claude 持续记住命令、架构、约定、风险点 |
| 子代理 | 放在 `.claude/agents/` 或 `~/.claude/agents/` 的专项角色 | 某类任务值得有一个专门角色和工具权限 |
| 技能 | 放在 `.claude/skills/<name>/SKILL.md` 的可复用能力 | 你想把某个流程、检查表、命令封装起来重复使用 |
| 钩子 | 写在 `settings.json` 里的事件触发自动化 | 某件事必须在工具前后稳定发生 |
| MCP | 外部工具与数据源接入层 | Claude 需要访问 GitHub、Jira、Figma、数据库或内部服务 |
| Plan Mode | 只读规划模式 | 你想让 Claude 先分析、先出方案，再决定是否改代码 |

如果你刚开始用 Claude Code，不要先堆满钩子和代理。先把 `CLAUDE.md` 写好，再逐步加一两个真正高频的扩展。

---

## 每个仓库都建议先打好的基础

在安装任何额外工具前，先把这套基线做好：

1. 在项目根目录运行 `claude`
2. 执行 `/init`，生成有用的 `CLAUDE.md`
3. 把真实可执行的命令写进去：build、test、lint、format、dev、部署说明
4. 记录架构约束、命名规范、危险目录和常见坑
5. 用 `/permissions` 只放开真正安全且高频的命令
6. 大改动或陌生代码先用 Plan Mode
7. 只有当某种“专家角色”反复出现时才创建子代理
8. 只有当某种流程会反复执行时才创建技能
9. 只有当某种行为“必须每次都执行”时才创建钩子

本仓库里的代理和技能，建立在这套基线上效果最好。

---

## 推荐学习路径

### 路径 A：刚接触 Claude Code

1. 读 [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)
2. 用 `/init` 建好 `CLAUDE.md`
3. 在真实项目里做几个小任务
4. 读 [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
5. 先只安装本仓库里的一个组件，不要一口气全装

### 路径 B：已经在用 Claude Code，但工作流不稳

1. 读 [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
2. 安装 `global-doc-master`
3. 安装 `global-review-doc` 和 `global-review-code`
4. 如果项目文档很多，再加 `doc-scanner`
5. 等模式稳定后，再补项目专属技能和子代理

### 路径 C：想自己做扩展能力

1. 读 [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)
2. 读 [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)
3. 结合 `agents/`、`skills/`、`hooks/` 里的例子看结构
4. 团队共享的能力放项目级，个人偏好放用户级

### 路径 D：想做个人助理 / 知识系统

1. 读 [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)
2. 读 [HOW_TO_START_ASSISTANT_SYSTEM_CN.md](HOW_TO_START_ASSISTANT_SYSTEM_CN.md)
3. 直接拿 [docs/assistant-os-starter/README_CN.md](docs/assistant-os-starter/README_CN.md) 里的模板起步
4. 再读 [docs/ASSISTANT_TEAM_PATTERNS_CN.md](docs/ASSISTANT_TEAM_PATTERNS_CN.md)
5. 先跑一个最小版本，不要一开始就做超级助理
6. 等节奏稳定后，再补子代理和技能

---

## 这个仓库主张的工作流

```text
1. 固化上下文    ->  /init + CLAUDE.md + 现有文档
2. 规划变更      ->  doc master + Plan Mode + 文档审查
3. 分片实现      ->  聚焦提示词、技能、子代理
4. 审查代码      ->  global-review-code
5. 测试与迭代    ->  跑命令、看结果、修问题
6. 沉淀知识      ->  流程文档、问题文档、已解决文档
```

这是一个明确的“文档优先”工作流。项目记忆和文档质量越稳定，Claude 的产出越稳。

---

## 如果你想看更细的工作流

如果你看到这里，觉得“方向有了，但真正怎么跑还不够具体”，直接按下面三条看：

1. **单仓库现有项目**：看 [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
   适合你已经有代码库，想把 `CLAUDE.md`、flow doc、代码审查、技能、子代理逐步接进去。
2. **新项目从 0 到 1**：看 [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)
   适合你还在规划阶段，想按“先文档、再审查、再分片实现”的顺序启动。
3. **OpenClaw 外环 + Claude CLI 内环**：看 [docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md](docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md)
   适合你想让长期在线助理负责收件、提醒、路由，再把具体仓库执行交给 Claude CLI。
4. **具体场景怎么选**：看 [docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md](docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md)
   适合你想在“OpenClaw 负责什么、Claude CLI 负责什么、桥接文档怎么用”之间快速选模式。
5. **只看收件到执行这一条链路**：看 [docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md](docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md)
   适合你只关心最常见、最稳的那一种外环/内环分工。
6. **只看最小执行清单**：看 [docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md](docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md)
   适合你已经知道要做什么，只想直接照着跑。

如果你只是想解决“OpenClaw agent 和 Claude CLI 子代理是不是一回事”，看：

- [docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md](docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md)

---

## 仓库里有什么

### 代理（Agents）

| 代理 | 作用 | 目录 |
|---|---|---|
| **[Global Doc Master](agents/global-doc-master/)** | 负责规划文档、功能流程、问题文档、部署说明、调试文档等结构化文档的创建与维护。 | `agents/global-doc-master/` |
| **[Global Doc Fixer](agents/global-doc-fixer/)** | 反复调用审查与修复流程，把文档收敛到可实施状态。 | `agents/global-doc-fixer/` |

### 技能（Skills）

| 技能 | 作用 | 目录 |
|---|---|---|
| **[Global Review Doc](skills/global-review-doc/)** | 对照真实代码库审查文档，找缺漏、歧义、风险和代理可执行性问题。 | `skills/global-review-doc/` |
| **[Global Review Code](skills/global-review-code/)** | 从架构、安全、正确性、测试和可维护性等维度审查代码。 | `skills/global-review-code/` |

### 钩子

这里的钩子指 Claude Code 的事件钩子，也就是在特定事件发生前后按配置自动执行的规则，不是某个单独产品组件名。

| 钩子 | 作用 | 目录 |
|---|---|---|
| **[Doc Scanner](hooks/doc-scanner/)** | 会话开始时尽早把 Markdown 文档暴露给 Claude。 | `hooks/doc-scanner/` |
| **[Design Context](hooks/design-context/)** | 面向 Pencil 设计场景，把应用上下文桥接进设计会话。 | `hooks/design-context/` |

### 辅助脚本

| 脚本 | 作用 | 目录 |
|---|---|---|
| **[Status Line](scripts/statusline-command.sh)** | 在 Claude Code 状态栏里显示分支和改动状态。 | `scripts/` |

---

## 推荐安装顺序

如果你想渐进式采用本仓库，建议按这个顺序：

1. 先完成 Claude Code 安装和 `CLAUDE.md` 基线
2. 安装 **Global Doc Master**
3. 安装 **Global Review Doc**
4. 安装 **Global Review Code**
5. 安装 **Doc Scanner**
6. 安装 **Status Line**
7. 只有在你使用 Pencil 时才安装 **Design Context**

每个组件自己的 README 里都保留了安装说明和可直接复制的提示词。

---

## 作用域建议

- **团队共享** 的工具，放 `.claude/` 并提交到仓库
- **个人默认** 的工具，放 `~/.claude/`
- **项目共享记忆**，放 `CLAUDE.md`
- **个人项目偏好**，优先通过 `CLAUDE.md` 的导入机制引用家目录文件
- **重复流程** 用技能，**专项角色** 用子代理
- **必须每次执行** 的规则才用钩子

---

## 下一步阅读

- [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)
- [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)
- [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
- [HOW_TO_START_ASSISTANT_SYSTEM_CN.md](HOW_TO_START_ASSISTANT_SYSTEM_CN.md)
- [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)
- [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)
- [docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md](docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md)
- [docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md](docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md)
- [docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md](docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md)
- [docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md](docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md)
- [docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md](docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md)
- [docs/ASSISTANT_TEAM_PATTERNS_CN.md](docs/ASSISTANT_TEAM_PATTERNS_CN.md)
- [docs/OFFICIAL_REFERENCE_MAP_CN.md](docs/OFFICIAL_REFERENCE_MAP_CN.md)
