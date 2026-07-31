import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { logger } from "@/lib/logger";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

export const client = postgres(connectionString, {
  connect_timeout: 10,
  idle_timeout: 30,
  max: 10,
});
export const db = drizzle(client, { schema });

/**
 * Connect to PostgreSQL and test database connection
 */
export const connectDB = async (): Promise<boolean> => {
  try {
    if (!connectionString) {
      console.error("❌ DATABASE_URL is not defined in environment variables!");
      logger.error("DATABASE_URL is not defined in environment variables!");
      return false;
    }

    // Execute a lightweight test query
    await client`SELECT 1`;
    console.log("🟢 PostgreSQL database connected successfully!");
    logger.info("PostgreSQL database connected successfully!");
    return true;
  } catch (error: any) {
    console.error("🔴 PostgreSQL connection error:", error.message || error);
    logger.error("PostgreSQL connection error:", error);
    return false;
  }
};

export * from "./schema";
