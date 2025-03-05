import { Redirect, Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function AppLayout() {
  // Handle redirect for non-authenticated users here - this is hard coded for now
  const user = false;

  if (!user) {
    return <Redirect href="/(auth)"/>
  }

  return (
    <GluestackUIProvider mode="dark">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"/>
      </Stack>
    </GluestackUIProvider>
  );
}