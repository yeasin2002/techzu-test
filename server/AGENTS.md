<!-- PRODUCT -->

# Mini Social Feed App — Product Overview

A lightweight social media application built as a technical assessment. Demonstrates full-stack + mobile development across three layers: backend API, mobile app, and push notifications.

## What It Does

- Users sign up and log in (JWT auth)
- Post short text-only updates to a shared feed
- Like/unlike posts (toggle)
- Comment on posts
- Post authors receive push notifications (FCM) when someone likes or comments on their post
- Feed is paginated (newest first) and filterable by username

## Deliberate Scope Limits

These are intentional decisions, not oversights:

- **Text-only posts** — no media uploads
- **Single JWT, 7-day expiry** — no refresh token rotation
- **FCM push-only** — no WebSocket real-time feed, no persisted notification history
- **No follow/DM/social-graph** features
- **Android-first** mobile target (phone + tablet responsive)

## Project Layout (Monorepo Root)

```
techzu-test/
├── server/     # Express API (this workspace)
├── mobile/     # React Native / Expo app
├── turbo.json  # Turborepo task pipeline
└── BRD.md      # Full product requirements document
```

## API Contract

All responses use a consistent envelope:

```json
{ "success": true, "data": { ... }, "message": "..." }
```

All endpoints prefixed `/api`. Authenticated endpoints require `Authorization: Bearer <token>`.

### Endpoints

| Method | Path                      | Auth | Description                  |
| ------ | ------------------------- | ---- | ---------------------------- |
| POST   | `/api/auth/signup`        | No   | Create account               |
| POST   | `/api/auth/login`         | No   | Login, receive JWT           |
| POST   | `/api/posts`              | Yes  | Create a text post           |
| GET    | `/api/posts?page=&limit=` | Yes  | Paginated feed, newest first |
| POST   | `/api/posts/:id/like`     | Yes  | Like/unlike toggle           |
| POST   | `/api/posts/:id/comment`  | Yes  | Add comment                  |

## Notification Flow

1. User A likes/comments on User B's post
2. Backend identifies User B and looks up their stored FCM token
3. Backend sends FCM push: _"Someone liked your post"_ / _"Someone commented on your post"_
4. One FCM token stored per user — overwritten on each new login/device registration

## Data Model

| Entity  | Key Fields                                                    |
| ------- | ------------------------------------------------------------- |
| User    | id, username, password (hashed), fcmToken, createdAt          |
| Post    | id, authorId, text, createdAt                                 |
| Like    | id, postId, userId, createdAt — unique per user/post (toggle) |
| Comment | id, postId, userId, text, createdAt                           |

Notifications are not persisted — fired as push events at the moment of interaction only.


<!-- STRUCTURE -->
# Project Structure

## Directory Layout

```
src/
├── api/                  # Feature modules (one folder per domain)
│   └── [module]/
│       ├── [module].route.ts       # Express Router — define all routes here
│       ├── [module].validation.ts  # Zod schemas for body/params/query
│       ├── [module].openapi.ts     # OpenAPI path/schema registration
│       └── services/
│           ├── [module].service.ts # Business logic as RequestHandler functions
│           └── index.ts            # Barrel export
├── db/
│   ├── index.ts                    # Re-exports connectDB
│   └── models/                     # Mongoose models (one file per model)
├── data/
│   └── index.ts                    # Static / seed data
├── helpers/
│   ├── response-handler.ts         # sendSuccess, sendError, sendCreated, etc.
│   ├── mongodb-error-handler.ts    # exceptionErrorHandler, validateObjectIds
│   └── index.ts
├── lib/
│   ├── openapi.ts                  # Shared OpenAPI registry + generateOpenAPIDocument()
│   ├── jwt.ts                      # signAccessToken, signRefreshToken, verifyAccessToken, generateOTP
│   ├── connect-mongo.ts            # connectDB()
│   ├── multer.ts                   # Multer upload config
│   ├── nodemailer.ts               # Email transport
│   ├── logger.ts                   # Winston logger
│   ├── morgan.ts                   # Morgan format config
│   └── index.ts                    # Barrel export for all lib utilities
├── middleware/
│   ├── auth.middleware.ts          # requireAuth, requireRole, requireAnyRole, requireOwnership, optionalAuth
│   ├── validation.middleware.ts    # validateBody, validateParams, validateQuery, validate
│   ├── common/
│   │   ├── global-error-handler.ts
│   │   ├── default-not-found.ts
│   │   └── index.ts
│   └── index.ts
└── app.ts                          # Express app setup, middleware, routes, server start

api-client/                         # .http test files (one per module)
uploads/                            # Uploaded files (local storage)
script/
└── generate-module.js              # Module scaffolding CLI
docs/                               # Developer documentation
```

## Module Conventions

Every feature lives under `src/api/[module]/` and follows this exact pattern:

### `[module].route.ts`

- Import `./[module].openapi` at the top (side-effect import — required for OpenAPI registration)
- Create and export a named `Router` instance
- Apply `validateBody` / `validateParams` / `validateQuery` middleware before handlers

### `[module].validation.ts`

- Call `extendZodWithOpenApi(z)` once at the top
- Export named Zod schemas (e.g. `CreateUserSchema`, `UserParamsSchema`)
- Add `.openapi({ description: "..." })` to fields that need API docs metadata

### `[module].openapi.ts`

- Import `registry` from `@/lib/openapi`
- Call `registry.register(...)` for reusable schemas
- Call `registry.registerPath(...)` for each route
- **Must be side-effect imported in the route file** so it runs before `generateOpenAPIDocument()`

### `services/[module].service.ts`

- Export async `RequestHandler` functions (named exports)
- Use `sendSuccess`, `sendCreated`, `sendError`, etc. from `@/helpers` for all responses
- Wrap DB calls in try/catch and delegate to `exceptionErrorHandler` for Mongoose errors

## Response Pattern

Always use helpers from `@/helpers/response-handler`:

```ts
sendSuccess(res, 200, "Users fetched", data);
sendCreated(res, "User created", data);
sendBadRequest(res, "Validation failed", errors);
sendUnauthorized(res, "Token required");
sendNotFound(res, "User not found");
sendInternalError(res, "Something went wrong");
// or via exceptionErrorHandler for Mongoose errors:
exceptionErrorHandler(error, res, "Failed to fetch user");
```

## Auth Middleware

```ts
requireAuth; // Validates Bearer JWT, sets req.user
requireRole("admin"); // Exact role match
requireAnyRole(["customer", "contractor"]); // Multiple allowed roles
requireOwnership("id"); // req.user.userId must match req.params.id (admin bypasses)
optionalAuth; // Attaches req.user if token present, never rejects
```

`req.user` shape: `{ userId: string, email: string, role: "customer" | "contractor" | "admin" }`

## Naming Conventions

- **Folders**: kebab-case (`auth-tokens/`)
- **Files**: camelCase (`example.service.ts`)
- **Exports**: named exports preferred; barrel `index.ts` in each folder
- **Imports**: always use `@/` alias (never relative `../../`)
- **API routes**: `/api/[module]/...` pattern

## Adding a New Module

1. Run `pnpm generate:module` to scaffold boilerplate, **or** create files manually
2. Register the router in `src/app.ts`: `app.use("/api/[module]", moduleRouter)`
3. The OpenAPI import in the route file handles doc registration automatically
4. Add a `api-client/[module]-api.http` file for manual testing


<!-- TECH -->

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
