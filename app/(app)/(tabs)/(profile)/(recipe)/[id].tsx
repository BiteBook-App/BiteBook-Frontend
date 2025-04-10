import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import RecipeComponent from "@/components/ui/custom-recipe";
import { useLocalSearchParams } from "expo-router";

export default function Recipe() {
  const GRADIENT_COLORS: [string, string, ...string[]] = [
    "#141f30", "#151d2e", "#161b2c", "#171a2a", "#181928", "#181826", 
    "#1a1923", "#1a1921", "#1a181f", "#1a181d", "#19181b", "#181719"
  ];
  
  const GRADIENT_LOCATIONS: [number, number, ...number[]] = [
    0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7
  ];

  const { id } = useLocalSearchParams() as { id: string };

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: -0.5 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false} 
      >
        <RecipeComponent recipeId={id}/>

      </ScrollView>
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