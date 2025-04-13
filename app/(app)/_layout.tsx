import { Redirect, Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuth } from "@/configs/authProvider";

export default function AppLayout() {
  const { user, signOut } = useAuth();
  
  // Unauthenticated users are redirected to login page
  if (!user)
    return <Redirect href="/(auth)"/>

  return (
    <GluestackUIProvider mode="dark">
      <Stack screenOptions={{
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'VVDSRashfield-Normal',
            fontSize: 20
          },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerTitle: "",
          headerTransparent: true
        }}
      >
        {/* If the user is authenticated, home page renders */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/> 
      </Stack>
    </GluestackUIProvider>
  );
}