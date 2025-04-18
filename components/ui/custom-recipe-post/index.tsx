import { View, Image, StyleSheet, DimensionValue } from "react-native";
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
  size?: "small" | "large";
}

export default function RecipePost({photoUrl, mealName, tastes, createdAt, lastUpdatedAt, size = "large"}: RecipePost) {
  const sizes = {
    small: { height: 200, width: 200},
    large: { height: 350, width: "100%" as DimensionValue}
  }

  const selectedSize = sizes[size];

  return (
    <View>
      <View style={styles.container}>
        <Image
          source={{ uri: `${photoUrl}` }}
          style={{
            width: selectedSize.width,
            height: selectedSize.height,
            borderRadius: 10,
          }}
          alt="recipe post"
        />
        <LinearGradient
          colors={["transparent", "rgba(53, 5, 5, 0.5)"]} // Gradient from transparent to darker
          style={styles.gradient}
        />
        <HStack space="sm" style={styles.buttonContainer} className="m-2 flex-wrap">
          {tastes.map((taste, index) => (
            <Button key={index} style={styles.taste} className="rounded-full" variant="solid" size={size === "large" ? "sm" : "xs"}>
              <ButtonText>{taste}</ButtonText>
            </Button>
          ))}
        </HStack>
        <Text style={styles.overlayText} bold={true} size={size === "large" ? "3xl" : "2xl"} className="m-6">{ mealName }</Text>
      </View>

      <HStack className="flex justify-between w-full pb-2">
        {/* Post time or date */}
        {size === "large" &&
          <Text className="text-sm text-gray-300 mt-2">
            {formatDate(createdAt)}
          </Text>
        }

        {lastUpdatedAt && size === "large" && (
          <Text className="text-sm text-gray-300 mt-2">
            Last Updated: {formatDate(lastUpdatedAt)}
          </Text>
        )}
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative", // Ensures the text can be positioned within the container
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
