import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function AppLayout() {
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
        <Stack.Screen name="index" options={{ headerShown: true, headerBackButtonDisplayMode: 'minimal', headerTitle: 'BiteBook'}}/>
      </Stack>
    </GluestackUIProvider>
  );
}