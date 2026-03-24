# 如何用 Claude Code 启动一个新项目

这是一套面向真实开发的现代工作流，目标是从空目录走到可实现方案，而不是把 Claude 当成随手乱写代码的脚手架工具。

---

## 目标是什么

对于新项目，Claude Code 最稳的顺序通常是：

1. 先建立记忆
2. 先规划再编辑
3. 先审查规划
4. 分片实现
5. 审查并测试
6. 把知识沉淀下来

本仓库里的工具，就是围绕这条链路设计的。

---

## 步骤 1：创建项目目录并启动 Claude

```bash
mkdir my-project
cd my-project
claude
```

不要一上来就让 Claude 盲目把整个项目脚手架全生成出来。先建立项目记忆。

---

## 步骤 2：执行 `/init`，创建有用的 `CLAUDE.md`

在第一次会话里执行：

```text
/init
```

然后把生成的 `CLAUDE.md` 补充完整，至少写上：

- 计划采用的技术栈，或选型原则
- build/test/lint 命令
- 架构约束
- 命名规范
- 高风险目录
- 第三方依赖与合规说明

对于新项目来说，`CLAUDE.md` 是后续技能、子代理、审查流程共同依赖的稳定中心。

---

## 步骤 3：真正开始写代码前，先用 Plan Mode

新项目最容易犯的错就是过早编码。

如果项目不只是玩具 demo，建议先进入 Plan Mode：

```text
/plan
```

或在 shell 里直接这样启动：

```bash
claude --permission-mode plan
```

在 Plan Mode 里先解决这些问题：

- 这个项目最适合什么技术栈？
- 应该拆成哪些实施阶段？
- 最大的技术风险是什么？
- 第一阶段最小可交付范围是什么？

示例提示词：

```text
我想做一个任务管理 SaaS。请先给我分阶段实施计划、建议技术栈、核心实体模型，
并指出最大的技术风险。
```

---

## 步骤 4：用 Global Doc Master 生成真正的规划文档

方向清楚以后，再调用本仓库里的文档代理：

```text
@global-doc-master 我要做一个任务管理 SaaS。请生成一份规划文档，覆盖需求、
用户流程、数据模型、API、里程碑、测试策略和部署假设。
```

让它把文档写到 `docs/planning/` 下。

规划文档越扎实，后面你反复解释的次数就越少。

建议至少覆盖：

- 产品范围
- 用户流程
- 领域模型
- 核心页面 / 路由 / API
- 测试策略
- 非功能要求
- 明确的 out-of-scope

---

## 步骤 5：开始实现前，先审查规划文档

运行文档审查技能：

```text
/global-review-doc docs/planning/your-project-plan.md
```

重点看：

- 需求是否含糊
- 边界条件是否缺失
- 是否存在危险假设
- 运维/部署细节是否缺位
- 实施路径是否有断层

如果文档不够扎实，可以手动改；也可以直接用修复代理：

```text
@global-doc-fixer docs/planning/your-project-plan.md
```

不要把这一步当可选项。对新项目来说，审查通常省下来的返工时间远大于它花掉的时间。

---

## 步骤 6：决定哪些能力值得做成本地技能或子代理

这一步要等规划稳定后再做。

适合做成 **项目子代理** 的角色，例如：

- frontend-builder
- api-builder
- test-runner
- migration-reviewer

适合做成 **项目技能** 的流程，例如：

- `/review-api`
- `/deploy-preview`
- `/write-release-notes`

对当前的 Claude Code 来说，最稳定的官方入口是：

- 子代理 -> `.claude/agents/` 与 `/agents`
- 技能 -> `.claude/skills/<name>/SKILL.md`

后面继续看这两篇：

- [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)
- [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)

---

## 步骤 7：按小切片实现，保持可审查性

当规划文档达到 READY 后，再开始实现。

好的提示词应该是“可分片”的：

```text
根据 @docs/planning/your-project-plan.md，先实现 user model、认证 schema 和注册接口，
并补上相关测试。
```

```text
根据 @docs/planning/your-project-plan.md，先实现 dashboard 的壳层和 empty state UI，
并把样式 token 集中管理。
```

尽量不要这样：

```text
把整个 app 都做完。
```

分片实现的好处是：

- 更容易审查
- 更容易测试
- 更容易回滚
- 更不容易上下文漂移

同时大量使用 `@file` 引用，把 Claude 锚定到正确文档和目录上。

---

## 步骤 8：有意识地配置权限

实现阶段要明确 Claude 现在可以走多远。

当你发现同类安全操作反复申请授权时，再去用 `/permissions` 调整。

一个健康的做法是：

- 高风险命令保持显式确认
- 常见读/搜命令可以逐步放开
- 常用编辑/测试命令按需要放开
- 除非环境真的足够安全，否则不要一把梭全部绕过权限

---

## 步骤 9：先审查代码，再测试代码

每完成一个有意义的切片后：

### 审查代码

```text
/global-review-code
```

或针对目录：

```text
/global-review-code src/auth/
```

### 执行测试

让 Claude 跑项目里真实存在的命令，而不是想象中的命令：

```text
运行 CLAUDE.md 里定义的 test、lint、build 命令。逐个修复失败项。
```

规划文档告诉 Claude“应该做什么”，测试告诉你“实际上有没有做好”。

---

## 步骤 10：项目变大后，用 Git worktree 安全并行

Anthropic 的工作流文档很明确推荐在并行 Claude 会话里使用 Git worktree。

当项目进入真实开发阶段后，这特别适合：

- 前后端并行推进
- 修 bug 与做功能同时进行
- 长周期重构不阻塞其它任务

示例：

```bash
git worktree add ../my-project-auth -b feature/auth
git worktree add ../my-project-billing -b feature/billing
```

然后分别在不同 worktree 里运行 Claude。

这比把所有任务都塞进一个会话里健康得多。

---

## 步骤 11：边做边沉淀上下文

随着项目演进，要持续把知识写下来。

用 doc master 创建：

- 功能流程文档
- 问题文档
- 已解决文档
- 部署文档
- 调试文档

示例：

```text
@global-doc-master 记录认证流程，从注册到 token refresh。
```

```text
@global-doc-master webhook 重试逻辑有线上问题，请创建 issue doc。
```

这一步，决定了“这一轮 Claude 很好用”能不能升级成“这个项目一直都好用 Claude”。

---

## 总结

```text
1. 启动 Claude                    -> claude
2. 建立项目记忆                   -> /init
3. 编码前先规划                   -> /plan
4. 生成规划文档                   -> @global-doc-master
5. 审查规划文档                   -> /global-review-doc
6. 修到 READY                     -> @global-doc-fixer
7. 增加本地技能/子代理             -> .claude/skills + /agents
8. 分片实现                       -> 小切片提示词 + @file 引用
9. 审查并测试                     -> /global-review-code + 真实命令
10. 用 worktree 并行               -> git worktree
11. 沉淀知识                      -> flow docs + issue docs + resolved docs
```
