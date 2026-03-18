import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "@/context/AppContext";
import { theme } from "@/constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background
            },
            headerShadowVisible: false,
            headerTintColor: theme.colors.textPrimary,
            contentStyle: {
              backgroundColor: theme.colors.background
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700"
            }
          }}
        >
          <Stack.Screen name="index" options={{ title: "BigCommunity" }} />
          <Stack.Screen name="announcements/index" options={{ title: "Announcements" }} />
          <Stack.Screen name="announcements/[id]" options={{ title: "Announcement" }} />
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
          <Stack.Screen name="auth" options={{ title: "Join BigCommunity" }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
