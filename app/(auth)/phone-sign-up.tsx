import { View } from "react-native";
import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CloseCircleIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
import CustomInputField from "@/components/ui/custom-input-field"
import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";
import { Spinner } from "@/components/ui/spinner"
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { getDocs, collection, query, where } from "firebase/firestore";
// @ts-ignore
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';
import { FIREBASE_DB } from "../../configs/firebaseConfig.js"
import {useAuth} from "@/configs/authProvider";

SplashScreen.preventAutoHideAsync();

export default function PhoneSignUp() {
  const [username, setUsername] = useState("");
  const [invalidForm, setInvalidForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [duplicateUsernameError, setDuplicateUsernameError] = useState(false);

  const { createUserDB } = useAuth()

  useEffect(() => {
    const isFormValid =
      username.trim() !== ""
  
    setInvalidForm(!isFormValid);
  }, [username]);

  // Remove the "Email Already Exists" error if they edit the form again
  useEffect(() => {
    setDuplicateUsernameError(false);
  }, [username]);

  // Load custom font
  const [loaded, error] = useFonts({
    'Rashfield': require('assets/fonts/VVDSRashfield-Normal.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const db = FIREBASE_DB;

  const handleSignIn = async () => {
    setLoading(true);

    try {
      // Step 1: Check Firestore for existing username
      const usernameQuery = query(collection(db, "users"), where("displayName", "==", username));
      const querySnapshot = await getDocs(usernameQuery);

      if (!querySnapshot.empty) {
        console.log("Username already exists. Choose a different one.");
        setDuplicateUsernameError(true);
        setLoading(false);
        return;
      }

      await createUserDB(username)

      console.log("Account successfully created and authenticated");
      router.push('/(app)/(tabs)/(home)');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%",
      }}
    >
      <LinearGradient
        colors={[
          "#181719", "#1b181c", "#1e181e", "#221820",
          "#261821", "#2a1821", "#2e1820", "#32191f",
          "#36191d", "#39191a", "#3b1a17", "#3d1c13"
        ]}
        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <VStack space="3xl">
        {/* Heading */}
        <HStack className="justify-start" space="lg" reversed={false}>
          <VStack className="mt-8 lg:mt-3" space="xs">
            <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px]" size="5xl">
              Phone Sign Up
            </Text>
            <Text className="text-white text-xl mb-8">
                It looks like you did not have an account yet. Please provide us with some more information.
            </Text>
          </VStack>
        </HStack>

        {/* Manual Sign In */}
        <FormControl isInvalid={duplicateUsernameError}>
          <VStack space="md">
            <CustomInputField
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              icon={() => <Feather name="user" size={20} color="#8C8C8C" />}
            />
          </VStack>

          <Button
            className="rounded-xl mt-10"
            size="xl"
            variant="solid"
            action="primary"
            onPress={handleSignIn}
            isDisabled={invalidForm}
          >
            {!loading && <ButtonText>Done!</ButtonText>}
            {loading && <Spinner/>}
          </Button>

          {/* Username already taken error */}
          {duplicateUsernameError && (
            <FormControlError className="justify-center pt-4">
              <FormControlErrorIcon as={CloseCircleIcon} />
              <FormControlErrorText>
                Username has already been taken.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    </View>
  );
}