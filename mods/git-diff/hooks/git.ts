// git-diff/hooks/git.ts
// The one way this mod runs git, and how it finds the repos to watch: the session folder's own repo, plus any child folder with its own .git
// (a parent folder holding separate frontend and backend repos). Every command runs with -C <repo root>, so root-relative paths from
// `git status --porcelain` feed straight back into diff, add and restore.

import type { EngineInterface } from 'claude-code'

export type Repo = { root: string; name: string }

// Folders that never hold a repo worth watching, and would be slow to look into.
const SKIP = new Set(['node_modules', 'dist', 'build', 'venv', '.venv', '__pycache__'])

// The mod runs git on its own, in every repo it finds, so a repo's .git/config must not be able to run a program through it.
// fsmonitor runs on every status, hooks on a pull, and the ext:: transport on a fetch; a folder that arrived with its .git (an archive, a synced folder) could set any of them.
// Command-line -c beats the repo's own config.
export const SAFE = ['-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null', '-c', 'protocol.ext.allow=never']

// quotePath off so non-ASCII file names come back as written, not as octal escapes.
export async function git($: EngineInterface, root: string, args: string[], timeoutMs = 30_000) {
  return $.process.run(['git', '-C', root, ...SAFE, '-c', 'core.quotePath=false', ...args], { timeoutMs })
}

const baseName = (path: string) => path.slice(path.replace(/\/+$/, '').lastIndexOf('/') + 1)

// Run on every refresh, so a `git init` or a clone made mid-session shows up without a restart.
// A missing git binary makes process.run throw: that, like a folder with no repo at all, ends as an empty list.
export async function findRepos($: EngineInterface): Promise<Repo[]> {
  const repos: Repo[] = []
  const top = await $.process.run(['git', ...SAFE, 'rev-parse', '--show-toplevel'], { timeoutMs: 10_000 }).catch(() => null)
  if (!top) return repos
  if (top.exitCode === 0) {
    const root = top.stdout.trim()
    repos.push({ root, name: baseName(root) })
  }

  // One level down only: frontend/.git and backend/.git under the session folder, not repos buried deeper.
  const entries = await $.fs.list().catch(() => [])
  const dirs = entries.filter(d => d.kind === 'dir' && !d.name.startsWith('.') && !SKIP.has(d.name))
  const children = await Promise.all(
    dirs.map(async d => {
      const inside = await $.fs.list(d.name).catch(() => [])
      if (!inside.some(x => x.name === '.git')) return null
      const r = await $.process.run(['git', '-C', d.name, ...SAFE, 'rev-parse', '--show-toplevel'], { timeoutMs: 10_000 }).catch(() => null)
      return r && r.exitCode === 0 ? { root: r.stdout.trim(), name: d.name } : null
    }),
  )
  for (const child of children) {
    if (child && !repos.some(r => r.root === child.root)) repos.push(child)
  }
  return repos
}
