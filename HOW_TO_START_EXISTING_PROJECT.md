# How to Use Claude CLI in an Existing Project

A step-by-step guide to bringing Claude CLI into a project you're already working on — so Claude understands your codebase and can work on it effectively.

---

## Step 1: Open Claude in Your Project

Navigate to your existing project directory and start Claude:

```bash
cd my-existing-project
claude
```

Claude is now running inside your project. It can read every file, understand your folder structure, and see your git history. But it doesn't have a structured understanding of how things work yet — that's what the next steps fix.

---

## Step 2: Create Feature Flow Docs

The first thing to do with an existing project is **document how it works**. Use the global doc master to create feature flow docs for every major feature in your codebase. These docs trace how each feature works end-to-end through your actual code — from user action to database and back.

This is the most important step. Flow docs give Claude (and any future agent) a structured map of your codebase. Without them, Claude has to re-read and re-trace the code every time you ask it to do something. With them, it already knows how everything connects.

**Start with your core features:**

```
@global-doc-master document the authentication flow — from login to token refresh
to logout, including middleware and token storage
```

```
@global-doc-master document the user registration flow — from signup form to email
verification to first login
```

```
@global-doc-master document the database schema — all models, relationships, indexes,
and migration history
```

```
@global-doc-master document the API structure — all endpoints, middleware chain,
request validation, and response formats
```

```
@global-doc-master document the frontend routing and state management — how pages
are organized, how state flows, and how components communicate
```

The agent reads your actual code, traces every layer, and produces flow documents with real `file:line` references under `docs/feature_flow/`. Do this for every major feature — the more you document, the better Claude understands your project.

---

## Step 3: Review the Code and Document Issues

Now that the codebase is documented, review the actual code to find existing problems. Run the code review skill on your project:

```
/global-review-code
```

Or review specific areas:

```
/global-review-code src/auth/
/global-review-code src/api/
/global-review-code src/components/
```

Claude will run a 12-phase audit — architecture, security, performance, error handling, dependencies, testing, and framework best practices. It produces a report with findings grouped by severity.

**For each significant finding**, use the doc master to create an issue doc:

```
@global-doc-master there's a security issue — the user input on the search endpoint
isn't sanitized, and there's no rate limiting on the login route
```

```
@global-doc-master there's a performance issue — the dashboard page makes 12 separate
API calls that could be batched, and the product listing has an N+1 query problem
```

This creates structured issue docs under `docs/issues/`. You now have a clear backlog of what needs fixing, with root cause analysis and recommended fixes — all documented.

As you fix each issue, tell the doc master to move it to resolved:

```
@global-doc-master the search sanitization issue is resolved — added input validation
with Zod and rate limiting with express-rate-limit
```

This builds a searchable history under `docs/resolved/`.

---

## Step 4: Create Local Tools for Your Project

Now that Claude understands your codebase through the flow docs and code review, create local versions of the tools that are tailored to your specific project.

### Local Doc Master Agent

Use the agent-development plugin to generate a local doc master:

```
/agent-development

Create a local doc master agent for this project. It should work like the global
doc-master agent but be aware of this project's tech stack, folder structure,
database schema, API patterns, and coding conventions. Refer to the feature flow
docs in docs/feature_flow/ and the existing code to understand the project.
```

This creates a project-specific agent in `.claude/agents/` that knows your routes, models, services, and conventions — so every doc it writes from now on references your actual code accurately.

### Local Review Skills

Use the skill-development plugin to create local versions of both review skills:

```
/skill-development

Create a local review-doc skill for this project. It should work like the global
global-review-doc skill but be adapted to this project's tech stack, architecture,
and conventions. Refer to the existing code and flow docs to understand what patterns
and security domains are relevant.
```

```
/skill-development

Create a local review-code skill for this project. It should work like the global
global-review-code skill but be tailored to this project's framework, folder structure,
and coding patterns. It should know the project's architecture and check against
the actual conventions used here.
```

From this point on, use the **local** tools instead of the global ones. They produce faster, more accurate results because they already know your project.

---

## Recommended: Create Development Agents

Now that Claude fully understands your codebase, create purpose-built agents that help you develop new features. Use the agent-development plugin to generate agents based on your actual code structure:

```
/agent-development

Look at this project's codebase and create development agents that will help build
new features. Create agents based on what the project actually needs — for example
a frontend agent, a backend agent, a database agent, a testing agent, etc. Each
agent should understand the project's patterns and conventions.
```

The plugin scans your code and generates agents tailored to your project. For example:

- **Frontend Agent** — knows your component structure, state management, styling patterns, and routing
- **Backend Agent** — knows your API patterns, middleware chain, service layer, and database queries
- **Database Agent** — knows your schema, migrations, ORM patterns, and query optimization
- **Testing Agent** — knows your test framework, fixtures, mocking patterns, and coverage gaps

These agents live in `.claude/agents/` and are ready to use whenever you need to build something new. When you start a new feature, instead of explaining your project's conventions from scratch, you just tell the relevant agent what to build and it already knows how.

---

## The Ongoing Workflow

Once your existing project is set up with Claude CLI, the day-to-day workflow is the same as a new project:

1. **New feature?** → Use the local doc master to create a planning doc, review it, iterate until READY, then build
2. **Bug found?** → Use the local doc master to create an issue doc, fix it, move to resolved
3. **Code changes?** → Use the local review-code skill to audit before merging
4. **Feature shipped?** → Use the local doc master to create or update the flow doc

The difference is that everything is faster because your local tools already know the project.

---

## Summary

```
1. Open Claude in your project          →  cd my-project && claude
2. Create feature flow docs             →  @global-doc-master document [each feature]
3. Review the code                      →  /global-review-code
4. Document issues found                →  @global-doc-master [describe each issue]
5. Create local doc master agent        →  /agent-development
6. Create local review skills           →  /skill-development (review-doc + review-code)
7. Create development agents            →  /agent-development (frontend, backend, etc.)
8. Use local tools for all future work
```
