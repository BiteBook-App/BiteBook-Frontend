import { useState, useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/configs/authProvider";

export default function Profile() {
  const { user, signOut, getUserProfile, deleteUser } = useAuth();
  const [profile, setProfile] = useState({ displayName: "", profilePicture: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) setProfile(userProfile);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>{ `Username: ${ profile.displayName }` }</Text>
      <Pressable onPress={async () => await signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
      <Pressable onPress={async () => await deleteUser()}>
        <Text>Delete Account</Text>
      </Pressable>
    </View>
  );
}
