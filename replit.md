# Heave Games API

A full-stack API platform for Discord bots and games with anime interactions, images, giveaways, and developer tools. Includes a public landing page and a rich admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/heave-games run dev` — run the frontend (auto-assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Default Credentials (dev only)

- Owner: `heave_owner` / `admin123`
- Admin: `admin_alex` / `mod123`
- Moderator: `mod_sara` / `mod123`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + TanStack Query + Framer Motion + Recharts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — Drizzle table definitions (one file per domain)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/heave-games/src/` — React frontend (landing + admin panel)

## Architecture decisions

- Single React app serves both public landing page (`/`) and admin panel (`/admin/*`)
- Session-based auth stored in `sessions` table; token sent as `Authorization: Bearer <token>`
- All API endpoints validated with generated Zod schemas from codegen
- Admin panel uses role-based UI (owner > admin > moderator > user)
- Performance metrics are partially simulated (real CPU/memory from `os` module)

## Product

- **Landing Page** — public, animated, black/white electric indigo aesthetic with category cards, live stats, giveaways, changelog
- **Admin Panel** — full CRUD for users, API keys, categories, endpoints, images, giveaways, games, logs, backups, config, documentation

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Routes under `/admin/*` require a valid session token; login at `/admin/login`
- `config` route deletes by `key` string, not numeric id (different from other routes)
- `sha256` password hashing uses `heave_salt` suffix — must match in both seed SQL and `auth.ts`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
