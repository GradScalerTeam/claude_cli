# 如何在 Claude CLI 中创建技能

理解什么是技能、它们与代理的区别以及如何创建自己的技能的指南。

---

## 什么是技能？

Claude CLI 中的技能是 Claude 可以使用的专门能力 —— 要么当你用斜杠命令直接调用它，要么当 Claude 决定它相关时自动使用。

把它想象成一个食谱。代理是一个独立工作的厨师。技能是任何厨师都可以遵循的食谱。当你创建技能时，你定义了一个结构化过程 —— 要遵循的步骤、要检查的内容、要产生的输出 —— Claude 在情况需要时执行它。

**简而言之：技能是具有定义过程的可重用能力。你用 `/skill-name` 调用它，它运行结构化工作流。**

---

## 技能 vs 代理 —— 何时使用哪个

| | **代理** | **技能** |
|---|---|---|
| **调用方式** | `@agent-name` | `/skill-name` 或自动 |
| **运行环境** | 主上下文或后台 | 分叉上下文（不影响你的对话） |
| **最适合** | 构建东西 —— 编写代码、创建文件、进行更改 | 分析东西 —— 审查、审计、调查、报告 |
| **输出** | 对代码库的更改 | 结构化报告或分析 |
| **自主性** | 独立工作、做决策 | 遵循定义的过程一步步执行 |
| **示例** | 前端构建器、DB 架构师、测试编写器 | 代码审查器、文档审查器、安全审计器 |

**经验法则**：如果它产生代码或文件 → 代理。如果它产生分析或报告 → 技能。

---

## 技能存在哪里

技能是包含 `SKILL.md` 文件和可选参考文件的文件夹。

- **全局技能** 存在于 `~/.claude/skills/` —— 在每个项目中可用
- **本地技能** 存在于特定项目内的 `.claude/skills/` —— 仅在该项目中可用

```
~/.claude/skills/
└── my-skill/
    ├── SKILL.md              # 主技能定义
    └── references/           # 可选支持文件
        ├── checklist.md
        └── output-format.md
```

---

## 如何调用技能

一旦技能存在，你用斜杠命令调用它：

```
/my-skill-name path/to/target
```

或用自然语言描述你需要什么 —— 如果技能的描述匹配你的请求，Claude 将检测相关技能并自动使用它。

---

## 前提条件

要轻松创建技能，安装 **plugin-dev** 插件，其中包括 skill-development 技能。在 Claude CLI 会话中：

```
/plugin
```

浏览市场并安装 **plugin-dev**。这给你 `/skill-development` 技能，引导你创建技能。

---

## 创建技能

### 步骤 1：决定技能应该做什么

在你输入任何内容之前，要清楚：
- 这个技能执行什么具体过程？
- 它分析或审查什么？
- 过程的阶段或步骤是什么？
- 输出是什么样的？（报告格式、部分、严重性级别）
- 它需要参考文件吗？（检查清单、模板、输出格式）

### 步骤 2：使用 /skill-development

在 Claude CLI 会话中，输入：

```
/skill-development
```

然后详细描述你想让技能做什么。你对过程和输出越具体，技能就越好。

**示例 —— 创建 API 审查技能：**
```
/skill-development

Create a skill called review-api. It should review API endpoints in this project
for consistency, security, and best practices. It should check that every endpoint
has proper input validation with Zod, uses the correct HTTP methods, returns
consistent response formats, has rate limiting where needed, and follows our naming
conventions. The output should be a report grouped by severity — Critical, Important,
and Minor — with exact file:line references for each finding.
```

**示例 —— 创建依赖审计技能：**
```
/skill-development

Create a skill called audit-deps. It should analyze our package.json, check for
outdated dependencies, known vulnerabilities, unused packages, and missing peer
dependencies. It should use context7 to verify that we're using current API patterns
for our major dependencies. The output should list each issue with the package name,
current version, recommended action, and risk level.
```

**示例 —— 创建迁移审查技能：**
```
/skill-development

Create a skill called review-migration. It should review database migrations before
they're run. It should check for destructive operations (dropping columns/tables),
missing indexes on foreign keys, data type changes that might lose data, and
operations that could lock tables for too long in production. Each finding should
include the migration file, the specific operation, the risk, and a recommendation.
```

**示例 —— 创建性能审计技能：**
```
/skill-development

Create a skill called audit-performance. It should analyze code for performance
issues — N+1 queries, missing database indexes, unnecessary re-renders in React
components, large bundle imports, missing lazy loading, synchronous operations that
should be async, and memory leaks from uncleared listeners or intervals. Output
should be a report with estimated impact (High/Medium/Low) and before/after code
examples for each fix.
```

### 步骤 3：审查和完善

技能开发过程将生成：
- 一个带有 YAML 前置内容和完整技能定义的 `SKILL.md` 文件
- 可选参考文件（检查清单、输出模板）

审查它：
- 描述准确描述何时使用此技能吗？
- 所有阶段/步骤都涵盖了吗？
- 输出格式清晰且结构化吗？
- 列出了正确的工具吗？（Read、Grep、Glob 用于分析。Bash 用于 git 命令。）
- 上下文设置为 `fork` 吗？（技能通常应该在分叉上下文中运行）

如果有什么不对，告诉 Claude 调整什么。迭代直到你满意。

### 步骤 4：使用它

一旦技能文件夹创建，你可以立即使用它：

```
/review-api src/routes/
```

```
/audit-deps
```

```
/review-migration prisma/migrations/20240115_add_notifications/
```

```
/audit-performance src/
```

---

## 技能文件结构

作为参考，这是技能定义的样子：

```markdown
---
name: review-api
description: "Reviews API endpoints for consistency, security, and best practices. Use when you want to audit API routes before merging or deploying."
argument-hint: [path-to-api-routes]
context: fork
agent: Plan
allowed-tools: Read, Grep, Glob, Bash(ls/git log/git diff), context7
user-invocable: true
---

# API Review Skill

Review API endpoints for consistency, security, and best practices.

**Target**: `$ARGUMENTS`

## Phase 1: Discover API Structure
- Find all route files
- Map endpoints (method, path, handler)
- Identify middleware chain

## Phase 2: Validation Check
- Every endpoint has input validation?
- Zod schemas match expected request body?
- Query params validated?

## Phase 3: Security Check
- Rate limiting on sensitive endpoints?
- Auth middleware applied correctly?
- No sensitive data in URLs?

## Phase 4: Consistency Check
- Response format consistent across endpoints?
- Status codes correct and consistent?
- Error response format standardized?

## Output Format
[structured report template]
```

你不必手动编写这个 —— `/skill-development` 为你生成它。但理解结构有助于你完善它。

---

## 使用参考文件

技能可以有参考文件，保持主 `SKILL.md` 清晰，同时提供详细的检查清单、输出模板或领域特定检查。

```
my-skill/
├── SKILL.md
└── references/
    ├── output-format.md        # 详细输出模板
    ├── security-checklist.md   # 领域特定检查
    └── framework-patterns.md   # 框架最佳实践
```

在你的 `SKILL.md` 中，像这样引用它们：
```
Follow the output format in `references/output-format.md`.
Apply the security checks in `references/security-checklist.md`.
```

这保持主技能文件专注于过程，而参考文件保存细节。

---

## 提示

- **技能用于分析，代理用于行动** —— 如果你的技能开始想要修改文件，它可能应该是代理
- **清晰定义输出格式** —— 你的输出模板越结构化，技能的报告就越一致和有用
- **使用 `context: fork`** —— 技能应该在分叉上下文中运行，这样它们不会弄乱你的主对话
- **保持主 SKILL.md 专注** —— 把详细检查清单和模板放在参考文件中
- **先广后专** —— 先创建通用审查技能，然后随着你了解项目中什么最重要而创建专门的领域特定技能
- **对于项目特定检查，本地技能 > 全局技能** —— 如果技能检查项目约定，让它成为本地的，这样它知道你的特定模式
