import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { useRouter } from "expo-router";

interface ProfileInfo {
  displayName: string, 
  profilePicture: string, 
  numPosts: number, 
  numFriends: number,
  displayOptions: Boolean
}

export default function Profile({ displayName, profilePicture, numPosts, numFriends, displayOptions }: ProfileInfo) {
  const router = useRouter();

  return (
    <VStack space="md" className="mt-3 mb-3 px-5">
      <HStack space="lg" className="items-center">
        <Avatar size="xl">
          <AvatarFallbackText>{ displayName }</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: `${ profilePicture }`
            }}
          />
        </Avatar>
        <VStack>
          <Text bold={true} size="xl">{ displayName }</Text>
          <HStack className="items-center">
            <Feather name="heart" size={16} color="#e5e5e5" className="mr-1"/>
            <Text>{ numPosts } posts</Text>
          </HStack>
          <HStack className="items-center">
            <Feather name="globe" size={16} color="#e5e5e5" className="mr-1"/>
            {displayOptions ? (
              <Text>{numFriends} people in your circle</Text>
            ) : (
              <Text>{numFriends} people in their circle</Text>
            )}
          </HStack>
        </VStack>
      </HStack>
      {displayOptions && <HStack space="sm" style={{ flex: 1 }}>
        <Button size="md" variant="outline" style={styles.button} onPress={() => router.push('/(app)/(tabs)/(profile)/settings')}>
          <Feather name="settings" size={16} color="#e5e5e5"/>
          <ButtonText>Settings</ButtonText>
        </Button>
        <Button size="md" variant="outline" style={styles.button}>
          <Feather name="share" size={16} color="#e5e5e5"/>
          <ButtonText>Share Profile</ButtonText>
        </Button>
      </HStack>}
    </VStack>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flex: 1
  }
});