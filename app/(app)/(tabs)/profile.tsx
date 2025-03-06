import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/configs/authProvider";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>{ `Email: ${user.email }` }</Text>
      <Pressable onPress={async () => await signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
