# GM Aviation Backend — Architecture Guide

## Purpose and current state

`backend-new` is a TypeScript REST API foundation for GM Aviation. It uses Express for HTTP handling, MongoDB/Mongoose for persistence, Zod for request validation, and pnpm for packages.

At the time this document was written, this repository contains the shared application infrastructure only. No business/domain modules (for example, aircraft, booking, user, or settings modules) are implemented or registered in `src/routes/index.ts`. Therefore, do **not** assume that an API endpoint exists unless its route has been added to that router.

## Runtime architecture

```text
HTTP client
  -> Express application (src/app.ts)
    -> CORS + JSON parsing
    -> / health-check route
    -> /api/v1 root router (src/routes/index.ts)
      -> feature routers (to be added)
        -> controller -> service -> Mongoose model/database
    -> not-found middleware
    -> global error handler

src/index.ts
  -> connect to MongoDB
  -> create/listen on Node HTTP server
  -> handle startup failure and SIGTERM/SIGINT shutdown
```

The server starts only after `connectDB()` completes. The Express app is intentionally separate from the HTTP-server bootstrap, which makes the app easier to import for tests later.

## Folder structure

```text
backend-new/
├── src/
│   ├── index.ts                 # Process entry point; database connection and HTTP server lifecycle
│   ├── app.ts                   # Express app assembly and global middleware order
│   ├── config/
│   │   ├── index.ts             # Reads environment configuration
│   │   └── database.ts          # Mongoose connection with simple connection-state guard
│   ├── routes/
│   │   └── index.ts             # Versioned API router and feature-route registry
│   ├── middlewares/
│   │   ├── validateRequest.ts   # Runs a Zod schema against body/params/query/cookies
│   │   ├── notFound.ts          # Returns the standard 404 response
│   │   └── globalErrorHandler.ts# Converts known errors into the standard error format
│   ├── errors/
│   │   ├── AppError.ts          # Application error carrying an HTTP status code
│   │   ├── error.types.ts       # Shared error response types
│   │   └── handle*.ts           # Zod and Mongoose error normalizers
│   ├── utils/
│   │   ├── catchAsync.ts        # Passes rejected async route handlers to Express
│   │   ├── sendResponse.ts      # Sends the standard successful response envelope
│   │   ├── QueryBuilder.ts      # Search, filter, sort, pagination, and total-count helper
│   │   ├── calculatePagination.ts# Alternative pagination calculation helper
│   │   ├── validateObjectId.ts  # Rejects malformed MongoDB ObjectIds
│   │   └── withTransaction.ts   # Runs a callback in a Mongoose transaction/session
│   ├── types/
│   │   ├── index.ts             # Barrel exports for shared types
│   │   ├── response.type.ts     # Successful API response type
│   │   ├── pagination.type.ts   # Pagination option type
│   │   ├── filter.type.ts       # Common list-filter type
│   │   └── http-status.d.ts     # Type augmentation for http-status
│   └── validations/
│       └── paginationQuery.validation.ts # Reusable Zod schema for list query parameters
├── package.json                 # Scripts and dependencies
├── tsconfig.json                # Strict TypeScript build configuration
└── pnpm-lock.yaml               # Locked dependency graph
```

## Request lifecycle

1. `src/index.ts` connects to MongoDB and starts the Node HTTP server.
2. `src/app.ts` accepts the request, applies CORS rules, and parses JSON bodies.
3. `GET /` returns a simple API health response.
4. Requests beginning with `/api/v1` enter `src/routes/index.ts`.
5. A future feature router should validate input, run controller/service logic, interact with Mongoose models, and call `sendResponse()`.
6. Unknown paths reach `notFound` and return HTTP 404.
7. Errors passed to `next(error)`—including errors wrapped by `catchAsync()`—reach `globalErrorHandler`, which returns a consistent JSON error response.

Middleware ordering is important: the not-found handler is deliberately after API routes, and the error handler is deliberately last.

## API conventions

### Base paths

- Health check: `GET /`
- API namespace: `/api/v1`
- Feature paths are not yet registered.

### Successful response shape

Use `sendResponse(res, payload)` for normal success responses:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable result message",
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPage": 5 },
  "data": {}
}
```

`meta` is optional and is intended for paginated lists.

### Error response shape

The global error middleware returns:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorSources": [
    { "path": "body.email", "message": "Invalid email address" }
  ]
}
```

In `NODE_ENV=development`, the error handler also includes `stack`. Never depend on `stack` in clients.

Handled error categories are Zod validation errors, Mongoose validation errors, Mongoose cast errors, MongoDB duplicate-key errors (`code: 11000`), custom `AppError`s, and ordinary JavaScript errors.

## Configuration and environment variables

Configuration is centralized in `src/config/index.ts`. The code currently reads:

| Variable | Used for | Notes |
| --- | --- | --- |
| `PORT` | HTTP listen port | Defaults to `9000`. |
| `MONGO_URI` | MongoDB connection string | Required for a successful startup. |
| `DB_USERNANE` | Mongoose connection user | The code currently uses this exact spelling. It appears likely to be a typo for `DB_USERNAME`; keep it aligned with code until corrected. |
| `DB_PASSWORD` | Mongoose connection password | Passed to Mongoose. |
| `FRONTEND_URL` | Production CORS origin | Allowed with credentials. |
| `FRONTEND_DEV_URL` | Development CORS origin | Allowed with credentials. |
| `NODE_ENV` | Development error detail | Controls whether error stacks are returned. |

Do not commit real values from `.env`. The application imports `dotenv/config`, so `.env` values are loaded during startup.

## Reusable building blocks

### Validation

`validateRequest(schema)` parses an object containing `body`, `params`, `query`, and `cookies`. A route should place it before its controller. `paginationQuerySchema` validates optional `page`, `limit`, `searchTerm`, `sortBy`, and `sortOrder` query values; these are strings at the HTTP boundary.

### Error flow

Use `catchAsync()` around asynchronous Express handlers. Throw `new AppError(statusCode, message)` for expected application-level failures. Both approaches ensure the global error handler formats the response.

### Queries and pagination

`QueryBuilder` is the preferred chainable helper for Mongoose list queries. It supports:

- case-insensitive regex search across explicit fields;
- filtering with non-control query fields;
- caller-specified sorting or a `-createdAt` default;
- page/limit pagination, with limit constrained to 1–100;
- `countTotal()` metadata using the same filter.

`calculatePagination()` is a smaller legacy-style helper that calculates `skip`, `sortBy`, and sort direction from typed options. Choose one approach per feature rather than combining them blindly.

### Database safety

Call `validateObjectId(id, entityName)` before operations that assume a MongoDB ObjectId. Use `withTransaction(callback)` only when multiple database writes must succeed or fail together; the callback receives the Mongoose session and must pass it to its operations.

## Recommended feature-module pattern

When adding a domain, keep its files together in a new module folder, then register its router in the central route registry. This structure is recommended; it does not exist yet.

```text
src/modules/<feature>/
├── <feature>.model.ts          # Mongoose schema/model
├── <feature>.validation.ts     # Zod request schemas
├── <feature>.service.ts        # Business logic and database operations
├── <feature>.controller.ts     # HTTP request/response translation
└── <feature>.route.ts          # Express endpoints and middleware order
```

Suggested dependency direction:

```text
route -> validation middleware -> controller -> service -> model
                                      |              |
                                      +-> shared utils/types/errors
```

Controllers should stay thin: obtain request values, call a service, and return `sendResponse()`. Services should hold business rules and persistence operations. Avoid importing Express `Request` or `Response` into services or models.

Example route registration in `src/routes/index.ts`:

```ts
import FeatureRoutes from "../modules/feature/feature.route";

const moduleRoutes = [
  { path: "/features", route: FeatureRoutes },
];
```

That produces endpoints below `/api/v1/features`.

## Commands

```bash
pnpm dev      # Development server with automatic TypeScript reload
pnpm build    # Compile src/ into dist/
pnpm start    # Run compiled dist/index.js
```

## Notes for an AI modifying this project

- Preserve the `/api/v1` version prefix and register every new feature router in `src/routes/index.ts`.
- Preserve the standardized response/error envelopes so frontend code has predictable shapes.
- Validate external input with Zod before it reaches business logic.
- Wrap asynchronous controllers with `catchAsync()` or otherwise pass errors to Express `next()`.
- Prefer `AppError` for intentional client-facing failures.
- Do not expose `.env` values, credentials, database URIs, or development stack traces in production.
- The process event name in `src/index.ts` is currently `unhandlededRejection`; Node’s standard event is `unhandledRejection`. Treat this as a known implementation issue if working on process-level reliability.
- `validateRequest` reads `req.cookies`, but `cookie-parser` is not currently installed/configured. Add it before relying on cookie values.
- The default `QueryBuilder` sort uses `createdAt`; feature schemas need timestamps for that default to be meaningful.
