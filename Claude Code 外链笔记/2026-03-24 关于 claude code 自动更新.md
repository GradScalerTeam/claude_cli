学习日记：
你这台机器上的 Claude Code 不是用 Homebrew 公式装的，也不是 Python 包，而是全局 npm 安装的 @anthropic-ai/claude-code@2.1.81。/opt/homebrew/bin/claude 这个路径容易让人误会，但这里是因为你的 Node/npm 前缀在 Homebrew 目录下，不代表它是 brew install 装的。

我查到的状态是：

- 当前版本：2.1.81
- 安装方式：npm-global
- 自动更新：enabled
- 更新通道：latest
- 版本锁：无
  平时直接这样更新就行：claude update
  
**==如果哪天 claude update 异常，再用这个兜底：npm install -g @anthropic-ai/claude-code@latest==**
确认状态可以用：claude --version claude doctor
![[Pasted image 20260324100545.png]]
这 5 个最实用，基本够你日常用了。

```bash
gemini
```
进入交互模式，适合边问边改，像在终端里开一个 AI 助手。

```bash
gemini -p "帮我总结当前项目的目录结构和核心功能"
```
快速读当前目录，适合接手一个新项目时先摸清楚。

```bash
gemini -p "解释这个报错的根因，并给出修复步骤" < error.log
```
把日志直接喂给它，让它分析报错。处理构建失败、服务报错很方便。

```bash
gemini -p "为这个仓库生成一条清晰的 commit message"
```
适合你改完代码后，让它帮你整理提交说明。

```bash
gemini -p "写一个 bash 脚本：把当前目录下所有 png 转成 jpg，保留文件名"
```
适合生成一次性脚本、SQL、正则、数据处理命令。

如果你想要更贴近你的实际场景，我也可以直接给你 5 个“做公众号/文档/自动化”方向的 Gemini CLI 用法。
可以，按你这种场景，最实用的是这 5 个。

```bash
gemini -p "把这份采访录音整理成一篇适合微信公众号的文章，目标读者是职场妈妈，语气真诚、克制、有信息量" < transcript.txt
```
适合把访谈、会议纪要、聊天记录直接转成公众号初稿。

```bash
gemini -p "基于这篇草稿，给我 10 个微信公众号标题，分成'理性信息型'、'情绪共鸣型'、'故事悬念型'三类" < draft.md
```
适合标题打磨，不用自己硬想。

```bash
gemini -p "把这篇文章改写成一页内部说明文档，保留结论、行动建议和风险提示，去掉煽情表达" < article.md
```
同一份内容，一键改成文档/汇报口径。

```bash
gemini -p "从这堆笔记里提炼出：1. 核心观点 2. 可做成公众号的选题 3. 每个选题的 3 段式结构" < notes.txt
```
适合做选题库和内容策划。

```bash
gemini -p "写一个 bash 脚本：扫描当前目录下所有 Markdown 文件，列出标题、字数、最后修改时间，输出成 content_index.csv"
```
适合做内容资产整理，后面拿来做归档、选题盘点、自动化管理都方便。

如果你愿意，我也可以继续给你一套“公众号写作工作流”，比如“录音转文稿 -> 初稿 -> 标题 -> 摘要 -> 朋友圈文案”的 Gemini CLI 串联命令。
可以，给你一套很实用的“公众号写作工作流”命令链。假设你手上已经有逐字稿 `transcript.txt`。

```bash
gemini -p "把这份逐字稿整理成一篇微信公众号文章初稿。要求：保留真实细节；去掉重复口语；结构清晰；不要空话；结尾给出一个自然收束。" < transcript.txt > draft.md
```

```bash
gemini -p "基于这篇初稿，做一次深度改写。要求：语言更顺，段落更短，更适合手机阅读；保留事实和原意；不要夸张标题党。" < draft.md > draft_v2.md
```

```bash
gemini -p "为这篇文章生成 12 个公众号标题，分成 3 类：信息型、共鸣型、故事型。每个标题都尽量具体，不要套话。" < draft_v2.md > titles.txt
```

```bash
gemini -p "为这篇文章写 3 个摘要版本：1 个用于公众号摘要，1 个用于朋友圈转发，1 个用于知识星球/社群推荐语。" < draft_v2.md > promo.txt
```

```bash
gemini -p "检查这篇文章，输出三部分：1. 逻辑不顺的地方 2. 可删减的重复内容 3. 可以增强说服力的位置。不要直接重写，只给编辑建议。" < draft_v2.md > edit_notes.md
```

如果你是“多篇内容一起管理”，再补两个自动化方向的命令：

```bash
gemini -p "从这个内容目录的所有 Markdown 文章里，提炼每篇的主题、目标读者、一句话摘要，并给出一个选题表结构建议。"
```

```bash
gemini -p "写一个脚本：批量读取当前目录的 Markdown 文章，统计标题、字数、标签占位、更新时间，输出 CSV。"
```

你平时最顺手的流程通常会是：
1. `transcript.txt -> draft.md`
2. `draft.md -> draft_v2.md`
3. `draft_v2.md -> titles.txt`
4. `draft_v2.md -> promo.txt`
5. `draft_v2.md -> edit_notes.md`

如果你愿意，我可以直接在你这个目录里给你搭一个可复用的公众号写作脚本，比如一条命令自动生成 `draft/titles/promo/edit_notes` 这四个文件。