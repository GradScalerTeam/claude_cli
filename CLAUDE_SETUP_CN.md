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

如果你的团队跑在 Bedrock、Vertex 或 Microsoft Foundry 上，也能接入，但对个人来说最顺手的路径通常仍然是 Claude.ai 付费账号或 Anthropic Console。

---

## 安装方式

Anthropic 当前更推荐原生安装器。npm 安装仍然可用，但更像是兼容已有 Node 工具链的路径。

### 方式 1：推荐，原生安装器

Anthropic 提供了原生安装器，适用于 macOS、Linux，以及 Windows 下的 WSL/PowerShell。

macOS / Linux / WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

如果你不想碰 npm 全局权限，或者就想一个更干净、更新更省心的安装路径，这个方式值得优先考虑。

### 方式 2：兼容型 npm 安装

```bash
npm install -g @anthropic-ai/claude-code
```

这里“适合已经用 Node 统一管理开发工具的人”，具体是指你平时本来就这样工作：

- 用 `nvm`、`fnm`、`Volta`、`asdf` 这类工具管理 Node 版本
- 会用 npm 或 pnpm 全局安装 CLI，例如 `typescript`、`pnpm`、`prettier`、`tsx`
- 知道全局包、`PATH`、升级和卸载大概怎么处理
- 愿意把 Claude Code 也当成一个普通的 Node CLI 来维护

一个直观判断方法：

- 如果你平时就经常装各种全局开发工具，npm 安装 Claude Code 会觉得很自然
- 如果你看到“全局安装”“PATH”“npm 权限”就已经头大，直接选原生安装器会更省心

注意：

- **不要** 使用 `sudo npm install -g`
- 如果你本机 npm 全局权限本来就乱，后面更新时大概率会难受
- 装完后请跑 `claude doctor`

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

根据当前官方文档，Claude Code 需要 `Pro`、`Max`、`Teams`、`Enterprise` 或 Anthropic Console 账号；Claude.ai 免费版不包含 Claude Code 访问。

常见认证路径：

- **Claude.ai 付费账号**：个人使用最简单
- **Anthropic Console**：按 API 用量计费
- **AWS Bedrock / Google Vertex AI / Microsoft Foundry**：企业团队常见

登录成功后，你就进入了 Claude Code 的交互式 REPL。

---

## 如果你团队在用 GLM 或统一模型网关

这件事最容易混淆的点，是把“Claude Code 这个客户端”和“它背后接的模型或网关”混在一起理解。

更稳的常用做法通常不是“把 Claude Code 直接改成 GLM 客户端”，而是：

1. Claude Code 仍然按官方方式安装和启动
2. 团队前面放一个统一的 LLM Gateway
3. 让这个网关负责鉴权、预算、审计和模型路由
4. 让 Claude Code 通过 Anthropic 兼容端点连到这个网关

可以把它理解成：

```text
Claude Code -> 你的 LLM Gateway -> Claude / GLM / 其他模型
```

最小示意配置通常长这样：

```bash
export ANTHROPIC_BASE_URL="https://your-llm-gateway.example.com"
export ANTHROPIC_AUTH_TOKEN="your-token"
claude
```

这种做法的价值在于：

- 团队可以统一做鉴权、预算和审计
- 可以按项目或环境切换后端模型
- 每个人不需要各自维护一套复杂 provider 配置

但要注意：

- Claude Code 官方文档明确列出的直连 provider 主要是 Anthropic、Bedrock、Vertex AI 和 Microsoft Foundry；GLM 不是官方列出的直连 provider
- 如果你的网关只是 “OpenAI 兼容” 而不是 “Anthropic 兼容”，不要默认 Claude Code 一定能正常工作
- 如果你的目标是“主要跑 GLM”，最好先小范围验证工具调用、长上下文和代理式工作流是否符合预期

一句话理解：GLM 更适合作为你团队网关后面的一个可路由模型，而不是默认把 Claude Code 当成“任何模型都能无缝替代”的通用壳

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

### 为什么这些内容值得写

上面这几行不是“给人看的装饰”，它们会直接影响 Claude 的默认判断。

| 你写的内容 | 为什么有用 | Claude 更可能怎么做 |
|---|---|---|
| `Build: pnpm build` | 告诉 Claude 真实存在的构建命令，避免它猜成 `npm run build` | 当你说“先验证能不能编译”时，它更可能直接跑对命令 |
| `Test: pnpm test` | 告诉 Claude 改完代码后应该用哪条测试命令回归 | 修 bug 或加功能后，更容易主动做正确的回归验证 |
| `Lint: pnpm lint` | 告诉 Claude 团队静态检查的入口 | 它会更容易把 lint 当成提交前基线，而不是只看肉眼结果 |
| `` `apps/web` 是前端应用 `` | 告诉 Claude 前端代码主要集中在哪里 | 当你说“改页面”时，它更容易先去对的目录，而不是全仓乱搜 |
| `` `packages/api` 是共享 API client 和 schema `` | 告诉 Claude 哪一层负责共享接口定义 | 当你改接口时，它更容易意识到前后端都可能受影响 |
| `未经确认不要修改 infra/production/` | 明确风险边界 | 它会把这类路径视为高风险区域，先停下来确认 |

你可以把 `CLAUDE.md` 理解成“让 Claude 少猜、多按项目真实规则做事”的文件。

### 一个更像真实项目的写法

如果你是 monorepo，新手通常可以先从这种粒度开始：

```md
# Project Commands
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`

# Architecture
- `apps/web` 是用户访问的前端
- `apps/admin` 是内部运营后台
- `packages/api` 放共享 API client、schema 和类型
- `packages/ui` 放可复用 UI 组件

# Rules
- 涉及支付、权限、生产部署的改动必须先确认
- 外部输入优先使用 Zod 校验
- 改接口时同步检查调用方和测试
```

不需要一上来写得很长，但一定要写“真的会影响 Claude 决策”的东西。

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

### 不要背命令，先记住这 4 条工作流

#### 场景 1：第一次进入一个仓库

1. 如果安装有点怪，先跑 `claude doctor`
2. 进入项目后执行 `/init`
3. 让 Claude 概览仓库、找真实命令、标记高风险目录
4. 再用 `/memory` 回头补 `CLAUDE.md`

这条链路的重点不是“学会 `/init` 这个命令”，而是先把长期记忆建起来。

#### 场景 2：准备让 Claude 开始改文件

1. 先给一个小而安全的任务
2. 看 Claude 会申请哪些权限
3. 只有那些高频且安全的操作，再用 `/permissions` 放开

这比一上来把权限全开安全得多。

#### 场景 3：开始觉得有些提示词老在重复

- 重复的是一个流程，用技能
- 重复的是一个专家角色，用 `/agents`
- 需要访问外部系统，用 `/mcp`
- 某件事必须每次都自动发生，用 `/hooks`

也就是说，命令本身不是重点，重点是你要先分清自己遇到的是“流程问题”“角色问题”还是“工具接入问题”。

#### 场景 4：会话越来越长，Claude 开始忘上下文

这时才轮到 `/compact`。

它的作用不是“提升能力”，而是帮你把当前会话压缩成更短的上下文，减少后面对话继续膨胀。

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

这里的 “可复用的 slash command” 不是 shell alias，也不是 Claude 内建命令。

它更像是：你把一段会反复说的提示词、检查清单和辅助文件，封装成一个你自己定义的命令。

比如你每次都要说：

```text
审查 src/routes 下的 API，检查参数校验、鉴权、错误处理和缺失测试，并按严重级别输出。
```

那它就已经很适合做成一个技能。做完以后，你只需要输入：

```text
/review-api src/routes
```

你复用的不是一句简短别名，而是一整套稳定流程。更多细节可以继续看 [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)。

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
