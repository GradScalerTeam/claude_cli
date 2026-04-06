# Claude Code CLI — 安装设置指南

安装 Claude Code CLI、在终端和 VS Code 中设置、安装插件并学习基本命令的完整指南。

> **中文版** | [English](../../CLAUDE_SETUP.md)

---

## 什么是 Claude Code CLI？

Claude Code 是 Anthropic 开发的命令行工具，在终端中运行。你用自然语言与它对话，它读取你的代码、编写代码、运行命令、管理 git、创建文件，并处理整个开发工作流 — 全部从你的终端完成。

它不是聊天机器人。它是一个生活在你的终端中的 AI 开发者，理解你的完整代码库，并能执行真实操作 — 创建文件、编辑代码、运行测试、提交到 git 等等。

这样想：不用在编辑器、终端、文档和 Stack Overflow 之间切换，你只需描述你想要什么，Claude 就会完成。

---

## 安装 Claude Code CLI

### macOS / Linux（推荐）

在终端中运行：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

这是原生安装程序 — 无需 Node.js，内置自动更新。

### Windows（PowerShell）

```powershell
irm https://claude.ai/install.ps1 | iex
```

### 验证安装

安装后，运行：

```bash
claude --version
```

然后运行 doctor 命令检查一切设置正确：

```bash
claude doctor
```

---

## 身份验证

首次运行 `claude` 时，它会要求你进行身份验证。你有几个选项：

1. **Claude Pro/Max 订阅** — 使用你的 claude.ai 账户登录。你的订阅包含 Claude Code 访问权限。这是个人开发者最简单的选择。

2. **Anthropic Console（API 计费）** — 连接到你在 console.anthropic.com 的 Anthropic Console 账户。你根据 API 计费按使用量付费。

3. **企业版** — 如果你的组织使用 Amazon Bedrock、Google Vertex AI 或 Microsoft Foundry，配置 Claude Code 使用这些服务。

---

## 启动 Claude Code

打开终端，导航到你的项目目录，输入：

```bash
claude
```

就是这样。你现在在 Claude Code 会话中。用自然语言输入你想要的内容，它就会开始工作。

**你可以说的示例：**
- "读取 src/ 文件夹并解释架构"
- "修复登录函数中的 bug"
- "为用户注册创建新的 API 端点"
- "运行测试并修复任何失败"
- "用描述性消息提交这些更改"

---

## 在 VS Code 中使用 Claude Code

你不必只在终端中使用 Claude Code。有一个官方 VS Code 扩展可以直接在你的编辑器中使用。

### 安装

1. 打开 VS Code
2. 转到扩展（Mac 上 `Cmd+Shift+X`，Windows/Linux 上 `Ctrl+Shift+X`）
3. 搜索 **"Claude Code"**
4. 安装 **Anthropic** 发布的那个（已验证的发布者）

### 使用

- 点击 VS Code 侧边栏中的 **Spark 图标** 打开 Claude Code
- 用 `Cmd+N`（Mac）或 `Ctrl+N`（Windows）开始新对话
- 它的工作方式与终端版本完全相同，但集成在你的编辑器中 — 它可以看到你打开的文件、选择和编辑器上下文

该扩展也适用于 **Cursor**、**Windsurf** 和 **VSCodium**。

---

## 基本斜杠命令

在 Claude Code 会话中，你可以使用斜杠命令进行快速操作。以下是你最常用的：

| 命令 | 功能 |
|---|---|
| `/help` | 显示所有可用命令，包括插件添加的自定义命令 |
| `/stats` | 显示你的使用分析 — 图表、活动连续天数、模型偏好 |
| `/model` | 在 Claude 模型之间切换（Opus、Sonnet、Haiku） |
| `/config` | 切换功能，如思考模式、提示建议、自动更新 |
| `/clear` | 清除当前对话历史 |
| `/compact` | 压缩对话以节省上下文窗口空间 |
| `/hooks` | 打开交互式钩子界面进行事件驱动自动化 |
| `/plugin` | 管理插件 — 安装、更新、删除 |
| `/install-github-app` | 设置 GitHub 应用进行自动化 PR 审查 |

在任何会话中输入 `/help` 查看完整列表，包括插件添加的任何命令。

---

## 插件

插件是代理、技能、斜杠命令和钩子的捆绑包，扩展 Claude Code 的功能。它们让你从"Claude 可以写代码"到"Claude 可以对我的整个代码库进行 12 阶段安全审计"。

### 如何安装插件

在 Claude Code 会话中，输入：

```
/plugin
```

这会打开插件管理器。从那里你可以浏览官方市场并点击几下安装任何插件。

### 推荐插件

这些是我们日常使用并推荐安装的插件。它们来自官方 Claude 插件市场。

| 插件 | 功能 |
|---|---|
| **plugin-dev** | 构建自己插件的工具包。指导你创建钩子、代理、技能、斜杠命令、MCP 集成和插件结构。如果你想创建自定义工具，请安装这个。 |
| **feature-dev** | 完整的功能开发工作流，带有专门的代理 — 代码库探索、架构设计、代码审查和质量检查。适合端到端构建功能。 |
| **pr-review-toolkit** | 使用多个专门代理的综合 PR 审查。每个代理专注于不同方面 — 注释、测试、错误处理、类型设计、代码质量和简化。 |
| **code-review** | 自动化 PR 代码审查，带基于置信度的评分。使用多个代理审查不同维度，只显示高置信度的发现。 |
| **commit-commands** | 简化你的 git 工作流。添加提交、推送、创建 PR 和清理已删除分支的命令 — 一步完成。 |
| **claude-md-management** | 维护和改进 CLAUDE.md 文件的工具。审计质量、捕获会话学习并保持项目记忆最新。 |
| **claude-code-setup** | 分析你的代码库并推荐定制的 Claude Code 自动化 — 钩子、技能、MCP 服务器和专门为你的项目定制的子代理。非常适合首次设置。 |
| **code-simplifier** | 简化和改进代码以提高清晰度、一致性和可维护性的代理，同时保留所有功能。在你编写代码后自动运行。 |
| **frontend-design** | UI/UX 实现的专门技能。创建独特的、生产级前端界面，具有高设计质量。 |
| **security-guidance** | 编辑文件时警告潜在安全问题的钩子 — 命令注入、XSS、不安全代码模式。在后台运行并主动提醒你。 |
| **hookify** | 轻松创建钩子以防止不需要的行为。分析你的对话模式并生成阻止 Claude 做你不想要事情的钩子。 |
| **playground** | 创建交互式 HTML 演练场 — 自包含的单文件浏览器，带视觉控件、实时预览和复制按钮。适合原型设计。 |
| **skill-creator** | 创建新技能、改进现有技能并运行评估以测试技能性能。如果你在构建自定义技能，请使用这个。 |
| **agent-sdk-dev** | 使用 Claude Agent SDK 构建的开发工具包。如果你正在以编程方式构建自定义代理，请安装这个。 |
| **ralph-loop** | 在连续的自引用循环中运行 Claude，使用相同的提示直到任务完成。适合迭代开发，Claude 不断完善直到完成。 |
| **explanatory-output-style** | 在 Claude 的回复中添加关于实现选择和代码库模式的教育见解。帮助你在 Claude 工作时学习。 |
| **learning-output-style** | 交互式学习模式，要求你在关键决策点贡献。Claude 在构建时教学。 |

### 持续检查新插件

Anthropic 团队和社区不断发布新插件。定期运行 `/plugin` 检查市场 — 经常有可以改进你工作流的新东西。

---

## 自定义状态栏

Claude Code 在终端底部有一个状态栏，在你工作时显示上下文信息。默认情况下它很基础，但你可以用自定义脚本替换它，一目了然地显示有用的 git 信息。

### 这个状态栏显示什么

```
project_name/src | main +2 *3 ~1 / ↑1 ↓2
```

每个部分的含义：

| 符号 | 颜色 | 含义 |
|---|---|---|
| `project/folder` | 默认 | 缩短路径 — 当前目录的最后 2 段 |
| `main` | **粗体青色** | 当前 git 分支 |
| `+2` | **绿色下划线** | 2 个文件已暂存（准备提交） |
| `*3` | **黄色下划线** | 3 个文件已修改（未暂存的更改） |
| `~1` | **红色下划线** | 1 个未跟踪文件（新的，未添加到 git） |
| `↑1` | **蓝色下划线** | 领先远程 1 个提交 |
| `↓2` | **品红色下划线** | 落后远程 2 个提交 |

本地统计（暂存/修改/未跟踪）和远程统计（领先/落后）用 `/` 分隔符分开。如果没有更改，只显示分支名。如果你不在 git 仓库中，它只显示缩短的路径。

### 如何安装

**步骤 1：** 将状态栏脚本复制到你的 Claude 配置目录：

```bash
# 创建文件
cp scripts/statusline-command.sh ~/.claude/statusline-command.sh
```

或者如果你从 GitHub 仓库安装，从 [`scripts/statusline-command.sh`](scripts/statusline-command.sh) 复制内容并保存到 `~/.claude/statusline-command.sh`。

**步骤 2：** 将状态栏配置添加到你的 Claude 设置。打开 `~/.claude/settings.json` 并添加：

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

如果你已经在 `settings.json` 中有其他设置，只需将 `statusLine` 键添加到它们旁边。

**步骤 3：** 重启 Claude Code。新的状态栏将出现在终端底部。

### 工作原理

脚本通过 stdin 从 Claude Code 接收包含工作区信息（如当前目录）的 JSON 输入。它使用 `--no-optional-locks` 运行一系列快速 git 命令（这样它永远不会干扰其他 git 操作）并用 ANSI 颜色代码格式化输出。

脚本需要 `jq` 来解析 JSON 输入。大多数系统已安装 — 如果没有，用 `brew install jq`（macOS）或 `apt install jq`（Linux）安装。

---

## 下一步

现在你已经安装并设置了 Claude Code，阅读这些指南开始使用：

- **[用 Claude CLI 开始新项目](HOW_TO_START_NEW_PROJECT.md)** — 如何使用 Claude CLI 从零开始设置全新项目
- **[在现有项目中使用 Claude CLI](HOW_TO_START_EXISTING_PROJECT.md)** — 如何将 Claude CLI 引入你已经在做的项目
