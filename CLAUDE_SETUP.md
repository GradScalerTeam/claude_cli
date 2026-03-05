# Claude Code CLI — Setup Guide

A complete guide to installing Claude Code CLI, setting it up in your terminal and VS Code, installing plugins, and learning the essential commands.

---

## What is Claude Code CLI?

Claude Code is a command-line tool by Anthropic that runs in your terminal. You talk to it in plain English, and it reads your code, writes code, runs commands, manages git, creates files, and handles entire development workflows — all from your terminal.

It's not a chatbot. It's an AI developer that lives in your terminal, understands your full codebase, and can execute real actions — create files, edit code, run tests, commit to git, and more.

Think of it this way: instead of switching between your editor, terminal, docs, and Stack Overflow, you just describe what you want and Claude does it.

---

## Installing Claude Code CLI

### macOS / Linux (Recommended)

Run this in your terminal:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

This is the native installer — no Node.js required, automatic updates built in.

### Windows (PowerShell)

```powershell
irm https://claude.ai/install.ps1 | iex
```

### Verify Installation

After installing, run:

```bash
claude --version
```

Then run the doctor command to check everything is set up correctly:

```bash
claude doctor
```

---

## Authentication

When you run `claude` for the first time, it will ask you to authenticate. You have a few options:

1. **Claude Pro/Max Subscription** — log in with your claude.ai account. Your subscription includes Claude Code access. This is the simplest option for individual developers.

2. **Anthropic Console (API Billing)** — connects to your Anthropic Console account at console.anthropic.com. You pay per usage based on API billing.

3. **Enterprise** — configure Claude Code to use Amazon Bedrock, Google Vertex AI, or Microsoft Foundry if your organization uses those.

---

## Starting Claude Code

Open your terminal, navigate to your project directory, and type:

```bash
claude
```

That's it. You're now in a Claude Code session. Type what you want in plain English and it will start working.

**Examples of things you can say:**
- "Read the src/ folder and explain the architecture"
- "Fix the bug in the login function"
- "Create a new API endpoint for user registration"
- "Run the tests and fix any failures"
- "Commit these changes with a descriptive message"

---

## Claude Code in VS Code

You don't have to use Claude Code only in the terminal. There's an official VS Code extension that puts it right in your editor.

### Installation

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` on Windows/Linux)
3. Search for **"Claude Code"**
4. Install the one by **Anthropic** (the verified publisher)

### Using It

- Click the **Spark icon** in the VS Code sidebar to open Claude Code
- Start a new conversation with `Cmd+N` (Mac) or `Ctrl+N` (Windows)
- It works exactly like the terminal version, but integrated into your editor — it can see your open files, selections, and editor context

The extension also works with **Cursor**, **Windsurf**, and **VSCodium**.

---

## Essential Slash Commands

Inside a Claude Code session, you can use slash commands for quick actions. Here are the ones you'll use most:

| Command | What It Does |
|---|---|
| `/help` | Shows all available commands, including custom ones from plugins |
| `/stats` | Shows your usage analytics — graphs, activity streaks, model preferences |
| `/model` | Switch between Claude models (Opus, Sonnet, Haiku) |
| `/config` | Toggle features like thinking mode, prompt suggestions, auto-updates |
| `/clear` | Clear the current conversation history |
| `/compact` | Compress the conversation to save context window space |
| `/hooks` | Open the interactive hooks interface for event-driven automation |
| `/plugin` | Manage plugins — install, update, remove |
| `/install-github-app` | Set up the GitHub app for automated PR reviews |

Type `/help` in any session to see the full list, including any commands added by your plugins.

---

## Plugins

Plugins are bundles of agents, skills, slash commands, and hooks that extend what Claude Code can do. They're how you go from "Claude can write code" to "Claude can do a 12-phase security audit of my entire codebase."

### How to Install Plugins

Inside a Claude Code session, type:

```
/plugin
```

This opens the plugin manager. From there you can browse the official marketplace and install any plugin with a few clicks.

### Recommended Plugins

These are the plugins we use daily and recommend installing. They come from the official Claude plugins marketplace.

| Plugin | What It Does |
|---|---|
| **plugin-dev** | The toolkit for building your own plugins. Guides you through creating hooks, agents, skills, slash commands, MCP integrations, and plugin structure. Install this if you want to create custom tooling. |
| **feature-dev** | Full feature development workflow with specialized agents — codebase exploration, architecture design, code review, and quality checks. Good for building features end-to-end with agent support. |
| **pr-review-toolkit** | Comprehensive PR review using multiple specialized agents. Each agent focuses on a different aspect — comments, tests, error handling, type design, code quality, and simplification. |
| **code-review** | Automated code review for pull requests with confidence-based scoring. Uses multiple agents to review different dimensions and only surfaces high-confidence findings. |
| **commit-commands** | Streamlines your git workflow. Adds commands for committing, pushing, creating PRs, and cleaning up gone branches — all in one step. |
| **claude-md-management** | Tools to maintain and improve your CLAUDE.md files. Audits quality, captures session learnings, and keeps your project memory current. |
| **claude-code-setup** | Analyzes your codebase and recommends tailored Claude Code automations — hooks, skills, MCP servers, and subagents specific to your project. Great for first-time setup. |
| **code-simplifier** | An agent that simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality. Runs automatically after you write code. |
| **frontend-design** | Specialized skill for UI/UX implementation. Creates distinctive, production-grade frontend interfaces with high design quality. |
| **security-guidance** | A hook that warns about potential security issues when editing files — command injection, XSS, unsafe code patterns. Runs in the background and alerts you proactively. |
| **hookify** | Easily create hooks to prevent unwanted behaviors. Analyzes your conversation patterns and generates hooks that stop Claude from doing things you don't want. |
| **playground** | Creates interactive HTML playgrounds — self-contained single-file explorers with visual controls, live preview, and copy buttons. Useful for prototyping. |
| **skill-creator** | Create new skills, improve existing skills, and run evals to test skill performance. Use this if you're building custom skills. |
| **agent-sdk-dev** | Development toolkit for building with the Claude Agent SDK. Install this if you're building custom agents programmatically. |
| **ralph-loop** | Runs Claude in a continuous self-referential loop with the same prompt until task completion. Useful for iterative development where Claude keeps refining until done. |
| **explanatory-output-style** | Adds educational insights about implementation choices and codebase patterns to Claude's responses. Helps you learn while Claude works. |
| **learning-output-style** | Interactive learning mode that asks you to contribute at key decision points. Claude teaches while building. |

### Keep Checking for New Plugins

The Anthropic team and community are constantly shipping new plugins. Run `/plugin` periodically to check the marketplace — there's frequently something new that can improve your workflow.

---

## Custom Status Line

Claude Code has a status line at the bottom of the terminal that shows contextual information while you work. By default it's pretty basic, but you can replace it with a custom script that shows useful git info at a glance.

### What This Status Line Shows

```
project_name/src | main +2 *3 ~1 / ↑1 ↓2
```

Here's what each part means:

| Symbol | Color | Meaning |
|---|---|---|
| `project/folder` | default | Shortened path — last 2 segments of your current directory |
| `main` | **bold cyan** | Current git branch |
| `+2` | **green underlined** | 2 files staged (ready to commit) |
| `*3` | **yellow underlined** | 3 files modified (unstaged changes) |
| `~1` | **red underlined** | 1 untracked file (new, not added to git) |
| `↑1` | **blue underlined** | 1 commit ahead of remote |
| `↓2` | **magenta underlined** | 2 commits behind remote |

The local stats (staged/modified/untracked) and remote stats (ahead/behind) are separated by a `/` divider. If there are no changes, only the branch name shows. If you're not in a git repo, it just shows the shortened path.

### How to Install

**Step 1:** Copy the status line script to your Claude config directory:

```bash
# Create the file
cp scripts/statusline-command.sh ~/.claude/statusline-command.sh
```

Or if you're installing from the GitHub repo, copy the content from [`scripts/statusline-command.sh`](scripts/statusline-command.sh) and save it to `~/.claude/statusline-command.sh`.

**Step 2:** Add the status line configuration to your Claude settings. Open `~/.claude/settings.json` and add:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

If you already have other settings in `settings.json`, just add the `statusLine` key alongside them.

**Step 3:** Restart Claude Code. The new status line will appear at the bottom of your terminal.

### How It Works

The script receives JSON input from Claude Code via stdin containing workspace info (like the current directory). It runs a series of fast git commands using `--no-optional-locks` (so it never interferes with other git operations) and formats the output with ANSI color codes.

The script requires `jq` to parse the JSON input. Most systems have it installed — if not, install it with `brew install jq` (macOS) or `apt install jq` (Linux).

---

## What's Next

Now that you have Claude Code installed and set up, read these guides to start using it:

- **[Starting a New Project with Claude CLI](HOW_TO_START_NEW_PROJECT.md)** — how to set up a brand new project from scratch using Claude CLI
- **[Using Claude CLI in an Existing Project](HOW_TO_START_EXISTING_PROJECT.md)** — how to bring Claude CLI into a project you're already working on
