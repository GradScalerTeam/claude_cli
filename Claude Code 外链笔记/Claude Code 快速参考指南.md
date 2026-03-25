# Claude Code 快速参考指南

> 速查手册 | 常用命令 | 实战技巧

## 🚀 快速启动

### 基础命令
```bash
claude-code                    # 启动 Claude Code
claude-code --mcp-config .mcp.json  # 使用指定MCP配置
```

### 内置命令
```bash
/help                          # 查看帮助
/clear                         # 清屏
/compact                       # 压缩上下文
/tasks                         # 查看任务列表
/exit                          # 退出
```

## 🛠️ 核心工具

### 文件操作
```bash
# 读取文件
请读取 package.json

# 修改文件
将 version 改为 "2.0.0"

# 创建文件
创建一个新的 README.md 文件

# 查找文件
查找所有的 .ts 文件
```

### 代码搜索
```bash
# 搜索内容
搜索 "TODO" 注释

# 查找定义
找到 UserService 类的定义

# 分析依赖
分析这个文件的导入依赖
```

## 📋 Plan Mode 使用

### 启动时机
- ✅ 复杂的多步骤任务
- ✅ 需要深入理解代码
- ✅ 跨多个文件的修改
- ✅ 不确定最佳方案时

### 使用流程
```
1. 描述需求
   "我需要重构用户认证模块"

2. 自动规划
   → 调查现有代码
   → 分析依赖关系
   → 制定实施计划

3. 确认执行
   → 审查计划
   → 确认后执行
```

## 🔧 配置文件

### CLAUDE.md 结构
```markdown
# 项目名称

## 项目概述
项目描述...

## 开发规范
- 代码风格：XXX
- 测试要求：XXX

## 常用命令
```bash
npm start
npm test
```

## 注意事项
- ⚠️ 重要注意事项
```

### MCP 配置 (.mcp.json)
```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

## 💡 技能系统

### 查看技能
```bash
/skill                        # 查看所有技能
/skill skill-0                # 使用技能导航员
```

### 常用技能类型
- **Skill-1**: 爆款结构拆解器
- **Skill-2**: 写作前元思考
- **Skill-3**: 母内容构建
- **Skill-4**: 内容裂变引擎

## 🎯 实战技巧

### 日常工作流
```bash
# 1. 查看项目状态
请总结项目的当前状态

# 2. 开始新任务
用 Plan Mode 帮我实现 XXX 功能

# 3. 代码审查
请审查 authentication.js 的代码质量

# 4. 问题诊断
分析这个bug：XXX错误信息
```

### 效率提升
```bash
# 批量操作
把所有文件中的 'old' 替换为 'new'

# 系统分析
分析整个项目的代码结构

# 自动化测试
为这个函数生成单元测试
```

## 📊 性能优化

### 上下文管理
```bash
/compact                      # 定期压缩上下文
/clear                        # 清理不必要的历史
```

### 成本控制
- 使用 Haiku 模型处理简单任务
- 合理使用 Plan Mode 避免重复
- 及时压缩上下文

## 🔍 问题排查

### 常见问题

**Q: 命令执行失败？**
```bash
# 检查当前目录
pwd

# 检查文件权限
ls -la

# 查看错误详情
请详细说明错误原因
```

**Q: 找不到文件？**
```bash
# 搜索文件
使用 Glob 查找所有相关文件

# 确认路径
检查当前工作目录
```

**Q: MCP服务连接失败？**
```bash
# 检查MCP配置
cat .mcp.json

# 测试连接
请测试 MCP 服务连接
```

## 🎓 学习路径

### 第1周：基础
- [ ] 熟悉基本命令
- [ ] 练习文件操作
- [ ] 理解 CLAUDE.md

### 第2周：进阶
- [ ] 掌握 Plan Mode
- [ ] 配置 MCP 服务
- [ ] 使用技能系统

### 第3-4周：高级
- [ ] 创建自定义技能
- [ ] 配置子代理
- [ ] 集成插件

## 📱 快捷键参考

### 通用快捷键
- `Ctrl+C` - 中断当前操作
- `Ctrl+D` - 退出会话
- `↑/↓` - 浏览历史命令

### 编辑快捷键
- `Ctrl+A` - 移到行首
- `Ctrl+E` - 移到行尾
- `Ctrl+U` - 删除到行首
- `Ctrl+K` - 删除到行尾

## 🔗 常用链接

- [官方文档](https://code.claude.com/docs)
- [CLI参考](https://code.claude.com/docs/zh-CN/cli-reference)
- [插件市场](https://github.com/topics/claude-code-plugin)
- [社区教程](https://academy.claude-code.club)

---

**💡 提示：将此文档加入收藏，随时查阅！**
