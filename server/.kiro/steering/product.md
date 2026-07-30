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
