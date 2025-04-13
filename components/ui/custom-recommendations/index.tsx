import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import RecipePost from "@/components/ui/custom-recipe-post";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE } from "@/configs/queries";
import { useAuth } from "@/configs/authProvider";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from "expo-router";
import Post from "@/components/ui/custom-recipe-post";

export default function Recommendations() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid;

  // TODO: Update endpoint
  const { loading, error, data, refetch } = useQuery(GET_HOME_PAGE, {
    variables: { userId, numRecipes: 5 },
    skip: !userId,
  });

  console.log(data);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <HStack space="md">
        {
          data?.getHomePageRecipes?.map((post: any, index: any) => (
            <View key={index}>
              {/* Heading with profile picture and display name */}
              <Pressable className="flex-row items-center mb-2" 
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
                  imageSize="small"
                />
              </Pressable>
          </View>
          ))
        }
      </HStack>
    </ScrollView>
  );
}
