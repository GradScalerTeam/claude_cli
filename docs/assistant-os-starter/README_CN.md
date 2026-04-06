# Assistant-OS 起步模板

**[English](README.md)** | 中文

这是一套可直接复制到个人 `assistant-os` 项目里的起步模板，用来补齐教程里提到的 4 个关键文件：

- `context/manifests/reference_manifest.md`
- `context/protocols/inbox-triage-protocol.md`
- `context/protocols/daily-review-protocol.md`
- `context/protocols/weekly-review-protocol.md`

这些模板的目标不是替你一次性设计完整系统，而是先把 3 件事固定下来：

- Claude 先读什么
- 不同任务按什么流程做
- 哪些内容可以写入长期记忆，哪些不可以

## 目录

```text
docs/assistant-os-starter/
├── README.md
├── README_CN.md
└── context/
    ├── manifests/
    │   └── reference_manifest.md
    └── protocols/
        ├── inbox-triage-protocol.md
        ├── daily-review-protocol.md
        └── weekly-review-protocol.md
```

## 使用方式

1. 把 `context/` 目录复制到你的 `assistant-os/` 根目录下。
2. 根据你的真实目录结构修改 `reference_manifest.md` 里的路径、读写边界和单一事实来源。
3. 在你的 `CLAUDE.md` 里把 `context/manifests/reference_manifest.md` 和 `context/protocols/` 声明为规则入口。
4. 连续用几天，再根据实际节奏微调 protocol，而不是一开始就写得很复杂。

## 模板列表

- [reference_manifest.md](context/manifests/reference_manifest.md)
- [inbox-triage-protocol.md](context/protocols/inbox-triage-protocol.md)
- [daily-review-protocol.md](context/protocols/daily-review-protocol.md)
- [weekly-review-protocol.md](context/protocols/weekly-review-protocol.md)

## 说明

- 模板正文使用英文标题，是为了让结构更稳定、也更便于直接复用到 Claude 的工作流里。
- 你完全可以把正文改成中文；关键是保留“职责、输入、步骤、输出、写入规则”这几层结构。
- 这套模板默认对应 [HOW_TO_START_ASSISTANT_SYSTEM_CN.md](../../HOW_TO_START_ASSISTANT_SYSTEM_CN.md) 里的最小骨架，而不是企业知识库或多仓库复杂体系。
