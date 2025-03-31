import { View, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control"
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, CloseIcon, ChevronUpIcon, ChevronDownIcon, CloseCircleIcon } from "@/components/ui/icon";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/configs/authProvider';
import { Spinner } from "@/components/ui/spinner";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from 'react-native-reorderable-list';

type StepItem = {
  text: string;
  expanded: boolean;
  id: string;
};

type Ingredient = {
  name: string;
  count: string;
};

const TASTE_OPTIONS = ["Salty", "Sweet", "Sour", "Bitter", "Umami", "Spicy"];
const TASTE_COLORS: Record<string, string> = {
  Salty: "bg-blue-500 border-blue-500",
  Sweet: "bg-pink-500 border-pink-500",
  Sour: "bg-yellow-500 border-yellow-500",
  Bitter: "bg-green-700 border-green-700",
  Umami: "bg-purple-500 border-purple-500",
  Spicy: "bg-red-500 border-red-500",
};

const DraggableStep = memo(({ 
  item, 
  stepNumber,
  onToggle, 
  onRemove, 
  onUpdate,
  stepTextRefs 
}: {
  item: StepItem;
  stepNumber: number;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  stepTextRefs: React.MutableRefObject<Record<string, string>>;
}) => {
  const drag = useReorderableDrag();
  const [localText, setLocalText] = useState(item.text);

  // Update the ref whenever localText changes
  useEffect(() => {
    stepTextRefs.current[item.id] = localText;
  }, [localText, item.id, stepTextRefs]);

  // Update local state when item.text changes (from parent)
  useEffect(() => {
    setLocalText(item.text);
  }, [item.text]);

  const handleToggle = () => onToggle(item.id);
  const handleBlur = () => onUpdate(item.id, localText);
  const handleDragPress = () => onUpdate(item.id, localText);

  return (
    <View className="rounded-2xl bg-background-50 p-4 mb-3">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={handleToggle}
          className="flex-1 flex-row items-center"
          activeOpacity={0.7}
        >
          <Text className="text-lg font-bold text-white">Step {stepNumber}</Text>
          <Icon
            as={item.expanded ? ChevronUpIcon : ChevronDownIcon}
            className="text-white ml-2"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onLongPress={() => { drag(); handleDragPress(); }}
          delayLongPress={200}
          className="px-2"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="drag" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {item.expanded && (
        <View className="mt-2 flex-row justify-between items-start">
          <TextInput
            value={localText}
            onChangeText={setLocalText}
            onBlur={handleBlur}
            multiline={true}
            className="text-white text-base flex-1 p-2 bg-transparent"
            style={{ fontSize: 16 }}
            placeholder="Enter step details..."
            placeholderTextColor="#8C8C8C"
          />
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            className="mr-3 mt-2"
            activeOpacity={0.7}
          >
            <Icon as={CloseIcon} className="text-white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default function CreateRecipe() {
  // Recipe metadata
  const [title, setTitle] = useState("");
  const [recipeLink, setRecipeLink] = useState("");
  const [hasCooked, setHasCooked] = useState('NULL');
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Recipe import
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [importError, setImportError] = useState(false);
  
  // Ingredient management
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientCount, setIngredientCount] = useState("");
  
  // Step management
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [step, setStep] = useState("");
  const stepTextRefs = useRef<Record<string, string>>({});
  
  // Taste selection
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  
  // Form submission
  const [recipeSubmit, setRecipeSubmit] = useState(false);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Auth context
  const { storage, user } = useAuth();

  // Calculate if form can be submitted
  const canSubmitRecipe = useMemo(() => {
    const hasTitle = title.trim() !== "";
    const hasIngredients = ingredients.some(({ name }) => name.trim() !== "");
    const hasSteps = steps.some(({ text }) => text.trim() !== "");
    const hasRequiredCookedFields = hasCooked === 'Yes'
    ? ((photo || "").trim() !== "" && selectedTastes.length > 0)
    : hasCooked === 'No';
      
    return hasTitle && hasIngredients && hasSteps && hasRequiredCookedFields;
  }, [title, ingredients, steps, hasCooked, photo, selectedTastes]);

  // Helper functions for scrolling
  const scrollToText = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 180, animated: true });
  }, []);

  // Generate unique ID helper
  const generateUniqueId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substring(7);
  }, []);

  // Taste selection logic
  const toggleTasteSelection = useCallback((taste: string) => {
    setSelectedTastes((prev) =>
      prev.includes(taste) ? prev.filter((item) => item !== taste) : [...prev, taste]
    );
  }, []);

  // Photo handling functions
  const takePhoto = useCallback(async () => {
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
  }, []);

  const pickImage = useCallback(async () => {
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
  }, []);

  // Ingredient management functions
  const addIngredient = useCallback(() => {
    if (ingredientName.trim()) {
      setIngredients(prev => [...prev, { name: ingredientName, count: ingredientCount }]);
      setIngredientName("");
      setIngredientCount("");
    }
  }, [ingredientName, ingredientCount]);

  const removeIngredient = useCallback((index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateIngredient = useCallback((index: number, field: "count" | "name", value: string) => {
    setIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }, []);

  // Step management functions
  const addStep = useCallback(() => {
    if (step.trim() === "") return;
    
    setSteps(prev => [...prev, { 
      text: step, 
      expanded: false, 
      id: generateUniqueId()
    }]);
    setStep("");
  }, [step, generateUniqueId]);

  const handleRemoveStep = useCallback((id: string) => {
    setSteps(prev => prev.filter((item) => item.id !== id));
  }, []);

  const saveAllStepsContent = useCallback(() => {
    if (stepTextRefs.current) {
      setSteps(prevSteps => 
        prevSteps.map(step => {
          const localText = stepTextRefs.current[step.id];
          return localText !== undefined ? { ...step, text: localText } : step;
        })
      );
    }
  }, []);

  const handleUpdateStep = useCallback((id: string, text: string) => {
    saveAllStepsContent();
    
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, text } : step
      )
    );
  }, [saveAllStepsContent]);

  const handleToggleStep = useCallback((id: string) => {
    saveAllStepsContent();
    setSteps(prevSteps =>
      prevSteps.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  }, [saveAllStepsContent]);

  const onStepReorder = useCallback(({from, to}: ReorderableListReorderEvent) => {
    setSteps(value => reorderItems(value, from, to));
  }, []);

  // File upload function
  const uploadImage = useCallback(async (uri: string) => {
    if (!uri) return "";

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `recipes/${user.uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = ref(storage, filename);

    try {
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Upload failed:", error);
      return "";
    }
  }, [storage, user.uid]);

  // Recipe import function
  const importRecipe = useCallback(async (recipeUrl: string) => {
    if (!recipeUrl.trim()) return;
    
    setRecipeLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/import-recipe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: recipeUrl }),      
      });
      
      const data = await res.json();
      setRecipe(data);
      setTitle(data.name);
      setIngredients(data.ingredients);
      
      // Ensure each imported instruction has an ID
      setSteps(data.instructions.map((instruction: { text: string; }) => ({
        text: instruction.text || "",
        expanded: true,
        id: generateUniqueId()
      })));
      
      scrollToText();
      setImportError(false);
    } catch (error) {
      console.error("Error calling API:", error);
      setImportError(true);
    } finally {
      setRecipeLoading(false);
    }
  }, [generateUniqueId, scrollToText]);

  // Form submission
  const submitRecipe = useCallback(async () => {
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
  
      if (responseData.errors) {
        alert("Error submitting recipe: " + responseData.errors[0].message);
        setRecipeSubmit(false);
        return;
      }
  
      // Success handling
      alert("Recipe submitted successfully!");
      
      // Reset form
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
    } finally {
      setRecipeSubmit(false);
    }
  }, [
    photo, 
    title, 
    recipeLink, 
    ingredients, 
    steps, 
    selectedTastes, 
    hasCooked, 
    user.uid, 
    uploadImage
  ]);

  // Memoized renderStepItem function to prevent unnecessary re-renders
  const renderStepItem = useCallback(({ item }: { item: StepItem }) => {
    const stepNumber = steps.findIndex(step => step.id === item.id) + 1;
    
    return (
      <DraggableStep 
        item={item} 
        stepNumber={stepNumber}
        onToggle={handleToggleStep}
        onRemove={handleRemoveStep}
        onUpdate={handleUpdateStep}
        stepTextRefs={stepTextRefs}
      />
    );
  }, [steps, handleToggleStep, handleRemoveStep, handleUpdateStep]);

  // Background gradient colors - extracted as a constant
  const GRADIENT_COLORS: [string, string, ...string[]] = [
    "#141f30", "#151d2e", "#161b2c", "#171a2a", "#181928", "#181826", 
    "#1a1923", "#1a1921", "#1a181f", "#1a181d", "#19181b", "#181719"
  ];
  
  const GRADIENT_LOCATIONS: [number, number, ...number[]] = [
    0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="bg-background-dark px-5 lg:px-40" style={{ flex: 1, width: "100%" }}>
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
          ref={scrollViewRef}
        >
          <VStack space="xs" className="mb-20">
            <VStack className="mt-8 lg:mt-3" space="xs">
              <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
                Add a Recipe
              </Text>
            </VStack>

            <FormControl>
              <VStack space="4xl">
                {/* Recipe Import Section */}
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
                      <Button 
                        className="px-3 py-2 rounded-xl" 
                        size="lg" 
                        variant="solid" 
                        action="primary" 
                        onPress={() => importRecipe(recipeLink)} 
                        isDisabled={recipeLink.length < 1}
                      >
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

                {/* Recipe Name Section */}
                <VStack space="md">
                  <View>
                    <Text className="text-3xl font-medium">
                      What's the <Text className="text-3xl font-bold">meal</Text> called?
                    </Text>
                  </View>
                  <TextInput
                    placeholder="Meal Name"
                    multiline={true}
                    value={title}
                    onChangeText={setTitle}
                    className="text-white bg-background-0 rounded-xl opacity-70 p-3 pl-4"
                    style={{ fontSize: 17 }}
                    placeholderTextColor="#8C8C8C"
                  />

                  {/* Have You Cooked Section */}
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

                  {/* Photo Upload Section - Only shown if user has cooked the meal */}
                  {hasCooked === 'Yes' && (
                    <>
                      <Text className="text-xl font-medium">
                        What does your meal <Text className="text-xl font-bold">look like</Text>?
                      </Text>

                      <HStack space="md">
                        <Button 
                          className="rounded-full bg-background-0 opacity-70"
                          size="xl" 
                          variant="solid" 
                          action="secondary" 
                          onPress={takePhoto}
                        >
                          <Feather name="camera" size={24} color="white" />
                        </Button>

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

                {/* Ingredients Section */}
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
                        <TouchableOpacity onPress={() => removeIngredient(index)}>
                          <Icon as={CloseIcon}/>
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

                {/* Recipe Steps Section */}
                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    How do you <Text className="text-3xl font-bold">make it</Text>?
                  </Text>
                  <View className="bg-background-0 rounded-2xl border-0 opacity-70 p-5" style={{ flexGrow: 1, maxHeight: 480 }}>
                    
                    {steps.length > 0 && (
                      <ReorderableList
                        data={steps}
                        renderItem={renderStepItem}
                        onReorder={onStepReorder}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      />
                    )}
                    
                    <View className="rounded-2xl bg-background-0 mt-2 flex-row items-center">
                      <TextInput
                        placeholder="Step"
                        value={step}
                        onChangeText={setStep}
                        multiline={true}
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
                      onPress={addStep} 
                      isDisabled={!step.trim()}
                    >
                      <Feather name="plus" size={20} color="black" />
                    </Button>
                  </View>
                </VStack>

                {/* Taste Selection Section - Only shown if user has cooked the meal */}
                {hasCooked === 'Yes' && (
                  <VStack space="md">
                    <Text className="text-3xl font-medium">
                      How does it <Text className="text-3xl font-bold">taste</Text>?
                    </Text>
                    <View className="bg-background-0 rounded-2xl border-0 opacity-70 p-5">
                      <HStack space="sm" className="flex-row flex-wrap">
                        {TASTE_OPTIONS.map((taste) => {
                          const isSelected = selectedTastes.includes(taste);
                          const buttonColor = isSelected ? TASTE_COLORS[taste] : "border-gray-400";

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
                )}
              </VStack>
            </FormControl>

            {/* Submit Button */}
            <Button 
              className="rounded-xl mt-10" 
              size="xl" 
              variant="solid" 
              action="primary" 
              onPress={submitRecipe} 
              isDisabled={!canSubmitRecipe}
            >
              {!recipeSubmit && <ButtonText>{hasCooked === 'No' ? 'Save Recipe!' : 'Share Recipe!'}</ButtonText>}
              {recipeSubmit && <Spinner />}
            </Button>
          </VStack>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
