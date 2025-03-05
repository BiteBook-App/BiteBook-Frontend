import { Stack, Slot } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/configs/authProvider";

export default function RootLayout() {
  return (
    <Slot></Slot>
  );
}
