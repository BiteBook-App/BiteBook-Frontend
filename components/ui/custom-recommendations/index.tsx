import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from "expo-router";
import Post from "@/components/ui/custom-recipe-post";

export default function Recommendations({ recommendations }: { recommendations: any[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <HStack space="md">
          {
            recommendations?.map((post: any, index: any) => (
              <View key={index}>
                {/* Heading with profile picture and display name */}
                <Pressable className="flex-row items-center mb-2" 
                  onPress={() => router.push(`/(app)/(tabs)/(taste)/(friend)/${post.user.uid}`)}
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
                <Pressable onPress={() => router.push(`/(app)/(tabs)/(taste)/${post.uid}`)}>
                  <Post
                    photoUrl={post.photoUrl}
                    mealName={post.name}
                    tastes={post.tastes}
                    createdAt={post.createdAt}
                    lastUpdatedAt={post.lastUpdatedAt}
                    size="small"
                    color={"#7781ba"}
                  />
                </Pressable>
            </View>
            ))
          }
        </HStack>
      </ScrollView>
    </View>
  );
}
