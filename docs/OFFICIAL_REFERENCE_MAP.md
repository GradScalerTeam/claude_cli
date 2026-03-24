# Official Reference Map

This file shows which Anthropic Claude Code docs informed the refreshed tutorials in this repository.

更新时间 / Last reviewed: **2026-03-24**

---

## Mapping Table

| Repo guide | Official Anthropic docs | Why it matters |
|---|---|---|
| `CLAUDE_SETUP.md` / `CLAUDE_SETUP_CN.md` | Claude Code overview, Getting started, Quickstart, CLI reference, Built-in commands, Memory, Settings, Troubleshooting | Establishes the current install, login, command, memory, and config model |
| `HOW_TO_START_NEW_PROJECT.md` / `_CN` | Common workflows, Memory, Settings, Subagents, Skills | Supports the updated plan-first, memory-first, slice-based build workflow |
| `HOW_TO_START_EXISTING_PROJECT.md` / `_CN` | Common workflows, Plan Mode guidance, Memory, Git worktree workflow | Justifies read-only exploration, flow documentation, and safe parallelism |
| `HOW_TO_CREATE_AGENTS.md` / `_CN` | Subagents | Replaces older plugin-centric explanations with the current `/agents` workflow |
| `HOW_TO_CREATE_SKILLS.md` / `_CN` | Extend Claude with skills, Slash commands | Aligns repo guidance with the modern `SKILL.md` model |
| `hooks/*` docs | Hooks guide, Hooks reference | Confirms hook events, matchers, config shape, and security cautions |
| repo-wide scope guidance | Settings, Memory, MCP | Clarifies user/project/local scope so tutorials stay maintainable |

---

## Official Pages To Read Alongside This Repo

These are the most useful official references to keep nearby:

1. Claude Code overview
   https://docs.anthropic.com/en/docs/claude-code/overview
2. Set up Claude Code
   https://docs.anthropic.com/en/docs/claude-code/getting-started
3. Quickstart
   https://docs.anthropic.com/en/docs/claude-code/quickstart
4. Common workflows
   https://docs.anthropic.com/en/docs/claude-code/tutorials
5. CLI reference
   https://docs.anthropic.com/en/docs/claude-code/cli-reference
6. Built-in commands
   https://code.claude.com/docs/en/commands
7. Manage Claude's memory
   https://docs.anthropic.com/en/docs/claude-code/memory
8. Claude Code settings
   https://docs.anthropic.com/en/docs/claude-code/settings
9. Subagents
   https://docs.anthropic.com/en/docs/claude-code/sub-agents
10. Extend Claude with skills
    https://code.claude.com/docs/en/skills
11. Slash commands
    https://docs.anthropic.com/en/docs/claude-code/slash-commands
12. Get started with Claude Code hooks
    https://docs.anthropic.com/en/docs/claude-code/hooks-guide
13. Hooks reference
    https://docs.anthropic.com/en/docs/claude-code/hooks
14. Connect Claude Code to tools via MCP
    https://docs.anthropic.com/en/docs/claude-code/mcp
15. Troubleshooting
    https://docs.anthropic.com/en/docs/claude-code/troubleshooting
16. Manage costs effectively
    https://docs.anthropic.com/en/docs/claude-code/costs

---

## Maintenance Notes

When Anthropic updates Claude Code significantly, re-check these areas first:

1. installation method and minimum requirements
2. built-in slash commands
3. memory and settings hierarchy
4. subagent creation flow
5. skill frontmatter and file layout
6. hook event names and config shape
7. MCP scope and approval behavior

Those are the parts most likely to make a tutorial feel outdated fastest.
