import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { authApi } from "@/api/query-list/auth.query";

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions and register FCM token with the backend API
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("📱 [Push Notifications] Permission not granted by user.");
      return null;
    }

    // Get native FCM device push token
    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    const token = tokenResponse.data;

    if (token) {
      console.log("🔥 [FCM Token] Obtained FCM device token:", token);
      await authApi.updateFcmToken(token).catch((err) => {
        console.warn("⚠️ [FCM Token] Failed to sync token with backend:", err.message || err);
      });
      return token;
    }
  } catch (error: any) {
    console.warn("⚠️ [Push Notifications] Error obtaining FCM token:", error.message || error);
  }

  return null;
}
