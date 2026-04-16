# 6. Daily Workflow — How to Actually Use This

The system is set up. Now here's how to use it in practice without it feeling like a chore.

## The Three Moments

Your brain gets smarter at three natural moments. You don't need to schedule anything — just recognize these moments.

### Moment 1: "I found something interesting"

You're browsing, reading, talking to someone — and something clicks. An article, a project, a technique, a tool.

```
"research this article — https://..."
"add to my brain — I saw mempalace on Instagram, spatial memory app with cool UI"
"research Bun vs Node for my next project"
```

**Takes:** 2-5 minutes. Claude saves the source, discusses it with you, files the knowledge.

**Tip:** Don't overthink what's "worth" saving. If it caught your attention, it's worth a note. You can always adjust confidence later.

### Moment 2: "I just taught Claude something"

You finish a coding session. During it, you corrected Claude three times, showed your preferred folder structure, and explained why you hate inline styles. That's valuable knowledge sitting in a conversation that's about to end.

```
"learn from this and update my brain"
```

**Takes:** 1-2 minutes. Claude distills, you confirm, knowledge persists.

**Tip:** Do this at the end of sessions where you made non-obvious decisions. If you just wrote boilerplate CRUD, there's nothing to learn. If you taught Claude your auth pattern, state management preference, or design opinion — that's gold.

### Moment 3: "Let me check before I start"

You're about to start a new project or a new feature. Before you begin:

```
"what do I know about auth for React SPAs?"
"fetch my preferences on folder structure"
"maintain my wiki — I'm starting a new project and want fresh knowledge"
```

**Takes:** 1-3 minutes for fetch, 5-10 minutes for maintain.

**Tip:** Make this a habit at project start. A 2-minute fetch saves 20 minutes of re-explaining preferences.

## Weekly Rhythm

No strict schedule needed, but a rough rhythm helps:

| When | What | Why |
|---|---|---|
| **Daily** | Fetch before new work | Start informed |
| **After sessions** | Learn when you taught Claude something | Capture while fresh |
| **Whenever** | Research when you find things | Build knowledge |
| **Weekly/biweekly** | Maintain | Keep things clean and current |

## Building Momentum — The First 10 Pages

An empty wiki isn't useful. Here's how to seed it quickly:

### Start with what you keep re-explaining

Think about the last 5 things you told Claude in different projects:

1. Your auth pattern (JWT? Sessions? OAuth?)
2. Your state management choice (Redux Toolkit? Zustand? Context?)
3. Your folder structure preference
4. Your CSS approach (Tailwind? Modules? Styled-components?)
5. Your API design conventions

For each one, tell Claude:

```
"research [topic] — here's what I know and prefer: [your opinion]. 
Add it to my brain as high confidence."
```

### Then add things you've been meaning to look into

```
"research the new CSS anchor positioning API — I've seen it mentioned but 
haven't used it yet. Add as low confidence."
```

### Then add inspiration

```
"add to inspiration — I saw [cool project] that does [interesting thing]. 
Might be useful for future UI work."
```

After 10 pages, your wiki has enough content for:
- Meaningful fetch results
- Canvas graphs with visible connections
- Bases queries that return useful data

## Tips for Long-Term Use

### Let beliefs evolve

Don't treat your wiki as carved in stone. When you change your mind, that's a feature:

```
Before: "Prefer Context API for simple state"
After:  "Moved from Context API to Zustand after finding unnecessary 
         re-renders in medium-complexity apps (updated 2026-04-16)"
```

The evolution is the most valuable part — it's your decision history.

### Keep confidence honest

- Used it in 3+ production apps? → `high`
- Read about it, tried it once? → `medium`
- Just heard about it? → `low`

Low confidence is fine. It's a reminder to research more, not a failure.

### Don't over-organize

The LLM handles organization. You handle opinions and decisions. If you're spending time manually editing wiki pages or rearranging the canvas, you're doing the LLM's job.

### Git commit periodically

```bash
cd ~/Projects/obsidian_notes/your-vault-name
git add -A
git commit -m "Wiki update — [brief description of what was added/changed]"
```

This gives you a timeline of how your knowledge grew and the ability to roll back.

### Open-source when ready

When your wiki reaches critical mass (50+ pages), consider publishing it. Your accumulated developer knowledge — preferences, patterns, comparisons, evolution of opinions — is genuinely valuable to others.

Just make sure the open-source safety rules have been followed (no secrets, no client names, generalized patterns only).

## What Success Looks Like

After a month of use:

- You start every project with a 2-minute fetch that gives Claude your full context
- You never re-explain the same preference twice
- Your wiki has 30-50 pages covering your core knowledge areas
- Canvas graphs show meaningful clusters and connections
- New projects benefit from everything you learned in previous ones
- Knowledge compounds — each week, the brain is more useful than the last

---

**Back to:** [README](README.md)
