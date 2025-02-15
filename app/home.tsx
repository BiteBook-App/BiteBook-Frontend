import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the home page</Text>
      <Link href="/recipe">
        Go to a recipe
      </Link>
    </View>
  );
}
