import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import "@/global.css";

export const unstable_settings = {
  initialRouteName: "index",
};

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <HeroUINativeProvider
                config={{ devInfo: { stylingPrinciples: false } }}
              >
                <StackLayout />
              </HeroUINativeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
        statusBarTranslucent: true,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
