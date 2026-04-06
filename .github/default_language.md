# 默认语言设置指南

## GitHub 仓库级别设置

GitHub 不支持直接通过文件设置默认语言，但可以通过以下方式优化中文用户体验：

### 1. 仓库描述优化（已设置）
- 当前描述已包含中文说明
- 建议在描述开头添加 `[中文/EN]` 标识

### 2. README 默认显示
GitHub 会根据以下优先级显示 README：
1. 用户的语言设置（优先级最高）
2. 仓库主要语言
3. 默认 README.md

### 3. 解决方案

#### 方案 A：重命名文件（推荐）
```bash
mv README.md README_EN.md
mv README_CN.md README.md
```
这样中文 README 会成为默认文件，英文版需要显式访问。

#### 方案 B：添加语言跳转（保持兼容）
在 README.md 顶部添加显眼的中文链接：

```markdown
# Claude CLI — Agents, Skills & Workflows

**[🇨🇳 中文版](README_CN.md) | [English](README_EN.md)**

---

## Why This Exists
...
```

#### 方案 C：创建检测页面（最佳体验）
在 README.md 顶部添加自动检测：

```markdown
# Claude CLI — Agents, Skills & Workflows

<div align="center">

**[🇨🇳 点击查看中文版](README_CN.md)**

**[Click here for English](README_EN.md)**

---

</div>
```

## 推荐操作

1. 保持 README.md 为英文（国际用户）
2. 在 README.md 顶部添加显眼的中文链接
3. 更新仓库描述，添加 `[中文/EN]` 前缀
4. 在 GitHub About 中添加语言选择说明

## 立即执行

执行以下命令将中文版设为默认：

```bash
cd ~/github_GZ/claude_cli
mv README.md README_EN.md
mv README_CN.md README.md
git add .
git commit -m "feat: 将中文 README 设为默认显示，优化中文用户体验

- 将原 README.md 重命名为 README_EN.md
- 将 README_CN.md 提升为默认 README.md
- 在顶部添加英文版链接"
git push
```
