import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

interface TasteData {
  percentage: number;
  taste: string;
}

interface TasteProfile {
  tasteProfile?: TasteData[];
}

const placeholderData: TasteData[] = [
  { taste: "Salty", percentage: 0 },
  { taste: "Umami", percentage: 0 },
  { taste: "Sweet", percentage: 0 },
  { taste: "Sour", percentage: 0 },
  { taste: "Bitter", percentage: 0 },
  { taste: "Spicy", percentage: 0 },
];

function toPercentage(decimal: number) {
  return Math.round(decimal * 100) + '%';
}

export default function BarChart({ tasteProfile = placeholderData }: TasteProfile) {
  const TASTE_COLORS: Record<string, string> = {
    Salty: "bg-blue-500 border-blue-500",
    Sweet: "bg-pink-500 border-pink-500",
    Sour: "bg-yellow-500 border-yellow-500",
    Bitter: "bg-green-700 border-pgreen-700",
    Umami: "bg-purple-500 border-purple-500",
    Spicy: "bg-red-500 border-red-500",
  };

  const isPlaceholder = tasteProfile === placeholderData;

  return (
    <VStack space="sm">
      { isPlaceholder &&
        <Text className="text-primary-0 font-medium">
          No data to display. Add a recipe to view!
        </Text>
      }
      <HStack
        space="sm"
        className="justify-between"
        style={{
          width: '100%',
          alignItems: 'flex-end'
        }}
      >
        {tasteProfile.map((stat: any, i: number) => (
          <View
            key={i}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* Display percentage only for non-zero values */}
            {stat.percentage !== 0 &&
            <Text className="text-primary-200 text-center mt-2 font-medium" size="sm">
              {toPercentage(stat.percentage)}
            </Text>
            }

            {/* Display placeholder styling, if necessary */}
            <Box
              className={
                isPlaceholder
                  ? "rounded-xl bg-background-dark opacity-30 mt-1"
                  : `rounded-xl ${TASTE_COLORS[stat.taste]} opacity-60 mt-1`
              }
              style={{
                width: '100%',
                height: isPlaceholder ? 100 : 300 * stat.percentage,
              }}
            />

            {/* Display taste */}
            <Text className="text-primary-200 text-center mt-2 font-medium" size="sm">
              {stat.taste}
            </Text>
          </View>
        ))}
      </HStack>
    </VStack>
  );
}
