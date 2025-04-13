import { View, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { FormControl } from "@/components/ui/form-control";
import * as ImagePicker from "expo-image-picker";
import {useEffect, useState} from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, CloseIcon, ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from '@/configs/authProvider';
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_RECIPE, GET_RECIPE } from "@/configs/queries";
import { useLocalSearchParams } from "expo-router";


import CameraComponent from "@/components/ui/camera-component/camera";
import { useImagePicker } from "../../../../../components/ui/camera-component/camera-functionality"
import IngredientsSection from "@/components/ui/ingredients-component/ingredients";

type Ingredient = {
    name: string;
    count: string;
  };

export default function EditRecipe() {
    const { editRecipeId } = useLocalSearchParams() as { editRecipeId: string };

    const { storage, user } = useAuth();

     // Camera
    const [photo, setPhoto] = useState<string | null>(null);
    const { uploadImage } = useImagePicker();

    // Ingredient management
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

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
    const [step, setStep] = useState("");
    const [steps, setSteps] = useState<{ text: string; expanded: boolean }[]>([]);


    const { loading, error, data, refetch } = useQuery(GET_RECIPE, {
        variables: { recipeUid: editRecipeId }
    });    
    const [editRecipe, {data: mutationData, loading: mutationLoading, error: mutationError}] = useMutation(EDIT_RECIPE);

    if (error) {
        alert("Unable to find recipe. Please try again later.")
    }

    const loadData = () => {
        setRecipeLoading(true);
        try {
            const jsonData = data ? JSON.parse(JSON.stringify(data["getRecipe"], (key, value) =>
                key === '__typename' ? undefined : value
            )) : null;

            console.log(jsonData);

            setRecipe(jsonData);
            setTitle(jsonData["name"]);
            setIngredients(jsonData["ingredients"]);
            setSteps(jsonData["steps"]);

            if (jsonData["tastes"]) {
                setSelectedTastes(jsonData["tastes"]);
            }

            if(jsonData["url"]) {
                setRecipeLink(jsonData["url"])
            }
            else {
                setRecipeLink("No URL inputted.")
            }

            if(jsonData["photoUrl"]) {
                setPhoto(jsonData["photoUrl"])
            }

        } catch (error) {
            console.error("Error calling API:", error);
            setRecipeLoading(false)
        }
        setRecipeLoading(false);
    }

    useEffect(() => {
        loadData()
    }, []);

    const toggleTasteSelection = (taste: string) => {
        // If taste is already in array, remove; otherwise, add.
        setSelectedTastes((prev) =>
            prev.includes(taste) ? prev.filter((item) => item !== taste) : [...prev, taste]
        );
    };

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

    const canSubmitRecipe =
        title.trim() !== "" &&
        (photo || "").trim() !== "" &&
        ingredients.some(({ name }) => name.trim() !== "") &&
        steps.some(({ text }) => text.trim() !== "") &&
        selectedTastes.length > 0;

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
            tastes: selectedTastes, // Add later
        };

        try {
            // const responseData = await response.json();
            const responseData = await editRecipe({ variables: { recipeData } });
            console.log("Server Response:", mutationData);

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
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <VStack space="xs">
                    <VStack className="mt-8" space="xs">
                        <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
                            Edit Recipe
                        </Text>
                    </VStack>

                    <FormControl>
                        <VStack space="4xl">
                            <VStack space="md">
                            <Text className="text-xl font-medium"><Text className="text-xl font-bold">Link</Text> to the recipe</Text>
                                <HStack space="sm">
                                    <TextInput
                                        editable={false}
                                        placeholder="Recipe Link"
                                        value={recipeLink}
                                        onChangeText={setRecipeLink}
                                        className="text-white bg-background-0 rounded-xl opacity-50 p-3 pl-4"
                                        style={{ fontSize: 17, flex: 1 }}
                                        placeholderTextColor="#8C8C8C"
                                    />
                                </HStack>
                            </VStack>
                            <VStack space="md">
                                <Text className="text-3xl font-medium">
                                    What's the <Text className="text-3xl font-bold">recipe</Text> called?
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
                                    What does your meal <Text className="text-xl font-bold">look like</Text>?
                                </Text>

                                <CameraComponent 
                                    photo={photo}
                                    setPhoto={setPhoto}
                                />
                            </VStack>

                            <IngredientsSection 
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            />

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
                    <Button className="rounded-xl mt-10" size="xl" variant="solid" action="primary" onPress={submitRecipe} isDisabled={!canSubmitRecipe}>
                        {!recipeSubmit && <ButtonText>Edit Recipe!</ButtonText>}
                        {recipeSubmit && <Spinner/>}
                    </Button>
                </VStack>
            </ScrollView>
        </View>
    );
}
