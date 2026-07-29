# Mini Social Feed App — Project Documentation

**Type:** Technical Spec & Project Plan
**Status:** Draft v1
**Audience:** Anyone reviewing, contributing to, or evaluating this project

---

## 1. Overview

The **Mini Social Feed App** is a lightweight social media application built as part of a technical assessment. It demonstrates full-stack + mobile development capability across three layers:

- A **backend API** (Node.js/Express) handling authentication, posts, likes, and comments
- A **mobile app** (React Native/Expo) providing the user-facing feed, post creation, and interactions
- A **push notification system** (Firebase Cloud Messaging) that alerts users when their posts get liked or commented on

The project intentionally keeps scope small and functionality simple — the goal is a clean, working, well-structured implementation rather than a feature-rich product.

### 1.1 Goals

- Let users sign up, log in, and post short text updates
- Let users view a shared feed of all posts (paginated, newest first)
- Let users like and comment on posts
- Notify a post's author (via push notification) when someone likes or comments on their post
- Keep the codebase simple, readable, and easy for a reviewer to run locally

### 1.2 Non-Goals (Out of Scope)

To keep the assessment focused, the following are explicitly **not** part of this project:

- Image, video, or media posts (text-only)
- Direct messaging
- Follow/friend systems
- Real-time live feed updates (e.g., WebSockets) — the feed loads via pull/refresh, not a live socket connection
- Complex role-based permissions or admin panels
- Multi-environment deployment pipelines (CI/CD) — a working local/dev setup is sufficient

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend runtime | Bun | Fast JS/TS runtime, replaces Node for dev + execution |
| Backend framework | Node.js / Express | REST API |
| Database | PostgreSQL | Relational data — users, posts, likes, comments |
| ORM | Drizzle | Type-safe schema + queries, lightweight migrations |
| Auth | JWT (JSON Web Token) | Stateless, simplest viable approach for this scope |
| Containerization | Docker | Local dev environment (Postgres + API) |
| Mobile | React Native + Expo | Cross-platform (Android-first, per assessment requirement) |
| Push notifications | Firebase Cloud Messaging (FCM) | Simple "someone liked/commented" push, no in-app real-time layer |

### 2.1 Why This Stack

- **Bun** — faster install/start times than Node during development; drop-in compatible with Express-style code.
- **Drizzle over Prisma/TypeORM** — lighter weight, SQL-like syntax, less abstraction overhead for a small schema (4 tables).
- **JWT-only auth (no refresh tokens)** — the assessment doesn't require session longevity or multi-device logout handling. A single access token issued at login, sent on every request, is the simplest correct approach. This is a deliberate scope decision, not an oversight — noted here so reviewers understand it's intentional.
- **FCM push-only notifications (no WebSockets)** — the requirement is "notify when liked/commented," not "live-updating feed." Push notification on the interaction event is sufficient and avoids the added complexity of maintaining socket connections.
- **Expo over bare React Native** — faster setup, built-in build tooling (EAS) for producing the APK deliverable without configuring native Android tooling manually.

---

## 3. Project Structure

The project is split into two **independent, top-level folders** — not a monorepo. No shared packages, no workspace tooling beyond what each project needs individually.

```
project-root/
├── server/     → Node.js/Express backend (Bun runtime, Drizzle ORM, PostgreSQL)
├── app/        → React Native/Expo mobile app
└── README.md   → Setup instructions for both
```

Each folder is self-contained with its own dependencies, environment config, and can be run independently. This keeps the setup simple and avoids monorepo tooling overhead (Turborepo, shared configs, etc.) that isn't needed for a two-project assessment.

---

## 4. Data Model

Four core entities:

| Entity | Key Fields | Relationships |
|---|---|---|
| **User** | id, username, password (hashed), createdAt | has many Posts, Likes, Comments |
| **Post** | id, authorId, text, createdAt | belongs to User; has many Likes, Comments |
| **Like** | id, postId, userId, createdAt | belongs to Post and User (unique per user/post — toggles like/unlike) |
| **Comment** | id, postId, userId, text, createdAt | belongs to Post and User |

**Notes:**
- A `Like` is a join-table style record. A user can only like a post once — the "like" endpoint toggles it (like if not liked, unlike if already liked).
- Notifications are not stored as a separate persisted entity for this scope — they're fired as push events at the moment of interaction (like/comment), not queried later as a notification history. If a "notification inbox" becomes a requirement later, this would need its own table.

---

## 5. API Design

All endpoints are prefixed `/api`. Authenticated endpoints require a `Bearer <token>` header.

| Method | Endpoint | Purpose | Auth Required |
|---|---|---|---|
| POST | `/auth/signup` | Create account | No |
| POST | `/auth/login` | Log in, receive JWT | No |
| POST | `/posts` | Create a text post | Yes |
| GET | `/posts?page=&limit=` | Get paginated feed, newest first | Yes |
| POST | `/posts/:id/like` | Like/unlike a post (toggle) | Yes |
| POST | `/posts/:id/comment` | Add a comment to a post | Yes |

### 5.1 Design Principles

- **Consistent response shape** — every response follows `{ success, data, message }` so the mobile app can handle responses uniformly.
- **Validation at the boundary** — all incoming request bodies are validated (e.g., non-empty post text, comment length limits) before hitting business logic.
- **Ownership checks** — a user can only be notified about *their own* posts being interacted with; the API determines the post author server-side, not from client input.

### 5.2 Example Response Shape

```json
{
  "success": true,
  "data": { "id": "abc123", "text": "Hello world", "likesCount": 3 },
  "message": "Post created"
}
```

---

## 6. Authentication Flow

Kept intentionally simple for this scope:

1. User signs up with username + password → password is hashed (bcrypt) and stored.
2. User logs in → server verifies password, issues a single JWT (no refresh token).
3. Mobile app stores the JWT locally (secure storage) and attaches it as `Authorization: Bearer <token>` on every subsequent request.
4. Token has a reasonable expiry (e.g., 7 days) — when it expires, the user simply logs in again. No refresh-token rotation, no logout blacklist.

This is a conscious trade-off: production apps typically use refresh tokens for better security/UX, but for this assessment's scope, a single long-lived access token is simpler to implement and sufficient to demonstrate the auth flow works end-to-end.

---

## 7. Notification Flow

Simple, event-driven push notification — no real-time feed sync, no notification history table.

**Flow:**
1. User A likes or comments on User B's post.
2. Backend identifies User B (the post's author) and looks up their stored FCM device token.
3. Backend sends a push notification via Firebase Cloud Messaging: *"Someone liked your post"* / *"Someone commented on your post."*
4. User B receives the push notification on their device — that's the entire notification lifecycle. There's no persisted "notifications" list to view later.

**Requirements this implies:**
- Mobile app requests notification permission and registers its FCM device token with the backend after login.
- Backend stores one FCM token per user (overwritten on each new login/device registration — no multi-device fan-out needed for this scope).

---

## 8. Mobile App Flow

Screens and navigation, kept minimal:

1. **Login / Signup** — simple form-based auth screens.
2. **Feed** — scrollable list of posts (newest first), each showing author, text, like count/button, comment count/button. Includes a filter to search/filter the feed by username.
3. **Create Post** — simple text input + submit button.
4. **Post Detail / Comments** — tapping a post's comment icon shows existing comments and an input to add a new one.
5. **Push Notification Handling** — foreground and background notification handling via Firebase; tapping a notification can optionally deep-link to the relevant post (nice-to-have, not required).

**Device targets:** Android phone and tablet — UI should be responsive to both, per assessment evaluation criteria.

---

## 9. Deliverables

- **Backend repo** — `server/` folder, with a README covering setup, environment variables, and API documentation (endpoint list, request/response examples).
- **Mobile repo** — `app/` folder, Expo project with FCM integration.
- **APK file** — built via Expo/EAS, shared as a Google Drive download link.
- **GitHub repo** — contains both `server/` and `app/` folders plus a root README tying everything together.

---

## 10. Evaluation Criteria Mapping

How this project's design choices map to the stated evaluation criteria:

| Criteria | How This Project Addresses It |
|---|---|
| Code Quality | Modular folder structure per layer (routes/controllers/services in backend, screens/components in mobile), consistent naming, no monorepo overhead to add unnecessary complexity |
| API Design | Consistent response shape, input validation, JWT-secured endpoints |
| Frontend (Mobile) | Expo for fast iteration, simple/clear screen flow, responsive to phone + tablet |
| Notifications | FCM integrated at the point of interaction (like/comment), no over-engineering with real-time sockets |
| Error Handling | Validation errors, auth errors, and not-found errors return consistent, predictable API responses; mobile app surfaces these to the user |
| Extra Points (UI polish) | Feed filtering by username, responsive layout for tablet/phone |

---

## 11. Setup & Run (High-Level)

Detailed step-by-step commands live in each folder's README. At a high level:

1. **Backend:** `docker compose up` spins up PostgreSQL + the API together. Environment variables (DB connection, JWT secret, Firebase service account key) are set via `.env`.
2. **Database:** Drizzle migrations run automatically (or via a single command) to set up the schema.
3. **Mobile:** Standard Expo start (`bun run start` / `expo start`), pointed at the backend's URL via an environment variable. FCM requires a Firebase project config file placed in the app folder.
4. **APK:** Built via EAS Build, downloaded, and shared via Google Drive link per the deliverables requirement.

---

## Appendix: Key Scope Decisions (Summary)

For quick reference, the deliberate simplifications made to keep this assessment focused:

- No monorepo tooling — two independent folders (`server/`, `app/`)
- JWT access token only — no refresh tokens
- FCM push notifications only — no WebSocket/real-time layer, no persisted notification history
- Text-only posts — no media uploads
- No follow/DM/social-graph features
