import { registry } from "@/lib/openapi";
import { loginSchema, signupSchema } from "./auth.validation";

// Register Security Scheme for Bearer JWT token
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  method: "post",
  path: "/api/auth/signup",
  description: "Register a new user account with username and password",
  summary: "User Signup",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: signupSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
    },
    400: {
      description: "Bad Request (e.g. username taken or validation error)",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  description: "Authenticate user with username and password, returning a 7-day JWT access token",
  summary: "User Login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Logged in successfully",
    },
    401: {
      description: "Unauthorized (invalid credentials)",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/auth/me",
  description: "Get authenticated user profile details using Bearer token",
  summary: "Get Current User Profile",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Profile retrieved successfully",
    },
    401: {
      description: "Unauthorized - Invalid or missing token",
    },
  },
});
