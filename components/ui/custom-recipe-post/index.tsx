import { View, Image, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { formatDate } from "@/components/ui/custom-data-utils";

interface RecipePost {
  photoUrl: string,
  mealName: string,
  tastes: string[]
  createdAt: string,
  lastUpdatedAt: string
}

export default function RecipePost({photoUrl, mealName, tastes, createdAt, lastUpdatedAt}: RecipePost) {
  return (
    <VStack space="md">
      <View style={styles.container}>
        <Image
          source={{ uri: `${photoUrl}` }}
          style={styles.image}
          alt="recipe post"
        />
        <LinearGradient
          colors={["transparent", "rgba(53, 5, 5, 0.5)"]} // Gradient from transparent to darker
          style={styles.gradient}
        />
        <HStack space="sm" style={styles.buttonContainer} className="m-2">
          {tastes.map((taste, index) => (
            <Button key={index} style={styles.taste} className="rounded-full" variant="solid" size="sm">
              <ButtonText>{taste}</ButtonText>
            </Button>
          ))}
        </HStack>
        <Text style={styles.overlayText} bold={true} size="3xl" className="m-6">{ mealName }</Text>
      </View>

      <HStack className="flex justify-between w-full pb-2">
        {/* Post time or date */}
        <Text className="text-sm text-gray-300">
          {formatDate(createdAt)}
        </Text>

        {lastUpdatedAt && (
          <Text className="text-sm text-gray-300">
            Last Updated At: {formatDate(lastUpdatedAt)}
          </Text>
        )}
      </HStack>
    </VStack>

  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative", // Ensures the text can be positioned within the container
  },
  image: {
    width: "100%",
    height: 350,
    borderRadius: 10,
  },
  overlayText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    color: "white",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%", // Adjust height of the blur area
    borderRadius: 10,
  },
  taste: {

  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 0
  }
});
