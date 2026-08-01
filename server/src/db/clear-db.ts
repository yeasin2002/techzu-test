import "dotenv/config";
import { client, comments, db, likes, posts } from "./index";

async function clearDatabase() {
  try {
    console.log("🧹 Clearing comments, likes, and posts from database...");

    await db.delete(comments);
    console.log("✅ All comments deleted.");

    await db.delete(likes);
    console.log("✅ All likes deleted.");

    await db.delete(posts);
    console.log("✅ All posts deleted.");

    console.log("🎉 Database content cleared successfully (users preserved)!");
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

clearDatabase();
