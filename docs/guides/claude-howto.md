# Claude Code 使用指南

> **仓库**: https://github.com/luongnv89/claude-howto
> **作者**: luongnv89
> **评分**: ⭐⭐⭐⭐⭐

---

## 📖 简介

claude-howto 是一个**可视化、示例驱动**的 Claude Code 使用指南，从基础概念到高级代理，提供**复制粘贴模板**，带来即时价值。

---

## 🎯 特点

- ✅ **可视化** - 图文并茂，易于理解
- ✅ **示例驱动** - 大量实用示例
- ✅ **复制粘贴** - 开箱即用的模板
- ✅ **即时价值** - 立即提升效率
- ✅ **全覆盖** - 从基础到高级

---

## 📚 内容结构

### Part 1: 基础概念
1. Claude Code 简介
2. 安装和配置
3. 基本命令
4. 第一次使用

### Part 2: Slash Commands
1. 基本命令
2. 自定义命令
3. 命令参数
4. 实用示例

### Part 3: Sub-agents
1. 什么是子代理
2. 创建子代理
3. 代理协作
4. 高级用法

### Part 4: Skills
1. 内置技能
2. 自定义技能
3. 技能组合
4. 最佳实践

### Part 5: MCP Integrations
1. MCP 服务器
2. 连接配置
3. 数据交互
4. 实战案例

### Part 6: Hooks
1. 钩子机制
2. 事件处理
3. 自定义钩子
4. 工作流集成

### Part 7: Plugins
1. 插件系统
2. 插件开发
3. 插件分发
4. 社区插件

### Part 8: Advanced Features
1. 计算机控制
2. UI 自动化
3. 批量处理
4. 性能优化

---

## 🚀 快速开始

### 1. 安装 Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### 2. 初始化
```bash
claude init
```

### 3. 第一个命令
```bash
claude "帮我创建一个 Hello World 程序"
```

---

## 💡 常用命令

### Slash Commands
```bash
/help          # 显示帮助
/plan          # 计划模式
/implement     # 实现代码
/test          # 运行测试
/explain       # 解释代码
```

### Sub-agents
```bash
claude agent create my-agent
claude agent run my-agent "任务描述"
```

### Skills
```bash
claude skill list
claude skill use skill-name
```

---

## 📖 学习路径

### 新手（第1-2周）
1. ✅ 阅读基础概念
2. ✅ 学习基本命令
3. ✅ 练习 Slash Commands
4. ✅ 完成第一个项目

### 进阶（第3-4周）
1. ✅ 学习 Sub-agents
2. ✅ 掌握 Skills
3. ✅ 了解 MCP Integrations
4. ✅ 实战项目练习

### 高级（第5周+）
1. ✅ 深入 Hooks
2. ✅ 开发 Plugins
3. ✅ 计算机控制
4. ✅ 性能优化

---

## 🔗 相关链接

- **GitHub**: https://github.com/luongnv89/claude-howto
- **官方文档**: https://code.claude.com/docs
- **社区**: https://discord.gg/claude-code

---

## 🎓 实用示例

### 示例 1: 创建项目
```bash
claude "创建一个 React 项目，包含 TypeScript 和 TailwindCSS"
```

### 示例 2: 代码审查
```bash
claude "审查 src/app.tsx，找出潜在问题"
```

### 示例 3: 运行测试
```bash
claude "运行所有测试，修复失败的用例"
```

---

**整理者**: srxly888-creator
**最后更新**: 2026-03-31 12:52
