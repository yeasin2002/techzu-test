import Constants from "expo-constants";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const getDynamicServerUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_SERVER_URL;

  // If EXPO_PUBLIC_SERVER_URL is explicitly set to a production domain (not localhost/10.0.2.2/127.0.0.1)
  if (
    envUrl &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1") &&
    !envUrl.includes("10.0.2.2")
  ) {
    return envUrl;
  }

  // Derive host IP dynamically from Expo Metro bundler hostUri if available
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(":")[0];
    if (hostIp && hostIp !== "localhost" && hostIp !== "127.0.0.1") {
      const dynamicUrl = `http://${hostIp}:48217/api`;
      console.log(`🌐 [ENV] Derived API Server URL from Expo hostUri: ${dynamicUrl}`);
      return dynamicUrl;
    }
  }

  // Fallback URL for Android emulator
  return envUrl || "http://10.0.2.2:48217/api";
};

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_SERVER_URL: z
      .string()
      .url()
      .default(getDynamicServerUrl()),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
