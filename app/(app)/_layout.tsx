import {Redirect, router, Stack} from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuth } from "@/configs/authProvider";
import {useURL, parse} from 'expo-linking'

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const url = useURL();
  
  // Unauthenticated users are redirected to login page
  if (!user)
    return <Redirect href="/(auth)"/>

  if (url) {
      const parsedURL = parse(url);

      const actionPage = parsedURL.path;
      const actionID = parsedURL.queryParams?.id;

      if (typeof actionID === "string") {
        if (actionPage == "friends") {
            router.push( { pathname: '/(app)/(tabs)/(friends)', params: { id: actionID } })
        }
        else if (actionPage == "recipes") {
          router.push( { pathname: '/(app)/(tabs)/(home)/[recipeId]', params: { recipeId: actionID } })
        }
      }
  }

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