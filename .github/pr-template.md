## What
添加完整的 OpenClaw 集成文档和场景化工作流模板

## Why
帮助用户理解 OpenClaw 和 Claude Agents 的区别，提供实用的集成场景指南和即用型模板

## Changes

### 新增文档（12 个文件，1437 行）

#### 1. OpenClaw 集成指南
- `docs/OPENCLAW_CLAUDE_INTEGRATION.md` (340 行)
- `docs/OPENCLAW_CLAUDE_INTEGRATION_CN.md` (339 行)
- 内容：OpenClaw 和 Claude Code 的完整集成指南

#### 2. 工作流场景
- `docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md` (126 行)
- `docs/OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS_CN.md` (126 行)
- 内容：3 个实用场景（自动化测试、代码审查、持续集成）

#### 3. Inbox Triage 自动化
- `docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST.md` (76 行)
- `docs/OPENCLAW_INBOX_TRIAGE_EXECUTION_CHECKLIST_CN.md` (77 行)
- `docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR.md` (135 行)
- `docs/OPENCLAW_INBOX_TRIAGE_REPO_EXECUTOR_CN.md` (136 行)
- 内容：自动化 inbox 分拣和仓库执行

#### 4. Scenario-specific 模板
- `docs/subagent-refactor-starter/scenarios/backend/CLAUDE.md` (34 行)
- `docs/subagent-refactor-starter/scenarios/frontend/CLAUDE.md` (33 行)
- `docs/subagent-refactor-starter/scenarios/monorepo/CLAUDE.md` (35 行)
- 内容：针对不同项目类型的 CLAUDE.md 模板

### README 更新
- 在 README.md 和 README_EN.md 中添加了 OpenClaw 集成链接

## Testing
- [x] 所有文档链接已验证有效
- [x] 代码示例已测试可执行
- [x] 中英文版本内容保持一致
- [x] Markdown 格式正确

## Impact
- 📚 新增 12 个文档（1437 行）
- 🔗 添加 OpenClaw 集成链接
- 🎯 提供场景化模板（3 个场景）
- 🌐 完整的中英文支持

## Related
- OpenClaw 官方文档：https://docs.openclaw.ai
- Claude Agents 文档：https://anthropic.skilljar.com/

## Screenshots
（可选：添加文档预览截图）

---

**维护者提示**：这个 PR 主要是文档添加，没有代码逻辑变更，风险较低。
