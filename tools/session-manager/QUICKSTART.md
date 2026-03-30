# Claude Code CLI 会话管理完整指南

> **创建时间**: 2026-03-30  
> **作者**: 小lin (OpenClaw AI)  
> **状态**: ✅ 已验证可用

---

## 🎯 核心功能

Claude Code CLI **默认自动保存**所有会话，无需额外配置！

存储位置：`~/.claude/projects/[项目名]/[会话ID].jsonl`

---

## 🚀 快速开始（3步搞定）

### 步骤 1: 查看所有会话

```bash
cd ~/github_GZ/openclaw-memory
python3 .claude-exporter/claude_session_manager.py list
```

**示例输出**：
```
总计 8 个项目

1. assistant4Ming
   会话数: 156
   总大小: 45.2 MB
   - 0475e5e2... | 2026-03-12 13:40 | You are agent...
```

### 步骤 2: 导出所有会话为 Markdown

```bash
python3 .claude-exporter/claude_session_manager.py export-all
```

输出目录：`./claude-exports/`

### 步骤 3: 提交到 GitHub 公开仓库

```bash
cd claude-exports
git init
git add .
git commit -m "Add Claude Code session exports"
gh repo create claude-conversations --public --source=. --push
```

**完成！** 你的会话现在在 GitHub 上公开可访问了 🎉

---

## 📁 目录结构

### Claude Code 本地存储

```
~/.claude/
├── projects/
│   ├── -Volumes-PS1008-assistant4Ming/
│   │   ├── 0475e5e2-2d81-4478-a29f-b6d3fa20e671.jsonl
│   │   ├── 0781330b-a4a4-4ffd-95e5-01591b592607.jsonl
│   │   └── ...
│   └── -Volumes-PS1008-Github-autonomous-agent-stack/
└── history.jsonl
```

### 导出后的结构

```
claude-exports/
├── README.md                    # 自动生成的索引
├── assistant4Ming/              # 按 GitHub 项目分组
│   ├── 0475e5e2.md
│   ├── 0781330b.md
│   └── ...
└── autonomous-agent-stack/
    ├── 89f94b20.md
    └── ...
```

---

## 💡 高级用法

### 导出单个会话

```bash
python3 .claude-exporter/claude_session_manager.py export \
  --session ~/.claude/projects/-Volumes-PS1008-assistant4Ming/0475e5e2.jsonl \
  --output ./my-session.md
```

### 指定输出目录

```bash
python3 .claude-exporter/claude_session_manager.py export-all \
  --output ~/Documents/claude-sessions
```

### 指定 Claude 目录（非标准安装）

```bash
python3 .claude-exporter/claude_session_manager.py list \
  --claude-dir /custom/path/.claude
```

---

## 🔒 隐私清理

在公开分享前，务必清理敏感信息：

```bash
cd claude-exports

# 1. 搜索可能的敏感信息
grep -rE "(password|token|secret|api|sk-)" . --include="*.md"

# 2. 手动编辑敏感文件
vim assistant4Ming/0475e5e2.md

# 3. 或者使用批量替换（谨慎）
find . -name "*.md" -exec sed -i '' 's/sk-ant-[a-zA-Z0-9-]*/[API_KEY_REDACTED]/g' {} \;
```

---

## 🤖 自动化（可选）

### 每小时自动导出

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
        <string>/Users/iCloud_GZ/github_GZ/openclaw-memory/.claude-exporter/claude_session_manager.py</string>
        <string>export-all</string>
        <string>--output</string>
        <string>/Users/iCloud_GZ/github_GZ/claude-conversations</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
</dict>
</plist>
EOF

launchctl load ~/Library/LaunchAgents/com.claude.export.plist
```

**Linux (cron)**:

```bash
crontab -e

# 添加
0 * * * * cd ~/github_GZ/openclaw-memory && python3 .claude-exporter/claude_session_manager.py export-all
```

---

## 📊 统计信息

查看当前系统上的会话统计：

```bash
python3 .claude-exporter/claude_session_manager.py list | grep "会话数"
```

示例统计（2026-03-30）：

| 项目 | 会话数 | 总大小 |
|------|--------|--------|
| assistant4Ming | 156 | 45.2 MB |
| autonomous-agent-stack | 45 | 12.8 MB |
| assistant4Life | 32 | 3.9 MB |
| **总计** | **233** | **61.9 MB** |

---

## 🛠️ 故障排除

### 问题 1: 找不到项目目录

```bash
# 检查目录是否存在
ls -la ~/.claude/projects/

# 如果不存在，检查 Claude Code 是否正确安装
which claude
claude --version
```

### 问题 2: JSONL 文件为空

正常现象！某些会话只有环境配置，没有实际对话内容。

### 问题 3: 导出的 Markdown 为空

检查原始 JSONL 文件：

```bash
head -5 ~/.claude/projects/[-项目名]/[会话ID].jsonl
```

---

## 🎨 自定义

### 修改输出格式

编辑 `claude_session_manager.py` 中的 `export_session_to_markdown` 方法。

### 添加更多元数据

在导出时添加项目信息、标签等。

---

## 📚 相关工具

- **Claude Code**: Anthropic 官方 CLI
- **GitHub CLI**: `gh` 命令行工具
- **Glow**: Markdown 终端查看器

---

## ✅ 最佳实践

1. **定期导出**: 建议每天或每周导出一次
2. **版本控制**: 用 Git 追踪会话变化
3. **隐私检查**: 公开前务必清理敏感信息
4. **备份**: 同时保存在 GitHub 和本地
5. **分类**: 可以创建多个仓库（工作/个人/学习）

---

## 🎯 一键脚本

创建一个便捷的别名：

```bash
# 添加到 ~/.zshrc
alias claude-export='cd ~/github_GZ/openclaw-memory && python3 .claude-exporter/claude_session_manager.py export-all'
alias claude-list='cd ~/github_GZ/openclaw-memory && python3 .claude-exporter/claude_session_manager.py list'

# 使用
claude-list      # 查看所有会话
claude-export    # 导出所有会话
```

---

## 📞 支持

遇到问题？

1. 检查本文档的"故障排除"部分
2. 查看 `.claude-exporter/README.md` 详细文档
3. 提交 Issue 到 GitHub

---

**Happy Coding! 🚀**
