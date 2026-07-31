# 📱 Mini Social Feed App

A modern, lightweight full-stack social media application developed as a technical assessment. The application features a RESTful API backend handling authentication, post creation, likes, comments, and push notifications, paired with a responsive mobile interface built with React Native and Expo.

---

## 📸 Overview & Features

### 🌟 Core Capabilities
- **User Authentication**: Secure Signup and Login using JWT authentication with bcrypt password hashing.
- **Paginated Feed**: Shared text-only post feed displaying posts in reverse chronological order (newest first).
- **Username Filtering**: Search and filter newsfeed posts by author username.
- **Interactions**: Toggle like/unlike on posts and add comments with real-time optimistic UI updates.
- **Push Notifications**: Real-time Firebase Cloud Messaging (FCM) push notifications delivered to post authors when someone likes or comments on their post.
- **Interactive API Documentation**: Auto-generated Scalar UI (`/scaler`) and Swagger UI (`/swagger`) documentation built from Zod and OpenAPI 3.0 schemas.
- **Responsive Layout**: Crafted with Uniwind (Tailwind CSS 4) & HeroUI Native, supporting both Android phone and tablet screen sizes.

---

## 🛠️ Architecture & Tech Stack

The project is structured as a Turborepo monorepo utilizing Bun workspaces for package management and task orchestration.

```
techzu-test/
├── server/          # Express API (Bun, Drizzle ORM, PostgreSQL)
├── mobile/          # React Native / Expo Mobile App
├── turbo.json       # Turborepo task pipeline
├── package.json     # Root workspace configuration & devDependencies
├── lefthook.yml     # Git hooks manager
├── BRD.md           # Product & Technical Requirement Specifications
└── README.md        # Comprehensive setup & project guide
```

### Backend (`/server`)
- **Runtime & Engine**: Bun (Development & Execution) / Node.js 18+
- **Framework**: Express v5
- **Database & ORM**: PostgreSQL with Drizzle ORM
- **Authentication**: Stateless JWT (`jsonwebtoken`)
- **Validation**: Zod v4 schema validation for request params, queries, and bodies
- **API Specs**: `@asteasolutions/zod-to-openapi`, `@scalar/express-api-reference`, `swagger-ui-express`
- **Push Notifications**: Firebase Admin SDK (FCM)
- **Logging**: Winston logger + Morgan HTTP request logging

### Mobile App (`/mobile`)
- **Framework**: React Native 0.83 + React 19
- **Platform Tooling**: Expo 55
- **Navigation**: Expo Router 55 (Typed file-based routing)
- **State & Data Fetching**: TanStack React Query v5
- **Styling**: Uniwind (Tailwind CSS 4) + HeroUI Native
- **Animations & Gestures**: `react-native-reanimated` 4 & `react-native-gesture-handler`
- **Secure Token Storage**: `expo-secure-store`
- **Developer UX**: Automatic dynamic host IP resolution (`getDynamicServerUrl`) for seamless physical device and Android emulator API testing

---

## 📑 API Endpoint Specification

All backend endpoints are prefixed with `/api`. Authenticated endpoints require an `Authorization: Bearer <token>` header.

Responses follow a standard JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation description"
}
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | User registration (returns JWT & user details) | ❌ No |
| `POST` | `/api/auth/login` | User authentication (returns JWT & user details) | ❌ No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ Yes |
| `GET` | `/api/posts` | Fetch paginated feed (`?page=1&limit=10&username=...`) | ✅ Yes |
| `POST` | `/api/posts` | Publish a new text-only post | ✅ Yes |
| `POST` | `/api/posts/:id/like` | Toggle like/unlike on a post | ✅ Yes |
| `GET` | `/api/posts/:id/comments` | Fetch all comments for a post | ✅ Yes |
| `POST` | `/api/posts/:id/comment` | Add a comment to a post | ✅ Yes |
| `DELETE` | `/api/posts/:id` | Delete post (Author only) | ✅ Yes |
| `GET` | `/api/users` | List registered users | ❌ No |

### 📖 Live API Documentation
When running the server locally:
- **Scalar API Reference**: [http://localhost:48217/scaler](http://localhost:48217/scaler)
- **Swagger UI**: [http://localhost:48217/swagger](http://localhost:48217/swagger)
- **OpenAPI JSON Spec**: [http://localhost:48217/api-docs.json](http://localhost:48217/api-docs.json)

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Bun](https://bun.sh/) (`>= 1.3`) or Node.js (`>= 18`)
- PostgreSQL database instance
- Android Studio / Android Emulator or a physical device with Expo Go / Dev Build
- Firebase Project for FCM credentials (optional for testing non-push flows)

### 2. Installation
Clone the repository and install workspace dependencies:
```bash
git clone <repository-url>
cd techzu-test
bun install
```

### 3. Backend Environment Setup
Create a `.env` file in the `server/` directory:
```env
# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/mini_social_db

# Server Configuration
PORT=48217
API_BASE_URL=http://localhost:48217
CORS_ORIGIN=http://localhost:3000

# Auth Secrets
ACCESS_SECRET=your-access-secret-key
REFRESH_SECRET=your-refresh-secret-key

# Firebase FCM (Optional for push notifications)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

Initialize the database schema:
```bash
cd server
bun db:push
```

### 4. Running Development Servers

#### Option A: Monorepo Root (Simultaneous Launch)
From the monorepo root directory:
```bash
bun dev
```
This starts both the Express server and Expo bundler via Turborepo.

#### Option B: Individual Service Launch
- **Start Express Server**:
  ```bash
  cd server
  bun dev
  ```
- **Start Mobile App**:
  ```bash
  cd mobile
  bun start      # or bun dev / bun android
  ```

---

## 🔔 Firebase Push Notifications Setup

Push notifications are triggered on server side whenever a user likes or comments on another author's post.

1. **Server Configuration**: Place your downloaded Firebase service account JSON into `server/.env` under `FIREBASE_SERVICE_ACCOUNT`.
2. **Mobile Configuration**: Ensure `google-services.json` is located in `mobile/` and referenced in `mobile/app.json`.
3. **Android Build**: Clean and prebuild the Android app:
   ```bash
   cd mobile
   bun run prebuild --clean
   bun run android
   ```
For detailed setup instructions, refer to [`server/docs/push-notifications.md`](file:///server/docs/push-notifications.md).

---

## 📁 Repository Structure & Documentation References

- [`project-Instructions.md`](file:///project-Instructions.md): Technical assessment requirements and constraints.
- [`BRD.md`](file:///BRD.md): Product requirement document and architectural specifications.
- [`server/docs/push-notifications.md`](file:///server/docs/push-notifications.md): FCM notification setup & troubleshooting guide.
- [`server/docs/openapi-pattern.md`](file:///server/docs/openapi-pattern.md): Standardized OpenAPI & Zod module documentation patterns.
- [`server/docs/module-generator.md`](file:///server/docs/module-generator.md): Backend API module generator instructions.

---

## 🧪 Quality Assurance & Scripts

### Workspace Commands
- `bun run dev`: Launches development watch processes across monorepo.
- `bun run build`: Builds output artifacts for all workspace targets.
- `bun run lint`: Runs linters (`oxlint`, `ultracite`, `biome`).
- `bun run check-types`: Validates TypeScript strict mode compliance across projects.
- `bun run format`: Formats code using `prettier` & `biome`.
