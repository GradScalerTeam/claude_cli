# 默认语言设置指南

## GitHub 仓库级别设置

GitHub 不支持直接通过文件设置默认语言，但可以通过以下方式优化中文用户体验：

### 1. 仓库描述优化（已设置）
- 当前描述已包含中文说明
- 建议在描述开头添加 `[中文/EN]` 标识

### 2. 当前仓库状态

这个仓库当前已经采用：

- 默认首页：[`../README.md`](../README.md)（中文）
- 英文入口：[`../README_EN.md`](../README_EN.md)

这种做法对中文读者最直接，同时保留英文版本给国际用户。

### 3. 解决方案

#### 方案 A：保持当前做法

继续让中文内容放在 [`../README.md`](../README.md)，并在顶部保留 [`../README_EN.md`](../README_EN.md) 入口。

#### 方案 B：添加语言跳转（保持兼容）

在 README.md 顶部添加显眼的中文链接：

```markdown
# Claude CLI — Agents, Skills & Workflows

**中文 | [English](../README_EN.md)**

---

## Why This Exists
...
```

#### 方案 C：创建检测页面（最佳体验）
在 README.md 顶部添加自动检测：

```markdown
# Claude CLI — Agents, Skills & Workflows

<div align="center">

**中文**

**[Click here for English](../README_EN.md)**

---

</div>
```

## 推荐操作

1. 保持 [`../README.md`](../README.md) 为默认中文首页
2. 在顶部保留 [`../README_EN.md`](../README_EN.md) 入口
3. 更新仓库描述，添加 `[中文/EN]` 前缀
4. 在 GitHub About 中添加语言选择说明

## 立即执行

如果未来从英文默认切回中文默认，可以执行：

```bash
cd ~/github_GZ/claude_cli
mv README.md README_EN.md
mv README_ZH.md README.md
git add .
git commit -m "feat: 将中文 README 设为默认显示，优化中文用户体验

- 将原 README.md 重命名为 README_EN.md
- 将中文 README 提升为默认 README.md
- 在顶部添加英文版链接"
git push
```
