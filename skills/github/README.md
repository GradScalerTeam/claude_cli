# GitHub Skill

Wraps the `gh` CLI with a confirmation-first workflow. Creating repos, opening PRs, filing issues, pushing commits — all of it goes through an explicit approval step before anything touches a remote.

## What This Does

The `gh` CLI is fast and Claude is good at driving it, which is exactly the problem: a remote action is irreversible in a way a local file edit isn't. A pushed commit, a created PR, a deleted branch — none of those come back with an undo.

This skill sets the rules that make that safe. Every remote operation gets stated plainly first, then waits for your explicit go-ahead. Branch deletion is blocked outright unless you ask for it by name — merging a PR does **not** imply deleting its branch, and `--delete-branch` is off the table by default.

## When To Use It

Any GitHub-related action: creating a repo, pushing, opening or inspecting PRs, filing or reading issues, raw `gh api` calls. Claude picks it up automatically when the task involves GitHub.

## Requirements

- **`gh` CLI installed and authenticated** — `brew install gh` then `gh auth login`
- Check your setup with `gh auth status`

## Install

Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and install the github skill:

Copy skills/github/SKILL.md to ~/.claude/skills/github/SKILL.md with exact content. Exclude README.md. Create ~/.claude/skills/github/ if it doesn't exist.

Then run `gh auth status` to check that the gh CLI is installed and I'm logged in. If it isn't, tell me the commands to fix it — don't run a login flow yourself.

After installing, give me a summary of the confirmation rules this skill enforces.
```

Then quit your Claude CLI session and start a new one — skills only load at session startup.

## Check for Updates

Already installed and want the latest version? Paste this into your Claude CLI:

```
Go to the GitHub repo https://github.com/GradScalerTeam/claude_cli and check for updates to the github skill:

Compare skills/github/SKILL.md with my local version at ~/.claude/skills/github/SKILL.md. Tell me what changed. If there are updates, ask me whether I want you to explain the changes first or pull them straight into my local file.
```

## The Rules It Enforces

| Rule | Why |
|---|---|
| Confirm before **every** remote action | Remote operations don't have an undo |
| Never delete branches unless explicitly asked | Merging a PR is not permission to delete its branch |
| State the action, wait, then execute | You see what's about to happen while you can still stop it |
| No `Co-Authored-By` tags on commits | Keeps authorship clean |
| Report the result with URLs | You get a link to verify, not just "done" |

