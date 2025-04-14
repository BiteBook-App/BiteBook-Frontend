import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";


export default function PlaceholderPost() {
  return (
    <View>
      <Text className="text-primary-0 font-medium mb-3">
        No recommendations just yet. Check back later!
      </Text> 
      <HStack space="md">
        <Box 
          className="bg-background-dark opacity-30 rounded-xl"
          style={{
            height: 150,
            width: 150
          }}
        />
        <Box 
          className="bg-background-dark opacity-30 rounded-xl"
          style={{
            height: 150,
            width: 150
          }}
        />
      </HStack>     
    </View>
  );
}
