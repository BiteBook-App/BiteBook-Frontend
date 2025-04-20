import { useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, RefreshControl, useWindowDimensions, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from 'expo-router';
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import Post from "@/components/ui/custom-recipe-post"
import ProfileInfo from "@/components/ui/custom-profile";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_RECIPE_PREVIEW, GET_PROFILE } from "@/configs/queries";
import { useLocalSearchParams } from "expo-router";
import NoRecipes from "@/components/ui/custom-no-recipes-display";

export default function Profile() {
  const { userId } = useLocalSearchParams() as { userId: string };
  const [refreshing, setRefreshing] = useState(false);

  const { loading: postsLoading, error: postsError, data: posts, refetch: refetchPosts } = useQuery(GET_RECIPE_PREVIEW, {
    variables: { userId: userId }, // Ensure the userId is passed correctly
  });

  const { loading: profileLoading, error: profileError, data: profile, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { uid: userId }, // Ensure the userId is passed correctly
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

  useEffect(() => {
    refetchPosts();  // Trigger refetch when the page loads or when route changes
    refetchProfile();
  }, []);

  const router = useRouter();

  return (
    <View
      className="bg-background-dark lg:px-40"
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        <VStack space="md" className="bg-background-dark">
          <ProfileInfo 
            displayName={profile?.getUsers?.[0]?.displayName}
            profilePicture={profile?.getUsers?.[0]?.profilePicture}
            numPosts={numPosts} 
            numFriends={profile?.getUsers?.[0]?.relationships?.length}
            displayOptions={false}
            uid={userId}
          />
        </VStack>
        
        <VStack space="lg" className="mb-5 px-5 mt-4">
          {posts?.getRecipes?.length === 0 && <NoRecipes displayAction={false}/>}
          {posts?.getRecipes?.map((post: any, index: any) => (
            <Pressable 
              onPress={() => router.push(`/(app)/(tabs)/(taste)/(friend)/(recipe)/${post.uid}`)} 
              key={index}
            >
              <Post
                photoUrl={post.photoUrl}
                mealName={post.name}
                tastes={post.tastes}
                createdAt={post.createdAt}
                lastUpdatedAt={post.lastUpdatedAt}
                color={"#7781ba"}
              />
            </Pressable>
          ))}
        </VStack>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  activeText: {
    color: 'white',
    fontWeight: '500', // medium-bold
    textAlign: 'center',
  },
  inactiveText: {
    color: '#888', // or use 'gray' / '#aaa' for dimmed
    fontWeight: '500',
    textAlign: 'center',
  },
});
