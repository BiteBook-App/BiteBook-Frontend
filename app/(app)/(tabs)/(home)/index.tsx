import { View, RefreshControl, ScrollView, Image, Pressable } from "react-native";
import { useRouter } from 'expo-router';
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE } from "@/configs/queries";
import Post from "@/components/ui/custom-recipe-post";
import { useCallback, useEffect, useState } from 'react';
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner"
import colors from "tailwindcss/colors";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar"
import { LinearGradient } from "expo-linear-gradient";
import NoRecipes from "@/components/ui/custom-no-recipes-display";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid;
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_HOME_PAGE, {
    variables: { userId, numRecipes: 10 },
    skip: !userId,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error during refetch:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, []);

  const formatDate = (dateString: string) => {
    const postDate = new Date(dateString);
    const today = new Date();
  
    // Check if the post is from today
    const isToday = postDate.toDateString() === today.toDateString();
  
    // Check if the post is from this year (but not today)
    const isThisYear = postDate.getFullYear() === today.getFullYear();
  
    if (isToday) {
      // Return time in HH:MM format if today
      return postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isThisYear) {
      // Return Month Day if it's this year (but not today)
      return postDate.toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
    } else {
      // Return MM-DD-YY format if it's not from this year
      return postDate.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: '2-digit' });
    }
  };

  if (loading) 
    return (
      <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Spinner size="large" color={colors.gray[500]} />
    </View>
    );

  // if (error) return <Text>Error: {error.message}</Text>;

  // TODO: have text that redirects to create recipe if no recipes on home page

  const GRADIENT_COLORS: [string, string, ...string[]] = [
    "#301818", "#2e181a", "#2c181b", "#2a171d", "#28171d", 
    "#25181e", "#22181e", "#20181e", "#1e181d", "#1b181c", 
    "#1a171b", "#181719"
  ];
  
  const GRADIENT_LOCATIONS: [number, number, ...number[]] = [
    0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7
  ];

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%",
      }}
    >
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: -0.5 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VStack space="lg" className="mb-5 mt-4">
          {data?.getHomePageRecipes?.length === 0 ? ( <NoRecipes />) : (
            data?.getHomePageRecipes?.map((post: any, index: any) => (
              <View key={index} className="mb-4">
                {/* Heading with profile picture and display name */}
                <Pressable className="flex-row items-center mb-4" 
                  onPress={() => {
                    post.user.uid == userId ? router.push(`/(app)/(tabs)/(profile)`) : router.push(`/(app)/(tabs)/(home)/(friend)/${post.user.uid}`)
                  }}
                >
                  <Avatar size="sm">
                    <AvatarFallbackText>{post.user.displayName}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: post.user.profilePicture,
                      }}
                    />
                  </Avatar>
                  <Text className="font-semibold text-white ml-2">{post.user.displayName}</Text>
                </Pressable>

                {/* Render post content */}
                <Pressable onPress={() => router.push(`/(app)/(tabs)/(home)/${post.uid}`)}>
                  <Post
                    photoUrl={post.photoUrl}
                    mealName={post.name}
                    tastes={post.tastes}
                  />
                </Pressable>

                {/* Post time or date */}
                <Text className="text-sm text-gray-300 mt-2">
                  {formatDate(post.createdAt)}
                </Text>
              </View>
            ))
          )}
        </VStack>
      </ScrollView>
    </View>
  );
}