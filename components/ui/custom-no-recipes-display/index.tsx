import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";

interface Props {
  displayAction: Boolean
}

export default function NoRecipes({ displayAction }: Props) {
  return (
    <VStack className="flex-1 justify-center items-center" space="md">
      <Box className="w-[100px] h-[100px] rounded-full border-2 border-primary-900 items-center justify-center">
        <MaterialCommunityIcons name="egg-fried" size={68} color="white" />
      </Box>
      <View className="justify-center items-center">
        <Text className="font-bold text-primary-900" size="lg">No recipes yet.</Text>
        { displayAction &&
          <Pressable onPress={() => router.push('/(app)/(tabs)/(create)')}>
            <Text className="font-medium text-primary-900" style={styles.underline}>Add your first recipe here!</Text>
          </Pressable>
        }
      </View>
    </VStack>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flex: 1,
    marginTop: 10
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  }
});