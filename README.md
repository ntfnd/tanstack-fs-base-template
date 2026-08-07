# TanStack Fullstack Base Template

A fullstack development base built on **TanStack Start** with **Clean Architecture** principles — maintainable, testable, and scalable. Includes **Soft Club UI** (shadcn-compatible component kit), Prisma + SQLite, and a complete testing setup.

> Author: [ntfnd](mailto:roniardiyanto13@gmail.com)

## 🚀 Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Start 1.132** — Full-stack React framework
- **TanStack Router 1.132** — Type-safe file-based routing
- **TanStack Query 5** — Server-state management (caching, optimistic updates)
- **Tailwind CSS 4** — Utility-first CSS framework
- **Soft Club UI** — shadcn-compatible component kit (dark glass / phosphor aesthetic, 118+ components)
- **Radix UI** — Accessible primitives under the hood
- **Lucide React** — Icon library

### Backend & Database

- **TanStack Start Server Functions** — Full-stack capabilities
- **Prisma 6** — Modern database toolkit and ORM
- **SQLite** — Lightweight database

### Development Tools

- **Vite 7** — Lightning-fast build tool
- **TypeScript 5.9** — Strict type safety
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **Vitest** — Fast unit testing framework

## 📋 Prerequisites

- **Node.js** (18 or higher — tested on 22)
- **pnpm** (10+; tested on 11)

## 🛠️ Installation

```bash
git clone <your-fork-url> tanstack-fs-base-template
cd tanstack-fs-base-template
pnpm install
```

> **Note (pnpm 11):** native build packages (prisma, esbuild, @tailwindcss/oxide, unrs-resolver) must stay listed in `pnpm-workspace.yaml` → `allowBuilds`, or install fails with `ERR_PNPM_IGNORED_BUILDS`.

### Environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"
```

### Set up the database

```bash
pnpm db:generate   # Generate the Prisma client
pnpm db:push       # Create SQLite DB and apply the schema
```

## 🚀 Development

Start the development server:

```bash
pnpm dev
```

The application is available at `http://localhost:3000`.

### Available Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Build for production (client + SSR) |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Run ESLint (Raya FE ruleset) |
| `pnpm format` | Format code with Prettier |
| `pnpm exec tsc --noEmit` | Typecheck |
| `pnpm exec prettier --write <files>` | Format specific files |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Create and apply migrations |
| `pnpm db:studio` | Open Prisma Studio |

> Note: `pnpm lint` enforces the Raya FE ESLint ruleset (no semicolons, 4-space indent, no ternaries, no `else`, tagged comments, max nesting depth 1). The config ignores generated `routeTree.gen.ts` and the `soft-club/` vendor kit. `.prettierrc` is aligned to the same style.

## 🎨 Soft Club UI

All ~118 components are installed as owned source under `src/components/soft-club/` (plus hooks in `src/hooks/soft-club/`, utils in `src/lib/soft-club/`). Components are `sc-`-prefixed, fully editable, and themed via `data-sc-theme` on `<html>`.

**Themes**: `green` (default) · `blue` · `orange` · `night-city`

**Add more components** (registry is pre-registered in `components.json`):

```bash
npx shadcn add @soft-club/<component-name>
```

Import the stylesheet once (already done in `src/styles/app.css`):

```css
@import "./soft-club.css";
```

## 🏗️ Clean Architecture Structure

This project follows **Clean Architecture** with clear separation of concerns and dependency inversion. The dependency rule: **outer layers depend inward only**.

```
tanstack-fs-base-template/
├── prisma/                         # Database schema and migrations
│   └── schema.prisma
├── src/
│   ├── core/                       # Core Business Logic (Domain + Application)
│   │   ├── domain/                 # 🟦 Domain Layer (innermost — no framework/DB imports)
│   │   │   ├── entities/           # Business entities with domain logic (extend BaseEntity)
│   │   │   ├── events/             # Domain events
│   │   │   ├── repositories/       # Repository interfaces (contracts only)
│   │   │   └── value-objects/      # Immutable domain concepts
│   │   └── application/            # 🟨 Application Layer
│   │       ├── use-cases/          # <feature>/<verb>.use-case.ts — I*UseCase iface + class
│   │       ├── dtos/               # Data Transfer Objects
│   │       └── services/           # Application services
│   ├── infrastructure/             # 🟩 Infrastructure Layer
│   │   ├── di/container.ts         # Manual DI: repos → use-cases → getters
│   │   ├── prisma/client.ts        # Prisma singleton
│   │   └── repositories/           # Prisma*Repository implementations
│   ├── presentation/               # 🟪 Presentation Layer
│   │   └── controllers/            # createServerFn (GET/POST) + handlers via DI
│   ├── components/                 # React UI components
│   │   ├── soft-club/              # Soft Club UI kit (owned source)
│   │   └── theme-provider.tsx
│   ├── hooks/                      # use*Query / use*Mutation wrappers
│   ├── routes/                     # File-based routing (TanStack Router)
│   │   ├── __root.tsx              # Root layout (theme, providers)
│   │   └── index.tsx               # Home page (counter demo)
│   ├── styles/                     # app.css → imports soft-club.css (+ tokens)
│   ├── tests/                      # Tests mirroring layer structure
│   ├── lib/                        # utils, query-client, soft-club helpers
│   ├── router.tsx                  # Router configuration
│   └── routeTree.gen.ts            # Generated route tree
├── components.json                 # shadcn/Soft Club registry config
├── pnpm-workspace.yaml             # pnpm 11 allowBuilds (native deps)
├── AGENTS.md                       # Dev conventions + rules (read this first)
├── package.json
├── tsconfig.json                   # Strict TypeScript configuration
└── vite.config.ts                  # Vite + TanStack Start configuration
```

**Data flow**: route loader/hook → `presentation/controllers` (server function) → handler → DI container → use-case → repository interface → Prisma implementation → SQLite.

## 🧱 Architecture Layers

### 🟦 Domain Layer (`src/core/domain/`)

The innermost layer containing pure business logic:

- **Entities** — business objects with domain rules (e.g., `Counter`); immutable methods return new instances
- **Repository Interfaces** — contracts for data access
- **Domain Events** — business events within the domain
- **Value Objects** — immutable domain concepts

### 🟨 Application Layer (`src/core/application/`)

Orchestrates business operations:

- **Use Cases** — application-specific business rules (`I*UseCase` interface + class)
- **DTOs** — data transfer objects for layer communication
- **Services** — application services coordinating domain objects

### 🟩 Infrastructure Layer (`src/infrastructure/`)

Handles external concerns:

- **Repository Implementations** — concrete data access (Prisma)
- **Dependency Injection** — DI container wiring repositories → use-cases
- **External Services** — third-party integrations

### 🟪 Presentation Layer (`src/presentation/`)

User interface and API endpoints:

- **Controllers** — HTTP request handlers (TanStack Start server functions)
- **Routes** — application routing with TanStack Router
- **Components** — React UI components

## 🧪 Testing Strategy

Tests are organized by architecture layer under `src/tests/`:

```
src/tests/
├── domain/            # Entity/business-logic tests
├── application/       # Use-case tests
├── infrastructure/    # Repository tests (real Prisma + SQLite)
└── presentation/      # Controller/handler tests
```

- **Unit Tests** — individual components and business logic
- **Integration Tests** — layer interactions (repositories hit the real DB, cleaned in `beforeEach`)

## 🗄️ Database

SQLite via Prisma. The starter schema:

```prisma
model Counter {
  id        String   @id
  value     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## ⚡ State Management with TanStack Query

- `QueryClient` configured in `src/lib/query-client.ts`, provided in `src/routes/__root.tsx`
- `useCounter()` — fetches the counter value (30s staleTime)
- `useIncrementCounter()` — optimistic mutation with rollback + refetch

## 🆕 Counter Feature Demo

The home page demonstrates the full architecture loop: route loader → server function → use-case → Prisma → SQLite, with optimistic UI, error states, and TanStack Query DevTools (dev only).

## 🎯 Features

- ✅ Clean Architecture (domain / application / infrastructure / presentation)
- ✅ Type-safe routing with TanStack Router
- ✅ Server-side rendering with TanStack Start
- ✅ Database integration with Prisma + SQLite
- ✅ Soft Club UI component kit (118+ components, 4 themes)
- ✅ Testing setup with Vitest (per-layer)
- ✅ Dependency injection container
- ✅ Example counter feature demonstrating the architecture
- ✅ TanStack Query state management (caching, optimistic updates)
- ✅ React Query DevTools in development

## 🤝 Contributing

This is a personal fullstack base template. Fork it, adapt it, make it yours.

## 📄 License

MIT

## 🙏 Acknowledgments

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TanStack](https://tanstack.com) — Start, Router, Query
- [Soft Club UI](https://github.com/cobanov/soft-club-ui) — component kit
- [shadcn/ui](https://ui.shadcn.com) — component conventions
- Original boilerplate by Felipe Stanzani
