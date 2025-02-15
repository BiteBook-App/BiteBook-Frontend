import { View, StyleSheet } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading"


export default function Login() {
  return (
    <View
      className="bg-background-dark"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading size="5xl" className="text-primary-900">Welcome to BiteBook!</Heading>
      <Text size="3xl" className="text-primary-900">This is the login page.</Text>
    </View>
  );
}
