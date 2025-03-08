import { Redirect, Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuth } from "@/configs/authProvider";

export default function AppLayout() {
  const { user, signOut } = useAuth();

  console.log(user);

  // Unauthenticated users are redirected to login page
  if (!user)
    return <Redirect href="/(auth)"/>

  return (
    <GluestackUIProvider mode="dark">
      <Stack screenOptions={{ headerShown: false }}>
        {/* If the user is authenticated, home page renders */}
        <Stack.Screen name="(tabs)"/> 
      </Stack>
    </GluestackUIProvider>
  );
}