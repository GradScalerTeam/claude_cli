// git-diff/hooks/snapshot.ts
// The repo snapshots the /git-diff pane draws from, one per repo found: reading them from `git status`, refreshing them, and the
// Stage / Unstage actions its buttons run. A refresh also keeps the pane's expanded files and their diffs current. Local only: no fetch.

import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import type { ChangedFile, GitSnapshot } from '../types'
import { diffKey, loadDiff } from './diff'
import { findRepos, git } from './git'
import type { Repo } from './git'

// The engine's state scan reads atoms declared in the file that uses them, so each file of this mod declares the ones it reads.
const repos = atom({ plugin: 'git-diff', key: 'repos' } as const, null, { shape: 'repos-2' })
const expanded = atom({ plugin: 'git-diff', key: 'expanded' } as const, [])
const diffs = atom({ plugin: 'git-diff', key: 'diffs' } as const, {}, { shape: 'diffs-1' })

// all: every repo found, so a parent repo can leave out the child repos it would otherwise list as untracked folders ("frontend/").
async function readSnapshot($: EngineInterface, repo: Repo, all: Repo[], previous: GitSnapshot | undefined): Promise<GitSnapshot> {
  const { root, name, blocked } = repo
  const base = { name, root, busy: previous?.busy ?? null, blocked }
  // Not even a status: with a filter driver configured, status alone can run it.
  if (blocked) return { branch: '', upstream: null, ahead: 0, behind: 0, files: [], ...base, error: null }
  // -uall lists each untracked file rather than its folder, so every row of the pane opens a diff.
  const status = await git($, root, ['status', '--porcelain=v2', '--branch', '--untracked-files=all'])
  if (status.exitCode !== 0) {
    const said = status.stderr.trim().split('\n')[0]
    return { branch: '', upstream: null, ahead: 0, behind: 0, files: [], ...base, error: `git status failed: ${said}` }
  }

  const nested = new Set(all.filter(r => r.root.startsWith(`${root}/`)).map(r => `${r.root.slice(root.length + 1)}/`))
  let branch = ''
  let upstream: string | null = null
  let ahead = 0
  let behind = 0
  const files: ChangedFile[] = []
  const file = (path: string, origPath: string | null, group: ChangedFile['group'], code: string) => files.push({ repo: name, root, path, origPath, group, code })
  for (const line of status.stdout.split('\n')) {
    if (line.startsWith('# branch.head ')) branch = line.slice(14)
    else if (line.startsWith('# branch.upstream ')) upstream = line.slice(18)
    else if (line.startsWith('# branch.ab ')) {
      const [a, b] = line.slice(12).split(' ')
      ahead = Number(a.slice(1))
      behind = Number(b.slice(1))
    } else if (line.startsWith('u ')) {
      file(line.split(' ').slice(10).join(' '), null, 'conflict', 'U')
    } else if (line.startsWith('1 ') || line.startsWith('2 ')) {
      // The XY field: X is the staged side, Y the working tree; '.' means unchanged there.
      const [x, y] = line.slice(2, 4)
      // A rename (2) has a score field more than an ordinary change (1), then "new<TAB>old".
      const [path, origPath = null] = line.split(' ').slice(line.startsWith('2 ') ? 9 : 8).join(' ').split('\t')
      if (x !== '.') file(path, origPath, 'staged', x)
      if (y !== '.') file(path, null, 'unstaged', y)
    } else if (line.startsWith('? ') && !nested.has(line.slice(2))) {
      file(line.slice(2), null, 'untracked', '?')
    }
  }
  return { branch, upstream, ahead, behind, files, ...base, error: null }
}

// Which files stay open after the list changed (a stage, an unstage, an edit, a commit), by diff key.
// A row that left its group but whose file is still listed elsewhere in the same repo (you pressed Stage on it) stays open in its new group.
export function followExpanded(keys: string[], files: ChangedFile[]): string[] {
  const listed = new Set(files.map(diffKey))
  const kept: string[] = []
  for (const key of keys) {
    // key is repo:group:path; the group never holds a colon, the path may.
    const [repo, , ...rest] = key.split(':')
    const path = rest.join(':')
    const moved = files.find(f => f.repo === repo && f.path === path && !keys.includes(diffKey(f)))
    const target = listed.has(key) ? key : moved && diffKey(moved)
    if (target && !kept.includes(target)) kept.push(target)
  }
  return kept
}

// One refresh at a time: the poll, a turn ending, a tool call and a button can all ask at once.
// A request that lands mid-refresh runs once more after it, so the last edit is never missed.
let running: Promise<void> | null = null
let again = false

export function refresh($: EngineInterface): Promise<void> {
  if (running) {
    again = true
    return running
  }
  running = (async () => {
    const found = await findRepos($)
    const previous = (await read($, repos)) ?? []
    const next = await Promise.all(found.map(repo => readSnapshot($, repo, found, previous.find(p => p.root === repo.root))))
    await update($, repos, () => next)

    const open = await read($, expanded)
    if (open.length > 0) {
      const files = next.flatMap(s => s.files)
      const kept = followExpanded(open, files)
      if (kept.join('|') !== open.join('|')) await update($, expanded, () => kept)
      const views = await Promise.all(kept.map(k => loadDiff($, files.find(f => diffKey(f) === k)!)))
      await update($, diffs, () => Object.fromEntries(views.map(v => [v.key, v])))
    }
  })()
    .catch(() => {
      // Something outside git's own answers failed (the engine, the disk): keep the last snapshot rather than leave a half-written one.
    })
    .finally(() => {
      running = null
      if (again) {
        again = false
        void refresh($)
      }
    })
  return running
}

async function setBusy($: EngineInterface, root: string, busy: string | null) {
  await update($, repos, list => (list ? list.map(s => (s.root === root ? { ...s, busy } : s)) : list))
}

// Runs a git command a button asked for in one repo, toasts only on failure (the list itself shows a stage worked), then re-reads.
export async function runAction($: EngineInterface, root: string, label: string, args: string[]) {
  await setBusy($, root, `${label}…`)
  const result = await git($, root, args, 120_000).catch(e => ({ exitCode: 1, stdout: '', stderr: String(e) }))
  await setBusy($, root, null)
  if (result.exitCode !== 0) $.ui.toast(`${label} failed: ${(result.stderr || result.stdout).trim().split('\n')[0]}`)
  await refresh($)
}
