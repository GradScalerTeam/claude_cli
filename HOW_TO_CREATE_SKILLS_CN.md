# 如何在 Claude Code 中创建技能

这篇指南基于当前 Claude Code 的技能模型：在 `.claude/skills/<skill-name>/` 或 `~/.claude/skills/<skill-name>/` 里放一个 `SKILL.md`，并按需要添加辅助文件。

---

## 什么是技能

技能是 Claude 可以自动调用、也可以让你手动通过 `/skill-name` 触发的可复用能力。

技能最适合这些场景：

- 某个流程会重复出现
- 你想做一个可复用的 slash command
- 某类任务需要结构化说明
- 你希望这个能力附带模板、示例、检查表等辅助文件

Anthropic 当前的技能文档也明确说明：旧的自定义 commands 能力，已经基本并入技能体系。`.claude/commands/` 还兼容，但技能是更现代、能力更完整的方式。

---

## 技能、子代理、Hook 怎么选

| 用这个 | 当你需要 |
|---|---|
| 技能 | 一个可重复执行的流程、命令或结构化提示词 |
| 子代理 | 一个有专属 prompt 和可选工具限制的专家角色 |
| Hook | 一个必须每次都执行的确定性自动化 |

经验法则：

- **流程** -> 技能
- **角色** -> 子代理
- **保证执行** -> Hook

---

## 技能放在哪里

| 作用域 | 位置 | 适合什么 |
|---|---|---|
| 项目级 | `.claude/skills/<name>/SKILL.md` | 某个仓库团队共享的技能 |
| 个人级 | `~/.claude/skills/<name>/SKILL.md` | 你跨项目复用的个人技能 |

Claude Code 还会自动发现嵌套目录里的 `.claude/skills/`，所以在 monorepo 里也很好用。

---

## 一个最小技能长什么样

示例：

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

这已经会生成一个 `/explain-code` 技能。

---

## 一步一步创建靠谱的技能

### 步骤 1：先决定它是自动触发还是手动触发

如果它是轻量知识或通用模式，自动触发可能有帮助。

如果它是部署、迁移、发布这类需要明确人为触发的流程，建议设为手动：

```yaml
disable-model-invocation: true
```

### 步骤 2：决定它应该在当前上下文运行，还是 fork 出去跑

轻量指导类技能可以直接 inline。

较重的流程建议使用 forked context：

```yaml
context: fork
```

必要时还可以指定它运行在哪种 agent 类型里。

### 步骤 3：写好 description

description 决定 Claude 什么时候会觉得“这个技能相关”。

好的 description 要能说明：

- 这个技能做什么
- 在什么场景下该用
- 大概会输出什么样的结果

### 步骤 4：复杂技能要拆辅助文件

技能可以附带：

- 模板
- 示例
- 检查表
- 脚本
- 参考文档

结构示例：

```text
my-skill/
├── SKILL.md
├── template.md
├── examples/
│   └── sample.md
└── scripts/
    └── validate.sh
```

这也是为什么技能比旧式 custom command 更值得优先采用。

### 步骤 5：按需限制工具权限

如果技能只需要读和分析，就把工具范围收窄：

```yaml
allowed-tools: Read, Grep, Glob
```

如果需要 shell，再明确写出来。

### 步骤 6：同时测试自动触发和手动调用

先用自然语言试一遍自动触发。

再直接手动调用：

```text
/my-skill-name args
```

如果它一直不自动触发，通常是 description 写得太虚。

---

## 最值得先知道的 frontmatter 字段

下面这些是 Anthropic 当前技能文档里最实用的字段：

| 字段 | 作用 |
|---|---|
| `name` | 技能名，也是 slash command 名 |
| `description` | 告诉 Claude 什么时候应该用它 |
| `argument-hint` | 自动补全时显示参数提示 |
| `disable-model-invocation` | 禁止自动触发 |
| `user-invocable` | 控制是否在 slash 菜单里显示 |
| `allowed-tools` | 收窄工具权限 |
| `model` | 技能运行时覆盖模型 |
| `effort` | 覆盖推理深度 |
| `context` | 设为 `fork` 时在分叉上下文执行 |
| `agent` | 在 fork 模式下指定 agent 类型 |
| `hooks` | 给技能生命周期挂钩子 |

---

## 例子：一个手动 API 审查技能

```markdown
---
name: review-api
description: Reviews API routes for consistency, validation, and security.
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

这类项目技能的优点是：可复用、可审查、显式清晰。

---

## 真正重要的最佳实践

- 从一个已经反复让你痛苦的流程开始
- 优先用技能替代“超长一次性 prompt”
- 用辅助文件，不要把 `SKILL.md` 塞到爆
- 明确它是自动触发还是手动触发
- 较重流程优先 `context: fork`
- 项目技能提交到仓库
- 个人习惯放 `~/.claude/skills/`

---

## 常见错误

### 什么都想做成技能

如果某件事很少发生，就先保留成普通 prompt，等它真的重复了再封装。

### description 写得太空

这样 Claude 就不知道什么时候该触发它。

### 把所有内容都塞进一个 `SKILL.md`

复杂技能本来就应该拆辅助文件。

### 把技能和 Hook 搞混

技能是可选、由提示词驱动的；Hook 是确定性、由事件驱动的。

---

## 大多数团队最值得先做的技能

1. `review-api`
2. `release-checklist`
3. `triage-bug`
4. `write-changelog`
5. `deploy-preview`

从团队里最常重复的那个流程开始做，收益最大。

---

## 下一步

当技能和子代理都有了，接下来要确保你的日常工作流真的把它们用起来：

- [HOW_TO_START_EXISTING_PROJECT_CN.md](HOW_TO_START_EXISTING_PROJECT_CN.md)
- [HOW_TO_START_NEW_PROJECT_CN.md](HOW_TO_START_NEW_PROJECT_CN.md)
