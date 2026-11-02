// git-sync/types/index.d.ts
// The mod's $.state contract: one snapshot per repo (the session folder's own, plus any child folder with its own .git), which the band
// and status line draw from, plus the band the person last dismissed.

export type Commit = { hash: string; author: string; age: string; subject: string }

// A merge, rebase or cherry-pick that stopped part way (usually on a conflict).
export type PausedOp = 'merge' | 'rebase' | 'cherry-pick' | null

export type GitSnapshot = {
  name: string
  root: string
  branch: string
  upstream: string | null
  ahead: number
  behind: number
  // Files with staged changes and files with unstaged changes; a file edited again after staging counts in both.
  staged: number
  modified: number
  untracked: number
  conflicts: string[]
  paused: PausedOp
  incoming: Commit[]
  outgoing: Commit[]
  checkedAt: number
  busy: string | null
  error: string | null
}

declare module 'claude-code' {
  interface PluginState {
    // repos: null until the first read, then one snapshot per repo found (empty when there is none, or git is not installed).
    // dismissed: the band key the person last hid; the band returns once the key changes (new commits, other files).
    'git-sync': {
      repos: Shaped<GitSnapshot[] | null>
      dismissed: string | null
    }
  }
}
