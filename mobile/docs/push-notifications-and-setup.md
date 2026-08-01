# Project Setup & FCM Push Notifications Guide

This document details the current state of the application, features available out-of-the-box, manual configuration steps for Firebase Cloud Messaging (FCM) push notifications, and useful development commands.

---

## 1. System Readiness & Status

The application is **fully built, type-checked, and operational**.

| Component | Status | Details |
| :--- | :--- | :--- |
| **Backend API** | ✅ Fully Functional | Express + Bun + Drizzle ORM (PostgreSQL) with JWT authentication. |
| **Feed & Posts** | ✅ Fully Functional | Instant optimistic post creation, feed filtering, and pagination. |
| **Likes** | ✅ Fully Functional | Instant toggle feedback and like counts. |
| **Comment Bottom Sheet** | ✅ Fully Functional | 80% height snap point, keyboard avoidance (`useBottomSheetAwareHandlers`), instant comment list insertion. |
| **Push Notifications** | ✅ Fully Integrated | Triggers configured on server for post creation, likes, and comments. |

---

## 2. Push Notification Event Triggers

When users interact on the platform, the server automatically constructs FCM push notification payloads and sends them to the target user:

1. **New Post Created (`createPost`)**:
   - **Recipients**: All other registered users with an FCM token.
   - **Notification**: `"New Post! 📝"` — `"${username} shared a new post"`.
2. **Post Liked (`toggleLike`)**:
   - **Recipient**: The post author.
   - **Notification**: `"New Like! ❤️"` — `"${username} liked your post"`.
3. **Comment Added (`createComment`)**:
   - **Recipient**: The post author.
   - **Notification**: `"New Comment! 💬"` — `"${username} commented: \"...\""`.

---

## 3. Manual Steps for Real FCM Delivery

While notification payload triggers and token sync are 100% complete in the code, the following one-time manual configurations are required for Firebase to deliver notifications to physical devices:

### A. Firebase Admin SDK Service Account (Server)
To enable the Express server to communicate with Google's FCM servers:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select project **`techzu2026`** (or your Firebase project).
3. Go to **Project Settings > Service accounts**.
4. Click **Generate new private key** and download the JSON file.
5. Either:
   - Place the file at `server/service-account.json` (it is ignored by git), **OR**
   - Copy the JSON string into `server/.env` under `FIREBASE_SERVICE_ACCOUNT='{ ... }'`.

### B. Mobile Device Notification Permissions (Android)
- `google-services.json` is already placed in `mobile/google-services.json` and registered in `mobile/app.json`.
- When launching the mobile app on a physical device, accept the notification permission prompt.
- The app will automatically obtain the native FCM token via `getDevicePushTokenAsync()` and register it with the backend via `POST /api/auth/fcm-token`.

---

## 4. Helpful Development Commands

### Server Commands
```bash
# Start backend server in development mode
cd server && bun dev

# Wipe all posts, comments, and likes from database (preserves users)
cd server && bun db:clear

# Run TypeScript type check
cd server && bun check-types
```

### Mobile Commands
```bash
# Run application on connected Android device / emulator
cd mobile && bun run android

# Clean native android build cache and run
cd mobile && bun run prebuild --clean && bun run android

# Run TypeScript type check
cd mobile && bun check-types
```
