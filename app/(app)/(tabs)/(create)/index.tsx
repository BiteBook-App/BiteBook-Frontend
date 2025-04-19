import { View, ScrollView, TextInput } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control"
import { useState, useRef, useCallback, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { CloseCircleIcon } from "@/components/ui/icon";
import { useAuth } from '@/configs/authProvider';
import { Spinner } from "@/components/ui/spinner";
import { router } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StepsSection, { StepsUtils, StepItem } from "@/components/ui/steps-component/steps";
import CameraComponent from "@/components/ui/camera-component/camera";
import IngredientsSection from "@/components/ui/ingredients-component/ingredients";
import TastesSection from "@/components/ui/tastes-component/tastes";
import { useImagePicker } from "../../../../components/ui/camera-component/camera-functionality"
import { CREATE_RECIPE } from "@/configs/queries";
import { useMutation } from "@apollo/client";
import CustomModal from "@/components/ui/custom-modal";
import { TrashIcon } from "@/components/ui/icon";

type Ingredient = {
  name: string;
  count: string;
};

export default function CreateRecipe() {
  // Recipe metadata
  const [title, setTitle] = useState("");
  const [recipeLink, setRecipeLink] = useState("");
  const [hasCooked, setHasCooked] = useState('NULL');
  const [showModal, setShowModal] = useState(false);
  
  // Recipe import
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [importError, setImportError] = useState(false);

  // Camera
  const [photo, setPhoto] = useState<string | null>(null);
  const { uploadImage } = useImagePicker();
  
  // Ingredient management
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  
  // Step management
  const [steps, setSteps] = useState<StepItem[]>([]);
  
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
  
  const clearForm = (): void => {
    setPhoto(null);
    setTitle("");
    setRecipeLink("");
    setIngredients([]);
    setSteps([]);
    setSelectedTastes([]);
    setHasCooked("");
    setShowModal(false);
  };

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
      
      // Import steps
      StepsUtils.importStepsFromRecipe(data.instructions, setSteps);
      
      scrollToText();
      setImportError(false);
    } catch (error) {
      console.error("Error calling API:", error);
      setImportError(true);
    } finally {
      setRecipeLoading(false);
    }
  }, [scrollToText]);

  const [createRecipeMutation, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_RECIPE);

  // Form submission
  const submitRecipe = useCallback(async () => {
    setRecipeSubmit(true);
    let photoUrl = "";

    // Upload image if it exists
    if (photo && hasCooked === 'Yes') {
      try {
        photoUrl = await uploadImage(photo, storage, user.uid, "recipes");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        setRecipeSubmit(false);
        return;
      }
    }

    const hasCookedBool = hasCooked === 'Yes';

    // EDGE CASE: User says they cooked it, added photo and tastes, and then selected they didn't cook it before submitting
    if (hasCooked === 'No') {
      setPhoto(null);
      setSelectedTastes([]);
    }
    
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
        .filter(({ text }) => text !== ""),
      tastes: selectedTastes,
      hasCooked: hasCookedBool
    };
  
    try {
      await createRecipeMutation({
        variables: {
          recipeData,
        },
      });
  
      router.replace("/(app)/(tabs)/(profile)");
  
      // Reset form
      clearForm();
  
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
          <VStack space="xs" className="mb-10">
            <VStack className="mt-8 lg:mt-3" space="xs">
              <HStack>
                <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
                  Add a Recipe
                </Text>
              </HStack>
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
                      What's the <Text className="text-3xl font-bold">recipe</Text> called?
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
                    Have you <Text className="text-xl font-bold">cooked</Text> this recipe?
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

                  {hasCooked === 'No' && (
                  <Text className="text-lg text-gray-400 font-medium italic">
                    This recipe will be saved as a draft.
                  </Text>
                  )}

                  {/* Photo Upload Section*/}
                  {hasCooked === 'Yes' && (
                    <>
                      <Text className="text-xl font-medium">
                        What does your meal <Text className="text-xl font-bold">look like</Text>?
                      </Text>
                      
                      <CameraComponent 
                        photo={photo}
                        setPhoto={setPhoto}
                      />
                    </>
                  )}
                </VStack>

                {/* Ingredients Section */}
                <IngredientsSection 
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />

                {/* Recipe Steps Section */}
                <VStack space="md">
                  <Text className="text-3xl font-medium">
                    How do you <Text className="text-3xl font-bold">make it</Text>?
                  </Text>
                  <StepsSection 
                    steps={steps}
                    setSteps={setSteps}
                  />
                </VStack>

                {/* Taste Selection Section*/}
                {hasCooked === 'Yes' && (
                  <TastesSection
                    selectedTastes={selectedTastes}
                    setSelectedTastes={setSelectedTastes}
                  />
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
              {!recipeSubmit && <ButtonText>{hasCooked === 'No' ? 'Save recipe' : 'Share recipe'}</ButtonText>}
              {recipeSubmit && <Spinner />}
            </Button>

            <Button 
              className="rounded-xl mt-2" 
              size="xl" 
              variant="solid" 
              action="secondary" 
              onPress={() => setShowModal(true)}
            >
              <ButtonText>Clear recipe</ButtonText>
            </Button>

            <CustomModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              modalTitle="Clear changes"
              modalBody="Are you sure you want to clear all changes? This action cannot be undone"
              modalActionText="Clear"
              modalAction={clearForm}
              modalIcon={TrashIcon}
            />
          </VStack>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}