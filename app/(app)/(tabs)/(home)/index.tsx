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
import { LogBox } from 'react-native';

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
    LogBox.ignoreAllLogs();
    refetch();
  }, []);

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

  const GRADIENT_COLORS: [string, string, ...string[]] = [
    "#452020",
    "#411f22",
    "#3d1e24",
    "#391d25",
    "#351c25",
    "#301c25",
    "#2b1b25",
    "#271b23",
    "#221a22",
    "#1e191f",
    "#1b181c",
    "#181719"
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

      {/* Render No Recipes component if there is no data to display */}
      {data?.getHomePageRecipes?.length === 0 && <NoRecipes displayAction={true}/>}

      {/* Render posts if there is data to display */}
      { data?.getHomePageRecipes?.length !== 0 &&
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <VStack space="lg" className="mb-5 mt-4">
            {
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
                      createdAt={post.createdAt}
                    lastUpdatedAt={post.lastUpdatedAt}
                  />
                  </Pressable>
              </View>
              ))
            }
          </VStack>
        </ScrollView>
      }
    </View>
  );
}