import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function AuthLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </GluestackUIProvider>

  );
}
