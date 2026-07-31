import type { RequestHandler } from "express";
import { eq, or } from "drizzle-orm";

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
    const { fullName, email, username, password, fcmToken } =
      req.body as SignupInput;

    // Check if username or email is already taken
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      const match = existingUser[0];
      if (match.username === username) {
        return sendBadRequest(res, "Username is already taken");
      }
      return sendBadRequest(res, "Email is already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        fullName,
        email,
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
        fullName: newUser.fullName,
        email: newUser.email,
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
        fullName: existingUser.fullName,
        email: existingUser.email,
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
        fullName: users.fullName,
        email: users.email,
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
