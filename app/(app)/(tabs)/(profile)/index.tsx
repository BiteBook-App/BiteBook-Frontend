import { useState, useEffect, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
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
import { Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_RECIPE_PREVIEW, GET_PROFILE } from "@/configs/queries";

export default function Profile() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const { loading: postsLoading, error: postsError, data: posts, refetch: refetchPosts } = useQuery(GET_RECIPE_PREVIEW, {
    variables: { userId: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });

  const { loading: profileLoading, error: profileError, data: profile, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { uid: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });

  const numPosts = posts?.getRecipes?.length;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
  
    try {
      await refetchPosts();  // Wait for the refetch to complete
      await refetchProfile();  // Wait for the refetch to complete
    } catch (error) {
      console.error("Error during refetch:", error);
    } finally {
      setRefreshing(false);  // Set refreshing to false after refetch completes or fails
    }
  }, [refetchPosts, refetchProfile]);

  // useEffect(() => {
  //   refetchPosts();  // Trigger refetch when the page loads or when route changes
  //   refetchProfile();
  // }, [posts, profile]);

  const router = useRouter();

  const editRecipe = () => {
    router.push("/(app)/edit")
  }

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
      key={profile}
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <VStack space="xl" className="mt-5 mb-5">
          {/* TODO: Update numFriends!! */}
          <ProfileInfo 
            displayName={profile?.getUsers?.[0]?.displayName}
            profilePicture={profile?.getUsers?.[0]?.profilePicture}
            numPosts={numPosts} 
            numFriends={0} 
          />

          {/* <Pressable onPress={async () => editRecipe()}>
            <Text>Edit Recipe</Text>
          </Pressable> */}

          <Text className="font-[Rashfield] leading-[50px]" style={{ marginBottom: -10 }} size="3xl">
            Served Recipes              
          </Text>

          {posts?.getRecipes?.map((post: { photoUrl: string; name: string; tastes: string[] }, index: number) => (
            <Post
              key={index}
              photoUrl={post.photoUrl}
              mealName={post.name}
              tastes={post.tastes}
            />
          ))}

        </VStack>
      </ScrollView>
    </View>
  );
}
