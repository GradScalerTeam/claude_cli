# 如何在现有项目里使用 Claude Code

这是一套把 Claude Code 稳定接入真实代码库的工作流，目标不是“让 Claude 自己去看仓库”，而是避免它每天都重新摸索同样的上下文、踩同样的坑。

---

## 核心思路

现有项目已经有历史包袱、约定、潜在 bug、没写清楚的流程，以及运维层面的雷区。

所以真正要做的不是“让 Claude 把仓库读一遍”，而是：

1. 固化项目的长期上下文
2. 把关键流程画清楚
3. 审查风险区和技术债
4. 只在真正有收益的地方创建本地工具
5. 让文档和记忆持续跟着代码更新

---

## 步骤 1：从真实项目根目录启动 Claude

```bash
cd my-existing-project
claude
```

如果是 monorepo，除非你明确只想做某个包的会话，否则优先从根目录启动。

---

## 步骤 2：尽早建立项目记忆

先执行：

```text
/init
```

然后把 `CLAUDE.md` 真正写成一份能给人看、也能给 Claude 用的项目说明。

建议补上：

- build、test、lint、format 命令
- 服务边界与模块划分
- 包结构 / 应用结构
- 环境与密钥注意事项
- 高风险目录
- 关键外部依赖
- 发布流程说明

如果你已经有高质量文档，优先在 `CLAUDE.md` 里导入它们，而不是整段重复抄写。

---

## 步骤 3：先让 Claude 做只读地图，不要急着改代码

在让 Claude 动手之前，先让它解释项目。

适合开局的提示词：

```text
先给我一个这个仓库的高层架构概览。
```

```text
哪些目录风险最高，不应该轻易修改？
```

```text
这里真实可用的 build、test、lint、dev 命令分别是什么？
```

如果仓库大、历史复杂，建议直接进 Plan Mode：

```text
/plan
```

这能让 Claude 在不改文件的前提下，先把上下文摸清楚。

---

## 步骤 4：为关键流程创建 feature flow 文档

接下来，用本仓库里的文档代理把系统真正重要的流程记录下来。

例如：

```text
@global-doc-master 记录认证流程，从登录到 token refresh。
```

```text
@global-doc-master 记录 checkout 流程，从购物车到支付确认。
```

```text
@global-doc-master 记录发票生成的后台任务流水线。
```

优先记录那些：

- 对线上稳定性影响大
- 变更频率高
- 新人最难快速看懂

好的 flow doc，能让 Claude 不需要每次都从头追整条代码路径。

---

## 步骤 5：审查代码库里的风险与技术债

关键流程文档有了之后，再审查真实代码：

```text
/global-review-code
```

也可以针对热点区域：

```text
/global-review-code apps/web/
/global-review-code packages/api/
/global-review-code src/auth/
```

如果某个问题值得长期追踪，就不要让它只留在聊天记录里，直接生成结构化 issue doc：

```text
@global-doc-master 认证流程里有安全问题，请创建 issue doc。
```

```text
@global-doc-master dashboard 查询链路有性能问题，请创建 issue doc。
```

这样你得到的是一个可搜索、可追踪的问题库，而不是一次性的对话输出。

---

## 步骤 6：根据真实情况再逐步放开权限

第一天不要急着把权限开太大。

更稳的做法是：

1. 先观察哪些授权请求反复出现
2. 用 `/permissions` 放开那些安全且高频的操作
3. 对生产敏感命令继续保留确认
4. 随着熟悉度提升再逐步调整

Claude 在授权噪音降低后会更顺手，但前提是你已经知道项目的风险边界在哪里。

---

## 步骤 7：只有在模式稳定后，才创建本地子代理

如果项目反复需要同样的“专家角色”，再用 `/agents` 创建项目级子代理。

常见候选：

- frontend-agent
- backend-agent
- db-agent
- test-agent
- release-agent

这些应该放在 `.claude/agents/` 里，让整个团队都能共享。

不要一开始就造十个代理。先从一两个真正能节省重复沟通的角色开始。

---

## 步骤 8：把重复流程沉淀成本地技能

如果你发现某种流程不断重复，就该把它做成技能。

典型例子：

- `/review-api`
- `/release-checklist`
- `/migrate-config`
- `/triage-bug`

项目级技能放在 `.claude/skills/`，并让它们紧贴项目里的真实约定。

和一次性 prompt 相比，技能让团队拥有可复用、可审查、可演进的流程定义。

---

## 步骤 9：大量使用 `@file` 与记忆，保持上下文收敛

在现有项目里，上下文膨胀是隐形杀手。

尽量写这种提示词：

```text
更新 @src/auth/login.ts 里的校验逻辑，并确认它仍然符合
@docs/feature_flow/authentication.md 的约束。
```

而不是：

```text
把认证相关的东西修一下。
```

`@file` 引用、`CLAUDE.md` 和记录下来的 flow docs 一起使用，才能让 Claude 始终站在正确的上下文里工作。

---

## 步骤 10：高风险并行工作优先用 Git worktree

Anthropic 的工作流文档很明确推荐在并行 Claude 会话中使用 Git worktree。

在现有项目里，这更重要，因为你经常需要：

- 一边修线上 bug，一边推进功能开发
- 比较两条不同的解决方案
- 隔离一个风险较高的迁移任务

示例：

```bash
git worktree add ../project-hotfix -b hotfix/auth-timeout
git worktree add ../project-refactor -b refactor/session-model
```

分别在不同 worktree 里启动 Claude，而不是把所有事情混进同一个分支和同一个会话。

---

## 步骤 11：让文档和记忆持续活着

现有项目最怕的不是没文档，而是文档失效。

继续用 doc master 维护：

- feature flow docs
- issue docs
- resolved docs
- deployment docs
- debug docs

示例：

```text
@global-doc-master 更新支付流程文档，补上新的重试逻辑。
```

```text
@global-doc-master webhook 重复消费问题已修复，请移到 resolved。
```

这一步决定了 Claude 是“这次会话很好用”，还是“这个项目长期都很好用”。

---

## 总结

```text
1. 在仓库里启动 Claude             -> claude
2. 建立长期项目记忆                 -> /init + CLAUDE.md
3. 先安全摸清代码库                 -> 概览提示词 + /plan
4. 记录关键流程                     -> @global-doc-master
5. 审查风险区域                     -> /global-review-code
6. 把重要问题做成 issue docs        -> issue docs
7. 用子代理承载专项角色             -> /agents
8. 用技能承载重复流程               -> .claude/skills
9. 用文档和 @file 把上下文钉牢       -> @file + docs + memory
10. 用 worktree 安全并行             -> git worktree
11. 持续更新文档                    -> flow docs + resolved docs
```
