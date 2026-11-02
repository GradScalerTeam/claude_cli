// git-diff/hooks/register.tsx
// The Git diff mod: a /git-diff Changes pane beside the chat, laid out like VS Code's Source Control, with per-file diffs and Stage/Unstage.
// Runs git itself (no model calls) and only while the pane is open: a quick local re-read on a timer, after each turn, and after each tool
// call that can change files. Never fetches, pulls or pushes, and nothing in it discards work.

import { atom, read } from 'claude-code'
import type { Register } from 'claude-code'

import { registerChanges, startChanges } from './changes'
import { refresh } from './snapshot'

// Tools whose call can leave the working tree different; Bash covers git itself as well as rm, mv, sed and friends.
const CHANGING_TOOLS = new Set(['Bash', 'Edit', 'Write', 'NotebookEdit'])

const paneOpen = atom({ plugin: 'git-diff', key: 'paneOpen' } as const, false)

export const register: Register = on => {
  // One local read up front, so a pane still open from before a reload or restart draws at once rather than after the first poll.
  on('session.start', async ($, e, next) => {
    void refresh($)
    await startChanges($)
    return next(e)
  })

  registerChanges(on)

  // After Claude edits a file or runs a command, an open pane catches up without waiting for the poll.
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (CHANGING_TOOLS.has(e.tool) && (await read($, paneOpen))) void refresh($)
    return ran
  }).catch(($, e, next) => (next.called ? undefined : next(e)))

  on('turn.complete', async ($, e, next) => {
    if (await read($, paneOpen)) void refresh($)
    return next(e)
  })
}
