# Git Sync — Claude Code Mod

A **mod** that keeps your git state visible while Claude works: a `git ↑N ↓M` entry in the status line, and a band above the prompt when commits arrive on the remote or files are in conflict.

Built for the Claude desktop app (Code tab). It draws in the terminal too. Want the full list of changed files with diffs? That's its sibling mod, **[Git Diff](../git-diff/)**.

---

## Why Use It

When Claude edits files for an hour, you lose track of where the repo stands. And if a teammate pushes in the meantime, you only find out when your push fails.

This mod fixes both without leaving the session. The status line always shows how many files are staged, modified, new or in conflict, and how far you are from the remote. A band tells you about incoming commits before you push, with a Pull button right there.

It runs git itself and never calls the model, so it costs no tokens.

---

## What It Does

### Status line entry

```
git !1 +2 *3 ~1 · ↑0 ↓2
    └┘ └┘ └┘ └┘   └──────┘
    │  │  │  │    ahead / behind the upstream
    │  │  │  untracked (new) files
    │  │  modified, not staged
    │  staged
    conflicts
```

Each count only shows when it isn't zero. `↑0 ↓0` always shows, so being level with the remote is visible at a glance. With no upstream it says `no upstream`. When the session folder holds several repos (say `frontend/` and `backend/`, each with its own `.git`), every repo gets its own part, named, so you can tell which one needs a pull.

### The band above the prompt

It shows up only when something needs you:

| Situation | Band | Buttons |
|---|---|---|
| Merge conflicts (or a merge/rebase/cherry-pick paused on one) | `Conflicts · 2 files in conflict src/app.ts and 1 more` | Dismiss |
| Commits on the remote you don't have | `↓ 3 incoming · Alice: fix login redirect` | Pull · Dismiss |

**Pull** runs `git pull --ff-only`, so it can never start a merge. If your branch has diverged, it fails with git's message instead. A dismissed band comes back when the situation changes, for example when new commits arrive or different files conflict. Pull only happens when you press it. Claude never runs it on its own.

---

## How It Stays Current

```
  every 3 min ─────────► fetch + re-read ─┐
  Bash / Edit / Write ──► re-read ────────┼──► one snapshot per repo ──► status line, band
  turn ends ────────────► re-read ────────┘
```

Only the 3-minute timer reaches the remote (`git fetch`). Everything else re-reads local state, which is cheap. Because it re-reads after every tool call that can change files, the status line updates the moment Claude edits something.

Only one refresh runs at a time. A request that arrives mid-refresh triggers one more pass afterwards, so the last edit is never missed. If the remote can't be reached, the mod keeps showing the last fetched state.

---

## Safety

The mod runs git on its own, in every repo it finds, including child folders you never opened. A repo's `.git/config` can name programs for git to run: a filter driver on `git status`, a credential helper or SSH command on a fetch, hooks on a pull. A clone never copies that file, but a folder that arrived with its `.git` already inside (an extracted archive, a synced folder, someone else's checkout) can carry one.

Two layers stop that:

1. **A config check before anything else, using an allowlist.** For each repo found, the mod reads its config with `git config --list --show-scope`, which only reads files. Every key in the repo's *own* config (local or worktree scope) must be on a list of settings known to run nothing: what `git init` and `git clone` write, remotes and branches, `user.*`, `pull.rebase`, and the extras VS Code, the GitHub CLI and Git LFS add. One key that isn't on the list and the mod skips the repo completely: no status, no fetch. Because it's an allowlist, a setting nobody thought of fails safe. The status line shows that repo as `not watched`, and a toast names the key.
2. **Flags on every command**, which win over the repo's own config. They turn off `core.fsmonitor`, hooks and the `ext::`/`file::` transports. They keep git out of submodules (`submodule.recurse=false`, `fetch.recurseSubmodules=false`, `--ignore-submodules=all` on status, `--no-recurse-submodules` on fetch and pull), because each submodule has its own config the check never reads. And they stop signature checks (`log.showSignature=false`, `merge.verifySignatures=false`, `git log --no-show-signature`), which would run gpg.

Your **global** config is yours, so it never blocks a repo: Git LFS's filter, your credential helper and your SSH settings keep working. The cost is a repo with an unusual local setting, harmless or not. It shows as `not watched` until that key is added to `SAFE_KEY` in `hooks/git.ts`, which is a one-line change. Both layers live in that file.

---

## Files

| File | Role |
|---|---|
| `.claude-plugin/plugin.json` | Mod manifest: name, version, description |
| `hooks/hooks.json` | Points Claude Code at `register.tsx` |
| `hooks/register.tsx` | Entry point: the fetch timer, tool-call and turn hooks, the band |
| `hooks/snapshot.ts` | Reads `git status` and the incoming/outgoing commits per repo, builds the status line text, runs Pull |
| `hooks/git.ts` | The single way the mod runs git, plus repo discovery |
| `types/index.d.ts` | The mod's state shape |

The mod is listed in this repo's marketplace at [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json).

---

## Install

Needs `git` on your PATH. Type this at the prompt of a terminal Claude Code session:

```
/plugin install git-sync --marketplace GradScalerTeam/claude_cli
```

Answer `y` to add the marketplace, then pick a scope (user scope turns it on in every project). It's active right away.

**In the desktop app**, where `/plugin` doesn't run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `GradScalerTeam/claude_cli`, then **Add plugin** and pick `git-sync`.

## Check for Updates

```bash
claude plugin update git-sync@gradscaler-mods
```

Then run `/reload-plugins` in an open session, or start a new one.

> **Upgrading from 0.2.0?** Version 0.2.0 also held the `/git-diff` Changes pane. From 0.3.0 that pane is its own mod, [Git Diff](../git-diff/). Install it as well if you used the pane.

---

## Customization

The intervals are constants at the top of their files:

| Constant | File | Default | What It Controls |
|---|---|---|---|
| `FETCH_EVERY_MS` | `hooks/register.tsx` | 3 minutes | How often the mod fetches from the remote |
| `LIST_LIMIT` | `hooks/snapshot.ts` | 8 | Incoming commits counted before the band shows `8+` |
