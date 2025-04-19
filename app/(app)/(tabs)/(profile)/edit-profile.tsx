import { View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/configs/authProvider";
import { Pressable } from "@/components/ui/pressable";
import Feather from '@expo/vector-icons/Feather';
import { Button, ButtonText } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROFILE, EDIT_USER } from "@/configs/queries";
import CustomInputField from "@/components/ui/custom-input-field";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter } from "expo-router";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control"
import { AlertCircleIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";

export default function Edit() {
  const { storage, user } = useAuth();
  const router = useRouter();

  const { loading: profileLoading, error: profileError, data: profile } = useQuery(GET_PROFILE, {
    variables: { uid: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });

  const [displayName, setDisplayName] = useState(profile?.getUsers?.[0]?.displayName);
  const [profilePicture, setProfilePicture] = useState(profile?.getUsers?.[0]?.profilePicture || "");
  const [hasPictureChanged, setHasPictureChanged] = useState(false); // Tracks if user selects a new photo
  const [invalidEdit, setInvalidEdit] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // TODO: Move this to a new file for modularity
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access photos is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      setHasPictureChanged(true);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!uri) return "";

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `users/${user.uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = ref(storage, filename);

    try {
        // Upload to Firebase Storage
        await uploadBytes(storageRef, blob);
        // Get the URL
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Upload failed:", error);
        return "";
    }
  };

  const [editUser, { data, loading, error }] = useMutation(EDIT_USER);

  const handleUpdateUser = async () => {
    setPageLoading(true);

    const profilePictureURL = await uploadImage(profilePicture);

    // Remove the original profile picture
    if (profile?.getUsers?.[0]?.profilePicture) {
      try {
        const oldImageRef = ref(storage, profile?.getUsers?.[0]?.profilePicture);
        await deleteObject(oldImageRef);
        console.log("Old profile picture deleted successfully.");
      } catch (deleteError) {
        console.error("Failed to delete old profile picture:", deleteError);
      }
    }

    // Only updates if changes have been detected
    const hasDisplayNameChanged = displayName !== profile?.getUsers?.[0]?.displayName;

    const variables: Record<string, string> = { userId: user.uid };
    if (hasDisplayNameChanged) variables.displayName = displayName;
    if (hasPictureChanged) variables.profilePicture = profilePictureURL;

    try {
      const { data } = await editUser({ variables });
      console.log("Updated User:", data.editUser);
      // Navigate back to the profile page
      router.back();
      router.back();
    } catch (err) {
      setInvalidEdit(true)
    }

    setPageLoading(false);
  };

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
      key={profilePicture} // Forces re-render when profilePicture changes 
    >
      <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px] mt-5" style={styles.title} size="5xl">
        Edit Profile
      </Text>
      <VStack className="mt-5" space="2xl">
        <VStack style={styles.container} space="md">
          <Avatar size="xl">
            <AvatarFallbackText>{ displayName }</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: `${ profilePicture }`
              }}
            />
          </Avatar>
          <Button className="rounded-full" variant="outline" size="sm" onPress={pickImage}>
            <ButtonText>Change photo</ButtonText>
          </Button>
        </VStack>
        <FormControl isInvalid={invalidEdit}>
          <VStack space="md">
            <VStack space="sm">
              <Text>Username</Text>
              <CustomInputField
                  placeholder="Username"
                  value={displayName}
                  onChangeText={(text) => {
                    setDisplayName(text);
                    setInvalidEdit(false);
                  }}
                  icon={() => <Feather name="user" size={20} color="#8C8C8C" />}
                />
            </VStack>
            <Button style={styles.button} onPress={handleUpdateUser} isDisabled={!hasPictureChanged && displayName == profile?.getUsers?.[0]?.displayName}>
              { pageLoading ? <Spinner/> : <ButtonText>Save changes</ButtonText>}
            </Button>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                Username already taken. Please choose again.
              </FormControlErrorText>
            </FormControlError>
          </VStack>
        </FormControl>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10
  },
  container: {
    alignItems: "center"
  },
  title: {
    marginBottom: -15
  }
});
