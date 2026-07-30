import { registry } from "@/lib/openapi";
import {
  createCommentSchema,
  createPostSchema,
  getPostsQuerySchema,
  postParamsSchema,
} from "./post.validation";

registry.registerPath({
  method: "post",
  path: "/api/posts",
  description: "Create a new short text post",
  summary: "Create Post",
  tags: ["Posts"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createPostSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post created successfully",
    },
    400: {
      description: "Bad Request (validation error)",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/posts",
  description: "Get paginated feed of text posts (newest first). Filterable by username.",
  summary: "Get Posts Feed",
  tags: ["Posts"],
  security: [{ bearerAuth: [] }],
  request: {
    query: getPostsQuerySchema,
  },
  responses: {
    200: {
      description: "Posts feed retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/posts/{id}/like",
  description: "Toggle like/unlike on a post. Triggers FCM push notification to post author.",
  summary: "Like / Unlike Post (Toggle)",
  tags: ["Posts"],
  security: [{ bearerAuth: [] }],
  request: {
    params: postParamsSchema,
  },
  responses: {
    200: {
      description: "Post liked or unliked successfully",
    },
    404: {
      description: "Post not found",
    },
    401: {
      description: "Unauthorized",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/posts/{id}/comment",
  description: "Add a comment to a post. Triggers FCM push notification to post author.",
  summary: "Add Comment to Post",
  tags: ["Posts"],
  security: [{ bearerAuth: [] }],
  request: {
    params: postParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: createCommentSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Comment added successfully",
    },
    404: {
      description: "Post not found",
    },
    401: {
      description: "Unauthorized",
    },
  },
});
