import { View } from "react-native";
import { Link } from 'expo-router';
import { Text } from "@/components/ui/text";

export default function Home() {
  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%", 
      }}
    >
      <Text>This is the home page</Text>
      <Link href="/recipe" className="text-typography-800">
        Go to a recipe
      </Link>
    </View>
  );
}
