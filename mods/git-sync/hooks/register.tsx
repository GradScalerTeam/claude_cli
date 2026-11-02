// git-sync/hooks/register.tsx
// The Git sync mod: a band above the prompt for incoming commits and merge conflicts, and a git ↑N ↓M status line entry.
// The /git-diff Changes pane is its own mod, git-diff.
// Watches the session folder's repo and any child folder with its own .git (a parent folder holding separate frontend and backend repos).
// Runs git itself (no model calls): a fetch every few minutes, and a local re-read after each turn and each tool call that can change files.
// Pull is fast-forward only, so the button can never start a merge; Push and Pull are the person's own presses, never Claude's.

import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { GitSnapshot } from '../types'
import { LIST_LIMIT, refresh, runAction } from './snapshot'

const FETCH_EVERY_MS = 3 * 60 * 1000
// Tools whose call can leave the working tree different; Bash covers git itself as well as rm, mv, sed and friends.
const CHANGING_TOOLS = new Set(['Bash', 'Edit', 'Write', 'NotebookEdit'])

const repos = atom({ plugin: 'git-sync', key: 'repos' } as const, null, { shape: 'repos-3' })
const dismissed = atom({ plugin: 'git-sync', key: 'dismissed' } as const, null)

type Band = { kind: 'conflicts' | 'incoming'; key: string; s: GitSnapshot }

// What the band above the prompt is about, if anything, and for which repo: conflicts in any repo first, then incoming commits.
// The key changes when the situation does (and names the repo), so a dismissed band comes back for new commits or other files.
function bandFor(list: GitSnapshot[] | null): Band | null {
  const conflicted = list?.find(s => s.conflicts.length > 0)
  if (conflicted) return { kind: 'conflicts', key: `${conflicted.name}:conflicts:${conflicted.conflicts.join('|')}`, s: conflicted }
  const behind = list?.find(s => s.incoming.length > 0)
  if (behind) return { kind: 'incoming', key: `${behind.name}:incoming:${behind.incoming[0].hash}`, s: behind }
  return null
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    void refresh($, true)
    $.clock.every(FETCH_EVERY_MS, () => void refresh($, true))
    return next(e)
  })

  // After Claude edits a file or runs a command, the status line and band catch up without waiting for the timer.
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (CHANGING_TOOLS.has(e.tool)) void refresh($, false)
    return ran
  }).catch(($, e, next) => (next.called ? undefined : next(e)))

  on('turn.complete', async ($, e, next) => {
    void refresh($, false)
    return next(e)
  })

  // The band: shows only for conflicts or incoming commits, with Pull for incoming commits and Dismiss.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, repos)
    const band = bandFor(list)
    if (!band || e.props.hasSurvey || (await read($, dismissed)) === band.key) return next(e)
    const { s } = band
    // With several repos the band names the one it is about, so Pull is never a guess.
    const where = list && list.length > 1 ? `${s.name}: ` : ''

    const { Box, Text, Button } = $.ui.resolve(e)
    const hide = () => void update($, dismissed, () => band.key)
    const latest = s.incoming[0]
    const count = s.incoming.length > LIST_LIMIT ? `${LIST_LIMIT}+` : `${s.incoming.length}`

    return (
      <Box flexDirection="row" gap="sm" alignItems="center" flexWrap="wrap">
        {band.kind === 'conflicts' ? (
          <Text wrap="truncate-end">
            <Text bold color="error">
              {where}{s.paused ? `${s.paused[0].toUpperCase()}${s.paused.slice(1)} paused` : 'Conflicts'} · {s.conflicts.length} file{s.conflicts.length === 1 ? '' : 's'} in conflict
            </Text>
            <Text dimColor> {s.conflicts[0]}{s.conflicts.length > 1 ? ` and ${s.conflicts.length - 1} more` : ''}</Text>
          </Text>
        ) : (
          <Text wrap="truncate-end">
            <Text bold color="warning">{where}↓ {count} incoming</Text>
            <Text dimColor> · {latest.author}: {latest.subject}</Text>
          </Text>
        )}
        {s.busy ? (
          <Text color="suggestion">{s.busy}</Text>
        ) : (
          band.kind === 'incoming' && (
            <Button key="band-pull" variant="primary" onPress={() => void runAction($, s.root, 'Pull', ['pull', '--ff-only'])}>Pull</Button>
          )
        )}
        <Button key="band-dismiss" role="dismiss" onPress={hide}>Dismiss</Button>
      </Box>
    )
  })
}
