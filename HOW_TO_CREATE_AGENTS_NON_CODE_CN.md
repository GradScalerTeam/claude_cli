# 如何在 Claude Code 中创建子代理（非写代码版）— 中文版

**Language: 中文 (Chinese)**

这篇指南专门写给**不写代码**的 Claude Code 用户——运营、产品经理、内容创作者、研究者、管理者。

如果你看过 [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)，会发现那些例子全是代码审查、测试执行、前端构建。这篇把同样的核心概念拿过来，换成**你每天真正在做的事**。

---

## 什么是子代理

子代理就是 Claude 可以委派出去的专项角色。

想象你有一个团队：
- 你是老板，负责下指令
- 子代理是你的专家员工，每人只负责一件事

适合用子代理的场景：

- 你想要一个聚焦的专家角色（比如"翻译专家"）
- 你希望复用一段稳定的指令（比如每次翻译都用同一套风格要求）
- 你希望它有更窄的能力范围（比如只读文件，不乱改）
- 你不想让主会话聊乱掉

非写代码的常见例子：

- 内容写手——帮你起草公众号文章、小红书文案
- 翻译官——保持统一术语和风格的翻译
- 文档审查员——检查文档逻辑、格式、一致性
- 研究助理——收集资料、整理摘要
- 数据分析师——读取 CSV/Excel 并给出分析结论
- 项目规划师——帮你拆解任务、排优先级

如果你的需求本质上是"一个可复用流程"而不是"一个角色"，那更可能应该做成技能，而不是子代理。

---

## 子代理、技能、Hook 怎么选

| 用这个 | 当你需要 |
|---|---|
| 子代理 | 一个有独立思考方式、特定视角的专家角色 |
| 技能 | 一个固定流程，比如"每次都用这个模板写周报" |
| Hook | 一个必须每次都自动发生的动作，不可跳过 |

举个例子：

- "帮我用品牌语气写一篇产品介绍" → **子代理**（它需要理解品牌语气、目标受众）
- "每次输入 /weekly-report 就按固定模板生成周报" → **技能**（固定流程）
- "每次对话开始时自动读取我的品牌手册" → **Hook**（自动触发）

---

## 推荐方式：直接用 `/agents`

在 Claude Code 里执行：

```text
/agents
```

然后你可以：

- 创建新子代理
- 选择用户级或项目级作用域
- 编辑系统提示词
- 配置工具权限
- 删除或更新已有子代理

对大多数人来说，这比手改文件更稳，因为界面会把作用域和工具权限讲得更清楚。

---

## 先选对作用域

| 作用域 | 位置 | 适合什么 |
|---|---|---|
| 项目级 | `.claude/agents/` | 某个项目团队共享的专项角色，跟着项目走 |
| 用户级 | `~/.claude/agents/` | 你个人在所有项目里复用的角色，跟着你走 |

如果同名，项目级优先。

简单判断：**这个角色只服务于当前项目吗？** 是的话就用项目级，提交到 git 让团队也能用。

---

## 一步一步创建非写代码的子代理

### 步骤 1：只定义一个清晰职责

不好的定义：

- "负责所有内容相关的事情"

好的定义：

- "审查文档的逻辑连贯性和格式一致性"
- "将英文技术文档翻译成中文，保持术语统一"
- "根据品牌手册的语气要求起草社交媒体文案"

职责越聚焦，越容易触发正确，越容易建立信任。

### 步骤 2：写好 description

`description` 决定 Claude 在什么时候应该使用这个子代理。

好的 description 应该：

- 说清楚它的工作是什么
- 说清楚什么时候该用它
- 说清楚它优化什么目标
- 如果希望更积极自动委派，可以写上 `use proactively`

例子：

```yaml
description: Translates documents from English to Chinese with consistent terminology. Use for any translation task involving project documentation.
```

```yaml
description: Drafts social media posts matching the brand voice defined in the style guide. Use proactively when planning content.
```

### 步骤 3：只给它真正需要的工具

Claude Code 内置工具完整列表：

| 工具 | 用途 | 典型非代码场景 |
|------|------|----------------|
| `Read` | 读取文件（含图片、PDF） | 读文档、读数据表 |
| `Grep` | 按内容搜索（正则） | 在多个文件里找关键词 |
| `Glob` | 按文件名模式搜索 | 找到所有 .md 文件 |
| `Bash` | 执行 shell 命令 | 调用 CLI 工具（见下文） |
| `Edit` | 精确替换文件内容 | 修改文档中的某段话 |
| `Write` | 创建/覆盖文件 | 生成新文档 |
| `WebSearch` | 网络搜索 | 搜索最新资讯 |
| `WebFetch` | 抓取网页内容 | 读取网页全文 |
| `Agent` | 启动子代理 | 委派任务给其他代理 |
| `NotebookEdit` | 编辑 Jupyter notebook | 数据分析 |
| `AskUserQuestion` | 向用户提问 | 确认需求细节 |

非写代码场景下，大多数子代理只需要：

- `Read` — 读取文件内容
- `Grep` — 搜索关键词
- `Glob` — 按名称查找文件
- `Bash` — 执行命令（按需）

如果它需要改文件，再加上 `Edit` 和 `Write`。如果需要上网查资料，加上 `WebSearch` 和 `WebFetch`。

一个只做内容审查的子代理，可能只需要 `Read`、`Grep`、`Glob`——连 `Edit` 都不需要。

工具越小，安全性越高，行为也越聚焦。

### 步骤 4：在 prompt 里写清工作方式

一个好的子代理 prompt 至少要包含：

- 它扮演什么角色
- 应该先看什么文件
- 最重要的标准是什么
- 输出结果应该怎么呈现
- 什么事情不要做

例如——翻译子代理：

```text
你是一位专业技术文档翻译。

Always:
1. 先读取项目根目录的 glossary.md 获取术语对照表
2. 翻译时保持原文的段落结构
3. 技术术语使用 glossary.md 中的统一译法
4. 不确定的地方用 [待确认] 标记

Do not:
- 不要意译，要直译为主
- 不要改变代码块内容
- 不要添加原文没有的段落
```

### 步骤 5：同时测试"自动触发"和"显式调用"

一个成熟的子代理，应该既能：

- 被 Claude 自动选中
- 也能被你显式指定

显式调用例子：

```text
Use the translator agent to translate docs/api-guide.md to Chinese.
```

```text
Use the content-reviewer agent to check my blog draft for logical consistency.
```

如果一直无法自动触发，最常见原因是 description 写得太空泛。

---

## 如何扩展子代理的能力（爬社交媒体、调 API 等）

内置工具只覆盖文件读写和基本搜索。如果你想让子代理爬推特、搜小红书、读 YouTube 字幕——这些都不是内置的。

有三种方式扩展：

### 方式 1：Bash + CLI 工具（最简单）

子代理只要有 `Bash` 权限，就能调用任何命令行工具。

例如安装 [Agent-Reach](https://github.com/Panniantong/Agent-Reach)（一个一键装互联网能力的脚手架）：

```text
帮我安装 Agent Reach：https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md
```

装好后，子代理通过 `Bash` 调用：

| 平台 | 命令 | 能力 |
|------|------|------|
| Twitter/X | `twitter search "关键词"` | 搜索推文、读推文、浏览时间线 |
| Reddit | `rdt search "关键词"` | 搜索帖子、读全文和评论 |
| 小红书 | `xhs search "关键词"` | 搜索笔记、阅读详情、看评论 |
| YouTube/B站 | `yt-dlp --dump-json URL` | 提取字幕和视频信息 |
| 微信公众号 | 通过 Exa 搜索 | 搜索+全文阅读 |
| 微博 | `weibo hot` | 热搜、搜索、用户动态、评论 |

**不需要把这些命令写进 `tools` 字段**——`Bash` 一个就够了。

子代理示例——社交媒体研究助理：

```markdown
---
name: social-researcher
description: 搜索和分析社交媒体内容。Use proactively when user asks about social media trends, product reviews, or public opinion.
tools: Read, Grep, Glob, Bash, WebSearch
---

你是一位社交媒体研究专家。

Always:
1. 根据用户需求选择合适的平台工具：
   - Twitter: twitter search/read/timeline
   - Reddit: rdt search/read
   - 小红书: xhs search/read/comments
   - YouTube/B站: yt-dlp --dump-json
   - 网页: curl https://r.jina.ai/URL
2. 汇总分析，给出结构化结论
3. 标注信息来源

Do not:
- 不要发帖、评论、点赞（只读研究）
- 不要存储用户的 Cookie
```

### 方式 2：MCP 服务器（结构化 API）

MCP（Model Context Protocol）是给 Claude Code 添加外部服务的标准方式。适合需要结构化 API 的场景。

配置命令：

```bash
# 远程 HTTP 服务
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 本地 stdio 服务
claude mcp add --transport stdio firecrawl -- npx -y @mendable/firecrawl-mcp
```

三个作用域：

| 作用域 | 命令参数 | 存储位置 | 适合 |
|--------|---------|---------|------|
| local（默认） | `--scope local` | `~/.claude.json` | 个人临时使用 |
| project | `--scope project` | `.mcp.json`（可提交 git） | 团队共享 |
| user | `--scope user` | `~/.claude.json` | 个人所有项目通用 |

在子代理中引用 MCP 工具：

```yaml
---
name: browser-tester
description: Tests features in a real browser
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
tools: Read, Bash
---
```

注意：MCP 工具名（如 `mcp__playwright__navigate`）**不能**写在 `tools` 字段里，MCP 工具的访问由 `mcpServers` 字段控制。

### 方式 3：Bash + curl/脚本（万能兜底）

任何有 HTTP API 的服务，都可以通过 `Bash` + `curl` 调用：

```text
用 curl 调用这个 API：https://api.example.com/data?key=xxx
```

不需要额外安装，只要有 `Bash` 权限。

### 三种方式怎么选

| 场景 | 推荐方式 | 为什么 |
|------|---------|--------|
| 爬社交媒体、读网页 | Bash + CLI（如 Agent-Reach） | 零配置，装上就能用 |
| 调用结构化 API（数据库、Figma） | MCP 服务器 | 类型安全，有 schema |
| 一次性调 HTTP API | Bash + curl | 不需要额外依赖 |

---

## 子代理文件长什么样

虽然推荐用 `/agents` 管理，但理解文件结构仍然很有帮助。

### 例子 1：翻译官

```markdown
---
name: doc-translator
description: Translates English documents to Chinese with consistent terminology. Use for any document translation task.
tools: Read, Grep, Glob, Edit
---

你是一位专业技术文档翻译。

Always:
1. 先读取 glossary.md 获取术语对照表
2. 保持原文段落结构
3. 使用 glossary.md 中的统一译法
4. 不确定的地方用 [待确认] 标记

Output format:
- 列出所有翻译的术语对照
- 列出所有 [待确认] 的地方
```

### 例子 2：内容审查员

```markdown
---
name: content-reviewer
description: Reviews documents for logical consistency, formatting issues, and readability. Use after drafting any content.
tools: Read, Grep, Glob
---

你是一位内容质量审查专家。

Always:
1. 先通读全文，再给出评价
2. 检查以下维度：
   - 逻辑连贯性：段落之间是否有跳跃
   - 格式一致性：标题层级、列表格式是否统一
   - 可读性：是否有不必要的长句或术语堆砌
   - 事实准确性：关键信息是否准确

Output format:
- 按严重程度排列问题（高/中/低）
- 每个问题标注具体位置
- 给出修改建议，但不要直接修改文件
```

### 例子 3：研究助理

```markdown
---
name: research-assistant
description: Reads and summarizes research materials, extracts key findings. Use when collecting and organizing information.
tools: Read, Grep, Glob, WebSearch, WebFetch
---

你是一位研究助理。

Always:
1. 先了解研究主题和目标
2. 搜索和阅读相关资料
3. 提取关键发现和支撑论据
4. 标注信息来源

Output format:
- 一段核心摘要（不超过 200 字）
- 关键发现列表（标注来源）
- 相关但待深入的问题
```

---

## 真正重要的最佳实践

- 先做一个角色，不要一口气做十个
- 职责尽量窄——"翻译官"比"内容助手"好用得多
- description 要具体、可执行——"将英文翻译成中文"比"处理文本"强一百倍
- 工具权限能小就小——审查角色不需要编辑能力
- 如果角色跟项目绑定（比如用了项目的术语表），做成项目级
- 用过几轮之后再调整 prompt，不要只靠第一次写出来的版本

---

## 常见错误

### 做一个"万能助手"

一个什么都能做的代理，通常什么都做不好。"内容助手"不如拆成"文案写手 + 文档审查 + 翻译官"。

### description 写得太虚

"帮助处理各种内容需求"——这种描述 Claude 根本不知道何时该委派。

### 忘了给它参考材料

翻译官不知道术语表在哪里，审查员不知道格式规范是什么，等于白设。

### 给了太多不必要的工具

一个只做摘要的助理，不需要编辑文件的能力。权限越小，越安全。

---

## 非写代码场景最值得先做的几个子代理

如果你不知道该从哪里开始：

1. **翻译官** — 有跨语言需求的人最先受益
2. **内容审查员** — 发布前自动检查质量
3. **研究助理** — 整理资料、提取要点
4. **文档写手** — 按固定模板和风格起草文档

前提是：这些需求已经在你的日常工作里反复出现。不要为了做而做。

---

## 下一篇

当角色已经有了，再把这些角色内部反复执行的流程沉淀成技能：

- [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)
