import type { RequestHandler } from "express";
import { and, count, desc, eq } from "drizzle-orm";

import { comments, db, likes, posts, users } from "@/db";
import {
  sendCreated,
  sendInternalError,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from "@/helpers/response-handler";
import { sendPushNotificationToUser } from "@/lib/fcm";
import type {
  CreateCommentInput,
  CreatePostInput,
} from "./post.validation";

/**
 * Create a new text post
 * POST /api/posts
 */
export const createPost: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Unauthorized");
    }

    const { text } = req.body as CreatePostInput;

    const [newPost] = await db
      .insert(posts)
      .values({
        authorId: req.user.userId,
        text,
      })
      .returning();

    if (!newPost) {
      return sendInternalError(res, "Failed to create post");
    }

    console.log(`📝 [Posts] Post created by ${req.user.username}: "${text.slice(0, 30)}..."`);

    return sendCreated(res, "Post created successfully", {
      id: newPost.id,
      text: newPost.text,
      author: {
        id: req.user.userId,
        username: req.user.username,
      },
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: newPost.createdAt,
    });
  } catch (error: any) {
    console.error("❌ [Posts] Create post error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to create post");
  }
};

/**
 * Get paginated feed of posts (newest first, optional username filter)
 * GET /api/posts?page=1&limit=10&username=john
 */
export const getFeed: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Unauthorized");
    }

    const currentUserId = req.user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const usernameFilter = req.query.username ? String(req.query.username).trim() : undefined;
    const offset = (page - 1) * limit;

    // Filter condition for username
    let authorFilterUserId: string | undefined;
    if (usernameFilter) {
      const [author] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, usernameFilter))
        .limit(1);

      if (!author) {
        return sendSuccess(res, 200, "Posts retrieved successfully", {
          posts: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        });
      }
      authorFilterUserId = author.id;
    }

    // Total count query
    const totalResult = await db
      .select({ total: count() })
      .from(posts)
      .where(authorFilterUserId ? eq(posts.authorId, authorFilterUserId) : undefined);

    const total = Number(totalResult[0]?.total || 0);

    // Fetch paginated posts with author details
    const postsList = await db
      .select({
        id: posts.id,
        text: posts.text,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          username: users.username,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(authorFilterUserId ? eq(posts.authorId, authorFilterUserId) : undefined)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Enrich each post with counts and isLiked status
    const enrichedPosts = await Promise.all(
      postsList.map(async (post) => {
        const [likesCountResult] = await db
          .select({ count: count() })
          .from(likes)
          .where(eq(likes.postId, post.id));

        const [commentsCountResult] = await db
          .select({ count: count() })
          .from(comments)
          .where(eq(comments.postId, post.id));

        const [userLike] = await db
          .select()
          .from(likes)
          .where(and(eq(likes.postId, post.id), eq(likes.userId, currentUserId)))
          .limit(1);

        return {
          ...post,
          likesCount: Number(likesCountResult?.count || 0),
          commentsCount: Number(commentsCountResult?.count || 0),
          isLiked: Boolean(userLike),
        };
      }),
    );

    return sendSuccess(res, 200, "Posts retrieved successfully", {
      posts: enrichedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("❌ [Posts] Get feed error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to fetch feed");
  }
};

/**
 * Toggle like/unlike on a post
 * POST /api/posts/:id/like
 */
export const toggleLike: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Unauthorized");
    }

    const postId = String(req.params.id);
    const currentUserId = req.user.userId;

    // Verify post exists
    const [targetPost] = await db
      .select({ id: posts.id, authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!targetPost) {
      return sendNotFound(res, "Post not found");
    }

    // Check if user already liked the post
    const [existingLike] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, currentUserId)))
      .limit(1);

    let isLiked = false;

    if (existingLike) {
      // Unlike post
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, currentUserId)));
      isLiked = false;
      console.log(`❤️ [Likes] User ${req.user.username} unliked post ${postId}`);
    } else {
      // Like post
      await db.insert(likes).values({
        postId,
        userId: currentUserId,
      });
      isLiked = true;
      console.log(`❤️ [Likes] User ${req.user.username} liked post ${postId}`);

      // Fire FCM push notification to post author if not self-like
      if (targetPost.authorId !== currentUserId) {
        sendPushNotificationToUser(
          targetPost.authorId,
          "New Like! ❤️",
          `${req.user.username} liked your post`,
          { postId, type: "like" },
        );
      }
    }

    // Fetch updated likes count
    const [likesCountResult] = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.postId, postId));

    return sendSuccess(res, 200, isLiked ? "Post liked" : "Post unliked", {
      postId,
      isLiked,
      likesCount: Number(likesCountResult?.count || 0),
    });
  } catch (error: any) {
    console.error("❌ [Posts] Toggle like error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to toggle like");
  }
};

/**
 * Add a comment to a post
 * POST /api/posts/:id/comment
 */
export const createComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Unauthorized");
    }

    const postId = String(req.params.id);
    const { text } = req.body as CreateCommentInput;
    const currentUserId = req.user.userId;

    // Verify post exists
    const [targetPost] = await db
      .select({ id: posts.id, authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!targetPost) {
      return sendNotFound(res, "Post not found");
    }

    // Insert comment
    const [newComment] = await db
      .insert(comments)
      .values({
        postId,
        userId: currentUserId,
        text,
      })
      .returning();

    if (!newComment) {
      return sendInternalError(res, "Failed to create comment");
    }

    console.log(`💬 [Comments] User ${req.user.username} commented on post ${postId}`);

    // Fire FCM push notification to post author if not self-comment
    if (targetPost.authorId !== currentUserId) {
      sendPushNotificationToUser(
        targetPost.authorId,
        "New Comment! 💬",
        `${req.user.username} commented: "${text.slice(0, 50)}"`,
        { postId, type: "comment" },
      );
    }

    return sendCreated(res, "Comment added successfully", {
      id: newComment.id,
      postId: newComment.postId,
      text: newComment.text,
      createdAt: newComment.createdAt,
      user: {
        id: currentUserId,
        username: req.user.username,
      },
    });
  } catch (error: any) {
    console.error("❌ [Posts] Create comment error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to add comment");
  }
};

/**
 * Get all comments for a specific post
 * GET /api/posts/:id/comments
 */
export const getPostComments: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Unauthorized");
    }

    const postId = String(req.params.id);

    // Verify post exists
    const [targetPost] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!targetPost) {
      return sendNotFound(res, "Post not found");
    }

    // Fetch comments with user details
    const commentsList = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        text: comments.text,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);

    return sendSuccess(res, 200, "Comments retrieved successfully", commentsList);
  } catch (error: any) {
    console.error("❌ [Posts] Get comments error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to fetch comments");
  }
};

