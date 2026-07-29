<!-- PRODUCT -->

# Product

**Mini Social Feed App** — a lightweight social media application built as a technical assessment. It demonstrates full-stack + mobile development across three layers:

- **Backend API**: Node.js/Express REST API handling authentication, posts, likes, and comments
- **Mobile app**: React Native/Expo providing the user-facing feed, post creation, and interactions
- **Push notifications**: Firebase Cloud Messaging (FCM) alerting users when their posts get liked or commented on

## Core Features

- User signup and login (JWT auth)
- Shared paginated feed of text posts (newest first), filterable by username
- Like/unlike toggle on posts
- Comments on posts
- Push notifications to post authors on like/comment events

## Deliberate Scope Limits

- Text-only posts (no media)
- No refresh tokens — single JWT, 7-day expiry
- FCM push-only notifications — no real-time WebSocket feed, no persisted notification history
- No follow/DM/social-graph features
- Android-first mobile target (phone + tablet responsive)

## API Response Shape

All API responses follow a consistent envelope:

```json
{ "success": true, "data": { ... }, "message": "..." }
```

All endpoints are prefixed `/api`. Authenticated endpoints require `Authorization: Bearer <token>`.

<!-- END:PRODUCT -->

<!-- START:STRUCTURE -->

# Project Structure

## Root (Monorepo)

```
techzu-test/
├── server/          # Express API (Bun runtime, Mongoose, MongoDB)
├── mobile/          # React Native / Expo mobile app
├── turbo.json       # Turborepo task pipeline
├── package.json     # Root workspace definition + shared devDeps
├── lefthook.yml     # Git hook configuration
├── BRD.md           # Product requirements document
└── bun.lock
```

---

## Server (`/server/src`)

```
src/
├── app.ts                    # Entry point — Express setup, middleware, OpenAPI mount, server start
├── api/                      # Feature modules (one folder per resource)
│   └── [module]/
│       ├── [module].route.ts      # Express router — route definitions + middleware wiring
│       ├── [module].service.ts    # Business logic as RequestHandler functions
│       ├── [module].validation.ts # Zod schemas for body/query/params + TS type exports
│       └── [module].openapi.ts    # Registers schemas + paths with zod-to-openapi registry
├── db/
│   ├── index.ts              # DB connection (connectDB)
│   └── models/               # Mongoose model definitions
├── middleware/
│   ├── auth.middleware.ts    # JWT verification
│   ├── validation.middleware.ts
│   ├── index.ts
│   └── common/               # notFoundHandler, globalErrorHandler
├── helpers/
│   ├── response-handler.ts   # Uniform { success, data, message } response helpers
│   └── mongodb-error-handler.ts
├── lib/
│   ├── jwt.ts
│   ├── logger.ts             # Winston logger
│   ├── morgan.ts             # HTTP request logging format
│   ├── multer.ts             # File upload config
│   ├── nodemailer.ts
│   ├── openapi.ts            # generateOpenAPIDocument()
│   └── connect-mongo.ts
└── data/
    └── index.ts              # Static/seed data
```

**Server module conventions:**

- One folder per API resource under `src/api/`
- `[module].openapi.ts` must be imported in `app.ts` before `generateOpenAPIDocument()` is called
- Business logic lives in `*.service.ts` — keep routes thin
- All responses use the `{ success, data, message }` envelope via response-handler helpers
- API test files go in `api-client/[module]-api.http`

---

## Mobile (`/mobile/src`)

```
src/
├── app/                  # Expo Router screens (file = route)
│   ├── _layout.tsx       # Root navigator — provider stack order matters (see below)
│   ├── index.tsx         # Entry screen
│   └── +not-found.tsx    # 404 fallback
├── components/           # Shared UI components (named exports only)
├── contexts/             # React context providers + hooks
├── lib/
│   └── env.ts            # Type-safe env vars via @t3-oss/env-core + Zod
├── assets/
│   └── images/
└── global.css            # Tailwind + Uniwind + HeroUI style imports
```

**Mobile conventions:**

- All `src/` imports use the `@/*` alias (e.g. `@/components/container`)
- Screens live in `src/app/` — filename = route path
- Components use named exports, never default exports
- Props typed inline or with a local `type Props = { ... }`
- One file per context in `src/contexts/`; export both the provider and a `use*` hook that throws outside the provider
- Styling via Tailwind `className` props; use `cn()` from `heroui-native` for conditional merging
- Wrap third-party components with `withUniwind()` to enable `className` support
- Animations use `react-native-reanimated` — create animated components with `Animated.createAnimatedComponent()`
- Theme state via `AppThemeProvider` — use `useAppTheme()` hook; never call `Uniwind.setTheme()` directly

**Root layout provider order** (`_layout.tsx`):

```
GestureHandlerRootView → KeyboardProvider → AppThemeProvider → HeroUINativeProvider
```

---

## Key Conventions (Both Workspaces)

- **TypeScript strict mode** everywhere — no `any`, no unchecked indexed access in mobile
- **Named exports** preferred over default exports
- **Barrel files** (`index.ts`) for clean module imports
- **kebab-case** for directory names, **camelCase** for TS files
- **ES modules** throughout (`"type": "module"` on server)
- Environment variables validated at startup — never access `process.env` directly without a typed wrapper

<!-- END:STRUCTURE -->

<!-- START:TECH -->

# Tech Stack

## Monorepo

- **Build orchestration**: Turborepo (`turbo.json` at root)
- **Package manager**: Bun
- **Workspaces**: `mobile/*`, `server/*`
- **Git hooks**: Lefthook (root `lefthook.yml`)

---

## Server (`/server`)

| Concern            | Choice                                                 |
| ------------------ | ------------------------------------------------------ |
| Runtime            | Bun (dev) / Node.js (prod)                             |
| Framework          | Express v5                                             |
| Database           | MongoDB via Mongoose v8                                |
| Auth               | JWT (`jsonwebtoken`) + bcryptjs                        |
| Validation         | Zod v4                                                 |
| OpenAPI            | `@asteasolutions/zod-to-openapi` + Scalar + Swagger UI |
| File uploads       | Multer                                                 |
| Email              | Nodemailer                                             |
| Push notifications | Firebase Admin SDK (FCM)                               |
| Logging            | Winston + winston-daily-rotate-file + Morgan           |
| Linting            | Oxlint                                                 |
| Formatting         | Biome                                                  |
| Build              | tsdown                                                 |
| Type checking      | TypeScript 5 (strict)                                  |

### Server Commands

```bash
bun dev          # tsx watch — hot reload dev server
bun dev:b        # bun --hot — alternative hot reload
bun build        # tsdown bundle
bun start        # node dist/app.js (production)
bun compile      # standalone executable via bun build --compile
bun check        # oxlint
bun check-types  # tsc -b
bun format       # biome format --write ./src
bun generate:module  # scaffold a new API module
```

---

## Mobile (`/mobile`)

| Concern        | Choice                                                    |
| -------------- | --------------------------------------------------------- |
| Framework      | React Native 0.83 + React 19                              |
| Platform       | Expo 55                                                   |
| Navigation     | Expo Router 55 (file-based, typed routes)                 |
| Styling        | Uniwind (Tailwind-for-RN) + TailwindCSS 4 + HeroUI Native |
| Animations     | react-native-reanimated 4                                 |
| Gestures       | react-native-gesture-handler                              |
| Keyboard       | react-native-keyboard-controller                          |
| Bottom sheets  | @gorhom/bottom-sheet                                      |
| Env vars       | @t3-oss/env-core + Zod (`src/lib/env.ts`)                 |
| Secure storage | expo-secure-store                                         |
| Linting        | Oxlint + ESLint (via ultracite)                           |
| Formatting     | Oxfmt (via ultracite)                                     |
| Type checking  | TypeScript 5 (strict, noUncheckedIndexedAccess)           |
| Dead code      | Knip                                                      |

### Mobile Commands

```bash
pnpm dev              # expo start --clear
pnpm start            # expo start
pnpm android          # run on Android emulator
pnpm ios              # run on iOS simulator
pnpm web              # run in browser
pnpm check            # lint + format check (ultracite)
pnpm fix              # lint + format fix (ultracite)
pnpm check-types      # tsc --noEmit
pnpm knip             # dead code check
```

### Root (Turborepo) Commands

```bash
bun run dev           # start all workspaces dev servers
bun run build         # build all workspaces
bun run lint          # lint all workspaces
bun run check-types   # type-check all workspaces
```

---

## Notes

- Server uses ES modules (`"type": "module"`); use named exports and barrel `index.ts` files
- Mobile uses `@/*` path alias for all `src/` imports
- All client env vars in mobile must be prefixed `EXPO_PUBLIC_`
- Read Expo versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing mobile code

<!-- END:TECH -->
