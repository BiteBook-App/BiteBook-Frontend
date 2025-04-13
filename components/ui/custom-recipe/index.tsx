import { View, StyleSheet, Image } from "react-native";
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

interface RecipeId {
  recipeId: String
}

export default function RecipeComponent({ recipeId }: RecipeId) {
  const { loading, error, data, refetch } = useQuery(GET_RECIPE, {
    variables: { recipeUid: recipeId }
  });

  if (error) {
    console.log(error)
  }
  if (!data?.getRecipe.photoUrl) {
    console.log("undefined")
  }

  return (
    <View className="mb-4">
      <Text className="font-[Rashfield] mt-4 pt-7" size="4xl">
        {data?.getRecipe.name}
      </Text> 
      <VStack space="md">
        {/* Profile, image, and tastes */}
        <VStack space="sm" className="mb-3">
          <HStack space="sm" className="justify-between">
            <HStack space="sm" className="items-center">
              <Avatar size="sm">
                <AvatarFallbackText>{data?.getRecipe.user.displayName}</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: `${data?.getRecipe.user.profilePicture}`
                  }}
                />
              </Avatar>            
              <Text size="md" className="font-bold">{data?.getRecipe.user.displayName}</Text>
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
              <Text className="text-sm text-gray-300">
                {formatDate(data?.getRecipe.createdAt)}
              </Text>

              {data?.getRecipe.lastUpdatedAt && (
                <Text className="text-sm text-gray-300">
                  Last Updated At: {formatDate(data?.getRecipe.lastUpdatedAt)}
                </Text>
              )}
            </HStack>
        </VStack>

        {/* Link */}
        <View className="bg-background-0 rounded-2xl border-0 opacity-80 p-5">
          <HStack space="sm">
            <Icon as={LinkIcon}/>
            <Link href={data?.getRecipe.url}>
              <LinkText className="text-primary-950 font-medium" size="md">
                {data?.getRecipe.name}            
              </LinkText>
            </Link>
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