import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Pressable } from "react-native";
import { Icon, ThreeDotsIcon } from "@/components/ui/icon"


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
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: true, headerBackButtonDisplayMode: 'minimal', headerTitle: 'BiteBook'}}/>
        <Stack.Screen name="settings" options={{ headerShown: true, headerBackButtonDisplayMode: 'minimal', headerTitle: ''}}/>
        <Stack.Screen name="edit-profile" options={{ headerShown: true, headerBackButtonDisplayMode: 'minimal', headerTitle: ''}}/>
        <Stack.Screen name="(recipe)" options={{ 
          headerShown: true, 
          headerBackButtonDisplayMode: 'minimal', 
          headerTitle: '',
          headerRight: () => (
            <Pressable>
              <Icon as={ThreeDotsIcon} size="xl" />
            </Pressable>
          ),
        }}/>
      </Stack>
    </GluestackUIProvider>
  );
}