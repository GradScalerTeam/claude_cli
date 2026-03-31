# Claude Code 计算机操作完全指南

> **最后更新**: 2026-03-31 12:55
> **状态**: 🔥 火力全开 × 10

---

## 🖥️ 计算机操作功能

### ✅ 功能概述

Claude Code 现在支持**计算机控制**功能！

Claude 可以直接通过命令行界面 (CLI)：
- ✅ **打开应用程序** - 启动桌面应用
- ✅ **浏览用户界面** - 识别 UI 元素
- ✅ **测试构建内容** - 自动化测试
- ✅ **执行操作** - 点击、输入、导航

---

## 🚀 快速开始

### 基本用法

```bash
# 打开计算器
claude open /Applications/Calculator.app

# 或使用斜杠命令
/open calculator

# 让 Claude 操作
claude "打开计算器，计算 123 + 456"
```

### 高级用法

```bash
# 测试 Web 应用
claude "打开浏览器，访问 http://localhost:3000，
        测试登录功能"

# 操作桌面应用
claude "打开 VSCode，创建新文件 hello.py，
        写一个 Hello World 程序"

# 自动化工作流
claude "运行测试，打开浏览器查看结果，
        截图保存到 screenshots/ 目录"
```

---

## 📋 支持的操作

### 1. 应用程序控制

#### 打开应用
```bash
# macOS
claude open /Applications/Safari.app

# Windows
claude open "C:\Program Files\Google\Chrome\Application\chrome.exe"

# Linux
claude open /usr/bin/firefox
```

#### 关闭应用
```bash
claude "关闭 Safari"
```

---

### 2. UI 自动化

#### 点击操作
```bash
claude "点击 '登录' 按钮"
claude "双击文件图标"
claude "右键点击文件夹"
```

#### 输入操作
```bash
claude "在搜索框输入 'Hello World'"
claude "在文本框输入用户名和密码"
```

#### 导航操作
```bash
claude "滚动到页面底部"
claude "切换到下一个标签页"
claude "点击返回按钮"
```

---

### 3. 测试自动化

#### Web 应用测试
```bash
# 测试登录功能
claude "打开 http://localhost:3000/login
        输入用户名 'admin'，密码 'password'
        点击登录按钮
        验证是否跳转到首页"

# 测试表单提交
claude "填写注册表单
        输入邮箱、密码、确认密码
        点击提交
        验证是否显示成功消息"
```

#### 桌面应用测试
```bash
# 测试计算器
claude "打开计算器
        输入 123 + 456
        验证结果是否为 579"
```

---

## 🔧 技术实现

### macOS
- **AppleScript** - UI 自动化
- **Automator** - 工作流自动化
- **Accessibility API** - 辅助功能

```bash
# 示例：使用 AppleScript
osascript << 'EOF'
tell application "System Events"
    click button "登录" of window "登录"
end tell
EOF
```

### Linux
- **xdotool** - X11 自动化
- **wmctrl** - 窗口管理
- **ydotool** - Wayland 自动化

```bash
# 示例：使用 xdotool
xdotool click 1  # 左键点击
xdotool type "Hello World"
```

### Windows
- **AutoHotkey** - 热键和自动化
- **pyautogui** - Python GUI 自动化
- **Selenium** - Web 自动化

```bash
# 示例：使用 pyautogui
python -c "import pyautogui; pyautogui.click(100, 100)"
```

---

## ⚠️ 安全考虑

### 权限控制
```bash
# macOS 授予辅助功能权限
# 系统偏好设置 > 安全性与隐私 > 隐私 > 辅助功能
# 添加 Claude Code

# Linux 配置 X11 权限
xhost +local:
```

### 沙盒环境
```bash
# 使用虚拟环境隔离
claude --sandbox

# 限制文件访问
claude --restrict-path /tmp/test
```

### 操作确认
```bash
# 关键操作需要确认
claude --confirm-before-action

# 只读模式
claude --read-only
```

---

## 💡 最佳实践

### 1. 错误处理
```bash
# 添加超时
claude "在 10 秒内打开应用，
        如果失败则重试"

# 验证操作结果
claude "点击按钮后，
        验证是否显示新窗口"
```

### 2. 性能优化
```bash
# 并行执行
claude "同时打开 3 个浏览器标签页"

# 批量操作
claude "处理文件夹中的所有文件"
```

### 3. 日志记录
```bash
# 启用详细日志
claude --verbose --log-file operations.log

# 截图记录
claude "操作前截图保存到 screenshots/before/
        操作后截图保存到 screenshots/after/"
```

---

## 🎯 实战案例

### 案例 1: 自动化测试

```bash
claude "
1. 打开浏览器
2. 访问 http://localhost:3000
3. 点击登录按钮
4. 输入用户名 'test@example.com'
5. 输入密码 'password123'
6. 点击提交
7. 验证是否显示欢迎消息
8. 截图保存
"
```

### 案例 2: 批量文件处理

```bash
claude "
1. 打开文件管理器
2. 导航到 ~/Downloads
3. 选择所有 PDF 文件
4. 移动到 ~/Documents/PDFs/
5. 按日期创建子文件夹
6. 整理文件到对应文件夹
"
```

### 案例 3: 数据录入

```bash
claude "
1. 打开 Excel 应用
2. 创建新工作表
3. 输入数据行
4. 应用公式
5. 生成图表
6. 保存文件
"
```

---

## 📚 相关资源

### 官方文档
- [Claude Code 计算机控制](https://code.cclaude.com/docs/computer-control)
- [UI 自动化指南](https://code.claude.com/docs/ui-automation)

### 推荐仓库
- [claude-howto - 计算机控制示例](https://github.com/luongnv89/claude-howto)
- [claude-code-best-practice - 安全实践](https://github.com/shanraisshan/claude-code-best-practice)

---

## 🔍 故障排除

### 常见问题

#### 1. 无法打开应用
```bash
# 检查应用路径
which app-name

# macOS: 使用 open 命令
open -a ApplicationName

# Windows: 使用 start 命令
start ApplicationName
```

#### 2. UI 元素找不到
```bash
# 增加等待时间
claude --wait-timeout 10

# 使用模糊匹配
claude "点击包含 '登录' 的按钮"
```

#### 3. 权限被拒绝
```bash
# macOS: 授予辅助功能权限
# 系统偏好设置 > 安全性与隐私 > 隐私 > 辅助功能

# Linux: 配置 X11 权限
xhost +local:

# Windows: 以管理员身份运行
```

---

## 🎓 学习路径

### 入门（第 1 周）
1. ✅ 基本命令
2. ✅ 打开/关闭应用
3. ✅ 简单点击操作

### 进阶（第 2-3 周）
1. ✅ UI 自动化
2. ✅ 表单填写
3. ✅ 测试自动化

### 高级（第 4 周+）
1. ✅ 复杂工作流
2. ✅ 错误处理
3. ✅ 性能优化

---

**整理者**: srxly888-creator
**最后更新**: 2026-03-31 12:55
**标签**: #ClaudeCode #计算机控制 #UI自动化 #实战案例
