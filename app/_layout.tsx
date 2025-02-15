import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'BiteBook' }} />
      <Stack.Screen name="recipe" options={{ title: 'Recipe' }} />
    </Stack>
  );
}
