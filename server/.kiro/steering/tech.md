# Tech Stack — Server

## Monorepo Context

The server lives inside a **Turborepo monorepo** at `techzu-test/server/`.

- **Build orchestration**: Turborepo (`turbo.json` at repo root)
- **Package manager**: Bun (root) / pnpm (server workspace — see `package.json`)
- **Git hooks**: Lefthook (`lefthook.yml` at repo root)

## Server Stack

| Concern            | Choice                                                                          |
| ------------------ | ------------------------------------------------------------------------------- |
| Runtime            | Bun (dev) / Node.js (prod)                                                      |
| Framework          | Express v5                                                                      |
| Database           | MongoDB via Mongoose v8                                                         |
| Auth               | JWT (`jsonwebtoken`) + bcryptjs                                                 |
| Validation         | Zod v4                                                                          |
| OpenAPI            | `@asteasolutions/zod-to-openapi` + Scalar (`/scaler`) + Swagger UI (`/swagger`) |
| File uploads       | Multer                                                                          |
| Email              | Nodemailer                                                                      |
| Push notifications | Firebase Admin SDK (FCM)                                                        |
| Logging            | Winston + winston-daily-rotate-file + Morgan                                    |
| Linting            | Oxlint                                                                          |
| Formatting         | Biome                                                                           |
| Build              | tsdown → `dist/`                                                                |
| Type checking      | TypeScript 5 (strict mode)                                                      |
| Module system      | ES modules (`"type": "module"`)                                                 |
| Path alias         | `@/*` → `./src/*`                                                               |

## Common Commands

```bash
# Development
pnpm dev           # tsx watch — hot reload dev server
pnpm dev:b         # bun --hot — alternative hot reload

# Build & Production
pnpm build         # tsdown bundle → dist/
pnpm start         # node dist/app.js
pnpm compile       # standalone executable via bun build --compile

# Code Quality
pnpm check         # oxlint
pnpm check-types   # tsc -b
pnpm format        # biome format --write ./src

# Scaffolding
pnpm generate:module   # interactive scaffold for a new API module
```

## Environment Variables

See `.env.example` for the full list. Key variables:

```env
PORT=4000
API_BASE_URL=http://localhost:4000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT
ACCESS_SECRET=your-access-secret-key
REFRESH_SECRET=your-refresh-secret-key
```

## Notes

- Always use `pnpm` inside the `server/` workspace (not `bun install` or `npm`)
- Use the `@/` path alias for all internal imports — never relative `../../` paths
- API docs auto-generate from Zod schemas — no manual OpenAPI YAML needed
- From repo root you can run `bun run dev` to start all workspaces via Turborepo
