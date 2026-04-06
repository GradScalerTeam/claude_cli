# 如何用 Claude Code 启动个人助理 / 知识系统项目

这篇教程面向的不是“我要产出一个 App”，而是“我要做一套长期可用的个人助理、反思系统、知识整理系统或个人操作系统”。

这类项目最容易犯的错，不是代码写得不好，而是：

- 上下文边界一开始就混乱
- 什么都想让一个总助理做
- 原始资料、摘要、结论混在一起
- 工作、生活、反思没有分层
- 敏感信息没有明确权限规则

所以更稳的做法不是先堆工具，而是先把系统的读写路径、角色分工、摘要机制和隐私边界定清楚。

---

## 目标是什么

对于个人助理 / 知识系统，Claude Code 最稳的顺序通常是：

1. 先定义边界
2. 先定义读写路径
3. 先定义摘要与索引
4. 再定义子代理和技能
5. 再逐步自动化
6. 持续把原始资料提炼成稳定知识

它更像是在搭一个长期运行的“个人操作系统”，而不是一次性生成一堆文件。

---

## 步骤 1：先决定你要的不是“万能助理”，而是哪一类系统

先回答这几个问题：

- 这个系统主要服务什么：生活管理、工作辅助、学习研究、反思复盘，还是几者组合
- 它默认输出什么语言
- 它能写哪些目录，不能碰哪些目录
- 它读的是原始资料，还是优先读摘要
- 它是一个统一系统，还是工作 / 生活 / 反思分层系统

如果你还没想清楚，我建议先用最稳的默认结构：

1. 工作执行层
2. 生活执行层
3. 反思层

关于为什么这样分层，可以继续看：

- [docs/ASSISTANT_TEAM_PATTERNS_CN.md](docs/ASSISTANT_TEAM_PATTERNS_CN.md)

---

## 步骤 2：创建项目目录，并先搭最小可用结构

```bash
mkdir assistant-os
cd assistant-os
claude
```

一开始不要把目录设计得过度复杂。先有一个清晰、能长期扩展的骨架。

推荐起步结构：

```text
assistant-os/
├── CLAUDE.md
├── inbox/
├── memory/
│   ├── daily/
│   ├── weekly/
│   └── decisions/
├── context/
│   ├── user_profile/
│   ├── manifests/
│   └── protocols/
├── work/
│   └── exported/
├── life/
│   └── exported/
└── reflection/
    ├── journal/
    ├── plans/
    └── weekly-review/
```

这套结构背后的原则是：

- `inbox/` 放未经整理的输入
- `memory/` 放已经沉淀过的日常记忆与决策
- `context/` 放规则、清单、索引、画像、协议
- `work/` 和 `life/` 放两个执行域的摘要输出
- `reflection/` 放跨域汇总、复盘与次日计划

如果你对边界特别敏感，`work/` 和 `life/` 也可以做成独立仓库，让这个项目只读取它们导出的 summary。

---

## 步骤 3：执行 `/init`，但把 `CLAUDE.md` 改写成“系统说明”

先运行：

```text
/init
```

然后不要机械套用“build / test / lint”的程序项目模板。

这类项目里，`CLAUDE.md` 更应该回答这些问题：

- 这是什么系统
- Claude 应该先读哪些文件
- 哪些文件是单一事实来源
- 什么请求要路由给什么子代理
- 思绪、计划、复盘分别写到哪里
- 哪些主题默认高敏感
- 一次输出必须包含哪些字段

推荐至少写这些段落：

- `Project Purpose`
- `Read Order`
- `Source of Truth`
- `Agent Routing`
- `Write Destinations`
- `Privacy Rules`
- `Output Protocol`
- `Update Rules`

你可以有两种写法：

- 系统还小的时候，把长期规则直接写在 `CLAUDE.md`
- 系统变大以后，让 `CLAUDE.md` 继续做入口，再把长期稳定记忆拆到单独的 `MEMORY.md` 或 protocol 文档里

下面这个例子采用第二种写法，也就是 `CLAUDE.md` 负责路由，`MEMORY.md` 负责长期稳定记忆。

示例：

```md
# Project Purpose
- 这是一个个人助理与知识整理系统，默认输出中文
- 目标是帮助我做捕捉、整理、复盘和行动分发

# Read Order
- 当前文件是入口
- 再读 `MEMORY.md`
- 再读 `context/user_profile/profile.md`
- 需要找路径时读 `context/manifests/reference_manifest.md`
- 做复盘时优先读 `work/exported/daily-summary.md` 与 `life/exported/daily-summary.md`

# Source of Truth
- 长期规则以 `MEMORY.md` 为准
- 目录说明以 `context/manifests/reference_manifest.md` 为准
- 协议流程以 `context/protocols/` 下文档为准

# Agent Routing
- 快速捕捉 -> `@thought-recorder`
- 日复盘 -> `@daily-reflection-mentor`
- 周复盘 -> `@weekly-reviewer`
- 研究整理 -> `@knowledge-gardener`

# Write Destinations
- 原始想法写入 `inbox/`
- 每日记录写入 `memory/daily/{YYYY-MM-DD}.md`
- 周复盘写入 `memory/weekly/{YYYY-WW}.md`
- 稳定决策写入 `memory/decisions/`

# Privacy Rules
- 健康、关系、财务默认为高敏感
- 未经确认不对外发送、不发布、不分享
- 不批量改名或清理原始资料

# Output Protocol
- 交接时输出 `State / Alerts / Next Actions / Evidence`
- 复盘时输出 `What Happened / What Matters / What Changed / What To Do Next`

# Update Rules
- 原始记录和提炼结论分开存放
- 只有稳定模式才能写入长期记忆
- 修改协议文档时同步更新 manifest
```

这份 `CLAUDE.md` 的作用，是把系统边界提前讲清楚，减少以后每次都重复解释。

---

## 步骤 4：先做“索引”和“协议”，不要一开始就把全部资料塞给 Claude

知识系统最容易失控的地方，是把太多原始资料直接暴露给主会话。

更稳的做法是先准备两类文件：

1. `reference_manifest.md`
2. 各类 protocol 文档

### `reference_manifest.md` 负责告诉 Claude：

- 哪些目录是做什么的
- 哪些文件是单一事实来源
- 哪些目录只读
- 哪些目录只能追加不能覆盖
- 什么时候该读摘要，什么时候才读原始资料

### protocol 文档负责告诉 Claude：

- inbox 如何清理
- 每日复盘如何生成
- 周复盘如何汇总
- 什么信息能进入长期记忆
- 什么事项应该回流到工作域或生活域

你可以直接用本仓库里的文档代理起草这些文件：

```text
@global-doc-master 为我的 assistant-os 生成一份 reference manifest，
说明各目录职责、优先读取顺序、只读范围、可写范围和单一事实来源。
```

```text
@global-doc-master 为我的 assistant-os 生成 daily review protocol、
weekly review protocol 和 inbox triage protocol。
```

这一步的关键不是“写很多文档”，而是先把系统运行规则写清楚。

如果你想直接从可复制的样板开始，可以看：

- [docs/assistant-os-starter/README_CN.md](docs/assistant-os-starter/README_CN.md)

---

## 步骤 5：自动化之前，先用 Plan Mode 设计三条核心流

对这类项目，最重要的通常不是技术栈，而是流程设计。

建议先用 Plan Mode 设计这三条流：

1. 捕捉流：输入如何进入系统
2. 提炼流：原始记录如何变成摘要、结论、行动项
3. 回流流：反思结果如何回到工作域或生活域

进入 Plan Mode：

```text
/plan
```

适合的提示词：

```text
请根据这个 assistant-os 的目录结构，设计 inbox -> daily summary -> reflection ->
next actions 的工作流，并指出哪些步骤应该人工确认，哪些步骤适合做成技能。
```

```text
请帮我设计“原始想法 -> 结构化笔记 -> 长期记忆”的提炼规则，
重点避免把短期情绪误写成长期结论。
```

这一步能帮你避免过早做出错误自动化。

---

## 步骤 6：子代理按“领域职责”创建，不按“什么都能做”创建

等协议稳定后，再考虑加子代理。

这类项目里比较常见的子代理有：

- `thought-recorder`：把输入快速整理进正确目录
- `inbox-triager`：给 `inbox/` 做分类、去重、路由建议
- `daily-reflection-mentor`：做日复盘、提取重点
- `weekly-reviewer`：周维度汇总模式与风险
- `knowledge-gardener`：把分散材料整理成结构化知识
- `travel-assistant`：旅行、出行、行程安排等专题事务

创建原则是：

- 每个子代理只负责一类任务
- 每个子代理的可写范围尽量明确
- 反思类子代理尽量先读摘要，不直接扫全量原始资料
- 不要一开始就做一个能读遍所有目录的超级总助理

如果你还没开始做子代理，先看：

- [HOW_TO_CREATE_AGENTS_CN.md](HOW_TO_CREATE_AGENTS_CN.md)

---

## 步骤 7：重复流程优先做成技能，而不是长期依赖一大段 prompt

个人助理 / 知识系统里，最值得沉淀的往往不是角色，而是流程。

典型适合做成技能的流程：

- `/capture-thought`
- `/triage-inbox`
- `/daily-review`
- `/weekly-review`
- `/summarize-reading`
- `/convert-notes-to-actions`

技能特别适合这种“输入固定、步骤重复、输出格式明确”的任务。

比如一个 `daily-review` 技能，通常可以固定：

- 先读哪些 summary
- 再读哪些未完成事项
- 输出用什么模板
- 写到哪个目录
- 哪些情况下只给建议、不直接改文件

如果你准备做技能，继续看：

- [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)

---

## 步骤 8：把隐私边界写成规则，而不是留给临场判断

这类项目里，高风险通常不是“代码删错了”，而是“边界混了”。

建议尽早明确这些规则：

- 健康、关系、财务默认高敏感
- 对外发送、发帖、分享、同步必须先确认
- 原始日记、原始聊天摘录、原始想法优先只追加，不批量重写
- 反思层默认优先读摘要，不直接读取全部原始资料
- 跨工作 / 生活域的写入动作要谨慎，最好先写建议再人工决定

你也可以把这些约束写进：

- `CLAUDE.md`
- 各子代理提示词
- 技能里的 protocol

不要假设“模型会自己知道什么该谨慎”。边界最好显式写出来。

---

## 步骤 9：先建立稳定的日常运行节奏，再考虑复杂自动化

一个健康的默认节奏通常是：

### 白天

- 零散输入先进入 `inbox/`
- 临时想法先记录，不急着提炼
- 明确任务再路由到工作域或生活域

### 晚上

- 跑一次 `daily-review`
- 生成当日摘要
- 提取次日行动项
- 发现真正稳定的规律后，再更新长期记忆

### 每周

- 跑一次 `weekly-review`
- 对比工作与生活两边的未闭环事项
- 看哪些问题在重复出现
- 生成下周优先级建议

示例提示词：

```text
读取今天的 inbox、工作摘要、生活摘要和未完成事项，帮我做一次日复盘。
请输出 What Happened / What Matters / Risks / Next Actions，并把结果写入今天的 daily 文件。
```

```text
根据本周 daily 文件，做一次 weekly review。
请特别指出重复拖延、边界冲突和下周应该删掉的低价值承诺。
```

先把节奏跑顺，再去考虑更复杂的 Hook、MCP 或自动触发。

---

## 步骤 10：让知识不断“上浮”，不要让系统永远停留在收纳层

如果系统只会囤积输入，它迟早会变成杂物间。

你需要持续做三种提炼：

1. 原始输入 -> 摘要
2. 摘要 -> 结论
3. 结论 -> 长期规则 / 决策 / 清单

推荐的沉淀方式：

- 每天的结果进入 `memory/daily/`
- 周级模式进入 `memory/weekly/`
- 稳定的做事规则进入 `MEMORY.md`
- 重要的长期判断进入 `memory/decisions/`
- 目录说明和协议变化同步更新到 `context/manifests/` 与 `context/protocols/`

判断“能不能写入长期记忆”的一个简单标准是：

- 它不是一次性情绪
- 它不是今天才成立的偶然结论
- 它对未来多次决策都有帮助

---

## 步骤 11：系统变大后，优先拆层或拆仓库，不要继续扩总上下文

当你开始感觉“Claude 什么都能看，但越来越不稳”时，通常不是模型变差了，而是系统边界该升级了。

常见升级方式有两种：

### 方式 A：同仓库分层

- `work/`
- `life/`
- `reflection/`

通过 summary 和 protocol 控制访问范围。

### 方式 B：多仓库强隔离

- `work-assistant/`
- `life-assistant/`
- `reflection-os/`

其中 `reflection-os/` 只读取前两者导出的摘要文件。

如果你已经进入这一步，推荐回看：

- [docs/ASSISTANT_TEAM_PATTERNS_CN.md](docs/ASSISTANT_TEAM_PATTERNS_CN.md)

---

## 一个最小可行的起步方案

如果你不想一开始就设计太多，可以直接先做这个版本：

1. 建一个 `assistant-os/`
2. 写好 `CLAUDE.md`
3. 建 `inbox/`、`memory/daily/`、`context/manifests/`
4. 先做一个 `daily review protocol`
5. 先做一个 `daily-reflection-mentor`
6. 连续用 7 天
7. 再决定要不要拆工作 / 生活域
8. 再决定要不要补 `weekly-review` 技能

这是最容易真正跑起来，而不是停留在“系统设计很漂亮”的版本。

---

## 总结

```text
1. 定义系统边界                  -> 工作 / 生活 / 反思是否分层
2. 建最小目录骨架                -> inbox + memory + context
3. 改写 CLAUDE.md                -> 读写规则、路由、隐私、输出协议
4. 先写 manifest 和 protocol     -> 索引清楚、流程清楚
5. 用 Plan Mode 设计核心流       -> 捕捉流 / 提炼流 / 回流流
6. 用子代理承载领域职责          -> capture / reflection / knowledge
7. 用技能承载重复流程            -> daily review / inbox triage
8. 显式写出隐私边界              -> 高敏感、只读、确认规则
9. 先跑稳定节奏                  -> 日复盘、周复盘、行动回流
10. 持续提炼长期知识             -> summary -> decisions -> memory
11. 系统变大后及时拆层           -> summary 驱动，而不是全量开放
```

一句话理解：程序项目的重点是“怎么 build / test”；个人助理 / 知识系统项目的重点是“先读什么、写到哪、怎么分工、怎么提炼、哪些边界不能破”。
