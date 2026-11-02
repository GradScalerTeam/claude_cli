// git-sync/hooks/snapshot.ts
// The repo snapshots the band and status line draw from, one per repo found: reading them, refreshing them (with an optional fetch),
// the status line text, and the git actions buttons run.

import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import type { Commit, GitSnapshot, PausedOp } from '../types'
import { findRepos, git } from './git'
import type { Repo } from './git'

export const LIST_LIMIT = 8

// The engine's state scan reads atoms declared in the file that uses them, so each file of this mod declares the ones it reads.
// repos replaced the single `snapshot` when several repos arrived; keep its shape tag the same in every file.
const repos = atom({ plugin: 'git-sync', key: 'repos' } as const, null, { shape: 'repos-3' })

// One line per commit: hash, author, relative age, subject (tab-separated so subjects may hold spaces).
async function commits($: EngineInterface, root: string, range: string): Promise<Commit[]> {
  const { exitCode, stdout } = await git($, root, ['log', '--format=%h%x09%an%x09%ar%x09%s', `-n${LIST_LIMIT + 1}`, range])
  if (exitCode !== 0) return []
  return stdout
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [hash, author, age, ...rest] = line.split('\t')
      return { hash, author, age: age.replace(' ago', ''), subject: rest.join('\t') }
    })
}

// A ref that only exists while that operation is stopped part way.
async function pausedOp($: EngineInterface, root: string): Promise<PausedOp> {
  for (const [ref, op] of [['MERGE_HEAD', 'merge'], ['REBASE_HEAD', 'rebase'], ['CHERRY_PICK_HEAD', 'cherry-pick']] as const) {
    if ((await git($, root, ['rev-parse', '-q', '--verify', ref])).exitCode === 0) return op
  }
  return null
}

// all: every repo found, so a parent repo can leave out the child repos it would otherwise count as untracked folders ("frontend/").
async function readSnapshot($: EngineInterface, repo: Repo, all: Repo[], previous: GitSnapshot | undefined): Promise<GitSnapshot> {
  const { root, name, blocked } = repo
  const base = { name, root, busy: previous?.busy ?? null, error: null, checkedAt: await $.clock.now(), blocked }
  const empty = { branch: '', upstream: null, ahead: 0, behind: 0, staged: 0, modified: 0, untracked: 0, conflicts: [], paused: null, incoming: [], outgoing: [] }
  // Not even a status: with a filter driver configured, status alone can run it.
  if (blocked) return { ...empty, ...base }
  const status = await git($, root, ['status', '--porcelain=v2', '--branch', '--untracked-files=all'])
  if (status.exitCode !== 0) {
    const said = status.stderr.trim().split('\n')[0]
    return { ...empty, ...base, error: `git status failed: ${said}` }
  }

  const nested = new Set(all.filter(r => r.root.startsWith(`${root}/`)).map(r => `${r.root.slice(root.length + 1)}/`))
  let branch = ''
  let upstream: string | null = null
  let ahead = 0
  let behind = 0
  let staged = 0
  let modified = 0
  let untracked = 0
  const conflicts: string[] = []
  for (const line of status.stdout.split('\n')) {
    if (line.startsWith('# branch.head ')) branch = line.slice(14)
    else if (line.startsWith('# branch.upstream ')) upstream = line.slice(18)
    else if (line.startsWith('# branch.ab ')) {
      const [a, b] = line.slice(12).split(' ')
      ahead = Number(a.slice(1))
      behind = Number(b.slice(1))
    } else if (line.startsWith('u ')) {
      conflicts.push(line.split(' ').slice(10).join(' '))
    } else if (line.startsWith('1 ') || line.startsWith('2 ')) {
      // The XY field: X is the staged side, Y the working tree; '.' means unchanged there.
      const [x, y] = line.slice(2, 4)
      if (x !== '.') staged += 1
      if (y !== '.') modified += 1
    } else if (line.startsWith('? ') && !nested.has(line.slice(2))) {
      untracked += 1
    }
  }

  const [incoming, outgoing, paused] = await Promise.all([
    upstream ? commits($, root, 'HEAD..@{u}') : Promise.resolve([]),
    upstream ? commits($, root, '@{u}..HEAD') : Promise.resolve([]),
    pausedOp($, root),
  ])
  return { branch, upstream, ahead, behind, staged, modified, untracked, conflicts, paused, incoming, outgoing, ...base }
}

// One repo's part: file changes, then ahead/behind. Same marks as the terminal status line: !conflicts +staged *modified ~new, each only
// when it isn't zero; push/pull always shows, ↑0 ↓0 included, so being level with the remote is visible at a glance.
function repoStatus(s: GitSnapshot): string {
  if (s.blocked) return 'not watched'
  const counts = [
    s.conflicts.length > 0 && `!${s.conflicts.length}`,
    s.staged > 0 && `+${s.staged}`,
    s.modified > 0 && `*${s.modified}`,
    s.untracked > 0 && `~${s.untracked}`,
  ].filter(Boolean)
  const remote = s.upstream ? `↑${s.ahead} ↓${s.behind}` : 'no upstream'
  return `${counts.length > 0 ? `${counts.join(' ')} · ` : ''}${remote}`
}

// One repo: no name, since Claude Desktop already shows the folder. Several: each named, so you can tell which one needs a pull.
export function statusLine(list: GitSnapshot[]): string | undefined {
  if (list.length === 0) return undefined
  if (list.length === 1) return `git ${repoStatus(list[0])}`
  return `git ${list.map(s => `${s.name} ${repoStatus(s)}`).join(' · ')}`
}

// One refresh at a time: the timer, a turn ending, a tool call and a button can all ask at once.
// A request that lands mid-refresh runs once more after it, so the last edit is never missed.
let running: Promise<void> | null = null
let again = false
// Repos already explained in a toast: the status line can only say "not watched", so the reason is told once per load.
const warned = new Set<string>()

export function refresh($: EngineInterface, withFetch: boolean): Promise<void> {
  if (running) {
    again = true
    return running
  }
  running = (async () => {
    const found = await findRepos($)
    const previous = (await read($, repos)) ?? []
    const next = await Promise.all(
      found.map(async repo => {
        let error: string | null = null
        if (repo.blocked && !warned.has(repo.root)) {
          warned.add(repo.root)
          $.ui.toast(`Git sync is not watching ${repo.name}: ${repo.blocked}.`)
        }
        if (withFetch && !repo.blocked) {
          const fetched = await git($, repo.root, ['fetch', '--quiet'], 60_000).catch(() => null)
          if (!fetched || fetched.exitCode !== 0) error = 'Could not reach the remote; showing the last fetched state.'
        }
        const snap = await readSnapshot($, repo, found, previous.find(p => p.root === repo.root))
        return snap.error ? snap : { ...snap, error }
      }),
    )
    await update($, repos, () => next)
    $.ui.status(statusLine(next))
  })()
    .catch(() => {
      // Something outside git's own answers failed (the engine, the disk): keep the last snapshot rather than leave a half-written one.
    })
    .finally(() => {
      running = null
      if (again) {
        again = false
        void refresh($, false)
      }
    })
  return running
}

async function setBusy($: EngineInterface, root: string, busy: string | null) {
  await update($, repos, list => (list ? list.map(s => (s.root === root ? { ...s, busy } : s)) : list))
}

// Runs a git command a button asked for in one repo, reports the first line git gave back, then re-reads.
export async function runAction($: EngineInterface, root: string, label: string, args: string[]) {
  await setBusy($, root, `${label}…`)
  const result = await git($, root, args, 120_000).catch(e => ({ exitCode: 1, stdout: '', stderr: String(e) }))
  await setBusy($, root, null)
  const said = (result.exitCode === 0 ? result.stdout || result.stderr : result.stderr || result.stdout).trim().split('\n')[0]
  if (result.exitCode !== 0) $.ui.toast(`${label} failed: ${said}`)
  else $.ui.toast(`${label} done${said ? `: ${said}` : ''}`)
  await refresh($, false)
}
