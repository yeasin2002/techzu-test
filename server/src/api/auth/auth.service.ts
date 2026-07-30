import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";

import { db, users } from "@/db";
import {
  sendBadRequest,
  sendCreated,
  sendInternalError,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from "@/helpers/response-handler";
import { comparePassword, hashPassword, signAccessToken } from "@/lib/jwt";
import type { LoginInput, SignupInput } from "./auth.validation";

/**
 * Register a new user
 * POST /api/auth/signup
 */
export const signup: RequestHandler = async (req, res) => {
  try {
    const { username, password, fcmToken } = req.body as SignupInput;

    // Check if username is already taken
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return sendBadRequest(res, "Username is already taken");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        fcmToken: fcmToken || null,
      })
      .returning();

    if (!newUser) {
      return sendInternalError(res, "Failed to create user account");
    }

    // Generate JWT access token
    const token = signAccessToken({
      userId: newUser.id,
      username: newUser.username,
    });

    console.log(`👤 [Auth] User signed up successfully: ${newUser.username}`);

    return sendCreated(res, "User registered successfully", {
      user: {
        id: newUser.id,
        username: newUser.username,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error("❌ [Auth] Signup error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to register user");
  }
};

/**
 * Log in user
 * POST /api/auth/login
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password, fcmToken } = req.body as LoginInput;

    // Find user by username
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!existingUser) {
      return sendUnauthorized(res, "Invalid username or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return sendUnauthorized(res, "Invalid username or password");
    }

    // Update FCM token if provided
    if (fcmToken && fcmToken !== existingUser.fcmToken) {
      await db
        .update(users)
        .set({ fcmToken, updatedAt: new Date() })
        .where(eq(users.id, existingUser.id));
    }

    // Generate JWT token
    const token = signAccessToken({
      userId: existingUser.id,
      username: existingUser.username,
    });

    console.log(`🔑 [Auth] User logged in: ${existingUser.username}`);

    return sendSuccess(res, 200, "Logged in successfully", {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        createdAt: existingUser.createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error("❌ [Auth] Login error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to log in");
  }
};

/**
 * Get current authenticated user details
 * GET /api/auth/me
 */
export const getMe: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return sendUnauthorized(res, "Unauthorized");
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    return sendSuccess(res, 200, "Profile retrieved successfully", { user });
  } catch (error: any) {
    console.error("❌ [Auth] GetMe error:", error.message || error);
    return sendInternalError(res, error.message || "Failed to fetch profile");
  }
};
