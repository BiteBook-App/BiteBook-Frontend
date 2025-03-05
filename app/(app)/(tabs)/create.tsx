import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Create() {
  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>This is the create recipe page</Text>
    </View>
  );
}
