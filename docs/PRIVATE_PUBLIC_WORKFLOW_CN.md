# 私有笔记 + 公共 PR 双仓库工作流

这套仓库结构分成两条线：

- `claude_cli-private`：私有笔记、草稿、实验和中文整理
- `claude_cli`：公开 fork，只放可以对外提交的改动

目标很简单：

1. 私有内容不出仓库
2. 公开贡献保持干净、可审查、可合并
3. 两边都能同步上游 `GradScalerTeam/claude_cli`

## 远程约定

在私有仓库里，推荐把远程命名成下面这样：

- `upstream` -> `git@github.com:GradScalerTeam/claude_cli.git`
- `private` -> `git@github.com:srxly888-creator/claude_cli-private.git`
- `public` -> `git@github.com:srxly888-creator/claude_cli.git`

这样 `git remote -v` 一眼就能看出三条线分别负责什么。

## 日常同步私有笔记

在 `claude_cli-private` 里运行：

```bash
./scripts/sync-upstream.sh
```

这个脚本会：

1. 拉取 `upstream/main`
2. 合并到当前分支
3. 清理英文 Markdown、英文 locale 和校验脚本
4. 规范中文文档中的双语残留
5. 推送回 `private/main`

如果你的本地仓库还没把 `origin` 改成 `private`，脚本也会尽量兼容旧配置。

## 从私有改动发 PR

当某个私有实验值得回流上游时，按这个顺序做：

1. 先在私有仓库里把改动整理成一个干净分支
2. 只保留可以公开阅读的代码或文档
3. 把这个分支推到公开 fork：

```bash
git push public my-topic-branch
```

4. 用 GitHub CLI 创建 PR：

```bash
gh pr create \
  --repo srxly888-creator/claude_cli \
  --base main \
  --head srxly888-creator:my-topic-branch \
  --title "..." \
  --body "..."
```

默认情况下，base 仓库的维护者可以修改这个 PR 分支。如果你不想开放这件事，额外加 `--no-maintainer-edit`。

如果你想把这一步压成一个命令，直接在私有仓库里运行：

```bash
./scripts/export-public-pr.sh
```

它会把当前分支推到 `public` 远程，然后打印对应的 `gh pr create` 命令。默认情况下它会优先使用 `--force-with-lease`，这样如果 public 分支被别人改过，不会直接覆盖。

## 什么时候留在私有仓库

这些内容建议只留在 `claude_cli-private`：

- 还没整理干净的探索性笔记
- 会暴露个人判断、草稿和失败尝试的内容
- 只对你自己有用的工作流整理

这些内容适合去 `claude_cli`：

- 已经验证过的 bugfix
- 不依赖私有笔记上下文的文档改动
- 你愿意公开给上游维护者看的最小提交

## 如果要重建本地远程

如果你是新克隆，或者想把旧的 `origin` 结构改成这套命名，可以按下面做：

```bash
git remote rename origin private
git remote add upstream git@github.com:GradScalerTeam/claude_cli.git
git remote add public git@github.com:srxly888-creator/claude_cli.git
```

如果 `upstream` 或 `public` 已经存在，就不用重复添加。
