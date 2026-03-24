# 如何在 Claude CLI 中创建代理

理解什么是代理、为什么它们很重要以及如何创建自己的代理的指南。

---

## 什么是代理？

Claude CLI 中的代理是为您做特定工作的自主工作者。你描述任务，代理处理它 —— 读取文件、编写代码、运行命令、在需要时向你提问，并产生完整结果。

把代理想象成团队中的专家。你不必每次都向每个人解释整个项目 —— 你雇佣一个已经知道前端的前端开发者、一个已经知道数据库的数据库工程师、一个已经知道测试的 QA 测试员。每个人都有自己的专业知识、工具和方法。这就是代理。

**简而言之：代理是为您完成任务的人。多个代理可以同时运行以更快完成工作。**

当你告诉 Claude "并行运行所有代理" 时，它会同时启动多个代理 —— 一个可能正在编写 API 路由，另一个正在设置数据库，另一个正在构建前端。每个代理独立工作，遵循自己的指令，它们都并行完成项目的各自部分。

---

## 代理存在哪里

代理是带有 YAML 前置内容的 markdown 文件，定义了代理的名称、行为和能力。

- **全局代理** 存在于 `~/.claude/agents/` —— 在每个项目中可用
- **本地代理** 存在于特定项目内的 `.claude/agents/` —— 仅在该项目中可用

本地代理是项目专用的。它们知道你的技术栈、文件夹结构和编码约定。全局代理是通用目的的 —— 它们到处工作。

---

## 如何调用代理

一旦代理存在，你通过输入 `@` 后跟代理名称来调用它：

```
@my-agent-name do this task for me
```

Claude 识别 `@` 提及、加载代理的指令并运行它。

---

## 前提条件

要轻松创建代理，安装 **plugin-dev** 插件，其中包括 agent-development 技能。在 Claude CLI 会话中：

```
/plugin
```

浏览市场并安装 **plugin-dev**。这给你 `/agent-development` 技能，引导你创建代理。

---

## 创建代理

### 步骤 1：决定代理应该做什么

在你输入任何内容之前，要清楚：
- 这个代理处理什么具体任务？
- 它处理代码库的哪些文件或区域？
- 它需要什么工具？（读取文件、编写代码、运行命令、搜索网络）
- 它应该问你问题还是完全自主工作？
- 完成时输出是什么样的？

### 步骤 2：使用 /agent-development

在 Claude CLI 会话中，输入：

```
/agent-development
```

然后详细描述你想让代理做什么。你越具体，代理就越好。

**示例 —— 创建前端代理：**
```
/agent-development

Create an agent called frontend-builder. It should build React components for this
project. It knows we use React with TypeScript, Tailwind CSS for styling, and Zustand
for state management. Components go in src/components/ organized by feature. It
should follow our existing patterns — functional components, custom hooks for logic,
and barrel exports from each feature folder. It should write tests for each component
using Vitest and React Testing Library.
```

**示例 —— 创建数据库代理：**
```
/agent-development

Create an agent called db-architect. It should handle all database work for this
project. We use PostgreSQL with Prisma as the ORM. It should create and update the
Prisma schema, generate migrations, seed data, and write efficient queries. It knows
our naming conventions — snake_case for table names, camelCase for Prisma models.
It should always add proper indexes and handle relationships correctly.
```

**示例 —— 创建测试代理：**
```
/agent-development

Create an agent called test-writer. It should write tests for this project. We use
Jest for unit tests and Supertest for API integration tests. It should read the
existing code, understand what each function and endpoint does, and write thorough
tests covering happy paths, edge cases, and error scenarios. Tests go in __tests__/
folders next to the code they test.
```

**示例 —— 创建文档代理：**
```
/agent-development

Create an agent called api-documenter. It should read our Express API routes and
generate OpenAPI/Swagger documentation. It should trace each route, extract the
request body schema, response format, status codes, and middleware chain, then
produce a complete OpenAPI spec file at docs/api-spec.yaml.
```

### 步骤 3：审查和完善

技能将生成代理定义文件 —— 一个带有 YAML 前置内容和系统提示的 markdown 文件。审查它：

- 名称有意义吗？
- 描述准确吗？（描述告诉 Claude 何时建议使用此代理）
- 系统提示涵盖你想要的所有内容吗？
- 列出了正确的工具吗？
- 模型合适吗？（Sonnet 用于大多数任务，Opus 用于复杂推理）

如果有什么不对，告诉 Claude 调整什么。迭代直到你满意。

### 步骤 4：使用它

一旦代理文件在 `.claude/agents/` 中创建，你可以立即使用它：

```
@frontend-builder create a dashboard page with a sidebar, header, and main content area
```

```
@db-architect add a notifications table with user_id, type, message, read status, and timestamps
```

```
@test-writer write tests for the authentication module in src/auth/
```

---

## 代理文件结构

作为参考，这是代理定义文件的样子：

```markdown
---
name: frontend-builder
description: "Builds React components for this project using TypeScript, Tailwind CSS, and Zustand. Use when you need to create or modify frontend components."
model: sonnet
tools: Read, Write, Edit, Glob, Grep, Bash
---

# Frontend Builder Agent

You are a frontend development agent for [project name].

## Tech Stack
- React with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Vitest + React Testing Library for tests

## Conventions
- Components in src/components/ organized by feature
- Functional components only
- Custom hooks for business logic
- Barrel exports from each feature folder

## Your Job
When asked to build a component or page:
1. Read existing components to understand patterns
2. Create the component following project conventions
3. Write tests for the component
4. Export it from the feature's index file
```

你不必手动编写这个 —— `/agent-development` 为你生成它。但理解结构有助于你完善它。

---

## 提示

- **对约定要具体** —— 你的代理对你的项目模式知道得越多，你以后需要纠正的就越少
- **从一个代理开始，然后添加更多** —— 不要试图一次创建 10 个代理。创建一个、使用它、看看缺少什么，然后创建下一个
- **对于项目工作，本地代理 > 全局代理** —— 本地代理知道你的特定代码库。只在真正适用于所有项目的事情上使用全局代理（如 global doc master）
- **并行运行代理以提高速度** —— 当构建涉及前端、后端和数据库的功能时，同时运行所有三个代理
- **代理可以引用文档** —— 如果你有规划文档或流程文档，在代理的系统提示中提及它们，以便它在工作前阅读它们
