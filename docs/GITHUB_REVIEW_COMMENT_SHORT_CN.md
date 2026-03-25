# GitHub Review Comment（短版）

这份仓库整体已经高度贴近当前 Claude Code 官方工作流，尤其是 Plan Mode、技能与子代理的职责拆分，以及文档优先这几块。

当前最值得补的不是重写方法论，而是把已经存在的能力讲得更显眼。

建议优先补三点：

1. 在 README 入口前置 `SKILL.md` 的 frontmatter / `effort`
2. 把 1M context 的说明区分为 API 语境和 Claude Code 套餐语境
3. 补充 `rate_limits`（Claude Code 2.1.80，2026-03-19）和 `sandbox.filesystem.allowRead`（Claude Code 2.1.77，2026-03-17）

另外，建议继续保留 `/compact`、auto-compaction 和 context rot 的提醒，避免把长上下文理解成“可以无限堆内容”。

如果把这几项补上，文档会更贴近当前版本，也更方便新用户正确上手。
