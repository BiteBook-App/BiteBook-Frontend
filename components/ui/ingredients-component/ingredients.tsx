import React, { useState, useCallback } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { Icon, CloseIcon } from "@/components/ui/icon";

type Ingredient = {
  name: string;
  count: string;
};

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const IngredientsSection = ({ ingredients, setIngredients }: IngredientsSectionProps) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCount, setIngredientCount] = useState("");

  // Ingredient management functions
  const addIngredient = useCallback(() => {
    if (ingredientName.trim()) {
      setIngredients(prev => [...prev, { name: ingredientName, count: ingredientCount }]);
      setIngredientName("");
      setIngredientCount("");
    }
  }, [ingredientName, ingredientCount, setIngredients]);

  const removeIngredient = useCallback((index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, [setIngredients]);

  const updateIngredient = useCallback((index: number, field: "count" | "name", value: string) => {
    setIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }, [setIngredients]);

  return (
    <VStack space="md">
      <Text className="text-3xl font-medium">
        <Text className="text-3xl font-bold">What's</Text> in it?
      </Text>

      <View className="bg-background-0 rounded-2xl border-0 opacity-70 p-5">
        {ingredients.map((item, index) => (
          <View 
            key={index}
            className="rounded-2xl bg-background-50 flex-row justify-between items-center p-4 mb-3"
          >
            <TextInput
              placeholder="Amount"
              value={item.count}
              onChangeText={(text) => updateIngredient(index, "count", text)}
              multiline={true}
              className="text-white font-bold"
              style={{ width: 125, textAlign: "left", fontSize: 16 }}
              placeholderTextColor="#8C8C8C"
            />
            <TextInput
              placeholder="Ingredient"
              value={item.name}
              multiline={true}
              onChangeText={(text) => updateIngredient(index, "name", text)}
              className="text-white flex-1 ml-3 "
              style={{ fontSize: 16 }}
              placeholderTextColor="#8C8C8C"
            />
            <TouchableOpacity
              onPress={() => removeIngredient(index)}
              testID={`remove-button-${index}`}
            >
              <Icon as={CloseIcon} />
            </TouchableOpacity>
          </View>
        ))}
        
        <View className="rounded-2xl bg-background-0 flex-row">
          <TextInput
            placeholder="Amount"
            value={ingredientCount}
            multiline={true}
            onChangeText={setIngredientCount}
            className="p-5 flex-1"
            style={{ color: "white", fontSize: 16 }}
            placeholderTextColor="#8C8C8C"
          />
          <TextInput
            placeholder="Ingredient"
            value={ingredientName}
            multiline={true}
            onChangeText={setIngredientName}
            className="p-5 flex-1"
            style={{ color: "white", fontSize: 16 }}
            placeholderTextColor="#8C8C8C"
          />
        </View>
        <Button 
          className="rounded-xl mt-5" 
          size="md" 
          variant="solid" 
          action="primary" 
          onPress={addIngredient} 
          isDisabled={!ingredientName.trim()}
        >
          <Feather name="plus" size={20} color="black" />
        </Button>
      </View>
    </VStack>
  );
};

export default IngredientsSection;