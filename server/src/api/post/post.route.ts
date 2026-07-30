import "./post.openapi";

import express, { type Router } from "express";

import { requireAuth } from "@/middleware/auth.middleware";
import { validateBody, validateParams, validateQuery } from "@/middleware/validation.middleware";

import { createComment, createPost, getFeed, toggleLike } from "./post.service";
import {
  createCommentSchema,
  createPostSchema,
  getPostsQuerySchema,
  postParamsSchema,
} from "./post.validation";

export const postRouter: Router = express.Router();

// All posts routes require authentication
postRouter.use(requireAuth);

// Create post
postRouter.post("/", validateBody(createPostSchema), createPost);

// Get paginated feed (optional username query parameter)
postRouter.get("/", validateQuery(getPostsQuerySchema), getFeed);

// Toggle like / unlike on post
postRouter.post("/:id/like", validateParams(postParamsSchema), toggleLike);

// Add comment to post
postRouter.post(
  "/:id/comment",
  validateParams(postParamsSchema),
  validateBody(createCommentSchema),
  createComment,
);
