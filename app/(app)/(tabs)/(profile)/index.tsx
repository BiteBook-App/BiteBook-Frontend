import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { useRouter} from 'expo-router';
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import Post from "@/components/ui/custom-recipe-post"
import ProfileInfo from "@/components/ui/custom-profile";
import { LinearGradient } from "expo-linear-gradient";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetIcon,
} from "@/components/ui/actionsheet"

export default function Profile() {
  const { user, signOut, getUserProfile, deleteUser } = useAuth();

  // TODO: Pull values from backend
  const [profile, setProfile] = useState({ 
    displayName: "catluvr", 
    profilePicture: "https://i.pinimg.com/736x/29/5c/c0/295cc07854f00d2d81953125b93f6b99.jpg", 
    numPosts: 2, 
    numFriends: 3
  });

  const [posts, setPosts] = useState([
    { 
      photo_url: "https://i.redd.it/6eii7kz9aj051.jpg",
      name: "Best Grilled Cheese",
      tastes: ['Salty', 'Umami']
    },
    { 
      photo_url: "https://preview.redd.it/sponge-cake-v0-qfvafbgje4id1.jpeg?auto=webp&s=538fc9b370a2f6b476405a6dc7e68b1386baf208",
      name: "Strawberry Shortcake",
      tastes: ['Sweet']
    },
  ]);

  const router = useRouter();
  
  // TODO: Uncomment and update 

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (user?.uid) {
  //       const userProfile = await getUserProfile(user.uid);
  //       if (userProfile) setProfile(userProfile);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[
          "#27212b", "#262029", "#241f28", "#231e26", "#211d24", 
          "#201c23", "#1f1c21", "#1d1b1f", "#1c1a1e", "#1b191c", 
          "#19181b", "#181719"      
        ]}
        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: -0.5 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0, // Ensures full height
          justifyContent: 'center', // Centers content vertically
          alignItems: 'center', // Centers content horizontally
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <VStack space="xl" className="mt-5 mb-5">
          <ProfileInfo 
            displayName={profile.displayName} 
            profilePicture={profile.profilePicture} 
            numPosts={profile.numPosts} 
            numFriends={profile.numFriends}
          />

          {/* <View className="h-px bg-background-100" /> */}

          <Text className="font-[Rashfield] leading-[50px]" style={{ marginBottom: -10 }} size="3xl">
            Served Recipes              
          </Text>

          {posts.map((post, index) => (
            <Post
              key={index}
              photoUrl={post.photo_url}
              mealName={post.name}
              tastes={post.tastes}
            />
          ))}

        </VStack>
        
        {/* <Text>{ `Username: ${ profile.displayName }` }</Text>
        <Pressable onPress={async () => await signOut()}>
          <Text>Sign Out</Text>
        </Pressable>
        <Pressable onPress={async () => await deleteUser()}>
          <Text>Delete Account</Text>
        </Pressable> */}
      </ScrollView>
    </View>
  );
}
