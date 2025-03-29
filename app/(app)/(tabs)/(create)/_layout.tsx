import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function AppLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Stack screenOptions={{
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: "#181719" },
          headerTitleStyle: {
            fontFamily: 'VVDSRashfield-Normal',
            fontSize: 20
          },
          headerShadowVisible: false
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: true, headerTitle: 'BiteBook'}}/>
      </Stack>
    </GluestackUIProvider>
  );
}