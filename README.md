# Claude Code 中文实战手册

**[English](README_EN.md)** | 中文

适合初学者的 Claude Code 上手、项目接入与进阶路线。

这个仓库不是一份零散命令清单，而是一套中文优先的实践教程，帮助你从第一次启动 Claude Code，走到在真实项目里稳定使用 `CLAUDE.md`、技能、子代理、Hook 和 MCP。

## 这个仓库适合谁

- 第一次接触 Claude Code，不知道该从哪里开始
- 已经有一个项目，想把 Claude Code 稳定接进去
- 想弄清 `CLAUDE.md`、技能、子代理、Hook、MCP 分别是什么
- 想先把基础打稳，再逐步扩展到个人助理或长期工作流

## 5 分钟开始

### 1. 先安装 Claude Code

如果你只想先跑起来，可以先用：

```bash
npm install -g @anthropic-ai/claude-code
claude doctor
```

如果你想看更完整的安装、登录、排障说明，先读 [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)。安装方式可能会更新，官方入口以 [Anthropic Claude Code setup docs](https://docs.anthropic.com/en/docs/claude-code/setup) 为准。

### 2. 进入一个真实项目后启动 Claude

```bash
cd your-project
claude
```

### 3. 第一次会话先执行 `/init`

```text
/init
```

这一步会生成 `CLAUDE.md`。它是项目共享记忆，不是可有可无的装饰文件。

### 4. 先别急着改代码，先问这 3 句

```text
给我概览一下这个仓库。
这里真实可用的 build、test、lint 命令分别是什么？
先不要改代码，告诉我风险最高的目录和原因。
```

如果仓库比较大、你对代码还不熟，先用：

```text
/plan
```

### 5. 先做一个小而安全的任务

比如修一个小 bug、补一条文档、跑一次测试、梳理一个模块结构。不要一上来就让 Claude“把整个项目做完”。

## 你现在应该先读哪篇

| 你的目标 | 先读 |
| --- | --- |
| 第一次安装 Claude Code | [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md) |
| 在现有项目里稳定使用 Claude Code | [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md) |
| 从零开始启动一个新项目 | [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md) |
| 学会把重复流程做成技能 | [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md) |
| 学会什么时候该创建子代理 | [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md) |
| 把 Claude Code 扩展成个人助理 / 知识系统 | [HOW_TO_START_ASSISTANT_SYSTEM_CN.md](HOW_TO_START_ASSISTANT_SYSTEM_CN.md) |
| 只想看 OpenClaw 到 Claude CLI 的最短执行链路 | [docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md](docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md) |

## 初学者最推荐的阅读顺序

1. [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)
2. [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
3. [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)
4. [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)
5. [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)
6. [HOW_TO_START_ASSISTANT_SYSTEM_CN.md](HOW_TO_START_ASSISTANT_SYSTEM_CN.md)

如果你现在不是要起新项目，而是要把 Claude Code 接进已有仓库，那么前两篇最重要。

## 先理解这 6 个概念

| 概念 | 一句话理解 | 什么时候再深入 |
| --- | --- | --- |
| `CLAUDE.md` | 项目的共享记忆，记录命令、架构、规则和风险点 | 第一天就该用 |
| Plan Mode | 先分析、先规划，不直接改文件 | 面对陌生仓库或大改动时 |
| 技能 | 可复用的流程、检查表或固定能力 | 当某件事开始重复出现时 |
| 子代理 | 专门处理某类任务的角色 | 当某种“专家角色”反复需要时 |
| Hook | 在固定事件前后自动执行的动作 | 当某件事必须每次都发生时 |
| MCP | Claude 访问外部工具和数据源的接口层 | 当你真的需要接 GitHub、数据库、服务端接口时 |

## 初学者最容易踩的坑

- 一上来就让 Claude 写完整个应用，而不是先做小切片
- 没写好 `CLAUDE.md`，就希望 Claude 自动理解项目约定
- 在陌生仓库里直接改代码，不先用 `/plan`
- 还没稳定一套基础工作流，就急着堆很多技能、子代理和 Hook
- 太早把权限放太大，结果自己也不清楚哪些命令是安全的

## 一个更稳的起步顺序

1. 安装并确认 `claude doctor` 通过
2. 在真实项目目录里启动 `claude`
3. 运行 `/init`，把 `CLAUDE.md` 补完整
4. 先让 Claude 解释仓库，而不是直接编码
5. 先做一个小任务，再逐步放开权限
6. 当某个流程重复出现，再考虑做技能或子代理

## 仓库里有什么

### 主教程

- 根目录 `*_CN.md`：核心中文教程
- [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)
- [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
- [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)

### 可直接复制的样板

- [docs/assistant-os-starter/README_CN.md](docs/assistant-os-starter/README_CN.md)
- [docs/subagent-refactor-starter/README_CN.md](docs/subagent-refactor-starter/README_CN.md)

### 可直接参考的脚本和示例

- [scripts/statusline-command.sh](scripts/statusline-command.sh)
- [hooks/doc-scanner/README.md](hooks/doc-scanner/README.md)
- [hooks/design-context/README.md](hooks/design-context/README.md)

## 已整合的开源项目

本仓库整合了多个开源项目的内容，形成一套中文优先的 Claude Code 实战教程体系。

| 来源项目 | 整合内容 | 位置 |
| --- | --- | --- |
| [GradScalerTeam/claude_cli](https://github.com/GradScalerTeam/claude_cli) | 基础框架：agents（doc-master, doc-fixer）、skills（review-doc, review-code）、hooks（doc-scanner, design-context）、英文指南 | `agents/`, `skills/`, `hooks/` |
| [garrytan/gstack](https://github.com/garrytan/gstack) | GStack 31 个专家角色、6 个核心技能、初学者结构化入门 | `docs/GSTACK_INTEGRATION.md` |
| [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | Vendored 快照：agents、skills、commands、plugins、跨工具配置 | `vendor/everything-claude-code/` |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | 社交媒体爬取工具集成指南（Twitter、小红书、Reddit、YouTube 等） | `HOW_TO_CREATE_AGENTS_NON_CODE_CN.md` |
| OpenClaw | OpenClaw + Claude 集成指南、inbox triage 工作流、场景文档 | `docs/OPENCLAW_*.md` |

整合方式说明：
- GradScalerTeam 为上游（upstream），定期同步更新
- everything-claude-code 以 vendor 快照形式纳入，可独立同步更新，详见 [docs/EVERYTHING_CLAUDE_CODE_INTEGRATION_CN.md](docs/EVERYTHING_CLAUDE_CODE_INTEGRATION_CN.md)
- GStack 和 Agent-Reach 以指南/教程形式整合，指向原始安装方式
- OpenClaw 内容为独立中文文档，与上游 GradScaler 仓库无直接依赖

## 进阶专题

当你已经把基础跑顺，再看这些会更合适：

- [docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md](docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md)
- [docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md](docs/OPENCLAW_AND_CLAUDE_AGENTS_CN.md)
- [docs/ASSISTANT_TEAM_PATTERNS_CN.md](docs/ASSISTANT_TEAM_PATTERNS_CN.md)
- [docs/EVERYTHING_CLAUDE_CODE_INTEGRATION_CN.md](docs/EVERYTHING_CLAUDE_CODE_INTEGRATION_CN.md)
- [docs/OFFICIAL_REFERENCE_MAP_CN.md](docs/OFFICIAL_REFERENCE_MAP_CN.md)

## 如果你今天只想做一件事

- 想把 Claude Code 安装好并跑通第一次会话：看 [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md)
- 想把它接进你的真实项目：看 [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
- 想从零启动一个新项目：看 [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)

从大多数人来说，最值得先开始的是 [CLAUDE_SETUP_CN.md](CLAUDE_SETUP_CN.md) 和 [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)。
