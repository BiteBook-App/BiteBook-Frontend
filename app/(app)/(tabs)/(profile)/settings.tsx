import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/configs/authProvider";
import { Pressable } from "@/components/ui/pressable";

export default function Settings() {
  const { signOut, deleteUser } = useAuth();

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
    >
      <VStack className="mt-5">
        <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
          Settings
        </Text>
        <Text size="xl">Edit Profile</Text>
        <Pressable onPress={async () => await signOut()}>
          <Text size="xl">Sign Out</Text>
        </Pressable>
        <Pressable onPress={async () => await deleteUser()}>
          <Text size="xl">Delete Account</Text>
        </Pressable>      
      </VStack>
    </View>
  );
}
