import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";

export default function NoRecipes() {
  return (
    <View className="items-center">
      <MaterialCommunityIcons name="bowl-mix-outline" size={125} color="white" />
      <Text className="text-xl font-medium">No <Text className="text-xl font-bold">recipes</Text> yet.</Text>
      <Button size="md" variant="outline" style={styles.button} onPress={() => router.push('/(app)/(tabs)/(create)')}>
        <ButtonText>Add your first recipe here!</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flex: 1,
    marginTop: 10
  }
});