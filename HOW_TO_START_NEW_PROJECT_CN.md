# 如何使用 Claude CLI 开始新项目

一步步指南：使用 Claude CLI 从零开始构建完整项目 —— 从脑中的想法到可运行的代码。

---

## 步骤 1：创建项目文件夹并打开 Claude

为你的项目创建一个文件夹，打开终端，导航到该文件夹，然后启动 Claude：

```bash
mkdir my-project
cd my-project
claude
```

现在你在一个空项目目录中的 Claude Code 会话里。一切从这里开始。

---

## 步骤 2：使用 Global Doc Master 编写规划文档

输入 `@global-doc-master` 并尽可能详细地描述你的项目想法。不要保留 —— 你告诉它的越多，规划文档就会越好。

**在消息中包含什么：**
- 项目是什么，解决什么问题
- 业务逻辑 —— 事物应该如何工作
- 用户会做什么（用户旅程）
- 你想要什么技术栈（或让代理建议一个）
- 你希望文件夹如何结构化
- 任何集成（数据库、API、第三方服务）
- 你有的任何约束或偏好

**示例：**
```
@global-doc-master 我想用 Node.js 和 Express 构建一个任务管理 API。
它应该有使用 JWT 的用户认证，包含任务的项目，任务可以
分配给用户。用户可以创建项目、邀请成员、创建任务、
分配任务并标记完成。我想用 PostgreSQL 和 Prisma 作为 ORM。
文件夹结构应该是基于功能的 —— 每个功能在自己的文件夹中，包含
路由、控制器和服务。我还需要速率限制和输入验证。
```

按回车。代理会：

1. 扫描你的项目（在这种情况下是空的，所以它知道这是全新的）
2. 向你提出 **2-4 轮结构化问题** —— 比如"任务应该有优先级吗？"、"你需要实时通知吗？"、"邀请的认证流程是什么？"
3. **回答每个问题。** 要具体。这些答案塑造整个规划文档。
4. 在 `docs/planning/` 下编写完整的规划文档，包括需求、技术设计、实施阶段、测试策略和风险

完成后，你将在 `docs/planning/` 中拥有项目的详细蓝图。

---

## 步骤 3：审查规划文档

现在使用审查技能在构建任何东西之前彻底检查规划文档。这能发现缺口、遗漏的边缘情况、安全问题和模糊之处。

```
/global-review-doc docs/planning/your-project-plan.md
```

Claude 将运行 9 阶段审查并生成报告，发现按严重性分组 —— 关键、重要和次要。它还会给出裁决：**READY**（就绪）、**REVISE**（修改）或 **REWRITE**（重写）。

仔细阅读审查。它会确切地告诉你缺少什么、什么模糊、什么可能在实施中引起问题。

---

## 步骤 4：修复文档直到可以实施

不要手动审查、修复和重新审查（这通常需要 5-10+ 轮），使用 **Global Doc Fixer** 代理处理整个循环：

```
@global-doc-fixer docs/planning/your-project-plan.md
```

代理会：
1. 在你的文档上运行 `global-review-doc`
2. 自动修复所有事实问题（错误路径、行号、过时引用）
3. 对它无法自行决定的业务逻辑决策向你提出多选题
4. 修复后重新审查，然后重复直到裁决是 **READY**

这通常在 2-4 轮内收敛。代理处理所有事情 —— 你只需要在它需要你输入时偶尔回答问题。

**更喜欢手动控制？** 你仍然可以一步一步做 —— 运行 `/global-review-doc`、阅读发现、自己修复它们、重新审查。但在大多数情况下，文档修复代理更快且能发现更多。

---

## 步骤 5：生成项目专用代理

现在规划文档已经稳固，不要直接跳进编码。相反，使用 **agent-development** 插件创建专为你的特定项目定制的代理。

```
/agent-development
```

这个插件扫描你的规划文档并生成适合你项目的本地代理 —— 例如，数据库设置代理、API 路由代理、测试编写代理等。这些代理存在于你项目的 `.claude/agents/` 文件夹中，并从你的计划中了解确切的架构、技术栈和模式。

为什么这很重要：通用 Claude 很好，但了解你特定项目计划、文件夹结构和技术决策的代理明显更好。它们不需要猜测 —— 它们已经知道蓝图。

---

## 步骤 6：并行运行代理构建项目

一旦你的代理生成，告诉 Claude 运行它们：

```
Run all the project agents in parallel and build the project based on the planning doc
```

Claude 将同时启动多个代理 —— 一个可能正在设置数据库模式，另一个正在构建 API 路由，另一个正在编写中间件。这就是速度的来源。

### 选择你的模式

你有两个选择让 Claude 如何编写代码：

**编辑前询问模式** —— Claude 在进行更改之前向你展示它想写什么并请求批准。如果你想在编写每段代码时审查它，请使用此模式。较慢但给你完全控制。

**自动编辑模式** —— Claude 编写所有代码而不停下来询问。当你信任规划文档稳固并希望快速构建项目时使用此模式。你总是可以在之后审查所有内容。

对于计划良好的项目，自动编辑模式通常没问题。规划文档已经定义了应该构建什么，代理会紧密遵循它。

---

## 步骤 7：审查代码

现在代理已经编写了代码，在运行之前审查它。使用代码审查技能审计构建的内容：

```
/global-review-code src/
```

或审查整个项目：

```
/global-review-code
```

Claude 将运行 12 阶段审计 —— 架构、安全（OWASP + 领域特定）、性能、错误处理、依赖、测试和框架最佳实践。它生成报告，发现按严重性分组：关键、重要和次要。

**如果发现问题：**

对于小修复，只需告诉 Claude 根据审查发现直接修复它们。

对于更大的问题 —— 安全漏洞、架构问题、缺少错误处理 —— 使用 doc master 在修复前正确记录问题：

```
@global-doc-master 有一个安全问题 —— 认证中间件没有正确验证
令牌过期，刷新端点缺少速率限制
```

代理在 `docs/issues/` 下创建问题文档。修复代码，然后告诉 doc master 将其移至已解决：

```
@global-doc-master 认证安全问题已解决 —— 修复了令牌验证并
向刷新端点添加了速率限制
```

这构建了可搜索的问题和修复历史。

---

## 步骤 8：测试项目

一旦代码编写完成，测试它。如何测试取决于你构建了什么：

### 后端项目

要求 Claude 使用终端中的 curl 命令测试 API 端点：

```
Start the server and test all the API endpoints — create a user, log in, create a
project, add a task, assign it, and mark it complete. Use curl commands and show me
the responses.
```

Claude 将启动你的服务器，对每个端点运行 curl 命令，并向你展示结果。如果某事失败，它可以当场调试和修复。

### 前端项目

使用 Playwright 交互式测试 UI：

```
Open the app in the browser using Playwright and test the full user flow — sign up,
log in, create a project, add tasks, and check that all buttons and forms work.
```

Claude 将启动浏览器、导航你的应用、点击按钮、填写表单，并验证一切在视觉上工作。它可以截图并捕获 curl 找不到的 UI bug。

### 全栈项目

两者都做 —— 先用 curl 测试 API，然后用 Playwright 测试前端。

---

## 步骤 9：修复问题并迭代

如果测试揭示 bug 或缺少功能：

1. 向 Claude 描述问题 —— 它会直接修复
2. 对于更大的问题，为修复创建新的规划文档：`@global-doc-master there's a bug where...`
3. 在新文档上运行 `@global-doc-fixer`，然后重建 —— 和之前相同的循环

这是循环：**计划 → 审查 → 构建 → 测试 → 修复 → 重复**。每个循环都让项目更好。

---

## 可选：记录你的功能流程

一旦项目构建并运行，强烈建议要求 doc master 创建 **功能流程文档**。这些追踪每个主要功能如何端到端地通过你的实际代码工作 —— 从用户操作到数据库并返回。

这是可选的但极其有价值。流程文档给你（以及以后在你项目上工作的任何 AI 代理）一个事物如何工作的完整地图。当六个月后某事崩溃时，你不必重新追踪代码 —— 你只需阅读流程文档。

**你可能创建的流程文档示例：**

```
@global-doc-master 记录认证流程 —— 从登录到令牌刷新
到登出，包括中间件和令牌存储
```

```
@global-doc-master 记录用户注册流程 —— 从注册表单提交
到邮箱验证到首次登录
```

```
@global-doc-master 记录支付流程 —— 从结账启动到 Stripe
webhook 到订单确认
```

```
@global-doc-master 记录文件上传流程 —— 从上传按钮到 S3
存储到向用户提供文件
```

```
@global-doc-master 记录实时消息流程 —— 从发送消息
到 WebSocket 传递到已读回执
```

代理读取你的实际代码，追踪每一层（前端组件、API 路由、控制器、服务、数据库查询），并生成带有真实 `file:line` 引用和架构图的流程文档。这些文档存在于 `docs/feature_flow/` 下。

你创建的流程文档越多，任何人 —— 人类或 AI —— 就越容易理解和处理你的代码库。

---

## 推荐：创建工具的本地版本

这是最后一步，也是让你的项目真正自给自足的一步。直到现在，你一直在使用 **全局** doc master 代理和 **全局** 审查技能 —— 它们适用于任何项目但不知道你项目的具体情况。现在你的项目已构建并运行，创建针对你代码库定制的 **本地** 版本。

### 本地 Doc Master 代理

使用 agent-development 插件生成了解你特定项目的 doc master 本地版本：

```
/agent-development

Create a local doc master agent for this project. It should work like the global
doc-master agent but be aware of this project's tech stack, folder structure,
database schema, API patterns, and coding conventions. It should reference the
actual code when writing docs.
```

这会在 `.claude/agents/` 中创建一个项目专用代理，它知道你的路由、你的模型、你的服务 —— 所以当它编写文档时，它引用你的实际代码而不是通用模式。

### 本地审查技能

使用 skill-development 插件创建审查技能的本地版本：

```
/skill-development

Create a local review-doc skill for this project. It should work like the global
global-review-doc skill but be adapted to this project's tech stack, architecture,
and conventions. It should know which files to check, which patterns to verify,
and which security domains are relevant.
```

```
/skill-development

Create a local review-code skill for this project. It should work like the global
global-review-code skill but be tailored to this project's framework, folder structure,
and coding patterns. It should know the project's architecture and check against
the actual conventions used here.
```

### 为什么这很重要

全局工具是通用目的的 —— 它们到处工作但对你特定项目一无所知。本地版本继承相同的审查阶段、输出格式和彻底性，但它们预装了你代码库的知识。它们检查你的实际模式、你的实际路由、你的实际模型。审查更快更准确，因为工具已经知道布局。

这样想：全局工具让你从零到工作项目。本地工具随着项目增长保持项目健康。

---

## 总结

```
1.  创建文件夹，打开 Claude               →  mkdir my-project && cd my-project && claude
2.  编写规划文档                         →  @global-doc-master [描述你的项目]
3.  回答代理的问题                       →  要具体，覆盖边缘情况
4.  审查文档                             →  /global-review-doc docs/planning/your-plan.md
5.  修复直到 READY                       →  @global-doc-fixer 处理审查-修复循环
6.  生成项目专用代理                     →  /agent-development
7.  并行运行代理                         →  告诉 Claude 运行所有代理并构建
8.  审查代码                             →  /global-review-code src/
9.  修复问题（大的用 doc master）        →  @global-doc-master [描述问题]
10. 测试（后端用 curl，前端用 Playwright）
11. 修复问题，重复循环
```
