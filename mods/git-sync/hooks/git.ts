// git-sync/hooks/git.ts
// The one way this mod runs git, and how it finds the repos to watch: the session folder's own repo, plus any child folder with its own .git
// (a parent folder holding separate frontend and backend repos). Every command runs with -C <repo root>, so root-relative paths from
// `git status --porcelain` feed straight back into diff, add and restore. A repo whose own config holds a setting not known to be safe is found but not watched.

import type { EngineInterface } from 'claude-code'

// blocked: why the mod will not run git in this repo, or null when it may.
export type Repo = { root: string; name: string; blocked: string | null }

// Folders that never hold a repo worth watching, and would be slow to look into.
const SKIP = new Set(['node_modules', 'dist', 'build', 'venv', '.venv', '__pycache__'])

// The mod runs git on its own, in every repo it finds, so a repo's .git/config must not be able to run a program through it.
// These settings are turned off on every command as a second layer; the config check below is the first. Command-line -c beats the repo's own config.
// The submodule ones keep git out of submodules, whose own configs the check never reads; the signature ones stop git log and pull from running gpg.
export const SAFE = [
  '--no-pager',
  ...['core.fsmonitor=false', 'core.hooksPath=/dev/null', 'protocol.ext.allow=never', 'protocol.file.allow=never'],
  ...['submodule.recurse=false', 'fetch.recurseSubmodules=false', 'diff.ignoreSubmodules=all', 'status.submoduleSummary=false'],
  ...['log.showSignature=false', 'merge.verifySignatures=false'],
].flatMap(arg => (arg.startsWith('--') ? [arg] : ['-c', arg]))

// The repo-config keys known to run nothing on the commands these mods use; any other key in the repo's own config means the repo is not watched.
// An allowlist, so a setting nobody thought of fails safe. It covers what git itself, VS Code, the GitHub CLI and Git LFS write. fsmonitor and hooksPath
// are listed because SAFE overrides them; a remote's url is listed because SAFE blocks the ext:: and file:: transports, and vcs (a helper program) is not.
// http.* is not listed: a repo's own http.proxy or http.sslVerify=false could steer a fetch, and the credentials git hands it, to someone else.
const SAFE_KEY = new RegExp(
  '^(' +
    [
      'core\\.(repositoryformatversion|filemode|bare|logallrefupdates|ignorecase|precomposeunicode|symlinks|autocrlf|eol|safecrlf|fsmonitor|hookspath|untrackedcache|commitgraph|multipackindex|splitindex|preloadindex|abbrev|quotepath|compression|longpaths|checkstat|trustctime|sparsecheckout|sparsecheckoutcone)',
      'remote\\..+\\.(url|pushurl|fetch|push|tagopt|prune|mirror|promisor|partialclonefilter|skipdefaultupdate|gh-resolved)',
      'branch\\..+\\.[a-z-]+',
      'submodule\\..+\\.(url|active|branch)',
      'user\\.(name|email|signingkey)',
      'pull\\.(rebase|ff)',
      'push\\.(default|autosetupremote)',
      'fetch\\.prune',
      'init\\.defaultbranch',
      'rebase\\.autostash',
      'merge\\.(ff|conflictstyle)',
      'rerere\\.enabled',
      'status\\.showuntrackedfiles',
      'extensions\\.[a-z]+',
      'lfs\\.(repositoryformatversion|url)',
      'gc\\.(auto|autodetach)',
      'color\\..+',
    ].join('|') +
    ')$',
)

// quotePath off so non-ASCII file names come back as written, not as octal escapes.
export async function git($: EngineInterface, root: string, args: string[], timeoutMs = 30_000) {
  return $.process.run(['git', '-C', root, ...SAFE, '-c', 'core.quotePath=false', ...args], { timeoutMs })
}

// Why this repo is not watched, or null when its own config holds only known-safe keys. Listing config only reads files: it runs nothing.
// Only the repo's own config (scope local or worktree) is checked: your global config is yours, but a .git/config can arrive with the folder.
// Keys pulled in by include.path show as local too, and include.path itself is not on the list.
async function blockedBy($: EngineInterface, root: string): Promise<string | null> {
  const r = await git($, root, ['config', '--list', '--name-only', '--show-scope'], 10_000).catch(() => null)
  if (!r || r.exitCode !== 0) return 'its git config could not be read'
  for (const line of r.stdout.split('\n')) {
    const [scope, key = ''] = line.split('\t')
    if ((scope === 'local' || scope === 'worktree') && !SAFE_KEY.test(key.toLowerCase())) return `its git config sets ${key}, which is not on the list of settings known to be safe`
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
