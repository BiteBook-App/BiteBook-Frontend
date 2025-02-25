import { View } from "react-native";
import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text } from "@/components/ui/text";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { MailIcon, LockIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import CustomInputField from "@/components/ui/custom-input-field"
import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    // Check if passwords match
    // TODO: display to the user this alert
    if (password !== confirmPassword) {
      console.log("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username
        });
        console.log("account successfully created and authenticated");
        const displayName = user.displayName;
        console.log(displayName);
        router.push('/home');
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
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
          bottom: 0, // Ensures full height
          justifyContent: 'center', // Centers content vertically
          alignItems: 'center', // Centers content horizontally
        }}
      />
      <VStack space="3xl">
        {/* Heading */}
        <HStack 
          className="justify-start"
          space="lg" 
          reversed={false} 
        >
          <VStack 
            className="mt-8 lg:mt-3" 
            space="xs"
          >
            <Text 
                className="font-[Rashfield] leading-[69px] lg:leading-[55px]"
                size="5xl"
            >
              Sign Up
            </Text>
          </VStack>
        </HStack>

        {/* Manual Sign In */}
        <FormControl>
          <VStack space="md"> 
            <HStack space="md">
              <CustomInputField
                placeholder="First Name"
                value={firstName}
                onChangeText={setfirstName}
                icon={() => <Feather name="user" size={20} color="#8C8C8C" />}
                style={{ flex: 1 }}
              />
              <CustomInputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={setlastName}
                icon={() => <Feather name="user" size={20} color="#8C8C8C" />}
                style={{ flex: 1 }}
              />
            </HStack>
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
              onChangeText={setPassword}
              icon={LockIcon}
              isPassword
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />
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
          >
            <ButtonText>Sign up</ButtonText>
          </Button>
        </FormControl>
      </VStack>

    </View>
  );
}
