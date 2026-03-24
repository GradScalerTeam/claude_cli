# 如何重构已有的粗糙子代理

这篇文档讨论的不是“怎么从 0 创建一个新子代理”，而是：

- 你以前已经做过一些子代理
- 但它们很粗糙、很大、很不稳
- 现在想把它们改造成更可维护、更容易自动触发、更不容易越界的形态

一句话先讲清：

**不要把旧 agent 的 prompt 越写越长。更稳的做法是先拆职责、再缩权限、再把重复流程下沉成技能。**

---

## 先判断：它真的是“子代理问题”吗

很多“粗糙子代理”其实不是 prompt 写得烂，而是对象放错层了。

先把这 4 类东西分清：

| 你真正需要的东西 | 更适合放哪里 |
|---|---|
| 一个带专属 prompt 和边界的专家角色 | 子代理 |
| 一段会反复出现的固定流程 | 技能 |
| 某件事必须每次自动发生 | Hook |
| 长期在线、跨渠道、带定时和记忆的外层助理 | OpenClaw agent |

如果一个旧 agent 同时承担：

- 审查代码
- 跑测试
- 写文档
- 定时检查 inbox
- 跨项目记忆

那它基本已经把 4 类东西混在一起了。这样的 agent 通常不可能稳定。

---

## 旧子代理最常见的 6 个问题

### 1. 一个 agent 想做太多事

典型表现：

- “负责前端、后端、测试、部署、文档”
- “什么任务都可以先交给它”

这类 agent 往往会：

- 自动触发不准
- 输出不稳定
- 越界读写
- 让你越来越不信任它

### 2. `description` 太空

如果 `description` 只写成：

```yaml
description: Helps with development.
```

Claude 几乎不知道什么时候该选它。

### 3. 工具权限过大

明明只是审查角色，却默认给了：

- 编辑权限
- 高风险 shell
- 宽泛目录访问

权限一大，边界就会变模糊。

### 4. prompt 只有身份，没有操作规程

很多旧 agent 只写：

- “你是高级架构师”
- “你是全栈专家”

但没有写清楚：

- 先读什么
- 优先标准是什么
- 输出怎么汇报
- 什么事情不要做

### 5. 本来是流程，却被硬塞进 agent

例如：

- API 审查检查表
- migration 安全检查
- 发布前 checklist

这些更像技能，不像角色。

### 6. 项目级和用户级混在一起

如果 agent 里写了：

- 当前仓库目录结构
- 当前团队规则
- 当前项目命令

那它通常应该是项目级，不适合继续放在全局用户级复用。

---

## 最稳的重构顺序

不要一口气重写十个 agent。按下面顺序收敛更稳。

### 步骤 1：先做清点表

把现有每个 agent 列出来，补一张最小表格：

| 旧 agent 名 | 真正职责 | 触发场景 | 是否需要写文件 | 是否更像流程 |
|---|---|---|---|---|
| `super-helper` | 审查 + 测试 + 文档 | 改完代码后 | 是 | 部分是 |

你要逼自己回答：

- 这个 agent 真正最核心的职责只有哪一个？
- 它最常见的触发时刻是什么？
- 它真的需要写文件吗？
- 这里面有没有一部分应该改成技能？

### 步骤 2：把万能 agent 拆成 2 到 4 个窄角色

大多数仓库最先值得保留的只有这些基础角色：

- `code-reviewer`
- `test-runner`
- `frontend-builder` 或 `api-builder`
- `debugger`

如果文档特别多，再加：

- `doc-writer`

不要先做十个。先做 2 到 4 个高频角色，命中率会更高。

### 步骤 3：重写 `description`

`description` 决定 Claude 什么时候会自动想到它。

好的 `description` 至少要说清：

- 这个角色做什么
- 什么时候该用
- 主要优化什么

不好的例子：

```yaml
description: Helps with coding.
```

更好的例子：

```yaml
description: Reviews changed code for correctness, edge cases, security, and missing tests. Use proactively after meaningful code changes.
```

### 步骤 4：缩小工具权限

先按最小权限原则收窄：

- 只读分析角色：`Read, Grep, Glob, Bash`
- 需要改文件的角色：再额外给编辑工具
- 不需要高风险 shell 的，先不要给

权限越小，行为越聚焦，也越容易建立信任。

### 步骤 5：补“操作规程型 prompt”

一个成熟的 agent prompt，至少要回答这几件事：

- 它扮演什么角色
- 先读什么
- 最重要的标准是什么
- 输出结果怎么汇报
- 什么事情不要做

例如：

- 先读 `CLAUDE.md`
- 先看改动文件，再决定是否扩大范围
- 优先保持现有架构模式
- 未经确认不要改部署相关文件

### 步骤 6：把重复步骤拆成技能

角色负责“谁来做”，技能负责“按什么固定流程做”。

例如：

- `code-reviewer` 是角色
- `/review-api` 是流程
- `/check-migration-safety` 是流程
- `/summarize-diff` 是流程

如果你发现某段检查逻辑每次都要重说，那部分就应该下沉成技能，而不是继续塞进 agent prompt。

### 步骤 7：用真实任务回归测试

每个重构后的 agent，至少要验证：

- 能否被自然语言正确自动触发
- 能否被显式指定稳定调用
- 会不会越界改文件
- 输出格式是否稳定
- 连跑 3 到 5 次后，是否仍然保持聚焦

---

## 一个 before / after 例子

### Before：粗糙的万能 agent

```markdown
---
name: super-helper
description: Helps with frontend, backend, tests, docs, deployments, and debugging.
tools: Read, Grep, Glob, Bash, Edit
---

You are a senior full-stack expert. Help with all engineering tasks.
```

问题很明显：

- 职责太多
- 触发条件太泛
- 权限太大
- 没写读什么、怎么判断、怎么汇报

### After：拆成角色 + 技能

#### 角色 1：`code-reviewer`

```markdown
---
name: code-reviewer
description: Reviews changed code for correctness, security, edge cases, and missing tests. Use proactively after meaningful code changes.
tools: Read, Grep, Glob, Bash
---

You are a code review specialist for this repository.

Always:
1. Read `CLAUDE.md` first if present
2. Check the changed files before broadening scope
3. Look for correctness, regressions, and missing tests
4. Report findings in priority order with file references

Do not make code changes unless explicitly asked.
```

#### 角色 2：`test-runner`

```markdown
---
name: test-runner
description: Runs the project's validation commands after meaningful code changes and helps explain failures.
tools: Read, Grep, Glob, Bash
---

You are responsible for executing the smallest relevant validation commands and reporting failures clearly.

Always:
1. Read `CLAUDE.md` first
2. Prefer the narrowest relevant test command
3. Report failing command, failing area, and likely cause

Do not edit code unless explicitly asked.
```

#### 技能：`/review-api`

把固定检查表下沉成技能：

- 参数校验
- 鉴权
- 错误处理
- 测试覆盖

这样 agent 只负责“该不该做 API 审查”，技能负责“API 审查具体怎么做”。

---

## Claude CLI 子代理 和 OpenClaw agent 不要混层

如果你的旧 agent 其实在做这些事：

- 定时清 inbox
- 长期追踪任务
- 跨渠道接消息
- 维护长期记忆

那它未必应该继续留在 Claude CLI 子代理层。

更合理的分层通常是：

- Claude CLI 子代理：当前仓库里的专项专家
- OpenClaw agent：长期在线的外层助理
- OpenClaw subagent：当前一次运行里临时派出的后台 worker

不要把“仓库专家”和“长期助理脑”混成一层。

---

## 一个可直接执行的重构模板

如果你已经有一批旧 agent，可以直接按这个顺序做：

1. 列出所有旧 agent。
2. 删除最泛的一个“万能总 agent”。
3. 只保留 2 到 4 个最高频角色。
4. 给每个角色只保留一个核心职责。
5. 重写 `description`。
6. 缩小工具权限。
7. 在 prompt 里补“先读什么 / 不要做什么 / 怎么汇报”。
8. 把角色内部重复步骤拆成技能。
9. 用真实任务跑几轮，再继续微调。

---

## 什么时候说明你已经重构成功了

如果出现下面这些变化，说明方向对了：

- Claude 自动选中角色的命中率提高
- 你开始敢信任它的默认行为
- 每个角色的输出风格更稳定
- 越界写文件的情况明显减少
- 新增一个流程时，你更容易想到“做成技能”，而不是继续往 agent prompt 里堆

---

## 继续阅读

- [HOW_TO_CREATE_AGENTS_CN.md](../HOW_TO_CREATE_AGENTS_CN.md)
- [HOW_TO_CREATE_SKILLS_CN.md](../HOW_TO_CREATE_SKILLS_CN.md)
- [HOW_TO_START_ASSISTANT_SYSTEM_CN.md](../HOW_TO_START_ASSISTANT_SYSTEM_CN.md)
- [OPENCLAW_AND_CLAUDE_AGENTS_CN.md](OPENCLAW_AND_CLAUDE_AGENTS_CN.md)
