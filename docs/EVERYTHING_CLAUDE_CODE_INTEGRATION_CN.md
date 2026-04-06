# Everything Claude Code 集成说明

这个仓库已经把 `affaan-m/everything-claude-code` 以 vendored 快照形式整合进来，路径是：

```text
vendor/everything-claude-code/
```

这样做的原因很直接：

1. 不覆盖当前 `claude_cli` 根目录结构
2. 不破坏现有中文教程、私有笔记和同步脚本
3. 允许 public fork 与两个 private 仓库共享同一份公开安全的 ECC 内容
4. 后续可以单独同步 ECC，而不必把整个仓库改造成 ECC 的目录布局

## 当前来源

- 上游仓库：`https://github.com/affaan-m/everything-claude-code`
- 快照分支：`main`
- 已导入提交：`62519f2b622b44d8289d573bb6e74c4c95fc7400`

同步脚本会把最新来源写入：

```text
vendor/everything-claude-code/.upstream-source.txt
```

## 这次整合包含什么

- ECC 的完整 vendored 源码快照
- ECC 的 `agents/`、`commands/`、`skills/`、`hooks/`、`rules/`、插件与跨工具配置
- 当前仓库 README 中的 ECC 导航入口
- 一个专门的同步脚本：`scripts/sync-everything-claude-code.sh`
- 对现有中文同步脚本的保护规则，避免未来同步上游 `claude_cli` 时误删 vendored ECC 内容

## 如何更新 ECC 快照

在仓库根目录执行：

```bash
./scripts/sync-everything-claude-code.sh
```

也可以指定来源和分支：

```bash
ECC_VENDOR_REPO=https://github.com/affaan-m/everything-claude-code.git \
ECC_VENDOR_REF=main \
./scripts/sync-everything-claude-code.sh
```

脚本会：

1. 浅克隆 ECC 上游到临时目录
2. 重建 `vendor/everything-claude-code/`
3. 写入来源 commit 元数据
4. 保持目录布局稳定，方便在 private / public 两条线上复用同一组改动

## 与中文专用同步脚本的关系

`scripts/sync-upstream.sh` 和 `scripts/prune-non-chinese-md.sh` 现在会把 `vendor/everything-claude-code/` 视为保留区域。

这意味着：

- 仓库本体仍然可以维持中文优先策略
- vendored ECC 子树不会在同步 `GradScalerTeam/claude_cli` 时被误删
- vendored ECC 内的英文 Markdown 不会被自动规范化或删除

## 发布建议

- `private` / `nxs-private`：直接同步这份 vendored 集成
- `public`：只推送公开安全的集成改动，不携带私有笔记目录

如果后续要继续演进，优先保持：

- 当前仓库自己的教程、工作流文档和私有材料继续放在根目录及现有 `docs/`
- ECC 原始生态继续保持在 `vendor/everything-claude-code/`

这样最不容易在后续同步时互相踩坏。
