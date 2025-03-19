import { View, Image, ScrollView, TextInput, FlatList, TouchableOpacity } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import CustomInputField from "@/components/ui/custom-input-field";
import { Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import { FormControl } from "@/components/ui/form-control";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateRecipe() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [recipeLink, setRecipeLink] = useState("");
  const [title, setTitle] = useState("");

  // Function to request permissions and open the camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Camera access is required to take a photo!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Function to request permissions and open the photo library
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access photos is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const [ingredients, setIngredients] = useState<{ name: string; count: string }[]>([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCount, setIngredientCount] = useState("");

  const addIngredient = () => {
    if (ingredientName.trim() && ingredientCount.trim()) {
      setIngredients([...ingredients, { name: ingredientName, count: ingredientCount }]);
      setIngredientName("");
      setIngredientCount("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <View className="bg-background-dark px-5 lg:px-40"
    style={{
      flex: 1,
      width: "100%",
      paddingBottom: 20,
    }}>
      <LinearGradient
        colors={[
          "#37232f", "#34222e", "#30212c", "#2d202a", 
          "#2a1f29", "#271e27", "#241d25", "#221c23", 
          "#1f1b20", "#1c1a1e", "#1a181c", "#181719"
        ]}
        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: -0.6 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0, // Ensures full height
          justifyContent: 'center', // Centers content vertically
          alignItems: 'center', // Centers content horizontally
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <VStack space="xs">
            <VStack className="mt-8 lg:mt-3" space="xs">
              <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
                Add a Recipe
              </Text>
            </VStack>

            <FormControl>
              <VStack space="4xl">
                <VStack space="md">
                  <Text className="text-xl font-medium">Do you have a <Text className="text-xl font-bold">link</Text> to the recipe?</Text>
                  <HStack space="sm">
                    <CustomInputField
                      placeholder="Recipe link"
                      value={recipeLink}
                      onChangeText={setRecipeLink}
                      icon={() => <Feather name="link" size={20} color="#8C8C8C" />}
                      style={{ flex: 1 }}
                    />
                    <Button className="px-4 py-2" size="md" variant="solid" action="primary">
                      <Octicons name="upload" size={24} color="black" />
                    </Button>
                  </HStack>
                </VStack>
                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    Show Your <Text className="text-3xl font-bold">Meal</Text>
                  </Text>
                  <Text className="text-xl font-medium">What is the <Text className="text-xl font-bold">name</Text> of your meal?</Text>
                  <CustomInputField
                    placeholder="Meal Name"
                    value={title}
                    onChangeText={setTitle}
                    icon={() => <MaterialIcons name="title" size={20} color="#8C8C8C" />}
                  />
                  <Text className="text-xl font-medium">What does your meal <Text className="text-xl font-bold">look like</Text>? </Text>

                  <HStack space="md">
                    {/* Camera Button */}
                    <Button 
                      className="rounded-full"
                      size="xl" 
                      variant="solid" 
                      action="secondary" 
                      onPress={takePhoto}
                    >
                      <Feather name="camera" size={24} color="white" />
                    </Button>

                    {/* Select from Photos Button */}
                    <Button 
                      className="rounded-full"
                      size="xl" 
                      variant="solid" 
                      action="secondary" 
                      onPress={pickImage}
                    >
                      <MaterialIcons name="photo-library" size={24} color="white" />
                    </Button>
                  </HStack>

                  {/* Display Selected Photo */}
                  {photo && (
                    <Image source={{ uri: photo }} style={{ width: 350, height: 350, borderRadius: 10, alignSelf: "center" }} />
                  )}
                </VStack>

                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    <Text className="text-3xl font-bold">What's</Text> In It?
                  </Text>
                  <Text className="text-xl font-medium">What are the <Text className="text-xl font-bold">ingredients</Text>? </Text>

                  <View 
                    className="bg-background-0 rounded-xl border-0 opacity-70 p-5"
                  >
                    {/* Ingredients List */}
                    <FlatList
                      data={ingredients}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 12,
                            paddingHorizontal: 15,
                            backgroundColor: "#525252",
                            borderRadius: 10,
                            marginBottom: 10
                          }}
                        >
                          <Text style={{ flex: 1, textAlign: "left", fontSize: 16, color: "white"}}>
                            {item.count} <Text className="font-bold" style={{fontSize: 16, color: "white"}}>{item.name}</Text>
                          </Text>
                          <TouchableOpacity onPress={() => removeIngredient(index)}>
                            <Feather name="trash-2" size={20} color="#d93e36" />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                    {/* Input Fields for Ingredient and Count */}
                    <View style={{ backgroundColor: "#525252", flexDirection: "row", alignItems: "center", borderRadius: 10 }}>
                    <TextInput
                        placeholder="Amount"
                        value={ingredientCount}
                        onChangeText={setIngredientCount}
                        keyboardType="numeric"
                        style={{
                          flex: 1,
                          height: 50,
                          marginLeft: 10,
                          padding: 8,
                          color: "white",
                          fontSize: 16
                        }}
                        placeholderTextColor="#8C8C8C"
                      />
                      <TextInput
                        placeholder="Ingredient"
                        value={ingredientName}
                        onChangeText={setIngredientName}
                        style={{
                          flex: 2,
                          marginLeft: 10,
                          height: 50,
                          padding: 8,
                          color: "white",
                          fontSize: 16
                        }}
                        placeholderTextColor="#8C8C8C"
                      />
                    </View>
                    <Button className="rounded-xl mt-5" size="md" variant="solid" action="primary" onPress={addIngredient}>
                        <Feather name="plus" size={20} color="black" />
                    </Button>
                  </View>
                </VStack>
              </VStack>
            </FormControl>
            <VStack space="xl">
              <Button className="rounded-xl mt-10" size="xl" variant="solid" action="primary">
                <ButtonText>Add Recipe!</ButtonText>
              </Button>
            </VStack>
          </VStack>
      </ScrollView>
    </View>
  );
}