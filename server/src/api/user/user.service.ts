import type { RequestHandler } from "express";

import { db, users } from "@/db";
import { sendInternalError, sendSuccess } from "@/helpers/response-handler";

export const getAllUsers: RequestHandler = async (_req, res) => {
  try {
    console.log("🔍 [Users API] Querying PostgreSQL for all users...");
    const allUsers = await db.select().from(users);
    console.log(`✅ [Users API] Found ${allUsers.length} user record(s).`);
    return sendSuccess(res, 200, "Users retrieved successfully", allUsers);
  } catch (error: any) {
    console.error("❌ [Users API] Failed to query users:", error.message || error);
    return sendInternalError(res, error.message || "Failed to fetch users");
  }
};
