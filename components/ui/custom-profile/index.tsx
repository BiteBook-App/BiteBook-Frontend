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
import { createURL } from 'expo-linking';
import Share from 'react-native-share';
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast"
import { useState } from "react";

interface ProfileInfo {
  displayName: string, 
  profilePicture: string, 
  numPosts: number, 
  numFriends: number,
  displayOptions: Boolean,
  uid: any
}

export default function Profile({ displayName, profilePicture, numPosts, numFriends, displayOptions, uid }: ProfileInfo) {
  const router = useRouter();

  const toast = useToast()
    const [toastId, setToastId] = useState("0")

    const showNewToast = (status: String, text: String) => {
        const newId = Math.random().toString()

        setToastId(newId)

        if (status == "success") {
            toast.show({
                id: newId,
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = "toast-" + id
                  return (
                    <Toast nativeID={uniqueToastId} action="success" variant="solid">
                      <ToastTitle>Success</ToastTitle>
                      <ToastDescription>
                        {text}
                      </ToastDescription>
                    </Toast>
                  )
                },
            })
        }
        else if (status == "error") {
            toast.show({
                id: newId,
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = "toast-" + id
                  return (
                    <Toast nativeID={uniqueToastId} action="error" variant="solid">
                      <ToastTitle>Error</ToastTitle>
                      <ToastDescription>
                        {text}
                      </ToastDescription>
                    </Toast>
                  )
                },
            })
        }
      }

    const handleToast = (status: String, text: String) => {
        if (!toast.isActive(toastId)) {
            showNewToast(status, text)
        }
    }

  const handleShare = () => {
    const invitationURL = createURL("expo-development-client/friends", {
        queryParams: {id: uid}
    })

    Share.open({message: "Invite friends to BiteBook!", title: "BiteBook Invitation", url: invitationURL})
        .then((res) => handleToast('success', "Link was copied to your clipboard!"));
  }

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
        <Button size="md" variant="outline" style={styles.button} onPress={handleShare}>
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