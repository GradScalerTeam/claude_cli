# 如何在 Claude Code 中创建技能

这篇指南会带你从"为什么需要技能"开始，一步一步理解它的设计逻辑，最后自己手写一个。

读完这篇，你应该能回答：
- 技能和 shell alias、子代理、Hook 有什么区别？
- 一个最小技能由哪些部分组成？
- frontmatter 里每个字段控制的是什么行为？

---

## 先想一个问题：你在 Claude 里有没有说过重复的话？

比如你每次审查代码时都会说：

```text
审查 src/routes 下的 API，检查参数校验、鉴权、错误处理和缺失测试，并按严重级别输出。
```

这句话你一周要说很多次。每次都要重新打一遍，或者从别的地方复制过来。

**技能就是为了解决这个问题的。** 你把这段话封装好以后，只需要输入：

```text
/review-api src/routes
```

这里的 `/` 是斜杠（slash）。在 Claude Code 里，所有以 `/` 开头的输入都被当作特殊命令处理 — 你可能已经用过 `/help`、`/clear`、`/compact`，这些就是内置的 slash command（斜杠命令）。技能创建好以后，它会变成一个新的 slash command，名字由你定。所以"slash command"不是什么专业术语，就是"用 `/` 开头触发的命令"。

看起来像缩短了输入，但你实际复用的是一整套东西：

- 固定目标：审查 API
- 固定检查项：校验、鉴权、错误处理、测试
- 固定输出格式：按严重级别列问题
- 可变输入：这次审查哪个目录

这就是技能的本质：**把会重复的脑力劳动固化下来。**

---

## 但是……它和这些东西有什么区别？

新手最容易混淆的是这四种东西：

| 你想解决的问题 | 该用什么 | 为什么不用技能 |
|---|---|---|
| 我总在重复一段长 prompt | **技能** | — |
| 我想要一个有独立人格和工具权限的专家角色 | **子代理** | 技能没有"角色感"，它只是流程 |
| 我想让某件事每次都自动发生，不可跳过 | **Hook** | 技能是可选的，Claude 可能不调用 |
| 我只是想把一个 shell 命令缩短 | **shell alias** | 技能不是给终端用的 |

记住这个区分方式：

- **流程** -> 技能（你反复做的一套步骤）
- **角色** -> 子代理（你想要一个专属专家）
- **保证执行** -> Hook（这件事必须每次都发生，不能漏）

还有一个常见误解：技能不是 shell alias。`/review-api` 不是 `alias review-api="..."` 的缩写。它运行在 Claude 的对话上下文里，能用 Claude 的所有工具（读文件、搜索、写文件等），而且可以带 frontmatter 控制行为。shell alias 做不到这些。

---

## 技能放在哪里

技能文件的位置决定了谁能用它：

| 位置 | 谁能用 | 什么时候放这里 |
|---|---|---|
| `.claude/skills/<name>/SKILL.md`（项目根目录下） | 这个仓库的所有人 | 团队共享的流程，比如 `review-api`、`release-checklist` |
| `~/.claude/skills/<name>/SKILL.md`（家目录下） | 只有你自己 | 你个人的跨项目习惯，比如你自己的笔记格式 |

如果一个同名技能同时存在于两个位置，**项目级的优先**。这和 `CLAUDE.md` 的规则一样：近的覆盖远的。

Claude Code 会自动发现嵌套目录里的 `.claude/skills/`，monorepo 里也能正常工作。

---

## 一个最小技能长什么样

先看一个能跑的例子，然后再拆解它的结构：

```markdown
---
name: explain-code
description: Explains code with analogies and diagrams. Use when teaching how code works.
---

When explaining code:
1. Start with a plain-language summary
2. Use a small diagram when helpful
3. Walk the reader through the control flow
4. Call out one common gotcha
```

把它存成 `.claude/skills/explain-code/SKILL.md`，你就有了一个 `/explain-code` 技能。

### 它的结构是什么

每个技能由两部分组成：

**1. frontmatter**（`---` 之间的部分）

frontmatter 是技能的"配置卡"，放在文件开头的两个 `---` 之间。它告诉 Claude 这个技能叫什么、什么时候该用、有哪些行为限制。上面例子里的 `name` 和 `description` 就是在说：
- `name: explain-code` → 这个技能在 Claude 里用 `/explain-code` 触发
- `description: ...` → 告诉 Claude："当用户在学代码时，这个技能可能有用"

**2. 正文**（`---` 之后的部分）

这是技能真正要做的事。当技能被触发时，这段文字会作为指令注入给 Claude。你可以把它理解成"你每次都要说的那段话，但只写一次"。

### 从手写 prompt 到技能的演变

假设你经常要审查 API 路由。你每次都手动输入：

```text
检查 src/api 下的路由，确认输入校验、鉴权、错误处理和测试是否完整。
```

把它变成技能以后，你只需要：

```text
/review-api src/api
```

对应的 `SKILL.md` 做了两件事：

1. 把"每次都不变的检查标准"固定下来（校验、鉴权、错误处理、测试）
2. 只把"这次要审查哪里"留给参数（`$ARGUMENTS` 会接住你输入的 `src/api`）

---

## 一步一步创建靠谱的技能

下面的 6 个步骤不是"你必须全做"，而是"你在创建技能时应该想清楚的 6 个问题"。简单的技能可能只需要前 3 步。

### 步骤 1：先决定它是自动触发还是手动触发

技能被 Claude 使用有两种方式：

**自动触发（model invocation）：** Claude 读到你的 description 以后，觉得"这个技能跟当前对话相关"，就自己调用它。你不需要输入 `/skill-name`。这和 Claude 自动决定使用 Read 工具或 Grep 工具的机制一样 — 它根据上下文判断该不该用。

**手动触发：** 只有你明确输入 `/skill-name` 时，技能才会执行。Claude 不会主动调用它。

那么问题来了：什么时候该让 Claude 自动调用？

**简单的判断方式：这个技能有副作用吗？**

- **没有副作用**（只是读、分析、给建议）→ 可以自动触发。比如代码风格建议、注释规范这类轻量指导。
- **有副作用**（会改文件、改线上状态、发请求）→ 禁掉自动触发。比如部署、数据库迁移、发布。你不希望 Claude 猜到"你可能要部署"就自动跑起来。

禁掉自动触发的方式：

```yaml
disable-model-invocation: true
```

这里的关键词是 **invocation**，意思是"调用"。`disable-model-invocation` 的字面意思就是"禁止模型自动调用这个技能"。设了 `true` 以后，这个技能只能通过你手动输入 `/skill-name` 来触发。

### 步骤 2：决定它应该在当前上下文运行，还是 fork 出去跑

**先理解一个问题：** Claude 的每个对话都有一个上下文窗口。技能在执行时会占用这个窗口。轻量技能（几句话的指导）不会占多少，但重型技能（要读几十个文件、做复杂分析）可能会挤掉你当前对话里已有的内容。

**`context: fork`** 就是用来解决这个问题的。它的意思是：给这个技能开一个独立的分叉上下文去跑，跑完只把结果带回来。你当前对话的上下文不受影响。

```yaml
context: fork
```

**什么时候用 fork：**
- 技能需要读大量文件
- 技能会跑长时间分析
- 你不想让它占用当前对话的上下文

**什么时候不用 fork：**
- 轻量指导类技能
- 几句话就能完成的事

如果你用了 `context: fork`，还可以用 `agent` 字段指定它在 fork 模式下跑在哪种 agent 类型里（比如 `Explore` 只读型、`Plan` 规划型等）。

### 步骤 3：写好 description

description 是整个 frontmatter 里最重要的字段。它决定了 Claude 会不会在合适的时机自动触发你的技能，也决定了用户在 slash 菜单里能不能一眼看出这个技能是干什么的。

好的 description 要回答三个问题：

1. **这个技能做什么**（动作）
2. **在什么场景下该用**（触发条件）
3. **大概会输出什么**（预期结果）

对比一下：

```yaml
# 太虚 — Claude 不知道什么时候该用它
description: Review code.

# 好一些 — 但没说什么时候该用
description: Reviews code for bugs and style issues.

# 好 — 动作、场景、预期结果都说了
description: Reviews API routes for input validation, auth, error handling, and missing tests. Use when auditing REST endpoints. Outputs findings grouped by severity.
```

**如果你的技能设了自动触发（没有 `disable-model-invocation: true`），但 Claude 从来不自动调用它，问题几乎一定出在 description 上。**

### 步骤 4：复杂技能要拆辅助文件

小技能只需要一个 `SKILL.md` 就够了。但当技能变复杂时，你可以把模板、示例、检查表、脚本拆成辅助文件，放在同一个目录下：

```text
my-skill/
├── SKILL.md
├── template.md
├── examples/
│   └── sample.md
└── scripts/
    └── validate.sh
```

在 `SKILL.md` 的正文里，你可以用相对路径引用这些文件，Claude 能读到它们。

**为什么这比把所有内容塞进一个文件好？** 因为 `SKILL.md` 应该是技能的"入口和流程说明"，不是所有细节的堆砌。模板归模板，示例归示例，各司其职。这也是技能比旧式 `.claude/commands/` 更值得优先采用的原因之一。

### 步骤 5：按需限制工具权限

默认情况下，技能被触发后可以使用 Claude 的所有工具。但很多时候你的技能只需要读和分析，不需要改文件。

这时候可以用 `allowed-tools` 把工具范围收窄：

```yaml
allowed-tools: Read, Grep, Glob
```

这就像给技能设了一个"最小权限"原则。如果它只需要读，就没必要让它能写。这样做的好处是：即使技能的 prompt 被误解或触发条件判断错了，它也不会意外修改你的代码。

如果技能确实需要执行 shell 命令（比如跑测试），再加上 `Bash`：

```yaml
allowed-tools: Read, Grep, Glob, Bash
```

### 步骤 6：测试它能不能被触发

技能创建好以后，应该测两个场景：

**场景 1：手动触发**

直接输入：

```text
/my-skill-name 参数
```

看它能不能正常执行，输出是否符合预期。

**场景 2：自动触发**（如果你没有设 `disable-model-invocation: true`）

用自然语言描述一个应该触发这个技能的场景，比如：

```text
帮我看看 src/api 下的路由有没有问题。
```

如果 Claude 自动调用了你的技能，说明 description 写得够好。如果没有，回去改 description。

---

## frontmatter 字段速查

下面这些是 Claude Code 技能 frontmatter 里目前支持的字段。你不需要全记住，知道有哪些、需要时回来查就行。

| 字段 | 控制什么 | 你什么时候会关心它 |
|---|---|---|
| `name` | 技能名，也是 `/技能名` 里的那个名字 | 每个技能都要写 |
| `description` | 告诉 Claude 这个技能什么时候相关 | 每个技能都要写，写不好 = 自动触发失败 |
| `argument-hint` | 用户输入 `/技能名` 时，后面跟的提示文字，告诉用户"这里应该填什么"。比如写成 `[path-to-routes]`，用户就知道要填一个路径，不是随便写个名字 | 技能需要用户传参数时建议写 |
| `disable-model-invocation` | 设为 `true` 后，Claude 不会自己调用这个技能，只能你手动触发 | 技能有副作用时（部署、迁移等）必须设 |
| `user-invocable` | 控制这个技能是否出现在 `/` 菜单里 | 某些内部技能不想让用户直接看到时 |
| `allowed-tools` | 限制技能只能用哪些工具（比如 `Read, Grep, Glob`，不给 `Write`） | 只需要读和分析的技能，没必要让它能改文件 |
| `model` | 让这个技能跑在跟当前对话不同的模型上（override model） | 简单任务用轻量模型省成本，复杂任务用强模型要精度 |
| `effort` | 控制这个技能花多少"力气"思考（reasoning effort） | 简单任务用低 effort 省 token，复杂分析用高 effort 要深度 |
| `context` | 设为 `fork` 时，技能在独立上下文跑，不挤占当前对话 | 技能比较重、会读大量文件时 |
| `agent` | 配合 `context: fork` 使用，指定跑在哪种子代理上 | 需要特定子代理的工具或行为时 |
| `hooks` | 在技能执行的特定阶段（开始前、结束后）自动触发脚本 | 高级用法，暂时不需要关心 |

---

## 完整例子：一个 API 审查技能

把前面说的所有概念串起来，看一个真实可用的技能：

```markdown
---
name: review-api
description: Reviews API routes for input validation, auth, error handling, and missing tests. Use when auditing REST endpoints. Outputs findings grouped by severity.
argument-hint: [path-to-routes]
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
context: fork
---

Review `$ARGUMENTS` for:
1. input validation
2. auth and authorization
3. error handling consistency
4. response shape consistency
5. missing tests

Output findings by severity with file references.
```

逐行读一下这个 frontmatter，每个字段你都应该能解释了：

- `name: review-api` → 用 `/review-api` 触发
- `description: ...` → 三句话分别说了：做什么、什么时候用、输出什么
- `argument-hint: [path-to-routes]` → 用户输入时看到这个提示，知道要传路径
- `disable-model-invocation: true` → 有副作用，禁掉自动触发
- `allowed-tools: Read, Grep, Glob` → 只需要读和搜索，不需要写
- `context: fork` → 会读很多文件，用独立上下文跑

正文里的 `$ARGUMENTS` 会接住用户输入的参数。比如你输入 `/review-api src/api`，那 `$ARGUMENTS` 就是 `src/api`。

---

## 最常见的错误

### 什么都想做成技能

如果某件事很少发生，先保留成普通 prompt。等它真的重复了再封装。判断标准：**一周内你会不会用到第二次？** 不会的话先别做。

### description 写得太虚

这是自动触发失败的第一大原因。"Review code" 不如 "Reviews API routes for input validation, auth, error handling, and missing tests"。越具体，Claude 越容易判断该不该用它。

### 把所有内容都塞进一个 SKILL.md

复杂技能应该拆辅助文件。SKILL.md 是入口，不是百科全书。

### 把技能和 Hook 搞混

问自己一个问题："这件事可以不执行吗？" 如果可以，用技能。如果不可以（比如"每次写文件后必须跑 prettier"），用 Hook。技能是可选的、由提示词驱动的；Hook 是强制的、由事件驱动的。

---

## 大多数团队最值得先做的 5 个技能

如果你不知道从哪个技能开始，从团队里最常重复的流程选：

1. `review-api` — 审查 API 路由
2. `release-checklist` — 发布前检查清单
3. `triage-bug` — Bug 分类和优先级判断
4. `write-changelog` — 生成变更日志
5. `deploy-preview` — 预览环境部署

**判断方法：看你上周在 Claude 里重复输入最多的是什么，那就是你的第一个技能。**

---

## 下一步

当技能和子代理都有了，接下来要确保你的日常工作流真的把它们用起来：

- [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
- [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)
