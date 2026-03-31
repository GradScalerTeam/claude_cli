# Claude-Kits 资源

> **仓库**: https://github.com/chengjon/Claude-Kits
> **作者**: chengjon
> **评分**: ⭐⭐⭐⭐⭐

---

## 📖 简介

Claude-Kits 是一个根据 Claude 官方文档生成的工具集，包含：

- **Skills** - Claude Code 技能集合
- **Agents** - 智能代理配置
- **Plug-in** - 插件系统
- **Hooks** - 钩子机制

### 特点
- ✅ 参考30万行代码大神的库
- ✅ 收集了其它一些有用库
- ✅ 采用安全安装的方式
- ✅ 不会覆盖您的原有设置
- ✅ 为提升 Claude Code 效率而生

---

## 🚀 安装

### 前置要求
- Python 3.8+
- Claude Code 已安装

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/chengjon/Claude-Kits.git
cd Claude-Kits

# 安全安装（不覆盖原有设置）
./install.sh --safe
```

### 验证安装
```bash
# 检查技能
claude skill list

# 检查代理
claude agent list
```

---

## 💡 使用

### Skills（技能）
```bash
# 使用技能
claude run /skill-name

# 列出所有技能
claude skill list
```

### Agents（代理）
```bash
# 启动代理
claude agent start agent-name

# 查看代理状态
claude agent status
```

### Hooks（钩子）
```bash
# 注册钩子
claude hook register hook-name

# 触发钩子
claude hook trigger hook-name
```

---

## 📚 核心组件

### 1. Skills
- 文件操作
- 代码生成
- 测试自动化
- 部署脚本

### 2. Agents
- 编程助手
- 代码审查
- 文档生成
- Bug 修复

### 3. Plug-ins
- MCP 集成
- 第三方工具
- 自定义扩展

### 4. Hooks
- Git 钩子
- 构建钩子
- 部署钩子

---

## 🔗 相关链接

- **GitHub**: https://github.com/chengjon/Claude-Kits
- **官方文档**: https://code.claude.com/docs
- **问题反馈**: https://github.com/chengjon/Claude-Kits/issues

---

## ⚠️ 注意事项

1. **安全安装** - 不会覆盖原有设置
2. **兼容性** - 确保 Claude Code 版本兼容
3. **权限** - 某些功能需要额外权限
4. **更新** - 定期更新以获得最新功能

---

**整理者**: srxly888-creator
**最后更新**: 2026-03-31 12:52
