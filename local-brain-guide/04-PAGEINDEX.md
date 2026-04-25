# 4. Page Index — How Claude Searches Your Brain

This is the piece that goes beyond Karpathy's original pattern. A purpose-built JSON file gives Claude a **fast search index** over the entire wiki — and Obsidian's built-in graph view handles the visual side for free.

## The Two-Layer Index

Your brain has two indices that serve different readers:

| File | Reader | Purpose |
|---|---|---|
| `wiki/index.md` | Human | Flat catalog — one line per page, grouped by domain. Read this when you want to scroll through what's in the brain. |
| `wiki/pageindex.json` | Claude (LLM) | Structured search index — tags, summary, related neighbors per page. Read this to find the right pages fast. |

The flat markdown index is for humans. The JSON index is purpose-built for the way an LLM actually searches: keyword/tag matching, then targeted page reads.

## Anatomy of `pageindex.json`

```json
{
  "generated": "2026-04-25",
  "version": 1,
  "pages": [
    {
      "id": "jwt-authentication",
      "file": "dev/jwt-authentication.md",
      "title": "JWT Authentication",
      "domain": "dev",
      "tags": ["auth", "security", "spa"],
      "summary": "JWT stored in httpOnly cookies for SPA auth — XSS-safe pattern.",
      "related": ["session-auth", "httponly-cookies"],
      "confidence": "high",
      "updated": "2026-03-12"
    }
  ]
}
```

Per-page fields and what they're for:

| Field | What It's For |
|---|---|
| `id` | Stable identifier (filename without `.md`). Used in `related[]` references and as the wikilink target. |
| `file` | Path relative to `wiki/` so Claude can open the page after scoring. |
| `title` | Human-readable title, second-strongest match signal. |
| `domain` | Coarse bucket (`dev`, `design`, `tools`, `inspiration`). Used for filtering when a query is domain-specific. |
| `tags` | **The strongest match signal.** Curated keywords. Mandatory — empty tags = page is invisible to fetch. |
| `summary` | One-line description from `wiki/index.md`. Used as a tiebreaker keyword match and for ranking output. |
| `related` | Hop-1 neighbor page IDs (mirrored from the page's `related:` frontmatter). Lets fetch expand context without spidering. |
| `confidence` | High/medium/low — surfaces in answers ("you have a high-confidence opinion on X"). |
| `updated` | Last-edited date — flags staleness for `maintain` mode. |

The whole file stays around **8KB even at 100+ pages** — small enough that one read surfaces every candidate.

## How Fetch Uses It

When you ask "what do I know about state management?", Claude:

1. **Reads `wiki/pageindex.json`** — one ~8KB read.
2. **Scores every entry** against your query:
   - Tag match (e.g., your query mentions `state-management` and a page has `state-management` in tags) — strongest hit.
   - Title match — second strongest.
   - Summary keyword match — tiebreaker.
3. **Picks the top 2-3 candidate pages** — those become the actual reads.
4. **Reads only those `.md` files** — full content for the candidates, nothing speculative.
5. **(Optional) follows `related[]`** for one hop — only if the question is broad ("how does X fit with Y") and the neighbor's tags/summary suggest it would help. Hop-1 only, no spidering.
6. **Synthesizes the answer** with `[[wikilink]]` citations to the pages it pulled.

Total reads for a typical fetch: 1 index + 2-3 pages = **3-4 file reads** for the entire brain. Compare to grepping or reading `index.md` and guessing — much faster, much fewer tokens.

## Why Tags Are Mandatory

Tags are the **single highest-signal field** for LLM search. A page without tags can only be found by title substring — which fails the moment your query uses a synonym ("auth" vs "authentication", "RTK" vs "Redux Toolkit").

Good tags are:
- **Concrete keywords** — what someone would actually type when looking for this. `auth`, `state-management`, `glassmorphism`, `ssh-tunneling`.
- **Plural-naturally** — use the form that matches search behavior (`patterns` not `pattern`).
- **3-6 per page** — enough to cover synonyms and related searches, not so many that signal becomes noise.

Bad tags are:
- Single-letter or single-word abstractions (`misc`, `tech`, `stuff`).
- Filler tags that match every page in the domain (`development` on every dev page is useless).
- Ultra-specific tags only one page would match (defeats the whole point of tags).

`maintain` mode flags every page with empty tags — and refuses to invent tags silently because the author needs to choose them.

## How It's Maintained

You don't write `pageindex.json` by hand. The agent rebuilds it from source-of-truth frontmatter:

| Mode | What Happens to pageindex.json |
|---|---|
| `fetch` | Read only. Never modified. |
| `research` | Entries added/updated for any new or changed page. Untouched entries preserved. |
| `learn` | Same as research — re-syncs entries for any pages the learn session touched. |
| `maintain` | Full rebuild from page frontmatter + `wiki/index.md` summaries. Verifies entry count matches disk, all `file` paths resolve, all `related[]` IDs resolve, no empty tags, parses as valid JSON. |

If the file is missing entirely (fresh vault, never run maintain), fetch falls back to `wiki/index.md` keyword search and notes "run maintain to bootstrap the index."

## What About the Visual Graph?

The relationships between pages — "JWT auth alternative to session auth", "glassmorphism inspired by frosted glass" — live as:

- **`[[wikilinks]]` in page bodies** — written naturally as you describe one concept and link to another
- **`related:` frontmatter entries** — explicit cross-references that aren't necessarily wikilinked in the body

Obsidian's **built-in graph view** (sidebar icon, or `Cmd/Ctrl + G`) renders both automatically. You see your knowledge as a navigable visual graph with no separate file to maintain.

> **Earlier design used `wiki/index.canvas`** — a single `.canvas` file as the graph index. That's been removed. Two reasons:
> 1. **At 50+ pages it degrades into spaghetti** — a single canvas can't lay out a real-sized vault legibly.
> 2. **Obsidian's graph view already does it** — same `[[wikilink]]` graph, rendered automatically, zoom-and-filter UI included. Maintaining a parallel canvas was duplicate work for no gain.
>
> The `obsidian-canvas` skill is still useful — for canvases with **specific topical purpose** (a single architecture diagram, a planning board, a decision tree). It's just not the brain's graph layer anymore.

## Bootstrapping the Index

If you're setting up a fresh vault, just write a few wiki pages with proper frontmatter and run:

```
"maintain my wiki"
```

The agent's `maintain` mode will detect that `pageindex.json` is missing and bootstrap it from your page frontmatter + `index.md` summaries. From then on, every write mode keeps it in sync.

---

**Next:** [05 — Agent Modes](05-AGENT-MODES.md)
