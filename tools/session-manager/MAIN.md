# 🤖 Claude Code CLI 会话管理器

> **完整的会话持久化、导出与 GitHub 同步解决方案**
> 
> 创建时间: 2026-03-30 | 作者: 小lin (OpenClaw AI)

---

## 🎯 核心功能

- ✅ **自动保存**: Claude Code 默认持久化所有对话
- ✅ **批量导出**: 将 JSONL 转换为易读的 Markdown
- ✅ **GitHub 同步**: 一键推送到公开仓库
- ✅ **隐私保护**: 自动检测敏感信息

---

## 🚀 快速开始（3 步搞定）

### 步骤 1: 查看会话统计

```bash
cd ~/github_GZ/claude_cli/tools/session-manager
python3 claude_session_manager.py list
```

**示例输出**:
```
总计 8 个项目

1. assistant4Ming - 156 个会话 (45.2 MB)
2. autonomous-agent-stack - 45 个会话 (12.8 MB)
3. assistant4Life - 32 个会话 (3.9 MB)
```

### 步骤 2: 导出所有会话为 Markdown

```bash
python3 claude_session_manager.py export-all
```

输出目录: `./claude-exports/`

### 步骤 3: 提交到 GitHub

```bash
cd claude-exports
git init
git add .
git commit -m "Add Claude Code session exports"
gh repo create claude-conversations --public --source=. --push
```

**完成！** 🎉

---

## 📁 文件说明

```
tools/session-manager/
├── claude_session_manager.py    # Python 管理器（推荐）
├── export_claude_sessions.sh    # Bash 脚本
├── README.md                     # 详细文档
├── QUICKSTART.md                 # 快速开始
└── SOLUTION.md                   # 完整解决方案
```

---

## 💡 使用示例

### 导出单个会话

```bash
python3 claude_session_manager.py export \
  --session ~/.claude/projects/-Volumes-PS1008-assistant4Ming/0475e5e2.jsonl \
  --output ./my-session.md
```

### 指定输出目录

```bash
python3 claude_session_manager.py export-all \
  --output ~/Documents/claude-sessions
```

---

## 📊 导出格式

```markdown
# Claude Code 会话记录

**会话 ID**: `0475e5e2-2d81-4478-a29f-b6d3fa20e671`
**项目**: `assistant4Ming`
**时间**: 2026-03-12T05:40:09.670Z

---

## 会话内容

### 消息 1 [user]

You are agent 39f63199... Continue your work.

---

### 消息 2 [assistant]

I'll help you continue the Paperclip work...

---
```

---

## 🔒 隐私保护

公开分享前务必检查敏感信息：

```bash
cd claude-exports

# 搜索敏感词
grep -rE "(password|token|secret|api_key|sk-)" . --include="*.md"

# 批量替换（谨慎）
find . -name "*.md" -exec sed -i '' 's/sk-ant-[a-zA-Z0-9-]*/[REDACTED]/g' {} \;
```

---

## 🤖 自动化（可选）

### 添加便捷别名

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
alias claude-list='python3 ~/github_GZ/claude_cli/tools/session-manager/claude_session_manager.py list'
alias claude-export='python3 ~/github_GZ/claude_cli/tools/session-manager/claude_session_manager.py export-all'

# 使用
claude-list      # 查看所有会话
claude-export    # 导出所有会话
```

### 定时自动导出

**macOS (launchd)**:

```bash
cat > ~/Library/LaunchAgents/com.claude.export.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.claude.export</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/iCloud_GZ/github_GZ/claude_cli/tools/session-manager/claude_session_manager.py</string>
        <string>export-all</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.claude.export.plist
```

---

## 🎯 一键脚本

```bash
# 导出 + 提交 + 推送（完整流程）
python3 claude_session_manager.py export-all && \
cd claude-exports && \
git init && git add . && git commit -m "Update sessions" && \
git push
```

---

## 📚 相关文档

- **README.md**: 完整技术文档
- **QUICKSTART.md**: 快速开始指南
- **SOLUTION.md**: 一页纸解决方案

---

## 🆚 对比其他方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Claude Code 内置** | 自动保存 | JSONL 格式不便阅读 |
| **本方案** | Markdown 格式，便于分享 | 需要手动运行脚本 |
| **GitHub Gist** | 简单快速 | 不支持批量导出 |
| **Notion/Obsidian** | 功能强大 | 需要额外工具 |

---

## 🔧 故障排除

### 问题 1: 找不到项目目录

```bash
# 检查目录是否存在
ls -la ~/.claude/projects/

# 如果不存在，检查 Claude Code 是否正确安装
which claude
claude --version
```

### 问题 2: JSONL 文件为空

某些会话只有环境配置，没有实际对话内容，这是正常现象。

### 问题 3: 导出的 Markdown 为空

检查原始 JSONL 文件：

```bash
head -5 ~/.claude/projects/[-项目名]/[会话ID].jsonl
```

---

## 📞 支持

遇到问题？

1. 查看本文档的"故障排除"部分
2. 阅读 `README.md` 详细文档
3. 在 GitHub 仓库提交 Issue

---

## 📄 许可证

本工具采用 MIT 许可证。

---

## 🎉 总结

**核心价值**:
- 将碎片化的 Claude Code 会话转换为结构化知识库
- 便于回顾、分享和版本控制
- 支持自动化工作流

**一键搞定**:
```bash
python3 claude_session_manager.py export-all
```

**Happy Coding!** 🚀
