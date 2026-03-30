# Claude Code CLI 会话持久化与 GitHub 导出指南

## 📋 问题背景

Claude Code CLI 默认会保存所有会话记录，但这些记录以 JSONL 格式存储在本地，不便查看和分享。本指南提供了一套完整的解决方案，让你能够：

1. ✅ **自动保存**：Claude Code 默认持久化所有会话
2. ✅ **整理导出**：将 JSONL 转换为易读的 Markdown 格式
3. ✅ **GitHub 分享**：一键提交到公开仓库

---

## 🔍 会话存储位置

### macOS / Linux

```
~/.claude/
├── projects/
│   ├── -Volumes-PS1008-project-a/
│   │   ├── session-id-1.jsonl    # 会话记录
│   │   ├── session-id-2.jsonl
│   │   └── ...
│   └── -Volumes-PS1008-project-b/
└── history.jsonl                  # 全局历史记录
```

### 关键目录

| 目录 | 说明 |
|------|------|
| `~/.claude/projects/` | 按项目分组的会话记录 |
| `~/.claude/session-env/` | 会话环境配置（空目录） |
| `~/.claude/history.jsonl` | 全局会话历史索引 |

---

## 🛠️ 解决方案

### 方案一：使用 Bash 脚本（推荐快速使用）

#### 1. 下载脚本

```bash
cd ~/github_GZ/openclaw-memory
chmod +x .claude-exporter/export_claude_sessions.sh
```

#### 2. 运行导出

```bash
./.claude-exporter/export_claude_sessions.sh
```

#### 3. 提交到 GitHub

```bash
cd claude-conversations  # 输出目录
git init
git add .
git commit -m "Add Claude Code session exports"
gh repo create claude-conversations --public --source=. --push
```

---

### 方案二：使用 Python 管理器（推荐完整功能）

#### 1. 安装依赖

```bash
# Python 3.6+ 已内置所需模块，无需额外安装
```

#### 2. 列出所有会话

```bash
cd ~/github_GZ/openclaw-memory
python3 .claude-exporter/claude_session_manager.py list
```

**输出示例**：

```
=== Claude Code 项目列表 ===

总计 8 个项目

1. assistant4Ming
   会话数: 156
   总大小: 45.2 MB
   - 0475e5e2... | 2026-03-12 13:40 | You are agent 39f63199...
   - 0781330b... | 2026-03-13 05:32 | 继续你的 Paperclip...
   ... 还有 154 个会话

2. Github/autonomous-agent-stack
   会话数: 89
   总大小: 12.8 MB
   ...
```

#### 3. 导出所有会话

```bash
python3 .claude-exporter/claude_session_manager.py export-all --output ./claude-exports
```

**功能特性**：

- ✅ 自动解析 JSONL 格式
- ✅ 生成易读的 Markdown
- ✅ 按项目分组
- ✅ 自动生成 README 索引
- ✅ 保留时间戳和消息结构

#### 4. 导出单个会话

```bash
python3 .claude-exporter/claude_session_manager.py export \
  --session ~/.claude/projects/-Volumes-PS1008-assistant4Ming/0475e5e2.jsonl \
  --output ./my-session.md
```

---

## 📦 导出格式

### 目录结构

```
claude-exports/
├── README.md                          # 自动生成的索引
├── assistant4Ming/                    # 项目 A
│   ├── 0475e5e2-2d81-4478-a29f-b6d3fa20e671.md
│   ├── 0781330b-a4a4-4ffd-95e5-01591b592607.md
│   └── ...
└── autonomous-agent-stack/           # 项目 B
    ├── 0a2a9b58-451a-4741-9409-d3dc9fdcbd4c.md
    └── ...
```

### Markdown 文件示例

```markdown
# Claude Code 会话记录

**会话 ID**: `0475e5e2-2d81-4478-a29f-b6d3fa20e671`
**项目**: `assistant4Ming`
**时间**: 2026-03-12T05:40:09.670Z

---

## 会话内容

### 消息 1 [user]

**时间**: 2026-03-12T05:40:09.670Z

You are agent 39f63199-0fd9-49c2-a6ba-6e8cd2cca82c (Engineer). Continue your Paperclip work.

---

### 消息 2 [assistant]

**时间**: 2026-03-12T05:40:15.123Z

I'll help you continue the Paperclip work. Let me check the current state...

---
```

---

## 🚀 提交到 GitHub 公开仓库

### 完整流程

```bash
# 1. 导出所有会话
python3 .claude-exporter/claude_session_manager.py export-all

# 2. 进入导出目录
cd claude-exports

# 3. 创建 .gitignore
cat > .gitignore << 'EOF'
# 只保留 Markdown
*.md
!README.md
EOF

# 4. 初始化 Git
git init
git add .
git commit -m "Add Claude Code session exports"

# 5. 推送到 GitHub（使用 GitHub CLI）
gh repo create claude-conversations --public --source=. --remote=origin --push

# 或者手动推送
git remote add origin https://github.com/你的用户名/claude-conversations.git
git branch -M main
git push -u origin main
```

### GitHub 仓库设置

#### 1. 添加描述

```
Claude Code CLI 会话存档 - 我的 AI 编程助手对话记录
```

#### 2. 设置主题

- 推荐: `Minimal` 或 `Architect`

#### 3. 启用 GitHub Pages（可选）

如果想让会话公开可读：

```bash
# Settings → Pages → Source: main branch
```

---

## 🔧 高级配置

### 自动化导出（定时任务）

#### macOS (launchd)

```bash
# 创建定时任务
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
    <integer>3600</integer>  <!-- 每小时运行一次 -->
</dict>
</plist>
EOF

# 加载任务
launchctl load ~/Library/LaunchAgents/com.claude.export.plist
```

#### Linux (cron)

```bash
# 编辑 crontab
crontab -e

# 添加每小时执行一次
0 * * * * cd ~/github_GZ/openclaw-memory && python3 .claude-exporter/claude_session_manager.py export-all
```

---

## 📝 会话查看技巧

### 方法一：本地浏览

```bash
# 使用 VS Code 打开
code claude-exports

# 或使用 Markdown 查看器
glow claude-exports/assistant4Ming/*.md
```

### 方法二：在线浏览（GitHub）

提交到 GitHub 后，直接在仓库中查看 `.md` 文件，GitHub 会自动渲染。

### 方法三：全文搜索

```bash
# 导出后搜索关键词
cd claude-exports
grep -r "某个关键词" . --include="*.md"
```

---

## 🔒 隐私注意事项

### 检查敏感信息

在公开分享前，务必检查：

```bash
# 搜索可能的敏感信息
cd claude-exports
grep -rE "(password|token|secret|key|api)" . --include="*.md"
```

### 自动清理脚本

```bash
# 创建清理脚本
cat > .claude-exporter/sanitize.sh << 'EOF'
#!/bin/bash
# 清理敏感信息

cd claude-exports

# 替换 API 密钥
find . -name "*.md" -exec sed -i '' 's/sk-ant-[a-zA-Z0-9]*/[REDACTED]/g' {} \;

# 替换邮箱
find . -name "*.md" -exec sed -i '' 's/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/[EMAIL]/g' {} \;

echo "✓ 清理完成"
EOF

chmod +x .claude-exporter/sanitize.sh
```

---

## 🆚 对比其他方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **Claude Code 内置** | 自动保存，无需配置 | JSONL 格式不便阅读 |
| **本方案** | Markdown 格式，便于分享 | 需要手动运行脚本 |
| **GitHub Gist** | 简单快速 | 不支持批量导出 |
| **Notion/Obsidian** | 功能强大 | 需要额外工具 |

---

## 📚 参考资料

- [Claude Code CLI 文档](https://docs.anthropic.com/)
- [GitHub Pages 使用指南](https://pages.github.com/)
- [JSONL 格式说明](https://jsonlines.org/)

---

## 🎯 快速开始

```bash
# 一键导出并提交
cd ~/github_GZ/openclaw-memory
python3 .claude-exporter/claude_session_manager.py export-all
cd claude-exports
git init && git add . && git commit -m "Add Claude Code sessions"
gh repo create claude-conversations --public --source=. --push
```

**完成！你的会话现在已经公开可访问了** 🎉
