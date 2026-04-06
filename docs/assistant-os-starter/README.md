# Assistant-OS Starter Templates

English | **[中文](README_CN.md)**

This starter kit is a copy-ready set of templates for the four files referenced in the assistant-os guide:

- `context/manifests/reference_manifest.md`
- `context/protocols/inbox-triage-protocol.md`
- `context/protocols/daily-review-protocol.md`
- `context/protocols/weekly-review-protocol.md`

The goal is not to pre-design a full personal operating system. The goal is to lock down three things early:

- what Claude should read first
- which workflow each recurring task should follow
- what can and cannot be promoted into long-term memory

## Layout

```text
docs/assistant-os-starter/
├── README.md
├── README_CN.md
└── context/
    ├── manifests/
    │   └── reference_manifest.md
    └── protocols/
        ├── inbox-triage-protocol.md
        ├── daily-review-protocol.md
        └── weekly-review-protocol.md
```

## How To Use It

1. Copy the `context/` folder into the root of your own `assistant-os/` project.
2. Edit `reference_manifest.md` so the paths, write permissions, and sources of truth match your real setup.
3. In `CLAUDE.md`, point Claude to `context/manifests/reference_manifest.md` and `context/protocols/` as rule entry points.
4. Run the system for a few days, then refine the protocols based on actual usage instead of over-designing them up front.

## Files

- [reference_manifest.md](context/manifests/reference_manifest.md)
- [inbox-triage-protocol.md](context/protocols/inbox-triage-protocol.md)
- [daily-review-protocol.md](context/protocols/daily-review-protocol.md)
- [weekly-review-protocol.md](context/protocols/weekly-review-protocol.md)

## Notes

- The templates use English headings because that structure tends to remain stable and portable in Claude-facing docs.
- You can localize the prose freely as long as you keep the same operating layers: responsibilities, inputs, steps, outputs, and write rules.
- This starter kit matches the minimal structure described in [HOW_TO_START_ASSISTANT_SYSTEM.md](../../HOW_TO_START_ASSISTANT_SYSTEM.md), not a large enterprise knowledge system.
