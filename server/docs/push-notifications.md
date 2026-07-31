# Firebase Cloud Messaging (FCM) Push Notifications Setup Guide

This document outlines the architecture, completed setup tasks, and remaining step-by-step instructions for enabling end-to-end FCM push notifications when posts get liked or commented on.

---

## 📋 Task Checklist

### Completed Tasks
- [x] **Firebase Admin SDK Integration (`server/src/lib/fcm.ts`)**: Server-side push dispatcher module initialized.
- [x] **Event-Driven Push Triggers (`server/src/api/post/post.service.ts`)**: Automatically dispatches push notifications to post authors on Like and Comment events.
- [x] **Database Schema Support (`server/src/db/schema/user.schema.ts`)**: `fcmToken` column stored in PostgreSQL `users` table.
- [x] **Auth Token Registration (`server/src/api/auth/auth.service.ts`)**: `fcmToken` saved during user signup and login.
- [x] **Android Client Configuration (`mobile/google-services.json`)**: Configured Android app package `com.yeasin.outside.expostarter`.
- [x] **Expo Android App Linking (`mobile/app.json`)**: Added `"googleServicesFile": "./google-services.json"` to Expo config.

### Remaining Tasks (Action Required)
- [ ] **Step 1: Download Firebase Admin Service Account Private Key** (From Firebase Console).
- [ ] **Step 2: Add `FIREBASE_SERVICE_ACCOUNT` to `server/.env`**.
- [ ] **Step 3: Rebuild Mobile Android Development Build** (`bun run prebuild --clean && bun run android`).
- [ ] **Step 4: Verify Push Notifications** (Test like/comment push notification events between 2 accounts).

---

## 🚀 Step-by-Step Instructions

### Step 1: Download Firebase Service Account Key (Server)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Open project: **`techzu2026`**.
3. Click the **Settings Gear (⚙️)** in the left sidebar and select **Project settings**.
4. Navigate to the **Service Accounts** tab.
5. Click **Generate new private key** and confirm by clicking **Generate key**.
6. A `.json` key file will be downloaded to your computer.

---

### Step 2: Add `FIREBASE_SERVICE_ACCOUNT` to `server/.env`
1. Open the downloaded `.json` file in your code editor and copy its entire content.
2. Open [server/.env](file:///C:/techzu-test/server/.env).
3. Add the `FIREBASE_SERVICE_ACCOUNT` environment variable with the single-line JSON string:

```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"techzu2026","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"..."}'
```

---

### Step 3: Rebuild the Mobile App
Because native Android configuration (`google-services.json`) was added to `app.json`, clean and rebuild your Expo Android app:

```powershell
cd mobile
bun run prebuild --clean
bun run android
```

---

### Step 4: Testing & Verification
1. Start the Express backend server (`bun dev` inside `/server`).
2. Log into User Account A on a physical device or emulator.
3. Log into User Account B on another device/emulator.
4. Have Account B **like** or **comment** on Account A's post.
5. Account A will receive a native push notification:
   - **Like Event**: `New Like! ❤️` — `[Username] liked your post`
   - **Comment Event**: `New Comment! 💬` — `[Username] commented: "[Comment text]"`
