# 如何在 Claude Code 中创建子代理

这篇指南基于当前官方 Claude Code 模型：通过 `/agents` 管理专项 **子代理**，并以带 YAML frontmatter 的 Markdown 文件形式存放。

---

## 什么是子代理

子代理就是 Claude 可以委派出去的专项角色。

适合用子代理的场景：

- 你想要一个聚焦的专家角色
- 你希望复用一段稳定的系统提示词
- 你希望它有更窄的工具权限
- 你不想让主会话上下文越来越脏

常见例子：

- 代码审查员
- 测试执行者
- 迁移审查员
- 前端构建者
- 发布负责人

如果你的需求本质上是“一个可复用流程”而不是“一个角色”，那更可能应该做成技能，而不是子代理。

---

## 子代理、技能、Hook 怎么选

| 用这个 | 当你需要 |
|---|---|
| 子代理 | 一个带专属 prompt、上下文和可选工具限制的专家角色 |
| 技能 | 一个可反复执行的流程、命令或知识手册 |
| Hook | 一个必须每次都发生的确定性自动化 |

经验法则：

- **角色** -> 子代理
- **流程** -> 技能
- **保证执行** -> Hook

---

## 推荐方式：直接用 `/agents`

Anthropic 当前官方子代理文档明确推荐用 `/agents` 作为主入口。

在 Claude Code 里执行：

```text
/agents
```

然后你可以：

- 创建新子代理
- 选择用户级或项目级作用域
- 编辑系统提示词
- 配置工具权限
- 删除或更新已有子代理

对大多数人来说，这比手改文件更稳，因为界面会把作用域和工具权限讲得更清楚。

---

## 先选对作用域

| 作用域 | 位置 | 适合什么 |
|---|---|---|
| 项目级 | `.claude/agents/` | 某个仓库团队共享的专项角色 |
| 用户级 | `~/.claude/agents/` | 你想在所有项目里复用的个人角色 |

如果同名，项目级优先。

只要子代理里面写了项目架构、目录结构或团队规范，通常就应该是项目级，并提交到 git。

---

## 一步一步创建靠谱的子代理

### 步骤 1：只定义一个清晰职责

不好的定义：

- “负责前端、后端、测试和部署”

好的定义：

- “审查最近改动的代码，关注正确性和可维护性”
- “在关键改动后负责执行测试并协助修复失败项”
- “按设计系统实现 React 界面”

职责越聚焦，越容易触发正确，越容易建立信任。

### 步骤 2：写好 description

`description` 决定 Claude 在什么时候应该使用这个子代理。

好的 description 应该：

- 说清楚它的工作是什么
- 说清楚什么时候该用它
- 说清楚它优化什么目标
- 如果希望更积极自动委派，可以写上 `use proactively`

例子：

```yaml
description: Reviews recent code changes for correctness, security, and maintainability. Use proactively after any meaningful code change.
```

### 步骤 3：只给它真正需要的工具

如果它只是审查代码，可能只需要：

- `Read`
- `Grep`
- `Glob`
- `Bash`

如果它负责改文件，再明确加上编辑工具。

工具越小，安全性越高，行为也越聚焦。

### 步骤 4：在 prompt 里写清项目上下文

一个好的子代理 prompt 至少要包含：

- 它扮演什么角色
- 应该先看什么
- 最重要的标准是什么
- 输出结果应该怎么汇报
- 什么事情不要做

例如：

- 先读 `CLAUDE.md`
- 先看改动文件，再决定是否扩大范围
- 优先保持现有架构模式
- 未经确认不要改部署相关文件

### 步骤 5：同时测试“自动触发”和“显式调用”

一个成熟的子代理，应该既能：

- 被 Claude 自动选中
- 也能被你显式指定

显式调用例子：

```text
Use the code-reviewer subagent to inspect my recent auth changes.
```

如果一直无法自动触发，最常见原因是 description 写得太空泛。

---

## 子代理文件长什么样

虽然推荐用 `/agents` 管理，但理解文件结构仍然很有帮助。

```markdown
---
name: code-reviewer
description: Reviews changed code for correctness, security, and maintainability. Use proactively after meaningful code changes.
tools: Read, Grep, Glob, Bash
---

You are a senior code review specialist for this project.

Always:
1. Read `CLAUDE.md` first if present
2. Check the changed files before broadening scope
3. Look for correctness, security, edge cases, and missing tests
4. Report findings in priority order with file references

Do not make code changes unless explicitly asked.
```

---

## 真正重要的最佳实践

- 先做一个角色，不要一口气做十个
- 项目约定强相关的角色，优先做成项目级
- 职责尽量窄
- description 要具体、可执行
- 工具权限能小就小
- 团队共享的子代理要纳入版本控制
- 用过几轮之后再调整 prompt，不要只靠第一次写出来的版本

---

## 常见错误

### 做一个“万能神代理”

一个什么都想做的超大代理，通常更难触发正确，也更难信任。

### description 写得太虚

如果 description 太泛，Claude 根本不知道何时该委派给它。

### 忘了先写好 `CLAUDE.md`

项目记忆没立住，子代理效果会明显变差。

### 给了太多不必要的工具

一个纯审查角色，没必要默认就拥有编辑或高风险 shell 能力。

---

## 大多数团队最值得先做的几个子代理

如果你不知道该从哪里开始，通常最先有回报的是：

1. `code-reviewer`
2. `test-runner`
3. `frontend-builder` 或 `api-builder`
4. `debugger`

前提是：这些需求已经在真实会话里反复出现。

---

## 下一篇

当角色已经有了，再把这些角色内部反复执行的流程沉淀成技能：

- [HOW_TO_CREATE_SKILLS_CN.md](HOW_TO_CREATE_SKILLS_CN.md)
