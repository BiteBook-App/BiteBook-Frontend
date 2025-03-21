import { View, Image, ScrollView, TextInput, FlatList, TouchableOpacity } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import CustomInputField from "@/components/ui/custom-input-field";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { FormControl } from "@/components/ui/form-control";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, CloseIcon, ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";

export default function CreateRecipe() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [recipeLink, setRecipeLink] = useState("");
  const [title, setTitle] = useState("");
  const tasteOptions = ["Salty", "Sweet", "Sour", "Bitter", "Umami", "Spicy"];
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const tasteColors: Record<string, string> = {
    Salty: "bg-blue-500 border-blue-500",     // Blue for salty
    Sweet: "bg-pink-500 border-pink-500",     // Pink for sweet
    Sour: "bg-green-500 border-green-500",    // Green for sour
    Bitter: "bg-gray-700 border-gray-700",    // Dark gray for bitter
    Umami: "bg-purple-500 border-purple-500", // Purple for umami
    Spicy: "bg-red-500 border-red-500",       // Red for spicy
  };

  const toggleTasteSelection = (taste: string) => {
    // If taste is already in array, remove; otherwise, add.
    setSelectedTastes((prev) =>
      prev.includes(taste) ? prev.filter((item) => item !== taste) : [...prev, taste]
    );
  };

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

  const updateIngredient = (index: number, field: "count" | "name", value: string) => {
    setIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const [step, setStep] = useState("");
  const [steps, setSteps] = useState<{ text: string; expanded: boolean }[]>([]);
  
  const addStep = () => {
    if (step.trim() === "") return;
    
    setSteps([...steps, { text: step, expanded: false }]);
    setStep("");
  };

  const toggleStep = (index: number) => {
    setSteps(
      steps.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, text: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) =>
        i === index ? { ...step, text } : step
      )
    );
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
          "#141f30", "#151d2e", "#161b2c", "#171a2a", "#181928", "#181826", "#1a1923", "#1a1921", "#1a181f", "#1a181d", "#19181b", "#181719"
        ]}
        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: -0.5 }}
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
                      placeholder="Recipe Link"
                      value={recipeLink}
                      onChangeText={setRecipeLink}
                      icon={() => <Feather name="link" size={20} color="#8C8C8C" />}
                      style={{ flex: 1 }}
                    />
                    <Button className="px-3 py-2 rounded-xl" size="lg" variant="solid" action="primary">
                      <Feather name="arrow-right" size={20} color="black" />
                    </Button>
                  </HStack>
                </VStack>
                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    Show your <Text className="text-3xl font-bold">meal</Text>
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
                      className="rounded-full bg-background-0 opacity-70"
                      size="xl" 
                      variant="solid" 
                      action="secondary" 
                      onPress={takePhoto}
                    >
                      <Feather name="camera" size={24} color="white" />
                    </Button>

                    {/* Select from Photos Button */}
                    <Button 
                      className="rounded-full bg-background-0 opacity-70"
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
                    <Image source={{ uri: photo }} style={{ width: '100%', height: 350, borderRadius: 10 }} />
                  )}
                </VStack>

                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    <Text className="text-3xl font-bold">What's</Text> in it?
                  </Text>

                  <View 
                    className="bg-background-0 rounded-2xl border-0 opacity-70 p-5"
                  >
                    {ingredients.map((item, index) => (
                      <View 
                        className="rounded-2xl bg-background-50 flex-row justify-between items-center p-4 mb-3"
                      >
                        <TextInput
                          placeholder="Amount"
                          value={item.count}
                          onChangeText={(text) => updateIngredient(index, "count", text)}
                          multiline={true}
                          className="text-white font-bold"
                          style={{ width: 65, textAlign: "left", fontSize: 16 }}
                          placeholderTextColor="#8C8C8C"
                        />
                        <TextInput
                          placeholder="Ingredient"
                          value={item.name}
                          multiline={true}
                          onChangeText={(text) => updateIngredient(index, "name", text)}
                          className="text-white flex-1 ml-3"
                          style={{ fontSize: 16 }}
                          placeholderTextColor="#8C8C8C"
                        />
                        <TouchableOpacity onPress={() => removeIngredient(index)}>
                          <Icon as={CloseIcon}/>
                        </TouchableOpacity>
                      </View>
                    ))}
                    {/* Input Fields for Ingredient and Count */}
                    <View 
                      className="rounded-2xl bg-background-50 flex-row"
                    >
                      <TextInput
                          placeholder="Amount"
                          value={ingredientCount}
                          multiline={true}
                          onChangeText={setIngredientCount}
                          className="p-5 flex-1"
                          style={{
                            color: "white",
                            fontSize: 16
                          }}
                          placeholderTextColor="#8C8C8C"
                        />
                        <TextInput
                          placeholder="Ingredient"
                          value={ingredientName}
                          multiline={true}
                          onChangeText={setIngredientName}
                          className="p-5 flex-1"
                          style={{
                            color: "white",
                            fontSize: 16
                          }}
                          placeholderTextColor="#8C8C8C"
                        />
                    </View>
                    <Button className="rounded-xl mt-5" size="md" variant="solid" action="primary" onPress={addIngredient} isDisabled={!ingredientName.trim() || !ingredientCount.trim()}>
                        <Feather name="plus" size={20} color="black" />
                    </Button>
                  </View>
                </VStack>

                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    How do you <Text className="text-3xl font-bold">make it</Text>?
                  </Text>
                  <View 
                    className="bg-background-0 rounded-2xl border-0 opacity-70 p-5"
                  >
                    {steps.map((item, index) => (
                      <View
                        key={index}
                        className="rounded-2xl bg-background-50 p-4 mb-3"
                      >
                        <TouchableOpacity 
                          onPress={() => toggleStep(index)} 
                          className="flex-row justify-between items-center"
                        >
                          <Text className="text-lg font-bold text-white">Step {index + 1}</Text>
                          <Icon as={item.expanded ? ChevronUpIcon : ChevronDownIcon} className="text-white" />
                        </TouchableOpacity>
                        {item.expanded && (
                         <View className="mt-2 flex-row justify-between items-start">
                         <TextInput
                           value={item.text}
                           onChangeText={(text) => updateStep(index, text)}
                           multiline={true}
                           className="text-white text-base flex-1 p-2 bg-transparent"
                           style={{ fontSize: 16 }}
                           placeholder="Enter step details..."
                           placeholderTextColor="#8C8C8C"
                         />
                         <TouchableOpacity onPress={() => removeStep(index)} className="ml-4 mt-2">
                           <Icon as={CloseIcon} className="text-white" />
                         </TouchableOpacity>
                       </View>
                        )}
                      </View>
                    ))}
                    <View 
                      className="rounded-2xl bg-background-50"
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TextInput
                        placeholder="Step"
                        value={step}
                        onChangeText={setStep}
                        multiline={true}
                        className="p-5 flex-1"
                        style={{
                          color: "white",
                          fontSize: 16
                        }}
                        placeholderTextColor="#8C8C8C"
                      />
                    </View>
                    <Button className="rounded-xl mt-5" size="md" variant="solid" action="primary" onPress={addStep} isDisabled={!step.trim()}>
                        <Feather name="plus" size={20} color="black" />
                    </Button>
                  </View>
                </VStack>
                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    How does it <Text className="text-3xl font-bold">taste</Text>?
                  </Text>
                  <View className="bg-background-0 rounded-2xl border-0 opacity-70 p-5">
                  <HStack space="sm" className="flex-row flex-wrap">
                    {tasteOptions.map((taste) => {
                      const isSelected = selectedTastes.includes(taste);
                      const buttonColor = isSelected ? tasteColors[taste] : "border-gray-400";

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
              </VStack>
            </FormControl>
            <Button className="rounded-xl mt-10" size="xl" variant="solid" action="primary">
              <ButtonText>Add Recipe!</ButtonText>
            </Button>
          </VStack>
      </ScrollView>
    </View>
  );
}