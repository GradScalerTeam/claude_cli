// git-diff/hooks/changes.test.tsx
// Tests for the /git-diff pane against a fake git: grouping from porcelain v2, the accordion, Stage / Unstage, and a parent folder that holds
// two separate repos (frontend/ and backend/), each in its own section with commands run in the right repo.

import { expect, test } from 'claude-code/testing'

const PANE = {
  plugin: 'git-diff',
  component: 'Pane',
  requestId: 'git-changes',
  props: {
    title: 'Changes',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const branch = (name: string) => ['# branch.oid abc123', `# branch.head ${name}`, `# branch.upstream origin/${name}`, '# branch.ab +1 -0']

// One file staged and edited again, one only edited, a staged rename, one untracked.
const STATUS = [
  ...branch('dev'),
  '1 MM N... 100644 100644 100644 aaa bbb backend/app.py',
  '1 .M N... 100644 100644 100644 aaa bbb frontend/src/App.jsx',
  '2 R. N... 100644 100644 100644 aaa bbb R100 docs/new.md\tdocs/old.md',
  '? notes.txt',
].join('\n')

const DIFF = 'diff --git a/x b/x\nindex 1..2 100644\n--- a/x\n+++ b/x\n@@ -1,2 +1,2 @@\n keep\n-old\n+new\n'

type On = Parameters<Parameters<typeof test>[1]>[1]
type Ran = { root: string; args: string[] }[]
const ok = (stdout = '') => ({ value: { exitCode: 0, stdout, stderr: '' } })
const dir = (name: string) => ({ name, kind: 'dir' as const, size: 0, mtimeMs: 0, isLink: false })

// The engine nouns the mod calls besides git.
function engine(on: On) {
  on('clock.now', () => ({ value: 0 }))
  on('clock.every', () => ({ value: undefined }))
  on('ui.status', () => ({ value: undefined }))
  on('command.register', () => ({ value: { command: 'git-diff' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
}

// statusOf: what `git status` prints per repo root; topLevel: the session folder's own repo, or null when it is not one.
// Records every command with the repo it ran in (the -C argument), args after the -c prefix.
function fakeGit(on: On, ran: Ran, statusOf: Record<string, string>, topLevel: string | null, children: Record<string, string> = {}, argvs: string[][] = []) {
  on('process.run', (_, e) => {
    const argv = [...e.argv]
    argvs.push(argv)
    // `git rev-parse --show-toplevel` for the session folder, `git -C frontend ... --show-toplevel` from the child scan.
    if (argv.includes('--show-toplevel')) {
      if (argv[1] === '-C') return ok(`${children[argv[2]]}\n`)
      return topLevel ? ok(`${topLevel}\n`) : { value: { exitCode: 128, stdout: '', stderr: 'fatal: not a git repository' } }
    }
    const root = argv[2]
    const args = argv.slice(argv.indexOf('core.quotePath=false') + 1)
    ran.push({ root, args })
    if (args[0] === 'status') return ok(statusOf[root])
    if (args[0] === 'diff') return ok(DIFF)
    if (args[0] === 'rev-parse') return { value: { exitCode: 1, stdout: '', stderr: '' } }
    return ok()
  })
  // The session folder lists the child folders; each child with its own repo holds a .git.
  // The engine hands the hook an absolute path (the session folder, or it joined with the child's name), so match on the last part.
  on('fs.list', (_, e) => {
    const last = e.path.slice(e.path.lastIndexOf('/') + 1)
    if (last in children) return { value: [dir('.git'), dir('src')] }
    return { value: Object.keys(children).map(dir) }
  })
  engine(on)
}

const single = (on: On, ran: Ran) => fakeGit(on, ran, { '/repo': STATUS }, '/repo')

// session.start kicks off the first refresh without awaiting it; give it a few ticks to land before drawing.
async function started($: Parameters<Parameters<typeof test>[1]>[0]) {
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  for (let i = 0; i < 400; i++) await Promise.resolve()
}

for (const surface of ['desktop', 'terminal'] as const) {
  test(`groups files and opens diffs as an accordion (${surface})`, async ($, on) => {
    const ran: Ran = []
    single(on, ran)

    await started($)
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: 'STAGED CHANGES' })).toBeDefined()
    // Untracked files sit in Changes with a U, as in VS Code; one repo means no repo sections.
    expect(await ui.find({ type: 'Text', text: 'CHANGES' })).toBeDefined()
    expect(await ui.find({ key: 'open-repo:untracked:notes.txt' })).toBeDefined()
    expect(await ui.find({ key: 'fold-repo:repo' })).toBeUndefined()

    await ui.press({ key: 'open-repo:unstaged:backend/app.py' })
    // The diff opens under its row; the list stays, with the file headers cut and +/− counted.
    expect(await ui.find({ key: 'open-repo:untracked:notes.txt' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^new$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /\+\+\+|diff --git/ })).toBeUndefined()
    expect(ran.some(r => r.args[0] === 'diff' && !r.args.includes('--cached') && r.args.includes('backend/app.py'))).toBe(true)

    // A second row opens alongside the first (the fake git gives every file the same diff); clicking again closes only that one.
    await ui.press({ key: 'open-repo:untracked:notes.txt' })
    expect((await ui.findAll({ type: 'Text', text: /^new$/ })).length).toBe(2)
    await ui.press({ key: 'open-repo:unstaged:backend/app.py' })
    expect((await ui.findAll({ type: 'Text', text: /^new$/ })).length).toBe(1)

    // Expand all opens all 5 rows; Collapse all closes them and brings Expand all back.
    await ui.press({ key: 'expand-all' })
    expect((await ui.findAll({ type: 'Text', text: /^new$/ })).length).toBe(5)
    expect(await ui.find({ key: 'expand-all' })).toBeUndefined()
    await ui.press({ key: 'collapse-all' })
    expect(await ui.find({ type: 'Text', text: /^new$/ })).toBeUndefined()
    expect(await ui.find({ key: 'expand-all' })).toBeDefined()
    await ui.unmount()
  })
}

test('Stage, Unstage and the rename use add and restore --staged', async ($, on) => {
  const ran: Ran = []
  single(on, ran)

  await started($)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })

  await ui.press({ key: 'stage-repo:untracked:notes.txt' })
  expect(ran.map(r => r.args)).toContainEqual(['add', '--', 'notes.txt'])

  // Stage all in Changes takes the untracked file along with the edited ones.
  await ui.press({ key: 'stage-all-repo' })
  expect(ran.map(r => r.args)).toContainEqual(['add', '--', 'backend/app.py', 'frontend/src/App.jsx', 'notes.txt'])

  // Unstaging a rename restores both names.
  await ui.press({ key: 'unstage-repo:staged:docs/new.md' })
  expect(ran.map(r => r.args)).toContainEqual(['restore', '--staged', '--', 'docs/old.md', 'docs/new.md'])
  await ui.unmount()
})

test('a wide pane shows the diff side by side', async ($, on) => {
  const ran: Ran = []
  single(on, ran)

  await started($)
  const ui = await $.ui.mount({ ...PANE, props: { ...PANE.props, bodyColumns: 160 }, surface: 'desktop' })
  await ui.press({ key: 'open-repo:unstaged:backend/app.py' })

  // "old" and "new" pair up on one row, so both texts are drawn and "keep" appears on both sides.
  expect(await ui.find({ type: 'Text', text: /^old$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^new$/ })).toBeDefined()
  expect((await ui.findAll({ type: 'Text', text: /^keep$/ })).length).toBe(2)
  await ui.unmount()
})

test('a parent folder with frontend and backend repos shows a section each', async ($, on) => {
  const ran: Ran = []
  const children = { frontend: '/p/frontend', backend: '/p/backend' }
  fakeGit(
    on,
    ran,
    {
      '/p/frontend': [...branch('main'), '1 .M N... 100644 100644 100644 aaa bbb src/App.jsx'].join('\n'),
      '/p/backend': [...branch('dev'), '? app.py'].join('\n'),
    },
    null,
    children,
  )

  await started($)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })

  // One collapsible header per repo, each file keyed by its repo.
  expect(await ui.find({ key: 'fold-repo:frontend' })).toBeDefined()
  expect(await ui.find({ key: 'fold-repo:backend' })).toBeDefined()
  expect(await ui.find({ key: 'open-frontend:unstaged:src/App.jsx' })).toBeDefined()
  expect(await ui.find({ key: 'open-backend:untracked:app.py' })).toBeDefined()

  // Stage and diff run inside the file's own repo, never the parent folder.
  await ui.press({ key: 'stage-backend:untracked:app.py' })
  expect(ran).toContainEqual({ root: '/p/backend', args: ['add', '--', 'app.py'] })
  await ui.press({ key: 'open-frontend:unstaged:src/App.jsx' })
  expect(ran.some(r => r.root === '/p/frontend' && r.args[0] === 'diff')).toBe(true)

  // Folding a repo hides its files only.
  await ui.press({ key: 'fold-repo:frontend' })
  expect(await ui.find({ key: 'open-frontend:unstaged:src/App.jsx' })).toBeUndefined()
  expect(await ui.find({ key: 'open-backend:untracked:app.py' })).toBeDefined()
  await ui.unmount()
})

// A repo's own .git/config must not run a program through the mod: every git call turns those settings off, and diffs skip textconv.
test('every git call disables fsmonitor, hooks and the ext transport', async ($, on) => {
  const ran: Ran = []
  const argvs: string[][] = []
  fakeGit(on, ran, { '/p/frontend': [...branch('main'), '? a.txt'].join('\n') }, null, { frontend: '/p/frontend' }, argvs)

  await started($)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'open-frontend:untracked:a.txt' })
  await ui.press({ key: 'stage-frontend:untracked:a.txt' })

  const git = argvs.filter(a => a[0] === 'git')
  expect(git.length).toBeGreaterThan(3)
  for (const argv of git) {
    for (const flag of ['core.fsmonitor=false', 'core.hooksPath=/dev/null', 'protocol.ext.allow=never']) expect(argv).toContain(flag)
  }
  expect(ran.filter(r => r.args[0] === 'diff').every(r => r.args.includes('--no-textconv'))).toBe(true)
  await ui.unmount()
})

test('a folder with no repo says so instead of hanging', async ($, on) => {
  const ran: Ran = []
  fakeGit(on, ran, {}, null)

  await started($)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /No git repository here/ })).toBeDefined()
  await ui.unmount()
})
