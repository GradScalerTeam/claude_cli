# Claude Code 现代上手指南

这是一份面向真实开发工作的 Claude Code 入门文档，目标不是罗列一堆命令，而是帮你搭起一套稳定、不过时的使用基线。

---

## 这份指南会帮你完成什么

读完后，你应该已经完成：

1. 安装 Claude Code
2. 登录并验证安装状态
3. 创建一份有用的 `CLAUDE.md`
4. 掌握日常最关键的命令
5. 理解 settings、memory、skills、subagents、hooks、MCP 各自放在哪里

---

## 安装前先知道这些

根据 Anthropic 当前 Claude Code 官方文档，常见基础要求包括：

- Node.js 18+
- macOS 10.15+、Ubuntu 20.04+/Debian 10+、或 Windows 10+
- 推荐使用 Bash、Zsh 或 Fish
- 需要网络进行认证和模型调用

如果你的团队跑在 Bedrock 或 Vertex 上，也能接入，但对个人来说最顺手的路径仍然是 Claude.ai 账号或 Anthropic Console。

---

## 安装方式

### 方式 1：标准 npm 安装

```bash
npm install -g @anthropic-ai/claude-code
```

适合已经用 Node 统一管理开发工具的人。

注意：

- **不要** 使用 `sudo npm install -g`
- 如果你本机 npm 全局权限本来就乱，后面更新时大概率会难受
- 装完后请跑 `claude doctor`

### 方式 2：原生安装器

Anthropic 也提供了原生安装器，适用于 macOS、Linux，以及 Windows 下的 WSL/PowerShell。

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

如果你不想碰 npm 全局权限，或者就想一个更干净的安装路径，这个方式更值得优先考虑。

### 安装后验证

```bash
claude --version
claude doctor
```

如果 `claude` 找不到，或者 `doctor` 报错，直接看文末的排障部分。

---

## 登录并启动第一次会话

进入一个项目目录后执行：

```bash
cd your-project
claude
```

首次启动会要求你登录。

常见认证路径：

- **Claude.ai 账号**：个人使用最简单
- **Anthropic Console**：按 API 用量计费
- **AWS Bedrock / Google Vertex AI**：企业团队常见

登录成功后，你就进入了 Claude Code 的交互式 REPL。

---

## 真正重要的前 10 分钟

很多教程一上来就讲插件、自动化、并行代理。先别急。

先做下面几件事：

1. 在真实项目里启动 Claude
2. 执行 `/init`
3. 把生成的 `CLAUDE.md` 改好
4. 让 Claude 给你做一次代码库概览
5. 做一个小而安全的任务

建议的第一批提示词：

```text
给我概览一下这个仓库。
```

```text
这里真实可用的 build、test、lint 命令分别是什么？
```

```text
这个项目里哪些目录风险最高，不应该随便改？
```

`/init` 很关键，因为它是在建立长期记忆，而不是让 Claude 每次都从零重新猜项目约定。

---

## CLAUDE.md 应该写什么

好的 `CLAUDE.md` 应该减少重复解释，而不是把所有东西都塞进去。

建议写：

- build、test、lint、format、dev 命令
- 架构说明
- 命名规范
- 核心文档路径
- 高风险目录
- 部署注意事项
- 测试环境或沙箱说明

示例：

```md
# Project Commands
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

# Architecture
- `apps/web` 是前端应用
- `packages/api` 是共享 API client 和 schema

# Rules
- 未经确认不要修改 `infra/production/`
- 外部输入优先使用 Zod 校验
```

Anthropic 当前的 memory 文档还支持你在 `CLAUDE.md` 里用 `@path/to/file` 导入其他文件，这通常比复制整段长文档更干净。

---

## 日常最该掌握的命令

下面这些是最值得先熟悉的内建命令：

| 命令 | 用途 |
|---|---|
| `/help` | 查看当前可用命令 |
| `/init` | 初始化项目 `CLAUDE.md` |
| `/memory` | 编辑和查看记忆文件 |
| `/config` | 打开 Claude Code 设置界面 |
| `/status` | 查看版本、账号和连接状态 |
| `/permissions` | 调整工具授权规则 |
| `/agents` | 创建和管理子代理 |
| `/mcp` | 配置 MCP 服务 |
| `/hooks` | 配置 Hook 自动化 |
| `/compact` | 压缩上下文 |
| `/plan` | 直接进入 Plan Mode |
| `/cost` | 查看本次会话成本和 token 用量 |
| `/doctor` | 检查安装状态 |
| `/statusline` | 配置状态栏 |

新手最容易犯的错，是背了太多命令却没建立工作流。对大多数开发者来说，先把 `/init`、`/memory`、`/permissions`、`/agents`、`/mcp`、`/hooks`、`/compact`、`/doctor` 用顺手就够了。

---

## 权限模式与 Plan Mode

Claude Code 的威力，很大程度上建立在你理解权限模型之上。

### Default mode

Claude 第一次需要更强能力时，会向你申请权限。

### Accept edits mode

适合你已经愿意让 Claude 改文件，但还想保留对命令执行的关注。

### Plan Mode

Plan Mode 是只读规划模式，适合：

- 代码库陌生
- 改动范围大
- 需求还不够清晰
- 想先拿迁移方案，再决定是否动手

进入方式：

```bash
claude --permission-mode plan
```

或在会话内：

```text
/plan
```

对探索、重构规划、代码审查来说，这通常是最安全的默认模式。

---

## Settings 的层级

很多教程把用户级、项目级、本地级混在一起讲，这会导致后面越来越乱。

| 作用域 | 文件 | 典型用途 |
|---|---|---|
| 用户级 | `~/.claude/settings.json` | 你在所有项目里的个人默认设置 |
| 项目级 | `.claude/settings.json` | 团队共享且提交到 git 的配置 |
| 项目本地级 | `.claude/settings.local.json` | 只给自己用、不提交的实验配置 |

团队共享的 hooks 或 permissions，优先放项目级。个人默认偏好，放用户级。

---

## Memory 的层级

大多数人真正需要用好的记忆层，主要是这两个：

| 记忆类型 | 位置 | 最佳用途 |
|---|---|---|
| 项目记忆 | `./CLAUDE.md` | 团队共享的项目说明 |
| 用户记忆 | `~/.claude/CLAUDE.md` | 你跨项目复用的个人偏好 |

你也可以用 `#` 开头的输入快速写入记忆，并通过 `/memory` 查看和编辑当前加载的记忆文件。

团队规范放项目记忆，个人偏好尽量别混进仓库。

---

## 什么时候该加子代理、技能、Hook、MCP

### 该加子代理的时候

- 同类“专家角色”反复出现
- 某类任务明显适合独立 prompt
- 你希望某个角色有更小的工具权限范围

优先用 `/agents` 创建，团队流程优先建项目级子代理。

### 该加技能的时候

- 某个流程会反复执行
- 你想做一个可复用的 slash command
- 这个流程需要参考文件、清单或模板

技能放在 `.claude/skills/<name>/SKILL.md`。

### 该加 Hook 的时候

- 某件事必须每次都发生，而不是“希望 Claude 记得做”

例如：

- 改完文件自动格式化
- 阻止修改敏感路径
- 记录执行过的命令

### 该加 MCP 的时候

- Claude 需要访问 GitHub、Jira、Figma、Slack、数据库或内部服务

用 `/mcp` 配置，并选对作用域：

- 个人常用工具 -> user scope
- 团队共享服务 -> project scope
- 只在当前环境临时使用的敏感配置 -> local scope

---

## Headless 与自动化基础

你不需要永远待在交互界面里。

Anthropic CLI 文档里很实用的几个模式：

```bash
claude -p "summarize the recent changes"
```

```bash
claude --permission-mode plan -p "analyze the auth system and suggest improvements"
```

```bash
cat build.log | claude -p "find the most likely root cause"
```

这些很适合本地脚本、CI 辅助、日志分析和自动化小任务。

---

## 结合本仓库的推荐落地顺序

如果你想把这个仓库用起来，又不想一下子把环境搞复杂，建议顺序如下：

1. 安装 Claude Code
2. 在真实项目中执行 `/init`
3. 把 `CLAUDE.md` 写扎实
4. 只配置真正需要的 `/permissions`
5. 安装 `global-doc-master`
6. 安装 `global-review-doc`
7. 安装 `global-review-code`
8. 如果仓库文档很多，再安装 `doc-scanner`
9. 如果想提升 git 可见性，再装状态栏脚本
10. 最后再补项目专属技能和子代理

---

## 可选：使用本仓库自带状态栏

仓库里自带了状态栏脚本 [`scripts/statusline-command.sh`](scripts/statusline-command.sh)。

使用方式：

```bash
cp scripts/statusline-command.sh ~/.claude/statusline-command.sh
```

然后在 `~/.claude/settings.json` 中加入：

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

这是很好的体验增强，但不是核心入门步骤。

---

## 快速排障

### 找不到 `claude`

- 先跑 `claude doctor`
- 检查 shell 的 `PATH`
- 如果 npm 安装太乱，直接考虑原生安装器

### npm 权限问题

- 不要用 `sudo npm install -g`
- 优先改用原生安装器，或迁移到本地安装路径

### 权限申请太频繁

- 用 `/permissions` 放开那些你确定安全且高频的命令
- 不要为了图省事直接全局跳过权限

### 登录异常

可以尝试：

1. `/logout`
2. 关闭 Claude Code
3. 重新执行 `claude`
4. 再登录一次

### 搜索能力怪怪的

Anthropic 的排障文档建议安装系统级 `ripgrep`，因为搜索和自定义能力发现依赖它时，效果会更稳定。

---

## 下一步阅读

- [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)
- [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
- [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)
- [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)
- [docs/OFFICIAL_REFERENCE_MAP_CN.md](docs/OFFICIAL_REFERENCE_MAP_CN.md)
