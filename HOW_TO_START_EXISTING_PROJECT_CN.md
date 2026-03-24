# 如何在现有项目中使用 Claude CLI

一步步指南：将 Claude CLI 引入你已经在做的项目 —— 让 Claude 理解你的代码库并有效地处理它。

---

## 步骤 1：在项目中打开 Claude

导航到你现有的项目目录并启动 Claude：

```bash
cd my-existing-project
claude
```

Claude 现在在你的项目内运行。它可以读取每个文件、理解你的文件夹结构、查看你的 git 历史。但它还没有对事物如何工作的结构化理解 —— 这正是接下来的步骤要解决的。

---

## 步骤 2：创建功能流程文档

对现有项目要做的第一件事是 **记录它如何工作**。使用 global doc master 为你代码库中的每个主要功能创建功能流程文档。这些文档追踪每个功能如何端到端地通过你的实际代码工作 —— 从用户操作到数据库并返回。

这是最重要的一步。流程文档给 Claude（以及任何未来的代理）一个你代码库的结构化地图。没有它们，Claude 每次你要求它做某事时都必须重新读取和重新追踪代码。有了它们，它已经知道一切如何连接。

**从你的核心功能开始：**

```
@global-doc-master 记录认证流程 —— 从登录到令牌刷新
到登出，包括中间件和令牌存储
```

```
@global-doc-master 记录用户注册流程 —— 从注册表单到邮箱
验证到首次登录
```

```
@global-doc-master 记录数据库模式 —— 所有模型、关系、索引
和迁移历史
```

```
@global-doc-master 记录 API 结构 —— 所有端点、中间件链、
请求验证和响应格式
```

```
@global-doc-master 记录前端路由和状态管理 —— 页面如何
组织、状态如何流动、组件如何通信
```

代理读取你的实际代码、追踪每一层，并在 `docs/feature_flow/` 下生成带有真实 `file:line` 引用的流程文档。为每个主要功能这样做 —— 你记录的越多，Claude 就越了解你的项目。

---

## 步骤 3：审查代码并记录问题

现在代码库已记录，审查实际代码以发现现有问题。在你的项目上运行代码审查技能：

```
/global-review-code
```

或审查特定区域：

```
/global-review-code src/auth/
/global-review-code src/api/
/global-review-code src/components/
```

Claude 将运行 12 阶段审计 —— 架构、安全、性能、错误处理、依赖、测试和框架最佳实践。它生成报告，发现按严重性分组。

**对于每个重要发现**，使用 doc master 创建问题文档：

```
@global-doc-master 有一个安全问题 —— 搜索端点的用户输入
没有清理，登录路由没有速率限制
```

```
@global-doc-master 有一个性能问题 —— 仪表板页面进行 12 个单独的
API 调用，可以批量处理，产品列表有 N+1 查询问题
```

这在 `docs/issues/` 下创建结构化问题文档。你现在有一个清晰的待办事项列表，包含根因分析和推荐修复 —— 全部已记录。

当你修复每个问题时，告诉 doc master 将其移至已解决：

```
@global-doc-master 搜索清理问题已解决 —— 添加了使用 Zod 的输入验证
和使用 express-rate-limit 的速率限制
```

这在 `docs/resolved/` 下构建可搜索的历史。

---

## 步骤 4：为你的项目创建本地工具

现在 Claude 通过流程文档和代码审查理解了你的代码库，创建针对你特定项目定制的工具本地版本。

### 本地 Doc Master 代理

使用 agent-development 插件生成本地 doc master：

```
/agent-development

Create a local doc master agent for this project. It should work like the global
doc-master agent but be aware of this project's tech stack, folder structure,
database schema, API patterns, and coding conventions. Refer to the feature flow
docs in docs/feature_flow/ and the existing code to understand the project.
```

这会在 `.claude/agents/` 中创建一个项目专用代理，它知道你的路由、模型、服务和约定 —— 所以它从现在开始编写的每个文档都准确地引用你的实际代码。

### 本地审查技能

使用 skill-development 插件创建两个审查技能的本地版本：

```
/skill-development

Create a local review-doc skill for this project. It should work like the global
global-review-doc skill but be adapted to this project's tech stack, architecture,
and conventions. Refer to the existing code and flow docs to understand what patterns
and security domains are relevant.
```

```
/skill-development

Create a local review-code skill for this project. It should work like the global
global-review-code skill but be tailored to this project's framework, folder structure,
and coding patterns. It should know the project's architecture and check against
the actual conventions used here.
```

从现在开始，使用 **本地** 工具而不是全局工具。它们产生更快、更准确的结果，因为它们已经知道你的项目。

---

## 推荐：创建开发代理

现在 Claude 完全理解了你的代码库，创建帮助你开发新功能的专用代理。使用 agent-development 插件基于你的实际代码结构生成代理：

```
/agent-development

Look at this project's codebase and create development agents that will help build
new features. Create agents based on what the project actually needs — for example
a frontend agent, a backend agent, a database agent, a testing agent, etc. Each
agent should understand the project's patterns and conventions.
```

插件扫描你的代码并生成适合你项目的代理。例如：

- **前端代理** —— 知道你的组件结构、状态管理、样式模式和路由
- **后端代理** —— 知道你的 API 模式、中间件链、服务层和数据库查询
- **数据库代理** —— 知道你的模式、迁移、ORM 模式和查询优化
- **测试代理** —— 知道你的测试框架、夹具、模拟模式和覆盖率缺口

这些代理存在于 `.claude/agents/` 中，随时可以在你需要构建新东西时使用。当你开始一个新功能时，不用从头解释你项目的约定，你只需告诉相关代理要构建什么，它已经知道怎么做。

---

## 持续工作流

一旦你的现有项目设置了 Claude CLI，日常工作流与新项目相同：

1. **新功能？** → 使用本地 doc master 创建规划文档、运行 `@global-doc-fixer` 审查并修复直到 READY，然后构建
2. **发现 bug？** → 使用本地 doc master 创建问题文档、修复它、移至已解决
3. **代码更改？** → 使用本地 review-code 技能在合并前审计
4. **功能发布？** → 使用本地 doc master 创建或更新流程文档

区别在于一切都更快，因为你的本地工具已经知道项目。

---

## 总结

```
1. 在项目中打开 Claude                  →  cd my-project && claude
2. 创建功能流程文档                     →  @global-doc-master document [每个功能]
3. 审查代码                             →  /global-review-code
4. 记录发现的问题                       →  @global-doc-master [描述每个问题]
5. 创建本地 doc master 代理             →  /agent-development
6. 创建本地审查技能                     →  /skill-development (review-doc + review-code)
7. 创建开发代理                         →  /agent-development (frontend, backend, 等)
8. 对所有未来工作使用本地工具
```
