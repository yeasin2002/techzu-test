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
