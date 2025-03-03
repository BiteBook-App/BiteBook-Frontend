import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#181719',
            
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'VVDSRashfield-Normal',
            fontSize: 20
          },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal'
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'BiteBook', headerShown: true }} />
        <Stack.Screen name="recipe" options={{ title: '' }} />
      </Stack>
    </GluestackUIProvider>
  );
}
