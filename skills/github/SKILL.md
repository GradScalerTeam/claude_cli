---
name: github
description: GitHub CLI operations — creating repos, pushing, PRs, issues, branch management. Use when any GitHub-related action is needed.
disable-model-invocation: false
---

# GitHub CLI Access

The `gh` CLI is installed and authenticated as **dev-arctik** via HTTPS.

## Rules
- **ALWAYS ask the user for confirmation before any GitHub action** — this includes creating repos, pushing code, creating PRs/issues, deleting branches, and any other remote operation.
- **NEVER delete branches (local or remote) unless the user explicitly says to delete them.** Do NOT use `--delete-branch` with `gh pr merge` or run `git branch -d/-D` or `git push origin --delete` unless the user specifically requests branch deletion. Merging a PR does NOT imply deleting its branch.
- Never assume permission. Confirm first, then act.
- Do NOT add `Co-Authored-By` tags on commits.

## Available Operations
- `gh repo create` — create new repositories
- `gh pr create` — open pull requests
- `gh issue create` — file issues
- `git push` — push commits to remote
- `gh pr view/list` — inspect PRs
- `gh issue view/list` — inspect issues
- `gh api` — raw GitHub API calls

## Workflow
1. User asks for a GitHub-related action
2. Clearly state what you are about to do
3. Wait for explicit user approval
4. Execute the action
5. Report the result (include URLs where applicable)
