# JobSphere Org API

- **OpenAPI Version:** `3.1.1`
- **API Version:** `1.0.0`

Backend API service for JobSphere Organization

## Servers

- **URL:** `http://localhost:48217`
  - **Description:** Development server

## Operations

### User Signup

- **Method:** `POST`
- **Path:** `/api/auth/signup`
- **Tags:** Auth

Register a new user account with username and password

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string`

- **`username` (required)**

  `string`

- **`fcmToken`**

  `string`

**Example:**

```json
{
  "username": "",
  "password": "",
  "fcmToken": ""
}
```

#### Responses

##### Status: 201 User registered successfully

##### Status: 400 Bad Request (e.g. username taken or validation error)

### User Login

- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Tags:** Auth

Authenticate user with username and password, returning a 7-day JWT access token

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string`

- **`username` (required)**

  `string`

- **`fcmToken`**

  `string`

**Example:**

```json
{
  "username": "",
  "password": "",
  "fcmToken": ""
}
```

#### Responses

##### Status: 200 Logged in successfully

##### Status: 401 Unauthorized (invalid credentials)

### Get Current User Profile

- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Tags:** Auth

Get authenticated user profile details using Bearer token

#### Responses

##### Status: 200 Profile retrieved successfully

##### Status: 401 Unauthorized - Invalid or missing token

### Create Post

- **Method:** `POST`
- **Path:** `/api/posts`
- **Tags:** Posts

Create a new short text post

#### Request Body

##### Content-Type: application/json

- **`text` (required)**

  `string`

**Example:**

```json
{
  "text": ""
}
```

#### Responses

##### Status: 201 Post created successfully

##### Status: 400 Bad Request (validation error)

##### Status: 401 Unauthorized

### Get Posts Feed

- **Method:** `GET`
- **Path:** `/api/posts`
- **Tags:** Posts

Get paginated feed of text posts (newest first). Filterable by username.

#### Parameters

##### `page`

- **In:** `query`

`number`, default: `1`

##### `limit`

- **In:** `query`

`number`, default: `10`

##### `username`

- **In:** `query`

`string`

#### Responses

##### Status: 200 Posts feed retrieved successfully

##### Status: 401 Unauthorized

### Like / Unlike Post (Toggle)

- **Method:** `POST`
- **Path:** `/api/posts/{id}/like`
- **Tags:** Posts

Toggle like/unlike on a post. Triggers FCM push notification to post author.

#### Parameters

##### `id` required

- **In:** `path`

`string`, format: `uuid`

#### Responses

##### Status: 200 Post liked or unliked successfully

##### Status: 401 Unauthorized

##### Status: 404 Post not found

### Get Post Comments

- **Method:** `GET`
- **Path:** `/api/posts/{id}/comments`
- **Tags:** Posts

Get all comments for a specific post.

#### Parameters

##### `id` required

- **In:** `path`

`string`, format: `uuid`

#### Responses

##### Status: 200 Comments retrieved successfully

##### Status: 401 Unauthorized

##### Status: 404 Post not found

### Add Comment to Post

- **Method:** `POST`
- **Path:** `/api/posts/{id}/comment`
- **Tags:** Posts

Add a comment to a post. Triggers FCM push notification to post author.

#### Parameters

##### `id` required

- **In:** `path`

`string`, format: `uuid`

#### Request Body

##### Content-Type: application/json

- **`text` (required)**

  `string`

**Example:**

```json
{
  "text": ""
}
```

#### Responses

##### Status: 201 Comment added successfully

##### Status: 401 Unauthorized

##### Status: 404 Post not found

### Get all users

- **Method:** `GET`
- **Path:** `/api/users`
- **Tags:** Users

Get all users from PostgreSQL database using Drizzle ORM

#### Responses

##### Status: 200 Users retrieved successfully

##### Status: 500 Internal server error
