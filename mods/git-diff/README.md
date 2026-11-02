# Git Diff — Claude Code Mod

A **mod** that adds a `/git-diff` Changes pane beside the chat, laid out like VS Code's Source Control: staged and unstaged groups, a diff under each file you click (side by side when the pane is wide), and Stage/Unstage buttons.

Built for the Claude desktop app (Code tab). It draws in the terminal too. Want git state in the status line and a heads-up when commits arrive? That's its sibling mod, **[Git Sync](../git-sync/)**.

---

## Why Use It

After a long session, the transcript tells you what Claude did, but not what your working tree looks like now. You end up switching to your editor or running `git diff` in a terminal to review the changes before committing.

This pane puts that review next to the chat. Every changed file is listed by group, and clicking one opens its diff right below it. You can stage the files you're happy with as you go, without leaving the session.

It runs git itself and never calls the model, so it costs no tokens. It only reads git while the pane is open.

---

## What It Does

Type `/git-diff` to open the pane.

```
Changes                         Expand all · Collapse all · ⟳
▾ Merge Changes
    src/app.ts                                  !
▾ Staged Changes                               −
    README.md                          −        M
▾ Changes                                      +
    src/auth/login.ts                  +        M
    src/auth/session.ts                +        U
      ┌ Staged ↔ Working tree ───────────────────┐
      │ 12  12   export function login() {       │
      │ 13     − return redirect('/')            │
      │     13 + return redirect(next ?? '/')    │
      └──────────────────────────────────────────┘
```

The groups and letters follow VS Code: `M` modified, `A` added, `D` deleted, `U` untracked, `!` conflict. Each file row works as an accordion: click it and its diff opens right below, and several can stay open. The diff is side by side when the pane is wide (120+ columns) and inline when it's narrow. A header above each diff says which two versions it compares:

| Group | Compares |
|---|---|
| Staged Changes | Last commit ↔ Staged |
| Changes | Staged ↔ Working tree |
| Untracked | New file, shown whole |
| Merge Changes | The file on disk, with its `<<<<<<<` `=======` `>>>>>>>` markers picked out |

`+` stages a file and `−` unstages it, one at a time or a whole group at once. Staging a conflicted file marks it resolved, which is why that group has no stage-all: check each file for leftover markers first. On the desktop the `+`/`−` buttons appear on hover. Elsewhere they stay visible.

When the session folder holds several repos (say `frontend/` and `backend/`, each with its own `.git`), each repo gets its own collapsible section with its branch, and every command runs in that file's own repo.

**Nothing in the pane discards work.** It only ever runs `git diff`, `git add` and `git restore --staged`. It never fetches, pulls, pushes or commits.

---

## How It Stays Current

```
  /git-diff opens pane ─► re-read ────────┐
  pane open ────────────► re-read / 10s ──┤
  Bash / Edit / Write ──► re-read ────────┼──► one snapshot per repo ──► the pane
  turn ends ────────────► re-read ────────┘     (only while it is open)
```

All reads are local. Because it re-reads after every tool call that can change files, a file Claude just edited shows up in the pane immediately. The 10-second re-read catches edits you make in your own editor. Open diffs stay open across refreshes: when you stage a file whose diff is open, it stays open in its new group.

Only one refresh runs at a time. A request that arrives mid-refresh triggers one more pass afterwards, so the last edit is never missed. Diffs longer than 3,000 lines are cut, with a note saying so.

---

## Safety

The mod runs git on its own, in every repo it finds, including child folders you never opened. A repo's `.git/config` can name programs for git to run: a filter driver on `git status`, `git diff` or Stage (`git add`), a `textconv` or external diff tool on `git diff`. A clone never copies that file, but a folder that arrived with its `.git` already inside (an extracted archive, a synced folder, someone else's checkout) can carry one.

Two layers stop that:

1. **A config check before anything else, using an allowlist.** For each repo found, the mod reads its config with `git config --list --show-scope`, which only reads files. Every key in the repo's *own* config (local or worktree scope) must be on a list of settings known to run nothing: what `git init` and `git clone` write, remotes and branches, `user.*`, `pull.rebase`, and the extras VS Code, the GitHub CLI and Git LFS add. One key that isn't on the list and the pane lists the repo as **Not watched**, names the key, and runs no other git there. Because it's an allowlist, a setting nobody thought of fails safe. The list leaves out `http.*` on purpose: a repo's own `http.proxy` or `http.sslVerify=false` runs no program, but could send git's traffic, and the login your credential helper hands it, to someone else.
2. **Flags on every command**, which win over the repo's own config. They turn off `core.fsmonitor`, hooks and the `ext::`/`file::` transports. They keep git out of submodules (`submodule.recurse=false`, `diff.ignoreSubmodules=all`, and `--ignore-submodules=all` on status and diff), because each submodule has its own config the check never reads. And they stop signature checks, which would run gpg. `git diff` also gets `--no-ext-diff --no-textconv`.

Your **global** config is yours, so it never blocks a repo: Git LFS's filter, for one, keeps working. The cost is a repo with an unusual local setting, harmless or not. It shows as **Not watched** until that key is added to `SAFE_KEY` in `hooks/git.ts`, which is a one-line change. Both layers live in that file, and three tests guard them: `every git call disables fsmonitor, hooks, submodules and signatures`, `a key not on the safe list blocks the repo; tool-written keys do not`, and `a repo whose config names a program is not watched, and runs no git`.

---

## Files

| File | Role |
|---|---|
| `.claude-plugin/plugin.json` | Mod manifest: name, version, description |
| `hooks/hooks.json` | Points Claude Code at `register.tsx` |
| `hooks/register.tsx` | Entry point: the tool-call and turn hooks that refresh an open pane |
| `hooks/changes.tsx` | The pane itself, the `/git-diff` command, the poll |
| `hooks/snapshot.ts` | Reads `git status` per repo into the file list, runs Stage/Unstage |
| `hooks/diff.ts` | Runs the right `git diff` for a row and parses it into numbered lines |
| `hooks/git.ts` | The single way the mod runs git, plus repo discovery |
| `hooks/changes.test.tsx` | Tests for the pane against a fake git (`claude plugin test mods/git-diff`) |
| `types/index.d.ts` | The mod's state shape |

The mod is listed in this repo's marketplace at [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json).

---

## Install

Needs `git` on your PATH. Type this at the prompt of a terminal Claude Code session:

```
/plugin install git-diff --marketplace GradScalerTeam/claude_cli
```

Answer `y` to add the marketplace, then pick a scope (user scope turns it on in every project). It's active right away: type `/git-diff`.

**In the desktop app**, where `/plugin` doesn't run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `GradScalerTeam/claude_cli`, then **Add plugin** and pick `git-diff`.

> **Have Git Sync 0.2.0?** That version also held this pane, so both would answer `/git-diff`. Update Git Sync to 0.3.0 or later first (`claude plugin update git-sync@gradscaler-mods`).

## Check for Updates

```bash
claude plugin update git-diff@gradscaler-mods
```

Then run `/reload-plugins` in an open session, or start a new one.

---

## Customization

The constants sit at the top of their files:

| Constant | File | Default | What It Controls |
|---|---|---|---|
| `POLL_MS` | `hooks/changes.tsx` | 10 seconds | Local re-read while the pane is open |
| `SPLIT_MIN_COLUMNS` | `hooks/changes.tsx` | 120 | Pane width at which diffs switch to side by side |
| `MAX_LINES` | `hooks/diff.ts` | 3000 | Diff lines drawn before the rest is cut |
