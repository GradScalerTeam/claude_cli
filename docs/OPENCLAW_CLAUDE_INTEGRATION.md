# OpenClaw + Claude CLI Integration Guide

This OpenClaw-specific page has been replaced by a more general guide:

- [Long-Lived Assistant Systems + Claude CLI Integration Guide](ASSISTANT_CLAUDE_INTEGRATION.md)

The new version no longer assumes OpenClaw specifically, and it does not assume multi-machine deployment.
If you only have one computer, or your outer loop is just a bot, desktop assistant, cron loop, or always-on service, the general guide is the better starting point.

If you are using OpenClaw, map the layers like this:

- **OpenClaw** = outer-loop assistant system
- **Claude CLI** = repo executor
- **OpenClaw runtime / skills / plugins** = assistant-side capabilities
- **Claude CLI skills / subagents** = repo-side capabilities

OpenClaw is still a strong concrete example. The topic is just now documented in a broader way.

Related reading:

- [OpenClaw Agents vs Claude CLI Agents](OPENCLAW_AND_CLAUDE_AGENTS.md)
- [OpenClaw + Claude CLI Workflow Scenarios](OPENCLAW_CLAUDE_WORKFLOW_SCENARIOS.md)
