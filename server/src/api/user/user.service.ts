import type { RequestHandler } from "express";

import { db, users } from "@/db";
import { sendInternalError, sendSuccess } from "@/helpers/response-handler";

export const getAllUsers: RequestHandler = async (_req, res) => {
  try {
    const allUsers = await db.select().from(users);
    return sendSuccess(res, 200, "Users retrieved successfully", allUsers);
  } catch (error: any) {
    return sendInternalError(res, error.message || "Failed to fetch users");
  }
};
