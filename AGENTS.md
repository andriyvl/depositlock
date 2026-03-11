# Development Guidelines

## I. Code & Project Standards

### Role & Tech Stack
Software engineer: web apps, browser extensions, AI automations, Web3 integrations
Stack: TypeScript, Vite, React, Next.js, Angular, Vue, Svelte, Bun/Hono, Node.js/Express, Postgres (Neon ORM)

### Code Principles
- Separation of concerns, reusability, DRY, KISS, SOLID
- ZERO Comments policy: self-explanatory code & naming
- Always use Typescript. Refer to the /models folder and reuse existing types. Avoid `any`.
- OOP + functional programming
- Design patterns: https://refactoring.guru/design-patterns/catalog

### Package Manager
- Always use pnpm for frontend
- Use bun for backend when using bun runtime.

### Naming Conventions
- **PascalCase**: Components, interfaces, types, enums, classes
- **camelCase**: functions, variables, DB columns
- **CAPS**: constants (system variables)
- **kebab-case**: ALL file names

### File Naming Pattern
Use suffixes, NOT prefixes:
- `time-difference.hook.ts` - hook function name inside follows standard use* prefix
- `timezone.service.ts` - contains usually a class with static methods
- `auth.provider.ts`
- `user.model.ts` - unites types, const, config, enum (only use separate *.suffix.ts of mentioned if more than 5 items of a type)
- `component-name.spec.ts`
- `auth-navigation.guard.ts`
- `service-worker.bridge.ts`
- `timezone.utils.ts` - contains helpers and utility functions. (NOT using *.helpers.ts)
- `feed.store.ts`

### Code Structure
- **Exports**: Named exports preferred, defaults acceptable
- **State**: Zustand over Context. Separate slices for SoC
- **Types**: Interfaces for object shapes
- **Folders**: Flat preferred. Feature-based modules when needed (self-contained). Shared logic in `/shared`
- **Colocation**: Keep related files close together
- **Component Composition**: Prefer composition over inheritance

### Git Conventions
- **Commits**: `prefix(context/taskId): description`
- **Branches**: `prefix/taskId/description`
- **Prefixes**: `feat`, `style`, `fix`, `refactor`, `chore`, `docs`, `build`

### Database
Column names in camelCase (no mapping needed)
Using ORM with database schema to update the database tables.

### ROADMAP.md Workflow
Work step-by-step following ROADMAP.md. Create/update steps with tasks and bugs autonomously. Mark tasks completed only after confirmation. One task at a time, verify before proceeding.

---

## II. LLM Interaction Rules

### Communication
- Be concise, output essential information only
- Ask for permission before performing actions if prompt is unclear

### Problem Solving
- If fixing same bug repeatedly: change approach, analyze root cause, apply critical thinking
- Don't repeat failed attempts - ask for relevant info (logs, screenshots, network data)
- Refer to official documentation of dependencies

### File Handling
- Check if manual changes make sense before reverting/renaming fields

---

## Reference Documentation
- React: https://react.dev
- Next.js: https://nextjs.org/docs
- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Hono: https://hono.dev/docs/
- Bun: https://bun.com/docs
- Tailwind: https://tailwindcss.com/docs
- Drizzle ORM Docs: https://orm.drizzle.team
- Neon Docs: https://neon.tech/docs
- PostgreSQL: https://www.postgresql.org/docs/
- ShadCN MCP: https://ui.shadcn.com/docs/mcp
- Turborepo: https://turborepo.com/docs