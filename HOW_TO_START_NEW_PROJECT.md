# How to Start a New Project with Claude CLI

A step-by-step guide to building an entire project from scratch using Claude CLI — from an idea in your head to working code.

---

## Step 1: Create Your Project Folder and Open Claude

Create a folder for your project, open your terminal, navigate to it, and start Claude:

```bash
mkdir my-project
cd my-project
claude
```

You're now in a Claude Code session inside an empty project directory. Everything starts here.

---

## Step 2: Write Your Planning Doc with Global Doc Master

Type `@global-doc-master` and describe your project idea in as much detail as you can. Don't hold back — the more you tell it, the better the planning doc will be.

**What to include in your message:**
- What the project is and what problem it solves
- The business logic — how things should work
- What users will do (the user journey)
- What tech stack you want (or let the agent suggest one)
- How you want the folders structured
- Any integrations (databases, APIs, third-party services)
- Any constraints or preferences you have

**Example:**
```
@global-doc-master I want to build a task management API with Node.js and Express.
It should have user authentication with JWT, projects that contain tasks, and tasks
can be assigned to users. Users can create projects, invite members, create tasks,
assign tasks, and mark them complete. I want PostgreSQL with Prisma as the ORM.
The folder structure should be feature-based — each feature in its own folder with
its routes, controllers, and services. I also need rate limiting and input validation.
```

Press enter. The agent will:

1. Scan your project (empty in this case, so it knows it's a fresh start)
2. Ask you **2-4 rounds of structured questions** — things like "Should tasks have priorities?", "Do you need real-time notifications?", "What's the auth flow for invitations?"
3. **Answer every question.** Be specific. These answers shape the entire planning doc.
4. Write a complete planning doc under `docs/planning/` with requirements, technical design, implementation phases, testing strategy, and risks

When it's done, you'll have a detailed blueprint for your project in `docs/planning/`.

---

## Step 3: Generate Project-Specific Agents

Now that you have a planning doc, don't just jump into coding. Instead, use the **agent-development** plugin to create agents that are purpose-built for your specific project.

```
/agent-development
```

This plugin scans your planning doc and generates local agents tailored to your project — for example, a database setup agent, an API routes agent, a test writing agent, etc. These agents live in your project's `.claude/agents/` folder and understand the exact architecture, tech stack, and patterns from your plan.

Why this matters: generic Claude is good, but agents that know your specific project plan, folder structure, and tech decisions are significantly better. They don't need to guess — they already know the blueprint.

---

## Step 4: Run Agents in Parallel to Build the Project

Once your agents are generated, tell Claude to run them:

```
Run all the project agents in parallel and build the project based on the planning doc
```

Claude will spin up multiple agents simultaneously — one might be setting up the database schema while another is building API routes while another is writing middleware. This is where the speed comes from.

### Choose Your Mode

You have two options for how Claude writes code:

**Ask Before Edit mode** — Claude shows you what it wants to write and asks for approval before making changes. Use this if you want to review every piece of code as it's written. Slower but gives you full control.

**Auto-edit mode** — Claude writes all the code without stopping to ask. Use this when you trust the planning doc is solid and want the project built fast. You can always review everything after.

For a well-planned project, auto-edit mode is usually fine. The planning doc already defines what should be built, and the agents follow it closely.

---

## Step 5: Document and Fix Issues

Read through what the agents built before you run it. Claude flags problems as it writes, but a pass over the finished code still catches things — especially where two agents worked on connected pieces.

For small fixes, just tell Claude what's wrong and it will fix them directly.

For bigger issues — security vulnerabilities, architectural problems, missing error handling — use the doc master to document the issue properly before fixing:

```
@global-doc-master there's a security issue — the auth middleware doesn't validate
token expiry correctly, and the refresh endpoint is missing rate limiting
```

The agent creates an issue doc under `docs/issues/`. Fix the code, then tell the doc master to move it to resolved:

```
@global-doc-master the auth security issue is resolved — fixed token validation and
added rate limiting to the refresh endpoint
```

This builds a history of issues and fixes that's searchable later.

---

## Step 6: Test the Project

Once the code is written, test it. How you test depends on what you built:

### Backend Projects

Ask Claude to test the API endpoints using curl commands in the terminal:

```
Start the server and test all the API endpoints — create a user, log in, create a
project, add a task, assign it, and mark it complete. Use curl commands and show me
the responses.
```

Claude will start your server, run curl commands against every endpoint, and show you the results. If something fails, it can debug and fix it on the spot.

### Frontend Projects

Use Playwright to test the UI interactively:

```
Open the app in the browser using Playwright and test the full user flow — sign up,
log in, create a project, add tasks, and check that all buttons and forms work.
```

Claude will launch a browser, navigate your app, click buttons, fill forms, and verify that everything works visually. It can take screenshots and catch UI bugs that curl can't find.

### Full Stack Projects

Do both — test the API with curl first, then test the frontend with Playwright.

---

## Step 7: Iterate

If tests reveal bugs or missing functionality:

1. Describe the issue to Claude — it will fix it directly
2. For bigger issues, create a new planning doc for the fix: `@global-doc-master there's a bug where...`, then rebuild from it — same cycle as before

This is the loop: **Plan → Build → Test → Fix → Repeat**. Each cycle makes the project better.

---

## Optional: Document Your Feature Flows

Once the project is built and working, it's highly recommended to ask the doc master to create **feature flow docs**. These trace how each major feature works end-to-end through your actual code — from user action to database and back.

This is optional but extremely valuable. Flow docs give you (and any AI agent working on your project later) a complete map of how things work. When something breaks six months from now, you don't have to re-trace the code — you just read the flow doc.

**Examples of flow docs you might create:**

```
@global-doc-master document the authentication flow — from login to token refresh
to logout, including middleware and token storage
```

```
@global-doc-master document the user registration flow — from signup form submission
to email verification to first login
```

```
@global-doc-master document the payment flow — from checkout initiation to Stripe
webhook to order confirmation
```

```
@global-doc-master document the file upload flow — from the upload button to S3
storage to serving the file back to the user
```

```
@global-doc-master document the real-time messaging flow — from sending a message
to WebSocket delivery to read receipts
```

The agent reads your actual code, traces every layer (frontend components, API routes, controllers, services, database queries), and produces a flow document with real `file:line` references and architecture diagrams. These docs live under `docs/feature_flow/`.

The more flow docs you create, the easier it is for anyone — human or AI — to understand and work on your codebase.

---

## Recommended: Create Local Versions of Your Tools

This is the final step and it's the one that makes your project truly self-sufficient. Up until now you've been using the **global** doc master agent — it works on any project but doesn't know the specifics of yours. Now that your project is built and working, create a **local** version tailored to your codebase.

### Local Doc Master Agent

Use the agent-development plugin to generate a local version of the doc master that understands your specific project:

```
/agent-development

Create a local doc master agent for this project. It should work like the global
doc-master agent but be aware of this project's tech stack, folder structure,
database schema, API patterns, and coding conventions. It should reference the
actual code when writing docs.
```

This creates a project-specific agent in `.claude/agents/` that knows your routes, your models, your services — so when it writes docs, it references your actual code instead of generic patterns.

### Why This Matters

The global agent is general-purpose — it works everywhere but knows nothing about your specific project. The local version is pre-loaded with knowledge of your codebase, so it references your actual patterns, your actual routes, your actual models instead of generic ones.

Think of it this way: the global agent got you from zero to a working project. The local one keeps that project healthy as it grows.

---

## Summary

```
1. Create folder, open Claude           →  mkdir my-project && cd my-project && claude
2. Write planning doc                   →  @global-doc-master [describe your project]
3. Answer the agent's questions         →  Be specific, cover edge cases
4. Generate project-specific agents     →  /agent-development
5. Run agents in parallel               →  Tell Claude to run all agents and build
6. Document issues                      →  @global-doc-master [describe the issue]
7. Test (curl for backend, Playwright for frontend)
8. Fix issues, repeat the cycle
```
