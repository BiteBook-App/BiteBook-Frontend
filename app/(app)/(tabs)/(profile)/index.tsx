import { useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, RefreshControl, useWindowDimensions, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { useRouter } from 'expo-router';
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import Post from "@/components/ui/custom-recipe-post"
import ProfileInfo from "@/components/ui/custom-profile";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_RECIPE_PREVIEW, GET_PROFILE, GET_DRAFT_PREVIEW } from "@/configs/queries";
import DraftRecipe from "@/components/ui/custom-draft-recipe";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import NoRecipes from "@/components/ui/custom-no-recipes-display";

export default function Profile() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Posts' | 'Drafts'>('Posts');
  const slideX = useSharedValue(0);
  const previousTab = useRef("Posts"); // Track previous tab

  const { loading: postsLoading, error: postsError, data: posts, refetch: refetchPosts } = useQuery(GET_RECIPE_PREVIEW, {
    variables: { userId: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });

  const { loading: draftsLoading, error: draftsError, data: drafts, refetch: refetchDrafts } = useQuery(GET_DRAFT_PREVIEW, {
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
      await refetchDrafts();
    } catch (error) {
      console.error("Error during refetch:", error);
    } finally {
      setRefreshing(false);  // Set refreshing to false after refetch completes or fails
    }
  }, [refetchPosts, refetchProfile]);

  useEffect(() => {
    refetchPosts();  // Trigger refetch when the page loads or when route changes
    refetchProfile();
    refetchDrafts();
  }, []);

  useEffect(() => {
    // Determine direction
    const direction = activeTab === "Posts" && previousTab.current === "Drafts"
      ? -1
      : activeTab === "Drafts" && previousTab.current === "Posts"
      ? 1
      : 0;
  
    // Start off-screen based on direction
    slideX.value = direction * 300;
  
    // Animate to center
    slideX.value = withTiming(0, { duration: 400 });
  
    // Save current tab
    previousTab.current = activeTab;
  }, [activeTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const router = useRouter();

  if (postsLoading || draftsLoading || profileLoading) {
    return (
      <View
        className="bg-background-dark lg:px-40"
        style={{
          flex: 1,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Spinner size="large" color={colors.gray[500]} />
      </View>
    );
  }

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
          {/* TODO: Update numFriends!! */}
          <ProfileInfo 
            displayName={profile?.getUsers?.[0]?.displayName}
            profilePicture={profile?.getUsers?.[0]?.profilePicture}
            numPosts={numPosts} 
            numFriends={profile?.getUsers?.[0]?.relationships?.length}
            displayOptions={true}
            uid={user.uid}
          />
          <HStack>
            <Pressable
              onPress={() => setActiveTab('Posts')}
              style={[
                styles.tab,
                activeTab === 'Posts' && styles.activeTab,
              ]}
            >
              <Text style={activeTab === 'Posts' ? styles.activeText : styles.inactiveText}>
                Posts
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('Drafts')}
              style={[
                styles.tab,
                activeTab === 'Drafts' && styles.activeTab,
              ]}
            >
              <Text style={activeTab === 'Drafts' ? styles.activeText : styles.inactiveText}>
                Drafts
              </Text>
            </Pressable>
          </HStack>
        </VStack>
        
        <Animated.View style={[animatedStyle]}>
          {activeTab === "Posts" ? (
            <VStack space="lg" className="mb-5 px-5 mt-4">
              {posts?.getRecipes?.length === 0 && 
                <View className="mt-20">
                  <NoRecipes displayAction={false}/>
                </View>
              }
              {posts?.getRecipes?.map((post: any, index: any) => (
                <Pressable 
                  onPress={() => router.push(`/(app)/(tabs)/(profile)/${post.uid}`)} 
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
          ) : (
            <VStack space="sm" className="mb-5 px-4 mt-4">
              {drafts?.getRecipes?.length === 0 && 
                <View className="mt-20">
                  <NoRecipes displayAction={false}/>
                </View>
              }
              {drafts?.getRecipes?.map((post: any, index: any) => (
                <Pressable
                  onPress={() => router.push(`/(app)/(tabs)/(profile)/${post.uid}`)} 
                  key={index}
                >
                  <DraftRecipe
                    key={index}
                    createdAt={post.createdAt}
                    mealName={post.name}
                    tastes={post.tastes}
                  />
                </Pressable>
              ))}

            </VStack>
          )}
        </Animated.View>
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
