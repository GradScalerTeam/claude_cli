# Claude CLI 深度优化版 - 完全手册

> **创建时间**: 2026-03-31 04:08
> **状态**: 🔥 火力全开 × 10

---

## 📖 目录

- [简介](#简介)
- [安装](#安装)
- [核心功能](#核心功能)
- [高级用法](#高级用法)
- [最佳实践](#最佳实践)

---

## 🎯 简介

Claude CLI 深度优化版是基于 Anthropic Claude API 的命令行工具。

### 核心特性
- ✅ 多模型支持
- ✅ 会话管理
- ✅ 上下文优化
- ✅ 自动补全
- ✅ 流式输出

---

## 📦 安装

### 1. 克隆仓库

```bash
git clone https://github.com/srxly888-creator/claude_cli
cd claude_cli
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置 API

```bash
# 设置 API 密钥
export ANTHROPIC_API_KEY="your-key"

# 或在配置文件中设置
echo "ANTHROPIC_API_KEY=your-key" > .env
```

---

## 💡 核心功能

### 1. 多模型支持

```bash
# 使用 Claude 3.5 Sonnet
claude --model claude-3-5-sonnet-20241022

# 使用 Claude 3 Opus
claude --model claude-3-opus-20240229

# 使用 Claude 3 Haiku
claude --model claude-3-haiku-20240307
```

### 2. 会话管理

```bash
# 列出所有会话
claude sessions list

# 恢复会话
claude sessions resume <session-id>

# 删除会话
claude sessions delete <session-id>

# 导出会话
claude sessions export <session-id> > session.json
```

### 3. 上下文优化

```bash
# 自动压缩上下文
claude --auto-compress

# 设置最大上下文
claude --max-context 100000

# 上下文统计
claude --context-stats
```

### 4. 自动补全

```bash
# 启用自动补全
claude --enable-autocomplete

# 禁用自动补全
claude --disable-autocomplete
```

### 5. 流式输出

```bash
# 启用流式输出
claude --stream

# 禁用流式输出
claude --no-stream
```

---

## 🚀 高级用法

### 1. 自定义提示词

```bash
# 使用自定义提示词
claude --system "你是一个专业的代码审查助手"

# 从文件加载提示词
claude --system-file prompt.txt
```

### 2. 多轮对话

```bash
# 启动交互模式
claude --interactive

# 继续上次对话
claude --continue
```

### 3. 文件处理

```bash
# 分析文件
claude --file code.py "分析这段代码"

# 批量处理
claude --files *.py "审查这些文件"
```

### 4. 输出格式

```bash
# JSON 输出
claude --output json

# Markdown 输出
claude --output markdown

# 纯文本输出
claude --output text
```

### 5. 超时控制

```bash
# 设置超时（秒）
claude --timeout 60

# 无限等待
claude --timeout 0
```

---

## 🎯 最佳实践

### 1. 模型选择

```bash
# 快速任务 - 使用 Haiku
claude --model haiku "简单问题"

# 复杂任务 - 使用 Sonnet
claude --model sonnet "复杂推理"

# 超复杂任务 - 使用 Opus
claude --model opus "深度分析"
```

### 2. 上下文管理

```bash
# 定期清理上下文
claude --clear-context

# 设置保留策略
claude --context-keep last-10
```

### 3. 错误处理

```bash
# 自动重试
claude --retry 3

# 失败回退
claude --fallback haiku
```

### 4. 性能优化

```bash
# 并发请求
claude --concurrent 5

# 缓存结果
claude --cache
```

---

## 🔧 配置文件

### .claude/config.yaml

```yaml
# 默认模型
model: claude-3-5-sonnet-20241022

# 最大上下文
max_context: 100000

# 流式输出
stream: true

# 自动压缩
auto_compress: true

# 超时设置
timeout: 60

# 重试次数
retry: 3

# 输出格式
output: markdown

# 会话保存
save_sessions: true

# 会话目录
sessions_dir: ~/.claude/sessions
```

---

## 📊 性能监控

### 1. Token 统计

```bash
# 查看 Token 使用
claude --stats

# 导出统计
claude --export-stats stats.json
```

### 2. 成本追踪

```bash
# 查看成本
claude --cost

# 设置预算
claude --budget 100
```

### 3. 性能分析

```bash
# 性能报告
claude --performance-report

# 响应时间统计
claude --response-time
```

---

## 🐛 故障排除

### 1. API 错误

```bash
# 检查 API 状态
claude --check-api

# 测试连接
claude --test-connection
```

### 2. 配置问题

```bash
# 验证配置
claude --validate-config

# 重置配置
claude --reset-config
```

### 3. 会话问题

```bash
# 修复会话
claude --repair-sessions

# 清理损坏的会话
claude --clean-sessions
```

---

## 📚 相关资源

- **GitHub**: https://github.com/srxly888-creator/claude_cli
- **文档**: https://docs.anthropic.com
- **Cookbooks**: https://github.com/srxly888-creator/claude-cookbooks-zh

---

## 🔄 更新日志

### v2.0.0 (2026-03-31)
- ✅ 新增会话管理器
- ✅ 优化上下文压缩
- ✅ 改进自动补全
- ✅ 增强错误处理

---

**整理者**: srxly888-creator
**时间**: 2026-03-31 04:08
