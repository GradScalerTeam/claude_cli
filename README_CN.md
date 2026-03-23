# Claude CLI — 代理、技能与工作流

[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) 的实战代理、技能和工作流集合 — 由 [GradScaler](https://github.com/GradScalerTeam) 构建和维护。

> **中文汉化版** | [English](README.md)

---

## 为什么创建这个仓库

Claude Code CLI 很强大，但大多数开发者只用了皮毛。他们用它做快速编辑和一次性问答。这就像买了一台数控机床却把它当镇纸用。

这个仓库的存在是因为我们花了几个月时间，弄清楚如何真正地发布功能、完成整个项目，以及使用 Claude CLI 作为主要驱动力来编写生产级代码。我们构建了写文档的代理、审查文档的技能、审查代码的技能，以及将它们串联起来的工作流，让你从模糊的想法到部署的功能，只需最少的编码。

我们分享一切 — 实际的代理定义、技能定义、参考文件，以及将它们联系在一起的工作流 — 这样你就可以安装它们，立即提升你使用 Claude CLI 的方式。

---

## 谁创建了这个

**[GradScaler](https://github.com/GradScalerTeam)** — 一个每天使用 Claude CLI 构建并记录有效方法的团队。

由 **[Devansh Raj](https://github.com/dev-arctik)** 创建和维护。

**中文汉化** — 由 [srxly888-creator](https://github.com/srxly888-creator) 汉化

---

## 快速开始

刚接触 Claude Code CLI？从这里开始：

1. **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** — 安装 Claude CLI，设置身份验证，在 VS Code 中运行，安装推荐插件，学习基本的斜杠命令。

然后选择适合你情况的指南：

2. **[HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)** — 从零开始构建全新项目。涵盖完整工作流：规划文档 → 审查 → 迭代 → 生成代理 → 并行构建 → 代码审查 → 测试 → 创建本地工具。

3. **[HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)** — 将 Claude CLI 引入你已经在做的项目。涵盖：记录功能流程 → 审查代码 → 记录问题 → 创建本地工具 → 生成开发代理。

想构建自己的代理和技能？

4. **[HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)** — 了解什么是代理以及如何使用代理开发插件为你的项目创建自定义代理。

5. **[HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)** — 了解什么是技能，它们与代理的区别，以及如何使用技能开发插件创建自定义技能。

想让 Claude 自动了解你的现有文档？

6. **[Doc Scanner Hook](hooks/doc-scanner/)** — SessionStart 钩子，在每次对话开始时扫描项目的 `.md` 文件并为 Claude 提供文档索引。不再需要"读取规划文档" — Claude 已经知道它的存在。

使用 Pencil 进行 UI 设计？

7. **[HOW_TO_USE_PENCIL_WITH_CLAUDE.md](HOW_TO_USE_PENCIL_WITH_CLAUDE.md)** — 如何将 [Pencil](https://www.pencil.dev/) 与 Claude Code 结合使用进行上下文感知的设计会话。包括将代码库知识桥接到 Pencil 设计环境的设计上下文钩子。

---

## 工作流

这不只是随机工具的集合。这里的所有内容都遵循我们在每个项目中使用的特定工作流：

```
1. 规划        →  global-doc-master 创建规划文档
2. 修复        →  global-doc-fixer 审查、修复并重复直到 READY
3. 构建        →  将文档交给代理或手动构建
4. 代码审查    →  global-review-code 审计实现
5. 发布        →  修复发现、重新审查、部署
```

先规划。构建前审查。构建后审查。就是这样。下面的代理和技能是让每一步快速而彻底的工具。

---

## 仓库内容

### 代理（Agents）

代理是自主工作者，它们调查你的代码库，向你提问，并产生完整的输出。它们位于 `~/.claude/agents/` 并在每个项目中可用。

| 代理 | 功能 | 文件夹 |
|---|---|---|
| **[Global Doc Master](agents/global-doc-master/)** | 创建和组织所有技术文档 — 规划规范、功能流程、部署指南、问题报告、解决的事后分析和调试手册。先扫描你的代码库，提出澄清问题，并在 `docs/` 下编写结构化文档。 | `agents/global-doc-master/` |
| **[Global Doc Fixer](agents/global-doc-fixer/)** | 自主审查和修复文档直到它们准备好实现。运行 `global-review-doc`，修复所有发现，重新审查并重复 — 消除手动审查-修复循环。只有在需要业务逻辑决策时才提出多选题。 | `agents/global-doc-fixer/` |

### 技能（Skills）

技能是你用斜杠命令或自然语言调用的专门能力。它们在分叉上下文中运行并产生结构化报告。它们位于 `~/.claude/skills/`。

| 技能 | 功能 | 文件夹 |
|---|---|---|
| **[Global Review Doc](skills/global-review-doc/)** | 根据你的实际代码库审查任何技术文档。9阶段审查涵盖代码库验证、完整性、安全性、bug 预测、边界情况和代理准备度。生成 11 节报告，包含 READY / REVISE / REWRITE 判定。 | `skills/global-review-doc/` |
| **[Global Review Code](skills/global-review-code/)** | 用 12 阶段审计审查实际代码，涵盖架构、安全性（OWASP + 领域特定）、性能、错误处理、依赖项、测试和框架最佳实践。还有 bug 狩猎模式，从症状追踪 bug 到根本原因。所有检查都适应你检测到的技术栈。 | `skills/global-review-code/` |

### 钩子（Hooks）

钩子是响应 Claude CLI 事件自动运行的脚本 — 比如启动会话、使用工具或完成任务。它们位于 `~/.claude/` 并在 `~/.claude/settings.json` 中注册。

| 钩子 | 功能 | 文件夹 |
|---|---|---|
| **[Doc Scanner](hooks/doc-scanner/)** | SessionStart 钩子，在每次对话开始时扫描项目的 `.md` 文件并输出文档索引。Claude 立即知道存在哪些规划文档、功能规范、流程文档和代理定义 — 并在开始工作前读取相关的。 | `hooks/doc-scanner/` |
| **[Design Context](hooks/design-context/)** | [Pencil](https://www.pencil.dev/) 设计会话的 SessionStart 钩子。检测 Claude 在 `design/` 子文件夹中运行时，爬取父项目，并生成包含项目概览、路由、组件、文档索引和自动研究规则的 `design/CLAUDE.md` — 这样 Claude 就能在完全了解代码库的情况下进行设计。 | `hooks/design-context/` |

### 状态栏

| 脚本 | 功能 | 文件夹 |
|---|---|---|
| **[Status Line](scripts/statusline-command.sh)** | 自定义 Claude Code 状态栏，显示 git 分支、暂存/修改/未跟踪文件计数，以及领先/落后远程 — 全部彩色编码。复制到 `~/.claude/` 并配置 `settings.json` 使用。 | `scripts/` |

### 指南

| 指南 | 涵盖内容 |
|---|---|
| **[CLAUDE_SETUP.md](CLAUDE_SETUP.md)** | 安装 Claude CLI、身份验证、VS Code 设置、插件、斜杠命令、自定义状态栏 |
| **[HOW_TO_START_NEW_PROJECT.md](HOW_TO_START_NEW_PROJECT.md)** | 从零构建项目 — 规划、审查、代理、并行构建、代码审查、测试、本地工具 |
| **[HOW_TO_START_EXISTING_PROJECT.md](HOW_TO_START_EXISTING_PROJECT.md)** | 在现有项目中使用 Claude CLI — 功能流程、代码审查、问题文档、本地工具、开发代理 |
| **[HOW_TO_CREATE_AGENTS.md](HOW_TO_CREATE_AGENTS.md)** | 什么是代理，它们如何工作，以及如何使用代理开发插件创建自己的代理 |
| **[HOW_TO_CREATE_SKILLS.md](HOW_TO_CREATE_SKILLS.md)** | 什么是技能，它们与代理的区别，以及如何使用技能开发插件创建自己的技能 |
| **[HOW_TO_USE_PENCIL_WITH_CLAUDE.md](HOW_TO_USE_PENCIL_WITH_CLAUDE.md)** | 将 [Pencil](https://www.pencil.dev/) 与 Claude Code 结合用于上下文感知的 UI 设计 — 上下文差距问题、设计上下文钩子和完整的设计工作流 |

---

## 设置

每个组件都有自己的 README，包含完整的设置说明。导航到文件夹，阅读 README，并将设置提示粘贴到你的 Claude CLI。

- **[Global Doc Master](agents/global-doc-master/)** — 文档代理。查看 [agents/global-doc-master/README.md](agents/global-doc-master/README.md) 进行设置。
- **[Global Review Doc](skills/global-review-doc/)** — 文档审查技能。查看 [skills/global-review-doc/README.md](skills/global-review-doc/README.md) 进行设置。
- **[Global Review Code](skills/global-review-code/)** — 代码审查 & bug 狩猎技能。查看 [skills/global-review-code/README.md](skills/global-review-code/README.md) 进行设置。
- **[Doc Scanner](hooks/doc-scanner/)** — 文档感知钩子。查看 [hooks/doc-scanner/README.md](hooks/doc-scanner/README.md) 进行设置。
- **[Design Context](hooks/design-context/)** — Pencil 设计上下文钩子。查看 [hooks/design-context/README.md](hooks/design-context/README.md) 进行设置。**注意：** 此钩子专门用于 [Pencil](https://www.pencil.dev/) 设计应用 — 除非你安装了 Pencil 并使用 `.pen` 文件进行 UI 设计，否则不会做任何事情。如果你使用 Pencil，请单独安装。

> **重要：** 安装代理或技能后，退出当前的 Claude CLI 会话并启动新会话。Claude 只在会话启动时加载代理和技能 — 所以新安装的工具在你重启前不会出现在 `/help` 或响应 `/slash-commands`。

### 一键安装所有内容

将此粘贴到你的 Claude CLI：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并安装所有内容：

1. 读取 agents/global-doc-master/global-doc-master.md — 在 ~/.claude/agents/global-doc-master.md 创建相同内容的文件。如果目录不存在则创建。

2. 读取 skills/global-review-doc/ 中的所有文件（SKILL.md, references/output-format.md, references/security-domains.md）— 在 ~/.claude/skills/global-review-doc/ 创建相同结构和内容。

3. 读取 skills/global-review-code/ 中的所有文件（SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, references/domain-security-checks.md）— 在 ~/.claude/skills/global-review-code/ 创建相同结构和内容。

4. 读取 hooks/doc-scanner/doc-scanner.sh — 保存到 ~/.claude/doc-scanner.sh，内容相同。使其可执行（chmod +x）。

5. 读取 scripts/statusline-command.sh — 保存到 ~/.claude/statusline-command.sh，内容相同。

6. 读取我现有的 ~/.claude/settings.json（如果不存在则创建）并添加：statusLine 配置 { "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } } 和一个运行 "bash ~/.claude/doc-scanner.sh" 的 SessionStart 钩子。与任何现有设置合并 — 不要覆盖它们。

注意：设计上下文钩子（用于 Pencil 设计应用）不包含在此 — 它是 Pencil 用户的单独安装。如果你使用 Pencil，请参阅下面的"仅安装设计上下文钩子"。

安装完所有内容后，读取每个文件夹中的 README.md 并给我一个安装了什么以及如何使用每一个的摘要。
```

### 仅安装代理

仅安装 Global Doc Master 代理：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并安装代理：

1. 读取 agents/global-doc-master/global-doc-master.md — 在 ~/.claude/agents/global-doc-master.md 创建相同内容的文件。如果目录不存在则创建。

安装后，读取 agents/global-doc-master/README.md 并给我一个安装了什么以及如何使用的摘要。
```

### 仅安装技能

仅安装 Global Review Doc 和 Global Review Code 技能：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并安装技能：

1. 读取 skills/global-review-doc/ 中的所有文件（SKILL.md, references/output-format.md, references/security-domains.md）— 在 ~/.claude/skills/global-review-doc/ 创建相同结构和内容。

2. 读取 skills/global-review-code/ 中的所有文件（SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, references/domain-security-checks.md）— 在 ~/.claude/skills/global-review-code/ 创建相同结构和内容。

安装后，读取每个技能文件夹中的 README.md 并给我一个安装了什么以及如何使用每一个的摘要。
```

### 仅安装文档扫描器钩子

仅安装文档扫描器 SessionStart 钩子：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并安装文档扫描器钩子：

1. 读取 hooks/doc-scanner/doc-scanner.sh — 保存到 ~/.claude/doc-scanner.sh，内容相同。使其可执行（chmod +x）。

2. 读取我现有的 ~/.claude/settings.json（如果不存在则创建）并添加一个运行 "bash ~/.claude/doc-scanner.sh" 的 SessionStart 钩子。与任何现有钩子合并 — 不要覆盖它们。

安装后，在有 .md 文件的项目中启动新会话并确认文档扫描器运行。
```

### 仅安装设计上下文钩子

仅安装 Pencil 设计上下文 SessionStart 钩子（用于 [Pencil](https://www.pencil.dev/) 设计应用）：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并安装设计上下文钩子：

1. 读取 hooks/design-context/design-context-hook.sh — 保存到 ~/.claude/design-context-hook.sh，内容相同。使其可执行（chmod +x）。

2. 读取我现有的 ~/.claude/settings.json（如果不存在则创建）并添加一个运行 "bash ~/.claude/design-context-hook.sh" 的 SessionStart 钩子。与任何现有钩子合并 — 不要覆盖它们。

安装后，告诉我已完成并解释钩子的功能。注意：此钩子仅在安装了 Pencil 设计应用（pencil.dev）时有效 — 它将项目上下文桥接到 Pencil 的设计会话。
```

### 仅安装状态栏

仅安装自定义 git 状态栏：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并安装状态栏：

1. 读取 scripts/statusline-command.sh — 保存到 ~/.claude/statusline-command.sh，内容相同。

2. 读取我现有的 ~/.claude/settings.json（如果不存在则创建）并添加 statusLine 配置：{ "statusLine": { "command": "bash ~/.claude/statusline-command.sh" } }。与任何现有设置合并 — 不要覆盖它们。

完成后告诉我并解释状态栏显示的内容。
```

### 检查更新

已经安装了所有内容并想检查是否有更新版本？将此粘贴到你的 Claude CLI：

```
访问 GitHub 仓库 https://github.com/srxly888-creator/claude_cli 并检查我安装的所有内容的更新：

1. 比较 agents/global-doc-master/global-doc-master.md 与我本地的 ~/.claude/agents/global-doc-master.md

2. 比较 skills/global-review-doc/ 中的所有文件（SKILL.md, references/output-format.md, references/security-domains.md）与我本地 ~/.claude/skills/global-review-doc/ 的版本

3. 比较 skills/global-review-code/ 中的所有文件（SKILL.md, references/output-format-code-review.md, references/output-format-bug-hunt.md, references/framework-best-practices.md, references/domain-security-checks.md）与我本地 ~/.claude/skills/global-review-code/ 的版本

4. 比较 hooks/doc-scanner/doc-scanner.sh 与我本地的 ~/.claude/doc-scanner.sh

5. 比较 scripts/statusline-command.sh 与我本地的 ~/.claude/statusline-command.sh

6. 如果我安装了 ~/.claude/design-context-hook.sh，比较 hooks/design-context/design-context-hook.sh 与我本地的版本

对于每个组件，告诉我是否有任何差异。如果发现更新，问我是想先解释变更内容还是直接将新更新拉取到我的本地文件。
```

---

## 汉化说明

本仓库为 [GradScalerTeam/claude_cli](https://github.com/GradScalerTeam/claude_cli) 的中文汉化版本。

### 汉化内容

- ✅ README.md → README_CN.md
- 🚧 CLAUDE_SETUP.md（进行中）
- 🚧 HOW_TO_START_NEW_PROJECT.md（进行中）
- 🚧 HOW_TO_START_EXISTING_PROJECT.md（进行中）
- 🚧 HOW_TO_CREATE_AGENTS.md（进行中）
- 🚧 HOW_TO_CREATE_SKILLS.md（进行中）
- 🚧 Agents 文档（进行中）
- 🚧 Skills 文档（进行中）

### 本地化优化

- 保留所有功能完整性
- 优化中文用户的使用体验
- 添加中文示例和说明

---

## 贡献

这个仓库积极维护。我们会在构建和完善时添加新的代理、技能和工作流。如果你有建议或想贡献，请开 issue 或 PR。

---

## 许可证

MIT
