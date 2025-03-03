import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/configs/authProvider";

export default function RootLayout() {
  return (
      <AuthProvider>
        <GluestackUIProvider mode="dark">
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="phone-sign-in" options={{ headerShown: false}} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ title: 'BiteBook', headerShown: false }} />
            <Stack.Screen name="recipe" options={{ title: 'Recipe' }} />
          </Stack>
        </GluestackUIProvider>
      </AuthProvider>
  );
}
