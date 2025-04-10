import { View, RefreshControl, ScrollView, Image } from "react-native";
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


export default function Home() {
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

  // TODO: have loading page or animation?
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

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VStack space="lg" className="mb-5 mt-4">
          {data?.getHomePageRecipes?.map((post: any, index: any) => (
            <View key={index} className="bg-background-dark lg:px-40 mb-6">
              {/* Heading with profile picture and display name */}
              <View className="flex-row items-center mb-4">
                <Avatar size="sm">
                  <AvatarFallbackText>{post.user.displayName}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: post.user.profilePicture,
                    }}
                  />
                </Avatar>
                <Text className="font-semibold text-white ml-2">{post.user.displayName}</Text>
              </View>

              {/* Render post content */}
              <Post
                photoUrl={post.photoUrl}
                mealName={post.name}
                tastes={post.tastes}
              />

              {/* Post time or date */}
              <Text className="text-sm text-gray-500 mt-2">
                {formatDate(post.createdAt)}
              </Text>
            </View>
          ))}
        </VStack>
      </ScrollView>
    </View>
  );
}