import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { P } from "@expo/html-elements";

interface DraftRecipe {
  mealName: String,
  createdAt: string,
  tastes: string[]
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DraftRecipe({ mealName, createdAt, tastes }: DraftRecipe) {
  return (
    <VStack space="md" className="bg-background-0 p-4" style={styles.card}>
      <VStack>
        <Text className="text-typography-800 font-medium" size="lg">{mealName}</Text>
        <Text className="text-typography-800" size="md">{formatDate(createdAt)}</Text>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    justifyContent: "center"
  },
  button: {
  }
});