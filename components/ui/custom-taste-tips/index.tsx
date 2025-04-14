import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";

interface Data {
  showPlaceholder?: boolean
  numRecipes?: number
  numTastes?: number
  favoriteTaste?: String
}

export default function Tips({ showPlaceholder = false, numRecipes, numTastes, favoriteTaste }: Data) {
  return (
    <View>
      {showPlaceholder ?
        <View>
          <Text className="text-primary-0 font-medium mb-3">
            No thoughts just yet. Add a recipe to view!
          </Text> 
          <Box 
            className="bg-background-dark opacity-30 rounded-xl"
            style={{
            height: 75,
            width: "100%"
            }}
          />
        </View> 
        :
        <View>
          <Text>
            🔥 You cooked {numRecipes} new recipes this month and explored {numTastes} taste profiles, with {favoriteTaste} being your favorite. Keep it up!
          </Text>
        </View> 
      }


    </View>
  );
}
