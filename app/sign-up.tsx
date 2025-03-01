import { View } from "react-native";
import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MailIcon, LockIcon, CloseCircleIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import CustomInputField from "@/components/ui/custom-input-field"
import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";
import { Spinner } from "@/components/ui/spinner"
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
// @ts-ignore
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';

SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [invalidForm, setInvalidForm] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingAccountError, setExistingAccountError] = useState(false);
  const [passwordTooShort, setPasswordTooShort] = useState(false);

  useEffect(() => {
    const isMismatch = password !== "" && confirmPassword !== "" && password !== confirmPassword;
    setInvalidPassword(isMismatch);
  
    const isTooShort = password.length > 0 && password.length < 6;
    setPasswordTooShort(isTooShort);
  
    const isFormValid =
      username.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      !isMismatch &&
      !isTooShort;
  
    setInvalidForm(!isFormValid);
  }, [username, email, password, confirmPassword]);

  // Remove the "Email Already Exists" error if they edit the form again
  useEffect(() => {
    setExistingAccountError(false);
  }, [username, email, password, confirmPassword]);

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

  // Firebase config - TO DO: Move somewhere else?
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const handleSignIn = () => {
    setLoading(true);
    setExistingAccountError(false);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username
        });
        console.log("Account successfully created and authenticated");
        router.push('/home');
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setExistingAccountError(true);
        } 
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
              Sign Up
            </Text>
          </VStack>
        </HStack>

        {/* Manual Sign In */}
        <FormControl isInvalid={invalidPassword || passwordTooShort || existingAccountError}>
          <VStack space="md">
            <CustomInputField
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              icon={() => <Feather name="user" size={20} color="#8C8C8C" />}
            />
            <CustomInputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              icon={MailIcon}
            />
            <CustomInputField
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              icon={LockIcon}
              isPassword
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />
            {passwordTooShort && (
              <FormControlError className="justify-center">
                <FormControlErrorIcon as={CloseCircleIcon} />
                <FormControlErrorText>
                  Password must be at least 6 characters.
                </FormControlErrorText>
              </FormControlError>
            )}
           {password.length > 0 && (
              <PasswordStrengthMeterBar
                password={password}
                showStrengthText={true}
                minLength={6}
                radius={8}
                unfilledColor="rgba(20, 20, 20, 0.7)"
              />
            )}
            <CustomInputField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={LockIcon}
              isPassword
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
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
            {!loading && <ButtonText>Sign up</ButtonText>}
            {loading && <Spinner/>}
          </Button>

          {/* Password mismatch error */}
          {invalidPassword && (
            <FormControlError className="justify-center">
              <FormControlErrorIcon as={CloseCircleIcon} />
              <FormControlErrorText>
                Passwords do not match.
              </FormControlErrorText>
            </FormControlError>
          )}

          {/* Email already exists error */}
          {existingAccountError && (
            <FormControlError className="justify-center">
              <FormControlErrorIcon as={CloseCircleIcon} />
              <FormControlErrorText>
                This email is already in use. Try signing in instead.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
    </View>
  );
}