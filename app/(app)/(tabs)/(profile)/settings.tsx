import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/configs/authProvider";
import { Pressable } from "@/components/ui/pressable";
import Feather from '@expo/vector-icons/Feather';
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter} from 'expo-router';
import CustomModal from "@/components/ui/custom-modal-delete-account";

export default function Settings() {
  const { signOut, deleteUser } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false)

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
    >
      <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px] mt-5" style={styles.title} size="5xl">
        Settings
      </Text>
      <VStack className="mt-5" space="2xl">
        <Pressable onPress={() => router.push('/(app)/(tabs)/(profile)/edit-profile')}>
          <HStack style={styles.container}>
            <Text size="xl">Edit Profile</Text>
            <Feather name="chevron-right" size={24} color="#e5e5e5" />
          </HStack>
        </Pressable>
        <Pressable onPress={() => setShowModal(true)}>
          <HStack style={styles.container}>
            <Text size="xl">Delete Account</Text>
            <Feather name="chevron-right" size={24} color="#e5e5e5" />
          </HStack>
        </Pressable>
        <Pressable onPress={async () => await signOut()}>
          <Text size="xl">Sign Out</Text>
        </Pressable>
      </VStack>
      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10
  },
  container: {
    justifyContent: "space-between"
  },
  title: {
    marginBottom: -15
  }
});
