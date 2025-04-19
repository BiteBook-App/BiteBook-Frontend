import { View, StyleSheet, Image, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Link, LinkText } from "@/components/ui/link";
import { Button, ButtonText } from "@/components/ui/button";
import Step from "@/components/ui/custom-collapsible-item";
import { useQuery } from "@apollo/client";
import { GET_RECIPE } from "@/configs/queries";
import { Icon, LinkIcon } from "@/components/ui/icon";
import { formatDate } from "@/components/ui/custom-data-utils";
import { Spinner } from "../spinner";
import colors from "tailwindcss/colors";
import { useRouter } from "expo-router";
import { useAuth } from "@/configs/authProvider";

interface RecipeId {
  recipeId: String
  tastePage?: boolean
  friendPage?: boolean
  homePage?: boolean
}

export default function RecipeComponent({ recipeId, tastePage = false, friendPage = false, homePage = false }: RecipeId) {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid;

  const { loading, error, data, refetch } = useQuery(GET_RECIPE, {
    variables: { recipeUid: recipeId },
    fetchPolicy: 'network-only'
  });
  
  if (error) {
    console.log(error)
  }
  
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

  return (
    <View className="mb-4">
      <Text className="font-[Rashfield] mt-4 pt-7" size="4xl">
        {data?.getRecipe.name}
      </Text> 
      <VStack space="md">
        {/* Profile, image, and tastes */}
        <VStack space="sm" className="mb-3">
          <HStack space="sm" className="justify-between mb-2">
            <HStack space="sm" className="items-center">
              <Pressable
                testID="user-pressable"
                className="flex-row items-center"
                onPress={() => {
                  if (friendPage) {
                    return;
                  } else if (data?.getRecipe.user.uid === userId) {
                    router.push("/(app)/(tabs)/(profile)");
                  } else if (tastePage) {
                    router.push({
                      pathname: "/(app)/(tabs)/(taste)/(friend)/[userId]",
                      params: { userId: data?.getRecipe.user.uid },
                    });
                  } else if (homePage) {
                    router.push({
                      pathname: "/(app)/(tabs)/(home)/(friend)/[userId]",
                      params: { userId: data?.getRecipe.user.uid },
                    });
                  }
                }}
              >
                <Avatar size="sm">
                  <AvatarFallbackText>{data?.getRecipe.user.displayName}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: data?.getRecipe.user.profilePicture,
                    }}
                  />
                </Avatar>
                <Text className="font-semibold text-white ml-2">{data?.getRecipe.user.displayName}</Text>
              </Pressable>
            </HStack>
            <HStack space="xs" className="mt-2 justify-end">
              {data?.getRecipe.tastes.map((taste: any, index: number) => (
                <Button key={index} className="rounded-full" variant="solid" size="xs">
                  <ButtonText>{taste}</ButtonText>
                </Button>
              ))}
            </HStack>
          </HStack>
          <View>
            <Image
              source={{ uri: data?.getRecipe?.photoUrl || "https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg" }}
              style={styles.image}
              alt="recipe post"
            />
          </View>
            <HStack className="flex justify-between w-full pb-2">
              {/* Post time or date */}
              <Text style={{ color: '#7781ba' }} className="text-sm">
                {formatDate(data?.getRecipe.createdAt)}
              </Text>

              {data?.getRecipe.lastUpdatedAt && (
                <Text style={{ color: '#7781ba' }} className="text-sm">
                  Last Updated: {formatDate(data?.getRecipe.lastUpdatedAt)}
                </Text>
              )}
            </HStack>
        </VStack>

        {/* Link */}
        <View className="bg-background-0 rounded-2xl border-0 opacity-80 p-5">
          <HStack space="sm">
            <Icon as={LinkIcon} />
            {data?.getRecipe.url === '' ? (
              <Text className="text-primary-950 font-medium italic" size="md">
                No link provided
              </Text>
            ) : (
              <Link href={data?.getRecipe.url}>
                <LinkText className="text-primary-950 font-medium" size="md">
                  {data?.getRecipe.name}
                </LinkText>
            </Link>
            )}
          </HStack>
        </View>

        {/* Ingredients */}
        <View className="bg-background-0 rounded-2xl border-0 opacity-80 p-5">
          <Text className="text-primary-950 font-bold" size="lg">Ingredients</Text>
          {data?.getRecipe.ingredients.map((ingredient: any, index: number) => (
            <View key={index}>
              <Text className="text-primary-950 mt-3">
                {ingredient.count ? `${ingredient.count}, ` : ""}
                <Text className="font-bold">{ingredient.name}</Text>
              </Text>
              {index !== data?.getRecipe.ingredients.length - 1 && (
                <View className="h-px bg-background-50 mt-3" />
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="bg-background-0 rounded-2xl border-0 opacity-80 p-5">
          <Text className="text-primary-950 font-bold" size="lg">Instructions</Text>
          {data?.getRecipe.steps.map((step: any, index: number) => (
            <Step 
              expanded={true} 
              text={step.text} 
              stepNumber={index + 1} 
              key={index}
            />
          ))}
        </View>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 350,
    borderRadius: 10,
  },
});