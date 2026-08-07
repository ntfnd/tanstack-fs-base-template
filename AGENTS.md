# AGENTS.md — tanstack-fs-base-template (fullstack base)

This project is the user's fullstack development base: TanStack Start + React 19 + Prisma/SQLite + Soft Club UI (shadcn-compatible). Follow this file FIRST, then `universal-coding-rules` skill for gaps, then the repo's actual config. **The repo's real config and existing code win over any rule in this file.**

## Stack & commands

- **Framework**: TanStack Start 1.132 (Vite 7, SSR), TanStack Router (file-based), TanStack Query 5
- **UI**: Soft Club UI (`@/components/soft-club/*`, `sc-*` classes, theme via `data-sc-theme` on `<html>`) — do NOT mix in default shadcn components
- **DB**: Prisma 6 + SQLite, `DATABASE_URL="file:./dev.db"` in `.env` (gitignored)
- **Package manager**: pnpm 11. Native-build packages MUST be listed in `pnpm-workspace.yaml` `allowBuilds` or install fails with `ERR_PNPM_IGNORED_BUILDS`
- **Commands**: `pnpm dev` (port 3000) · `pnpm build` · `pnpm test:run` · `pnpm lint` · `pnpm format` · `pnpm db:generate` · `pnpm db:push` · `pnpm db:migrate` · `pnpm db:studio` · `pnpm exec tsc --noEmit`
- Path alias: `@/*` → `./src/*` (tsconfig paths). No `../` parent imports — always `@/`.

## Architecture (Clean Architecture, dependency rule: outer → inner only)

```
src/
├── core/                     # innermost — NO framework/DB imports
│   ├── domain/
│   │   ├── entities/         # classes w/ business logic (BaseEntity: id/createdAt/updatedAt, equals())
│   │   ├── repositories/     # interface contracts only (e.g. CounterRepository)
│   │   ├── events/           # domain events
│   │   └── value-objects/
│   └── application/
│       ├── use-cases/        # <feature>/<verb>.use-case.ts: I*UseCase iface + class
│       ├── dtos/
│       └── services/
├── infrastructure/           # green — implements core interfaces
│   ├── di/container.ts       # manual DI: constructs repos → use-cases → exposes getters
│   ├── prisma/client.ts      # PrismaClientSingleton (single instance, disconnect())
│   └── repositories/         # Prisma*Repository implements domain repo iface
├── presentation/
│   └── controllers/          # createServerFn (GET/POST) + handlers that call DI use-cases
├── hooks/                    # use*Query/use*Mutation wrappers around controllers
├── routes/                   # file-based router: __root.tsx, index.tsx
├── components/
│   ├── soft-club/            # installed UI kit (owned source — edit freely)
│   └── theme-provider.tsx
├── lib/                      # utils, query-client
├── styles/                   # app.css imports soft-club.css (tokens)
└── tests/                    # mirror layer structure: domain/, application/, infrastructure/, presentation/
```

**Data flow**: route loader/hook → `presentation/controllers` (server fn) → handler → DI container → use-case → repository interface → Prisma impl → SQLite.

## Conventions (observed in code)

- **Use-case**: `export interface I<Name>UseCase { execute(req?): Promise<Resp> }` + `export class <Name>UseCase implements I<Name>UseCase`; constructor injects repository interface via `private readonly`. Request/Response are exported interfaces `<Name>Request` / `<Name>Response`. Default args `= {}` / `= 1`.
- **Entity**: class extends `BaseEntity`, `public readonly` fields, immutable methods return NEW instances (e.g. `increment()` returns `new Counter(...)`) — NEVER mutate.
- **Repository impl**: maps DB record ↔ entity explicitly in each method; `getDefault()` self-heals missing row; `save()` uses upsert.
- **Controllers**: `createServerFn({ method: "GET" })` / `({ method: "POST" }).inputValidator(...)`; handler pulls use-case from `container`, returns plain values (not entity objects) to the wire.
- **Hooks**: `const X_QUERY_KEY = ["x"] as const`; `useQuery({ queryKey, queryFn, staleTime })`; mutations use optimistic `onMutate` (cancel + snapshot + setQueryData), `onError` rollback, `onSettled` invalidate.
- **DI**: extend `container.ts` manually — construct new repo/use-case, add to `Dependencies`, add a getter. No auto-wiring.
- **Tests**: Vitest, mirror dirs under `src/tests/`; `setup.ts` mocks console; prisma tests do `deleteMany()` in `beforeEach`.

## Style (Raya FE conventions — enforced by eslint, adapted from bridgtl-sus-fe-rima)

- **No semicolons**, double quotes, **4-space indent** (`.prettierrc` aligned: semi:false, tabWidth:4, printWidth:100).
- **No ternaries** (`no-ternary`) — use lookup maps: `const xMap: Readonly<Record<string, T>> = { true: a, false: b }` then `xMap[String(cond)] || fallback`.
- **No `else` / `else-if`** (`no-else`, `max-alternative-conditions: 0`) — early returns / guard clauses only.
- **Max nesting depth 1** (`max-nested-conditions`) — flatten with guard clauses.
- **Comments MUST be tagged**: `TODO:` / `FIXME:` / `NOTE:` / `BUG:` / `HACK:` / `OPTIMIZE:` / `REVIEW:` / `SECURITY:` or `@public|@private|@deprecated` (`pattern-comment`). No plain comments.
- **No `console.log`** — warn/error only (`no-console`).
- **No `../` parent imports** — `@/` only (`pattern-restricted-import`).
- **Import order** enforced by `pattern-sort-import`: react → react-dom → @tanstack → @prisma/client → @radix-ui → lucide → cva → clsx → tailwind-merge → @/core/domain → @/core/application → @/infrastructure → @/presentation → @/hooks → @/lib → @/components → @/routes → @/styles → relative.
- **Components = arrow functions** (`react/function-component-definition`); so define the component BEFORE `createFileRoute(...)`/`createRootRoute(...)` in route files (Route export goes last).
- **Naming**: consts camelCase/PascalCase/UPPER_CASE, types PascalCase, functions camelCase, enums PascalCase/UPPER_CASE (`@typescript-eslint/naming-convention`).
- JSX multiline return: `parens-new-line` (`react/jsx-wrap-multilines`).
- Format with `pnpm exec prettier --write <file>`; lint via `pnpm lint`. Prettier is configured to match ESLint — run both.

## Universal rules that apply here (from universal-coding-rules skill)

1. **Async never typed `void`** — always `Promise<void>`/`Promise<T>`; check every handler/method type vs implementation.
2. **Structured error flow** — use-case throws for not-found (message carries entity id); server handlers must NOT let raw errors leak: wrap, map known cases (validation/timeout/auth), surface generic user message; never swallow with bare `return`. Success AND failure both get UI feedback.
3. **Naming** — files kebab-case with layer suffix (`get-counter.use-case.ts`, `prisma-counter.repository.ts`); classes/types PascalCase; methods camelCase verbs (`getX`/`save`/`increment`); handlers `onX`; feature name drives all names.
4. **Immutable state** — always return new objects/arrays; React state via setState only.
5. **Data mapping at boundary only** — snake_case wire keys ↔ camelCase code types; no leakage either way. (Prisma maps 1:1 here, but applies once schemas grow.)
6. **No hardcoded strings in components** — constants/enums for query keys, ids (`defaultCounterId`), labels.
7. **Repo-first** — before writing: read existing sibling files + this file; run `tsc --noEmit` + prettier before declaring done.
8. **Guards loading-aware** — any permission/route guard must check `!isLoading` first.
9. **Commits** — `type(scope): Sentence case` (feat/fix/refactor/test/chore...).

## Gotchas learned (do not repeat)

- `@vitejs/plugin-react` is imported by `vite.config.ts` but was MISSING from package.json — keep it in devDependencies (build crashes without it).
- pnpm 11 blocks native build scripts by default — `allowBuilds` entries required in `pnpm-workspace.yaml` (prisma, esbuild, @tailwindcss/oxide, unrs-resolver).
- `counter.entity.test.ts` has a flaky ms-race on `updatedAt` (`toBeGreaterThan` can fail if both stamps land in same millisecond) — rerun before blaming.
- `pnpm lint` works — Raya FE ESLint ruleset (no-semi, 4-space, no-ternary, no-else, tagged comments, depth-1 nesting). `routeTree.gen.ts` + `soft-club/**` are ignored in eslint.config.mjs.
- Soft Club registry: add components via `npx shadcn add @soft-club/<name>` (registry registered in components.json).
