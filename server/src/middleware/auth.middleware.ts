import { sendInternalError, sendUnauthorized } from "@/helpers";
import { verifyAccessToken } from "@/lib/jwt";
import type { NextFunction, Request, Response } from "express";

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT access token
 * Adds user data to req.user if token is valid
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendUnauthorized(res, "Unauthorized - No token provided");
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);

      req.user = {
        userId: decoded.userId,
        username: decoded.username,
      };

      next();
    } catch (_error) {
      return sendUnauthorized(res, "Unauthorized - Invalid or expired token");
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return sendInternalError(res, "Internal Server Error");
  }
};

/**
 * Optional auth middleware - adds user data if token is present but doesn't throw if missing
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          userId: decoded.userId,
          username: decoded.username,
        };
      } catch (_error) {
        console.log("Optional auth: Invalid token, continuing without user");
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};
