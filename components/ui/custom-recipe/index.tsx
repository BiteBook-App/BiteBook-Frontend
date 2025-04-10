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

interface RecipeId {
  recipeId: String
}

export default function RecipeComponent({ recipeId }: RecipeId) {
  // const mockData = {
  //   "data": {
  //     "getRecipe": {
  //       "createdAt": "2025-04-04T21:15:10.175732+00:00",
  //       "hasCooked": true,
  //       "ingredients": [
  //         {
  //           "count": "3 tablespoons plus 1/4 cup (105ml), divided",
  //           "name": "extra-virgin olive oil"
  //         },
  //         {
  //           "count": "2 medium cloves, minced (about 2 teaspoons)",
  //           "name": "garlic"
  //         },
  //         {
  //           "count": "3 cups, cut into 3/4-inch cubes",
  //           "name": "hearty bread"
  //         },
  //         {
  //           "count": "2 ounces (about 1 cup), divided",
  //           "name": "finely grated parmesan cheese"
  //         },
  //         {
  //           "count": "",
  //           "name": "kosher salt and freshly ground black pepper"
  //         },
  //         {
  //           "count": "1",
  //           "name": "large egg yolk"
  //         },
  //         {
  //           "count": "1 tablespoon (15ml)",
  //           "name": "lemon juice"
  //         },
  //         {
  //           "count": "2 to 6",
  //           "name": "anchovies"
  //         },
  //         {
  //           "count": "1 teaspoon (5ml)",
  //           "name": "Worcestershire sauce"
  //         },
  //         {
  //           "count": "1/3 cup (80ml)",
  //           "name": "canola oil"
  //         },
  //         {
  //           "count": "2 heads, inner leaves only, washed and carefully dried, large leaves torn into smaller pieces, smaller leaves left intact",
  //           "name": "romaine lettuce"
  //         }
  //       ],
  //       "name": "The Best Caesar Salad",
  //       "photoUrl": "https://firebasestorage.googleapis.com/v0/b/bitebook-e7770.firebasestorage.app/o/recipes%2FhS0EaEWRsDMBwP3uRkrTgIrxKRu2%2F1743801309519_9mqm5c.jpg?alt=media&token=75644624-4a3d-41a5-8e59-7de1663d282e",
  //       "steps": [
  //         {
  //           "expanded": false,
  //           "text": "Adjust oven rack to middle position and preheat oven to 375°F (190°C). In a small bowl, combine 3 tablespoons (45ml) olive oil with minced garlic and whisk for 30 seconds. Transfer to a fine-mesh strainer set over a large bowl and press with the back of a spoon to extract as much oil as possible, leaving garlic behind. Reserve pressed garlic separately. Add bread cubes to garlic oil and toss to coat."
  //         },
  //         {
  //           "expanded": false,
  //           "text": "Add 2 tablespoons parmesan cheese, toss again, and season to taste with salt and pepper. Transfer to a rimmed baking sheet. Bake until croutons are pale golden brown and crisp, about 15 minutes. Remove from oven and toss with 2 more tablespoons parmesan. Allow to cool."
  //         },
  //         {
  //           "expanded": false,
  //           "text": "While croutons bake, make the dressing. Combine egg yolk, lemon juice, anchovies, Worcestershire sauce, pressed garlic, and 1/4 cup parmesan cheese in the bottom of a cup that just fits the head of an immersion blender or in the bottom of a food processor. With blender or processor running, slowly drizzle in canola oil until a smooth emulsion forms. Transfer mixture to a medium bowl. Whisking constantly, slowly drizzle in remaining 1/4 cup (60ml) extra-virgin olive oil. Season to taste generously with salt and pepper."
  //         },
  //         {
  //           "expanded": false,
  //           "text": "To serve, toss lettuce with a few tablespoons of dressing, adding more if desired. Once lettuce is coated, add half of remaining cheese and three-quarters of croutons and toss again. Transfer to a salad bowl and sprinkle with remaining cheese and croutons. Serve."
  //         }
  //       ],
  //       "tastes": [
  //         "Salty",
  //         "Umami"
  //       ],
  //       "uid": "p3sHpR7BUPm9kyvpAtjW",
  //       "url": "https://www.seriouseats.com/the-best-caesar-salad-recipe",
  //       "userId": "hS0EaEWRsDMBwP3uRkrTgIrxKRu2"
  //     }
  //   }
  // };
  // const getRecipe = mockData.data.getRecipe;

  // const { loading, error, data: { getRecipe } = {}, refetch } = useQuery(GET_RECIPE, {
  //   variables: { recipeUid: recipeId }, // Ensure the userId is passed correctly
  // });
  const { loading, error, data, refetch } = useQuery(GET_RECIPE, {
    variables: { recipeUid: recipeId }, // Ensure the userId is passed correctly
  });

  if (error) {
    console.log(error)
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
                <AvatarFallbackText>chelleta</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: "https://preview.redd.it/mfpqclprjl781.jpg?width=1080&crop=smart&auto=webp&s=0452afad05af4a7c4dab543b5df50e4596dfcc21"
                  }}
                />
              </Avatar>            
              <Text size="md" className="font-bold">chelleta</Text>
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
              source={{ uri: `${ data?.getRecipe.photoUrl }` }}
              style={styles.image}
              alt="recipe post"
            />
          </View>
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