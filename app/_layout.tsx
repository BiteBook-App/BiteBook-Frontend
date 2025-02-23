import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'BiteBook', headerShown: false }} />
        <Stack.Screen name="recipe" options={{ title: 'Recipe' }} />
      </Stack>
    </GluestackUIProvider>
  );
}
