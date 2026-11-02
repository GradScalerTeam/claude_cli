// git-diff/hooks/changes.tsx
// The /git-diff pane, laid out like VS Code's Source Control: Merge / Staged / Changes groups, status letters on the right, + and − on hover.
// With several repos (a parent folder holding frontend/ and backend/), each repo gets its own collapsible section with its branch.
// Each file row is an accordion: clicking it opens its diff right under it (side by side when the pane is wide, inline when narrow); several can be open.
// Stage, Unstage and Mark resolved run git add / git restore --staged. Nothing here discards work.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, On } from 'claude-code'

import type { ChangedFile, DiffLine, DiffView, FileGroup, GitSnapshot } from '../types'
import { diffKey, loadDiff, splitRows } from './diff'
import { refresh, runAction } from './snapshot'

// Same refs as snapshot.ts and register.tsx (the state scan wants them declared in each file that reads them); collapsed is this file's alone.
// collapsed holds `repo:<name>` for a folded repo and `<name>:<group>` for a folded group inside one.
const repos = atom({ plugin: 'git-diff', key: 'repos' } as const, null, { shape: 'repos-2' })
const expanded = atom({ plugin: 'git-diff', key: 'expanded' } as const, [])
const diffs = atom({ plugin: 'git-diff', key: 'diffs' } as const, {}, { shape: 'diffs-1' })
const paneOpen = atom({ plugin: 'git-diff', key: 'paneOpen' } as const, false)
const collapsed = atom({ plugin: 'git-diff', key: 'collapsed' } as const, [])

const PANE = 'git-changes'
const TITLE = 'Changes'
// A quick local re-read while the pane is open, so edits made outside Claude (your editor) show up too.
const POLL_MS = 10_000
// VS Code switches to side by side at 900px; a pane cell is about 7.5px wide on the desktop.
const SPLIT_MIN_COLUMNS = 120

// Line backgrounds. The desktop paints the theme's diffAdded as a solid bright green, so it gets translucent tints instead
// (about 15% alpha, as GitHub and VS Code use), which read on light and dark themes alike; the terminal's theme colours are already muted.
const DESKTOP_TINTS = { add: '#2ea04326', del: '#f8514926', marker: '#d2992240' }
const TERMINAL_TINTS = { add: 'diffAdded', del: 'diffRemoved', marker: 'warning' }

// Untracked files sit in Changes with a U, as VS Code shows them by default; the group key stays separate for git.
const SECTIONS: { id: FileGroup; title: string; groups: FileGroup[] }[] = [
  { id: 'conflict', title: 'Merge Changes', groups: ['conflict'] },
  { id: 'staged', title: 'Staged Changes', groups: ['staged'] },
  { id: 'unstaged', title: 'Changes', groups: ['unstaged', 'untracked'] },
]

// Above an open diff: which two versions are being compared.
const COMPARES: Record<FileGroup, string> = {
  conflict: 'Conflicted file on disk',
  staged: 'Last commit ↔ Staged',
  unstaged: 'Staged ↔ Working tree',
  untracked: 'New file (untracked)',
}

// VS Code's letters: U untracked, ! conflict, the rest as git prints them.
function statusOf(f: ChangedFile): { letter: string; color: string } {
  if (f.group === 'conflict') return { letter: '!', color: 'error' }
  if (f.group === 'untracked') return { letter: 'U', color: 'success' }
  if (f.code === 'A') return { letter: 'A', color: 'success' }
  if (f.code === 'D') return { letter: 'D', color: 'error' }
  if (f.code === 'M') return { letter: 'M', color: 'warning' }
  return { letter: f.code, color: 'suggestion' }
}

const splitPath = (path: string) => {
  const slash = path.lastIndexOf('/')
  return { name: path.slice(slash + 1), dir: slash > 0 ? path.slice(0, slash) : '' }
}

// Both sides of a staged rename, so unstaging puts the old name back as well.
const pathsOf = (files: ChangedFile[]) => files.flatMap(f => (f.origPath ? [f.origPath, f.path] : [f.path]))

// A section's files all come from one repo, so the first file's root is where the command runs.
const stage = ($: EngineInterface, files: ChangedFile[]) => runAction($, files[0].root, 'Stage', ['add', '--', ...pathsOf(files)])
const unstage = ($: EngineInterface, files: ChangedFile[]) => runAction($, files[0].root, 'Unstage', ['restore', '--staged', '--', ...pathsOf(files)])

async function openPane($: EngineInterface) {
  await update($, paneOpen, () => true)
  await $.ui.open({ id: PANE, title: TITLE })
  void refresh($)
}

// Opens or closes one file's diff; the diff is loaded on open and dropped on close, so closed rows cost nothing on refresh.
async function toggle($: EngineInterface, f: ChangedFile) {
  const key = diffKey(f)
  const isOpen = (await read($, expanded)).includes(key)
  await update($, expanded, list => (isOpen ? list.filter(k => k !== key) : [...list, key]))
  if (isOpen) {
    await update($, diffs, all => Object.fromEntries(Object.entries(all).filter(([k]) => k !== key)))
    return
  }
  const view = await loadDiff($, f)
  await update($, diffs, all => ({ ...all, [key]: view }))
}

// Opens every file's diff, unfolding any folded group so none stays hidden.
async function expandAll($: EngineInterface, files: ChangedFile[]) {
  await update($, collapsed, () => [])
  await update($, expanded, () => files.map(diffKey))
  const views = await Promise.all(files.map(f => loadDiff($, f)))
  await update($, diffs, () => Object.fromEntries(views.map(v => [v.key, v])))
}

async function collapseAll($: EngineInterface) {
  await update($, expanded, () => [])
  await update($, diffs, () => ({}))
}

// Called from register.tsx's one session.start hook (the engine allows a single unmatched hook per event).
export async function startChanges($: EngineInterface) {
  await $.command.register({ name: 'git-diff', description: 'Open the Changes pane: staged and unstaged files with a diff view' })
  $.clock.every(POLL_MS, () => {
    void read($, paneOpen).then(open => {
      if (open) void refresh($)
    })
  })
}

export function registerChanges(on: On) {
  on('command.run', { command: 'git-diff' }, async $ => {
    await openPane($)
    return { text: 'Changes pane opened.' }
  })

  on('ui.close', { id: PANE }, async ($, e, next) => {
    await update($, paneOpen, () => false)
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const list = await read($, repos)
    const open = await read($, expanded)
    const loaded = await read($, diffs)
    const folded = await read($, collapsed)
    // Only a pointer can hover; elsewhere the + and − stay visible so they can still be reached.
    const canHover = e.surface === 'desktop'
    const reveal = canHover ? { display: 'none' as const, hover: { display: 'flex' as const } } : {}
    const tint = canHover ? DESKTOP_TINTS : TERMINAL_TINTS
    const isWide = e.props.bodyColumns >= SPLIT_MIN_COLUMNS

    if (!list) return <Text dimColor>Looking for git repositories…</Text>
    if (list.length === 0) return <Text dimColor>No git repository here: this folder isn't one, none of its folders has its own .git, or git isn't installed.</Text>

    // ── One open diff ────────────────────────────────────────────────────────
    const num = (n: number | null) => (n === null ? '' : String(n)).padStart(4)
    const bgOf = (l: DiffLine | null) => (!l || l.kind === 'ctx' ? undefined : tint[l.kind])

    const inlineRow = (l: DiffLine, isConflict: boolean) => (
      <Box flexDirection="row" width="100%" backgroundColor={bgOf(l)}>
        <Text mono dimColor>{isConflict ? num(l.new) : `${num(l.old)} ${num(l.new)}`} </Text>
        <Text mono color={l.kind === 'add' ? 'success' : l.kind === 'del' ? 'error' : undefined}>{l.kind === 'add' ? '+' : l.kind === 'del' ? '−' : ' '} </Text>
        <Box flexGrow={1} flexShrink={1}>
          <Text mono wrap="wrap" bold={l.kind === 'marker'}>{l.text || ' '}</Text>
        </Box>
      </Box>
    )

    const half = (l: DiffLine | null, side: 'old' | 'new') => (
      <Box width="50%" flexDirection="row" backgroundColor={bgOf(l)}>
        <Text mono dimColor>{num(l ? l[side] : null)} </Text>
        <Box flexGrow={1} flexShrink={1}>
          <Text mono wrap="wrap">{l ? l.text || ' ' : ' '}</Text>
        </Box>
      </Box>
    )

    const diffBlock = (f: ChangedFile, view: DiffView | undefined) => {
      if (!view) return <Text dimColor>Loading diff…</Text>
      if (view.kind === 'binary') return <Text dimColor>Binary file, there is no text diff to show.</Text>
      if (view.kind === 'empty') return <Text dimColor>No line changes (only file mode or permissions changed).</Text>
      const split = isWide && view.kind === 'diff'
      return (
        <Box flexDirection="column" alignItems="stretch">
          <Text dimColor size="footnote">
            {COMPARES[f.group]}
            {view.kind === 'diff' && <Text color="success">{'  '}+{view.added}</Text>}
            {view.kind === 'diff' && <Text color="error"> −{view.removed}</Text>}
          </Text>
          {/* Not `h`: JSX compiles to the global h(), which a variable of that name would hide. */}
          {view.hunks.map((hunk, hi) => (
            <Box flexDirection="column" alignItems="stretch">
              {/* The gap between hunks stands for the unchanged lines git left out, like VS Code's folded regions. */}
              {(hi > 0 || hunk.oldStart > 1) && view.kind === 'diff' && <Text dimColor mono wrap="truncate-end">⋯ {hunk.context}</Text>}
              {split
                ? splitRows(hunk.lines).map(r => (
                    <Box flexDirection="row" width="100%" gap="xs">
                      {half(r.left, 'old')}
                      {half(r.right, 'new')}
                    </Box>
                  ))
                : hunk.lines.map(l => inlineRow(l, view.kind === 'conflict'))}
            </Box>
          ))}
          {view.truncated && <Text dimColor>The diff is too long to show in full; open the file to see the rest.</Text>}
        </Box>
      )
    }

    // ── File rows ────────────────────────────────────────────────────────────
    const fileRow = (f: ChangedFile) => {
      const k = diffKey(f)
      const { name, dir } = splitPath(f.path)
      const status = statusOf(f)
      const isOpen = open.includes(k)
      return (
        <Box key={`file-${k}`} flexDirection="column" alignItems="stretch">
          <Box key={`row-${k}`} flexDirection="row" gap="xs" alignItems="center">
            <Box flexGrow={1} flexShrink={1}>
              <Button key={`open-${k}`} plain label={f.path} onPress={() => void toggle($, f)}>
                <Text dimColor>{isOpen ? '⌄' : '›'} </Text>
                <Text strikethrough={f.code === 'D'} bold={isOpen}>{name}</Text>
                <Text dimColor size="footnote"> {f.origPath ? `${f.origPath} → ` : ''}{dir}</Text>
              </Button>
            </Box>
            <Box {...reveal}>
              {f.group === 'staged' ? (
                <Button key={`unstage-${k}`} plain onPress={() => void unstage($, [f])}>−</Button>
              ) : (
                <Button key={`stage-${k}`} plain onPress={() => void stage($, [f])}>+</Button>
              )}
            </Box>
            <Text bold mono color={status.color}>{status.letter}</Text>
          </Box>
          {isOpen && (
            // A column with stretched children, so every diff row spans the pane instead of stopping where its longest line ends.
            <Box flexDirection="column" alignItems="stretch" paddingLeft={2} paddingTop="xs" paddingBottom="sm">
              {diffBlock(f, loaded[k])}
            </Box>
          )}
        </Box>
      )
    }

    // ── Groups of one repo ───────────────────────────────────────────────────
    const fold = (id: string) => void update($, collapsed, list => (list.includes(id) ? list.filter(g => g !== id) : [...list, id]))

    const groupsOf = (s: GitSnapshot) =>
      SECTIONS.map(section => {
        const files = s.files.filter(f => section.groups.includes(f.group))
        // Changes always shows, like VS Code, so there is somewhere to look; the others only when they have files.
        if (files.length === 0 && section.id !== 'unstaged') return null
        const id = `${s.name}:${section.id}`
        const isFolded = folded.includes(id)
        return (
          <Box key={`sec-${id}`} flexDirection="column" alignItems="stretch">
            <Box key={`head-${id}`} flexDirection="row" gap="xs" alignItems="center">
              <Box flexGrow={1}>
                <Button key={`fold-${id}`} plain label={section.title} onPress={() => fold(id)}>
                  <Text dimColor>{isFolded ? '›' : '⌄'} </Text>
                  <Text bold size="footnote" color={section.id === 'conflict' ? 'error' : undefined}>{section.title.toUpperCase()}</Text>
                </Button>
              </Box>
              {/* No stage-all for conflicts: each file should be checked for leftover markers first. */}
              {files.length > 0 && section.id !== 'conflict' && (
                <Box {...reveal}>
                  {section.id === 'staged' ? (
                    <Button key={`unstage-all-${s.name}`} plain onPress={() => void unstage($, files)}>−</Button>
                  ) : (
                    <Button key={`stage-all-${s.name}`} plain onPress={() => void stage($, files)}>+</Button>
                  )}
                </Box>
              )}
              <Text dimColor tabular>{files.length}</Text>
            </Box>
            {!isFolded && <Box flexDirection="column" alignItems="stretch" paddingLeft={2}>{files.map(fileRow)}</Box>}
          </Box>
        )
      })

    const branchText = (s: GitSnapshot) => (
      <Text dimColor>
        {s.blocked ? 'not watched' : s.branch}
        {s.blocked ? '' : s.upstream ? ` ↑${s.ahead} ↓${s.behind}` : ' · no upstream'}
      </Text>
    )

    const repoBody = (s: GitSnapshot) =>
      s.blocked ? (
        <Text color="warning" wrap="wrap">Not watched: {s.blocked}. The pane runs no git in this repo.</Text>
      ) : (
        <Box flexDirection="column" alignItems="stretch" gap="sm">
          {s.error && <Text color="warning" size="footnote">{s.error}</Text>}
          {s.files.length === 0 ? <Text dimColor>No changes. The working tree is clean.</Text> : groupsOf(s)}
        </Box>
      )

    const allFiles = list.flatMap(s => s.files)
    const busy = list.find(s => s.busy)?.busy

    return (
      <Box flexDirection="column" alignItems="stretch" gap="sm">
        <Box flexDirection="row" gap="sm" alignItems="center">
          <Box flexGrow={1} flexShrink={1}>
            {/* One repo: its branch heads the pane. Several: each repo's header carries its own branch instead. */}
            {list.length === 1 ? (
              <Text wrap="truncate-end">
                {/* A blocked repo has no branch read, so it is named instead. */}
                <Text bold>{list[0].branch || list[0].name}</Text>
                {list[0].upstream && <Text dimColor> ↑{list[0].ahead} ↓{list[0].behind}</Text>}
              </Text>
            ) : (
              <Text dimColor size="footnote">{list.length} repositories</Text>
            )}
          </Box>
          {busy && <Text color="suggestion">{busy}</Text>}
          {/* Each shows only when it would do something: Expand all while a file is closed, Collapse all while one is open. */}
          {allFiles.some(f => !open.includes(diffKey(f))) && (
            <Button key="expand-all" plain dimColor onPress={() => void expandAll($, allFiles)}>Expand all</Button>
          )}
          {open.length > 0 && (
            <Button key="collapse-all" plain dimColor onPress={() => void collapseAll($)}>Collapse all</Button>
          )}
          <Button key="changes-refresh" plain onPress={() => void refresh($)}>⟳</Button>
        </Box>

        {list.length === 1
          ? repoBody(list[0])
          : list.map(s => {
              const id = `repo:${s.name}`
              const isFolded = folded.includes(id)
              return (
                <Box key={`repo-${s.name}`} flexDirection="column" alignItems="stretch" gap="xs">
                  <Box flexDirection="row" gap="sm" alignItems="center">
                    <Box flexGrow={1} flexShrink={1}>
                      <Button key={`fold-${id}`} plain label={s.name} onPress={() => fold(id)}>
                        <Text dimColor>{isFolded ? '›' : '⌄'} </Text>
                        <Text bold>{s.name}</Text>
                      </Button>
                    </Box>
                    {branchText(s)}
                    <Text dimColor tabular>{s.files.length}</Text>
                  </Box>
                  {!isFolded && <Box flexDirection="column" alignItems="stretch" paddingLeft={2}>{repoBody(s)}</Box>}
                </Box>
              )
            })}
      </Box>
    )
  })
}
