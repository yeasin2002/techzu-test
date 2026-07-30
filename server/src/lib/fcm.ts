import { eq } from "drizzle-orm";
import admin from "firebase-admin";

import { db, users } from "@/db";

// Initialize Firebase Admin SDK if service account is provided in environment
if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.warn("⚠️ Failed to initialize Firebase Admin SDK from environment:", error);
  }
}

/**
 * Send push notification to user using FCM token
 */
export async function sendPushNotificationToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<boolean> {
  try {
    const [user] = await db
      .select({ fcmToken: users.fcmToken, username: users.username })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.fcmToken) {
      console.log(`📱 [FCM] User ${userId} has no FCM token. Skipping push notification.`);
      return false;
    }

    console.log(`🔔 [FCM Push] Sending notification to ${user.username}: "${title} - ${body}"`);

    if (admin.apps.length > 0) {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title,
          body,
        },
        data: data || {},
      });
      console.log(`✅ [FCM Push] Successfully sent push notification to ${user.username}`);
      return true;
    }

    console.log(`ℹ️ [FCM Push Sim] (Firebase Admin not configured) Notification payload for ${user.username}:`, { title, body, data });
    return true;
  } catch (error: any) {
    console.error("❌ [FCM Push Error]:", error.message || error);
    return false;
  }
}
