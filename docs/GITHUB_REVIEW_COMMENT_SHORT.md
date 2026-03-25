# GitHub Review Comment (Short)

This repository is already closely aligned with the current Claude Code workflow, especially around Plan Mode, the skills vs subagents split, and the documentation-first approach.

The highest-value improvements are not about rewriting the methodology, but about surfacing existing capabilities more clearly.

I would prioritize three additions:

1. Surface `SKILL.md` frontmatter / `effort` earlier in the README
2. Clarify 1M context in API vs Claude Code plan terms
3. Document `rate_limits` (Claude Code 2.1.80, 2026-03-19) and `sandbox.filesystem.allowRead` (Claude Code 2.1.77, 2026-03-17)

I would also keep the warning about `/compact`, auto-compaction, and context rot so users do not interpret long context as "just keep adding everything."

With those changes, the docs would feel even more up to date and easier for new users to apply correctly.
