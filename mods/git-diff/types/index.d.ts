// git-diff/types/index.d.ts
// The mod's $.state contract: one snapshot per repo (the session folder's own, plus any child folder with its own .git), which the
// /git-diff pane draws from, plus the pane's open files, their diffs and its folded sections.

// Which list a file sits in, as VS Code's Source Control groups them.
export type FileGroup = 'conflict' | 'staged' | 'unstaged' | 'untracked'

// One row of the changes pane; a file edited again after staging appears twice, once per group.
export type ChangedFile = {
  // The repo's folder name (frontend, backend) and its absolute root, where every git command for this file runs.
  repo: string
  root: string
  // Relative to the repo root, as git status prints it.
  path: string
  // The old path of a staged rename, so unstaging restores both sides.
  origPath: string | null
  group: FileGroup
  // The porcelain letter for that side: M, A, D, R, C, T, U or ?.
  code: string
}

// What the pane needs of one repo: its branch line and its changed files.
export type GitSnapshot = {
  name: string
  root: string
  branch: string
  upstream: string | null
  ahead: number
  behind: number
  files: ChangedFile[]
  busy: string | null
  error: string | null
  // Why the mod runs no git here (the repo's own config names a program), or null; a blocked repo has no files.
  blocked: string | null
}

// The file a diff is loaded for; repo + path + group pick exactly one row (a ChangedFile fits it).
export type Selection = { repo: string; root: string; path: string; origPath: string | null; group: FileGroup }

// One line of a diff with its numbers on each side; an added line has no old number, a removed one no new number.
// marker: a <<<<<<< ======= >>>>>>> line of a conflicted file.
export type DiffLine = { kind: 'add' | 'del' | 'ctx' | 'marker'; old: number | null; new: number | null; text: string }

// One @@ section; context is the function or heading git names after the @@, if any.
export type Hunk = { context: string; oldStart: number; newStart: number; lines: DiffLine[] }

export type DiffView = {
  // `${repo}:${group}:${path}`, so a stale diff for another row is never drawn.
  key: string
  // diff: changed lines; conflict: the file on disk with its markers; binary / empty: a one-line note.
  kind: 'diff' | 'conflict' | 'binary' | 'empty'
  hunks: Hunk[]
  added: number
  removed: number
  truncated: boolean
}

declare module 'claude-code' {
  interface PluginState {
    // repos: null until the first read, then one snapshot per repo found (empty when there is none, or git is not installed).
    // paneOpen: whether the pane is open, so the mod only reads git while someone is looking.
    // expanded: the diff keys of the file rows open in the accordion; diffs: their parsed diffs by the same key.
    // collapsed: folded sections, `repo:<name>` for a whole repo and `<name>:<group>` for one group inside it.
    'git-diff': {
      repos: Shaped<GitSnapshot[] | null>
      paneOpen: boolean
      expanded: string[]
      diffs: Shaped<Record<string, DiffView>>
      collapsed: string[]
    }
  }
}
