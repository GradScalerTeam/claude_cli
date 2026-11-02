// git-diff/hooks/diff.ts
// Builds the compare view for one file of the /git-diff pane: runs the right `git diff` for its group and parses it into numbered lines.
// The pane draws those lines itself (coloured rows, old/new gutters, inline or side by side), the way VS Code's diff editor shows them.

import type { EngineInterface } from 'claude-code'

import type { DiffLine, DiffView, Hunk, Selection } from '../types'
import { git } from './git'

// Every line becomes a few elements in the pane; past this the drawing gets slow, so the rest is cut with a note.
const MAX_LINES = 3000

// The repo is part of the key: frontend and backend can both have a changed README.md.
export const diffKey = (s: { repo: string; group: string; path: string }) => `${s.repo}:${s.group}:${s.path}`

// Staged compares the index with HEAD, unstaged the working tree with the index, untracked and conflicts show the file on disk.
function diffArgs(sel: Selection): string[] {
  const base = ['diff', '--no-color', '--no-ext-diff']
  if (sel.group === 'staged') return [...base, '--cached', '-M', '--', ...(sel.origPath ? [sel.origPath, sel.path] : [sel.path])]
  if (sel.group === 'untracked' || sel.group === 'conflict') return [...base, '--no-index', '--', '/dev/null', sel.path]
  return [...base, '--', sel.path]
}

const HUNK = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@ ?(.*)$/
const CONFLICT_MARKER = /^(<{7}|={7}|>{7}|\|{7})( |$)/

// Text drawn in the pane may hold no control characters; tabs become spaces so columns still line up.
const clean = (s: string) => s.replace(/\t/g, '    ').replace(/[\x00-\x1f\x7f]/g, '')

function parse(stdout: string): { hunks: Hunk[]; truncated: boolean } {
  const hunks: Hunk[] = []
  let current: Hunk | null = null
  let oldNo = 0
  let newNo = 0
  let count = 0
  for (const raw of stdout.split('\n')) {
    const head = HUNK.exec(raw)
    if (head) {
      oldNo = Number(head[1])
      newNo = Number(head[2])
      current = { context: clean(head[3]), oldStart: oldNo, newStart: newNo, lines: [] }
      hunks.push(current)
      continue
    }
    // File headers (diff --git, index, ---, +++) come before the first hunk; "\ No newline" lines carry no content.
    if (!current || raw.startsWith('\\')) continue
    if (count >= MAX_LINES) return { hunks, truncated: true }
    const sign = raw[0]
    const text = clean(raw.slice(1))
    let line: DiffLine
    if (sign === '+') line = { kind: 'add', old: null, new: newNo++, text }
    else if (sign === '-') line = { kind: 'del', old: oldNo++, new: null, text }
    else if (sign === ' ') line = { kind: 'ctx', old: oldNo++, new: newNo++, text }
    else continue
    current.lines.push(line)
    count += 1
  }
  return { hunks, truncated: false }
}

export async function loadDiff($: EngineInterface, sel: Selection): Promise<DiffView> {
  const key = diffKey(sel)
  const none = { key, hunks: [], added: 0, removed: 0, truncated: false }
  // --no-index exits 1 when the files differ, which is the normal case here, so the exit code is not checked.
  const { stdout } = await git($, sel.root, diffArgs(sel))
  if (/^Binary files .* differ$/m.test(stdout)) return { ...none, kind: 'binary' }

  const { hunks, truncated } = parse(stdout)
  if (hunks.length === 0) return { ...none, kind: 'empty' }

  // A conflicted file is shown as it sits on disk: plain lines, with the <<<<<<< ======= >>>>>>> markers picked out.
  if (sel.group === 'conflict') {
    for (const h of hunks) {
      h.lines = h.lines.map(l => ({ ...l, kind: CONFLICT_MARKER.test(l.text) ? 'marker' : 'ctx' }))
    }
    return { ...none, kind: 'conflict', hunks, truncated }
  }

  let added = 0
  let removed = 0
  for (const h of hunks) {
    for (const l of h.lines) {
      if (l.kind === 'add') added += 1
      else if (l.kind === 'del') removed += 1
    }
  }
  return { key, kind: 'diff', hunks, added, removed, truncated }
}

// One row of the side-by-side layout: the old line on the left, the new one on the right, either side empty.
export type SplitRow = { left: DiffLine | null; right: DiffLine | null }

// Context lines sit on both sides; a run of removals followed by a run of additions is paired up line by line, as VS Code aligns them.
export function splitRows(lines: DiffLine[]): SplitRow[] {
  const rows: SplitRow[] = []
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (l.kind !== 'add' && l.kind !== 'del') {
      rows.push({ left: l, right: l })
      i += 1
      continue
    }
    const dels: DiffLine[] = []
    const adds: DiffLine[] = []
    while (i < lines.length && lines[i].kind === 'del') dels.push(lines[i++])
    while (i < lines.length && lines[i].kind === 'add') adds.push(lines[i++])
    for (let j = 0; j < Math.max(dels.length, adds.length); j++) rows.push({ left: dels[j] ?? null, right: adds[j] ?? null })
  }
  return rows
}
