import { View, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control"
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, CloseIcon, ChevronUpIcon, ChevronDownIcon, CloseCircleIcon } from "@/components/ui/icon";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/configs/authProvider';
import { Spinner } from "@/components/ui/spinner";

export default function CreateRecipe() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [recipeLink, setRecipeLink] = useState("");
  const [title, setTitle] = useState("");
  const tasteOptions = ["Salty", "Sweet", "Sour", "Bitter", "Umami", "Spicy"];
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const tasteColors: Record<string, string> = {
    Salty: "bg-blue-500 border-blue-500",     // Blue for salty
    Sweet: "bg-pink-500 border-pink-500",     // Pink for sweet
    Sour: "bg-yellow-500 border-yellow-500",    // Yellow for sour
    Bitter: "bg-green-700 border-green-700",    // Green for bitter
    Umami: "bg-purple-500 border-purple-500", // Purple for umami
    Spicy: "bg-red-500 border-red-500",       // Red for spicy
  };
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [importError, setImportError] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToText = () => {
    scrollViewRef.current?.scrollTo({ y: 180, animated: true});
  };

  const importRecipe = async (recipeUrl: string) => {
    setRecipeLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/import-recipe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: recipeUrl
        }),      
      });
      const data = await res.json();
      setRecipe(data);
      setTitle(data.name);
      setIngredients(data.ingredients);
      setSteps(data.instructions);
      scrollToText();
      setImportError(false);
    } catch (error) {
      console.error("Error calling API:", error);
      setRecipeLoading(false)
      setImportError(true);
    }
    setRecipeLoading(false);
  }

  const [hasCooked, setHasCooked] = useState('');

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
    if (ingredientName.trim()) {
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

  const { storage, user } = useAuth();

  const uploadImage = async (uri: string) => {
    if (!uri) return "";

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `recipes/${user.uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = ref(storage, filename);

    try {
        // Upload to Firebase Storage
        await uploadBytes(storageRef, blob);
        // Get the URL
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error("Upload failed:", error);
        return "";
    }
  };

  const canSubmitRecipe = 
  title.trim() !== "" &&
  ingredients.some(({ name }) => name.trim() !== "") &&
  steps.some(({ text }) => text.trim() !== "") &&
  (hasCooked === 'Yes' 
    ? ((photo || "").trim() !== "" && selectedTastes.length > 0)  // If cooked, photo and tastes required
    : true);  // If not cooked, photo and tastes are optional

  const [recipeSubmit, setRecipeSubmit] = useState(false);

  const submitRecipe = async () => {
    setRecipeSubmit(true);
    let photoUrl = "";

    // Upload image if it exists
    if (photo) {
      try {
        photoUrl = await uploadImage(photo);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        setRecipeSubmit(false);
        return;
      }
    }

    const hasCookedBool = hasCooked === 'Yes';
    
    // Construct the recipeData object
    const recipeData = {
      userId: user.uid,
      url: recipeLink.trim(),
      name: title.trim(),
      photoUrl: photoUrl || "",
      ingredients: ingredients
        .filter(({ name }) => name.trim())
        .map(({ name, count }) => ({ name: name.trim(), count: count.trim() || "" })),
      steps: steps
        .map(({ text }) => ({ text: text.trim(), expanded: false }))
        .filter(({ text }) => text !== ""), // Remove empty steps
      tastes: selectedTastes,
      hasCooked: hasCookedBool,
    };
  
    // GraphQL Mutation with Variables
    const mutationQuery = {
      query: `
        mutation CreateRecipe($recipeData: RecipeInput!) {
          createRecipe(recipeData: $recipeData) {
            uid
          }
        }
      `,
      variables: { recipeData },
    };
  
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mutationQuery),
      });
  
      const responseData = await response.json();
      console.log("Server Response:", responseData);
  
      if (responseData.errors) {
        alert("Error submitting recipe: " + responseData.errors[0].message);
        return;
      }
  
      // TODO: Have a more proper success screen
      alert("Recipe submitted successfully!");
      setRecipeSubmit(false);
  
      // Reset form after successful submission
      setPhoto(null);
      setTitle("");
      setRecipeLink("");
      setIngredients([]);
      setSteps([]);
      setSelectedTastes([]);
      setHasCooked("");
  
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Failed to submit recipe. Please try again.");
      setRecipeSubmit(false);
    }
  };
  
  return (
    <View className="bg-background-dark px-5 lg:px-40"
    style={{
      flex: 1,
      width: "100%",
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
          <VStack space="xs" className="mb-20">
            <VStack className="mt-8 lg:mt-3" space="xs">
              <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
                Add a Recipe
              </Text>
            </VStack>

            <FormControl>
              <VStack space="4xl">
                <FormControl isInvalid={importError}>
                  <VStack space="md">
                    <Text className="text-xl font-medium">Do you have a <Text className="text-xl font-bold">link</Text> to the recipe?</Text>
                    <HStack space="sm">
                      <TextInput
                        placeholder="Recipe Link"
                        value={recipeLink}
                        onChangeText={setRecipeLink}
                        className="text-white bg-background-0 rounded-xl opacity-70 p-3 pl-4"
                        style={{ fontSize: 17, flex: 1 }}
                        placeholderTextColor="#8C8C8C"
                      />
                      <Button className="px-3 py-2 rounded-xl" size="lg" variant="solid" action="primary" onPress={() => importRecipe(recipeLink)} isDisabled={recipeLink.length < 1}>
                        {!recipeLoading && <Feather name="arrow-right" size={20} color="black" />}
                        {recipeLoading && <Spinner/>}
                      </Button>
                    </HStack>
                    <FormControlError>
                      <FormControlErrorIcon as={CloseCircleIcon} />
                      <FormControlErrorText>
                        Unable to import recipe. Try again or enter manually.
                      </FormControlErrorText>
                    </FormControlError>
                  </VStack>
                </FormControl>
                <VStack space="md">
                  {/* Wrap in View for scroll measurement */}
                  <View>
                    <Text className="text-3xl font-medium">
                      Show your <Text className="text-3xl font-bold">meal</Text>
                    </Text>
                  </View>
                  <Text className="text-xl font-medium">
                    What is the <Text className="text-xl font-bold">name</Text> of the meal?
                  </Text>
                  <TextInput
                    placeholder="Meal Name"
                    multiline={true}
                    value={title}
                    onChangeText={setTitle}
                    className="text-white bg-background-0 rounded-xl opacity-70 p-3 pl-4"
                    style={{ fontSize: 17 }}
                    placeholderTextColor="#8C8C8C"
                  />

                  <Text className="text-xl font-medium">
                    Have you <Text className="text-xl font-bold">cooked</Text> this meal?
                  </Text>

                  <HStack space="md">
                    <Button 
                      className={`rounded-full opacity-70 ${hasCooked === 'Yes' ? 'bg-green-500' : 'bg-background-0'}`}
                      size="xl" 
                      variant="solid" 
                      action="secondary" 
                      onPress={() => setHasCooked('Yes')}
                    >
                      <Feather 
                        name="check" 
                        size={24} 
                        color={hasCooked === 'Yes' ? 'black' : 'white'}
                      />
                      <Text className={`text-xl font-medium ${hasCooked === 'Yes' ? 'text-black' : 'text-white'}`}> Yes </Text>
                    </Button>

                    <Button 
                      className={`px-8 rounded-full opacity-70 ${hasCooked === 'No' ? 'bg-red-500' : 'bg-background-0'}`}
                      size="xl" 
                      variant="solid" 
                      action="secondary" 
                      onPress={() => setHasCooked('No')}
                    >
                      <Ionicons 
                        name="close" 
                        size={24} 
                        color={hasCooked === 'No' ? 'black' : 'white'}
                      />
                      <Text className={`text-xl font-medium ${hasCooked === 'No' ? 'text-black' : 'text-white'}`}> No </Text>
                    </Button>
                  </HStack>

                  {hasCooked === 'Yes' && (
                  <>
                    <Text className="text-xl font-medium">
                      What does your meal <Text className="text-xl font-bold">look like</Text>?
                    </Text>

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
                      <View style={{ position: 'relative' }}>
                        <Image 
                          source={{ uri: photo }} 
                          style={{ width: '100%', height: 350, borderRadius: 10 }} 
                        />
                        <TouchableOpacity
                          onPress={() => setPhoto(null)}
                          style={{
                            position: 'absolute', 
                            top: 10, 
                            right: 10,
                            backgroundColor: 'rgba(0,0,0,0.5)', 
                            borderRadius: 20,
                            padding: 10,
                          }}
                        >
                          <Icon as={CloseIcon} color="white" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
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
                          className="text-white flex-1 ml-3 p-1"
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
                      className="rounded-2xl bg-background-0 flex-row"
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
                    <Button className="rounded-xl mt-5" size="md" variant="solid" action="primary" onPress={addIngredient} isDisabled={!ingredientName.trim()}>
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
                      className="rounded-2xl bg-background-0"
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
              {hasCooked === 'Yes' && (
              <>
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
              </>
              )}
              </VStack>
            </FormControl>
            <Button className="rounded-xl mt-10" size="xl" variant="solid" action="primary" onPress={submitRecipe} isDisabled={!canSubmitRecipe}>
              {!recipeSubmit && <ButtonText>Add Recipe!</ButtonText>}
              {recipeSubmit && <Spinner/>}
            </Button>
          </VStack>
      </ScrollView>
    </View>
  );
}
