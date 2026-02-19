# How to Create Agents in Claude CLI

A guide to understanding what agents are, why they matter, and how to create your own.

---

## What is an Agent?

An agent in Claude CLI is an autonomous worker that does a specific job for you. You describe the task, and the agent handles it — reading files, writing code, running commands, asking you questions when needed, and producing a complete result.

Think of agents like specialists on a team. You don't explain the entire project to each person every time — you hire a frontend developer who already knows frontend, a database engineer who already knows databases, and a QA tester who already knows testing. Each one has their own expertise, tools, and approach. That's what agents are.

**In short: an agent is someone who does a task for you. Multiple agents can run at the same time to get work done faster.**

When you tell Claude to "run all agents in parallel", it spins up multiple agents simultaneously — one might be writing API routes while another is setting up the database while another is building the frontend. Each agent works independently, following its own instructions, and they all finish their parts of the project in parallel.

---

## Where Agents Live

Agents are markdown files with YAML frontmatter that define the agent's name, behavior, and capabilities.

- **Global agents** live at `~/.claude/agents/` — available in every project
- **Local agents** live at `.claude/agents/` inside a specific project — only available in that project

Local agents are project-specific. They know your tech stack, folder structure, and coding conventions. Global agents are general-purpose — they work anywhere.

---

## How to Invoke an Agent

Once an agent exists, you invoke it by typing `@` followed by the agent name:

```
@my-agent-name do this task for me
```

Claude recognizes the `@` mention, loads the agent's instructions, and runs it.

---

## Prerequisites

To create agents easily, install the **plugin-dev** plugin which includes the agent-development skill. Inside a Claude CLI session:

```
/plugin
```

Browse the marketplace and install **plugin-dev**. This gives you the `/agent-development` skill that guides you through creating agents.

---

## Creating an Agent

### Step 1: Decide What the Agent Should Do

Before you type anything, be clear about:
- What specific task does this agent handle?
- What files or areas of the codebase does it work on?
- What tools does it need? (reading files, writing code, running commands, searching the web)
- Should it ask you questions or work fully autonomously?
- What does the output look like when it's done?

### Step 2: Use /agent-development

Inside your Claude CLI session, type:

```
/agent-development
```

Then describe what you want the agent to do in detail. The more specific you are, the better the agent will be.

**Example — creating a frontend agent:**
```
/agent-development

Create an agent called frontend-builder. It should build React components for this
project. It knows we use React with TypeScript, Tailwind CSS for styling, and Zustand
for state management. Components go in src/components/ organized by feature. It
should follow our existing patterns — functional components, custom hooks for logic,
and barrel exports from each feature folder. It should write tests for each component
using Vitest and React Testing Library.
```

**Example — creating a database agent:**
```
/agent-development

Create an agent called db-architect. It should handle all database work for this
project. We use PostgreSQL with Prisma as the ORM. It should create and update the
Prisma schema, generate migrations, seed data, and write efficient queries. It knows
our naming conventions — snake_case for table names, camelCase for Prisma models.
It should always add proper indexes and handle relationships correctly.
```

**Example — creating a testing agent:**
```
/agent-development

Create an agent called test-writer. It should write tests for this project. We use
Jest for unit tests and Supertest for API integration tests. It should read the
existing code, understand what each function and endpoint does, and write thorough
tests covering happy paths, edge cases, and error scenarios. Tests go in __tests__/
folders next to the code they test.
```

**Example — creating a documentation agent:**
```
/agent-development

Create an agent called api-documenter. It should read our Express API routes and
generate OpenAPI/Swagger documentation. It should trace each route, extract the
request body schema, response format, status codes, and middleware chain, then
produce a complete OpenAPI spec file at docs/api-spec.yaml.
```

### Step 3: Review and Refine

The skill will generate an agent definition file — a markdown file with YAML frontmatter and a system prompt. Review it:

- Does the name make sense?
- Is the description accurate? (The description tells Claude when to suggest using this agent)
- Does the system prompt cover everything you want?
- Are the right tools listed?
- Is the model appropriate? (Sonnet for most tasks, Opus for complex reasoning)

If something's off, tell Claude what to adjust. Iterate until you're happy.

### Step 4: Use It

Once the agent file is created in `.claude/agents/`, you can immediately use it:

```
@frontend-builder create a dashboard page with a sidebar, header, and main content area
```

```
@db-architect add a notifications table with user_id, type, message, read status, and timestamps
```

```
@test-writer write tests for the authentication module in src/auth/
```

---

## Agent File Structure

For reference, here's what an agent definition file looks like:

```markdown
---
name: frontend-builder
description: "Builds React components for this project using TypeScript, Tailwind CSS, and Zustand. Use when you need to create or modify frontend components."
model: sonnet
tools: Read, Write, Edit, Glob, Grep, Bash
---

# Frontend Builder Agent

You are a frontend development agent for [project name].

## Tech Stack
- React with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Vitest + React Testing Library for tests

## Conventions
- Components in src/components/ organized by feature
- Functional components only
- Custom hooks for business logic
- Barrel exports from each feature folder

## Your Job
When asked to build a component or page:
1. Read existing components to understand patterns
2. Create the component following project conventions
3. Write tests for the component
4. Export it from the feature's index file
```

You don't have to write this manually — `/agent-development` generates it for you. But understanding the structure helps you refine it.

---

## Tips

- **Be specific about conventions** — the more your agent knows about your project's patterns, the less you have to correct later
- **Start with one agent, then add more** — don't try to create 10 agents at once. Create one, use it, see what's missing, then create the next
- **Local agents > global agents for project work** — local agents know your specific codebase. Use global agents only for things that truly work across all projects (like the global doc master)
- **Run agents in parallel for speed** — when building a feature that touches frontend, backend, and database, run all three agents at the same time
- **Agents can reference docs** — if you have planning docs or flow docs, mention them in the agent's system prompt so it reads them before working
