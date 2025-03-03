import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Profile() {
  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>Click here to see the settings page</Text>
    </View>
  );
}
