import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function AuthLayout() {
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
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="phone-sign-in" />
        <Stack.Screen name="phone-sign-up" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </GluestackUIProvider>

  );
}
