import React, { useCallback } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

export const TASTE_OPTIONS = ["Salty", "Sweet", "Sour", "Bitter", "Umami", "Spicy"];
export const TASTE_COLORS: Record<string, string> = {
  Salty: "bg-blue-500 border-blue-500",
  Sweet: "bg-pink-500 border-pink-500",
  Sour: "bg-yellow-500 border-yellow-500",
  Bitter: "bg-green-700 border-green-700",
  Umami: "bg-purple-500 border-purple-500",
  Spicy: "bg-red-500 border-red-500",
};

interface TastesSectionProps {
  selectedTastes: string[];
  setSelectedTastes: React.Dispatch<React.SetStateAction<string[]>>;
}

const TastesSection: React.FC<TastesSectionProps> = ({ selectedTastes, setSelectedTastes }) => {
  // Toggle taste selection
  const toggleTasteSelection = useCallback(
    (taste: string) => {
      setSelectedTastes((prev) =>
        prev.includes(taste) ? prev.filter((item) => item !== taste) : [...prev, taste]
      );
    },
    []
  );

  return (
    <VStack space="md">
      <Text className="text-3xl font-medium">
        How does it <Text className="text-3xl font-bold">taste</Text>?
      </Text>
      <View className="bg-background-0 rounded-2xl border-0 opacity-70 p-5">
        <HStack space="sm" className="flex-row flex-wrap">
          {TASTE_OPTIONS.map((taste) => {
            const isSelected = selectedTastes.includes(taste);
            const buttonColor = isSelected ? TASTE_COLORS[taste] : "border-gray-400";

            return (
              <Button
                key={taste}
                size="lg"
                variant="solid"
                className={`rounded-full ${buttonColor}`}
                onPress={() => toggleTasteSelection(taste)}
              >
                <ButtonText>{taste}</ButtonText>
              </Button>
            );
          })}
        </HStack>
      </View>
    </VStack>
  );
};

export default TastesSection;