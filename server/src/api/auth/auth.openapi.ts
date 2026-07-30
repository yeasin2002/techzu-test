import { registry } from "@/lib/openapi";

registry.registerPath({
  method: "post",
  path: "/api/auth/signup",
  description: "Register a new user account",
  summary: "User Signup",
  tags: ["Auth"],
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
  description: "Authenticate user and receive a 7-day JWT access token",
  summary: "User Login",
  tags: ["Auth"],
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
  description: "Get authenticated user profile details",
  summary: "Get Current User",
  tags: ["Auth"],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: "Profile retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
});
