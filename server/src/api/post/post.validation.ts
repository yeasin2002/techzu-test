import { z } from "zod";

export const createPostSchema = z.object({
  text: z
    .string()
    .min(1, "Post text cannot be empty")
    .max(1000, "Post text cannot exceed 1000 characters")
    .trim(),
});

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  username: z.string().optional(),
});

export const postParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format"),
});

export const createCommentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment text cannot be empty")
    .max(500, "Comment text cannot exceed 500 characters")
    .trim(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type GetPostsQueryInput = z.infer<typeof getPostsQuerySchema>;
export type PostParamsInput = z.infer<typeof postParamsSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
