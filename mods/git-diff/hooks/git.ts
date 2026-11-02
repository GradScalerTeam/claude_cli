// git-diff/hooks/git.ts
// The one way this mod runs git, and how it finds the repos to watch: the session folder's own repo, plus any child folder with its own .git
// (a parent folder holding separate frontend and backend repos). Every command runs with -C <repo root>, so root-relative paths from
// `git status --porcelain` feed straight back into diff, add and restore. A repo whose own config names a program is found but not watched.

import type { EngineInterface } from 'claude-code'

// blocked: why the mod will not run git in this repo, or null when it may.
export type Repo = { root: string; name: string; blocked: string | null }

// Folders that never hold a repo worth watching, and would be slow to look into.
const SKIP = new Set(['node_modules', 'dist', 'build', 'venv', '.venv', '__pycache__'])

// The mod runs git on its own, in every repo it finds, so a repo's .git/config must not be able to run a program through it.
// These settings are turned off on every command as a second layer; the config check below is the first.
// Command-line -c beats the repo's own config.
export const SAFE = ['-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null', '-c', 'protocol.ext.allow=never', '-c', 'protocol.file.allow=never']

// Repo-config keys that make git run a program on a command these mods use (status, diff, add, fetch, pull), or pull in another config file.
// Only the repo's own config (scope local or worktree) is checked: your global config is yours, but a .git/config can arrive with the folder.
const RUNS_A_PROGRAM = /^(filter\.|credential\.|include\.|includeif\.|uploadpack\.|diff\..+\.(textconv|command)$|merge\..+\.driver$|remote\..+\.(uploadpack|receivepack)$|core\.(sshcommand|askpass|gitproxy|alternaterefscommand)$)/

// quotePath off so non-ASCII file names come back as written, not as octal escapes.
export async function git($: EngineInterface, root: string, args: string[], timeoutMs = 30_000) {
  return $.process.run(['git', '-C', root, ...SAFE, '-c', 'core.quotePath=false', ...args], { timeoutMs })
}

// Why this repo is not watched, or null when its own config names no program. Listing config only reads files: it runs nothing.
async function blockedBy($: EngineInterface, root: string): Promise<string | null> {
  const r = await git($, root, ['config', '--list', '--name-only', '--show-scope'], 10_000).catch(() => null)
  if (!r || r.exitCode !== 0) return 'its git config could not be read'
  for (const line of r.stdout.split('\n')) {
    const [scope, key = ''] = line.split('\t')
    if ((scope === 'local' || scope === 'worktree') && RUNS_A_PROGRAM.test(key.toLowerCase())) return `its git config sets ${key}, which can run a program`
  }
  return null
}

const baseName = (path: string) => path.slice(path.replace(/\/+$/, '').lastIndexOf('/') + 1)

// Run on every refresh, so a `git init` or a clone made mid-session shows up without a restart, and a config change is checked again.
// A missing git binary makes process.run throw: that, like a folder with no repo at all, ends as an empty list.
export async function findRepos($: EngineInterface): Promise<Repo[]> {
  const found: Omit<Repo, 'blocked'>[] = []
  const top = await $.process.run(['git', ...SAFE, 'rev-parse', '--show-toplevel'], { timeoutMs: 10_000 }).catch(() => null)
  if (!top) return []
  if (top.exitCode === 0) {
    const root = top.stdout.trim()
    found.push({ root, name: baseName(root) })
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
    if (child && !found.some(r => r.root === child.root)) found.push(child)
  }
  return Promise.all(found.map(async r => ({ ...r, blocked: await blockedBy($, r.root) })))
}
