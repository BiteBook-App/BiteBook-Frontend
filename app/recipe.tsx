import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { getHeaderTitle } from '@react-navigation/elements';

export default function Recipe() {
  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is the recipe page</Text>
    </View>
  );
}
