import { View } from "react-native";
import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text } from "@/components/ui/text";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { MailIcon, LockIcon, CloseCircleIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, Link } from "expo-router";
import { Spinner } from "@/components/ui/spinner"
import CustomInputField from "@/components/ui/custom-input-field"

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false); // Tracks invalid credentials to display error message
  const [invalidForm, setInvalidForm] = useState(true); // Tracks invalid form requirements to disable log in button
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInvalidForm(!(email.trim() && password.trim())); // invalidForm is false if both fields are non-empty - disable log in button

    if (!email.trim() && !password.trim())
      setInvalidLogin(false); // Reset error message when fields are cleared
  }, [email, password]);

  const router = useRouter();

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
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setInvalidLogin(!invalidLogin);
      })
      .finally(() => {
        setLoading(false); // Hide spinner when call finishes
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
          "#232d37", "#232b34", "#222832", "#22262f", "#21242c",
          "#202229", "#1f2027", "#1e1e24", "#1d1c21", "#1b1a1e",
          "#1a191c", "#181719"
        ]}
        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
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
          className="justify-center items-center" 
          space="lg" 
          reversed={false} 
        >
          <Image
            size="lg"
            source={require('../assets/images/App_Icon.png')}
            alt="bitebook logo"
            className="rounded-xl"
          />
          <VStack 
            className="mt-8 lg:mt-3" 
            space="xs"
          >
            <Text 
              className="font-light" 
              size="4xl">
                Welcome to
            </Text>
            <Text 
              className="font-[Rashfield] leading-[69px] lg:leading-[55px]"
              size="5xl" 
            >
                BiteBook
            </Text>
          </VStack>
        </HStack>

        {/* Manual Sign In */}
        <FormControl isInvalid={invalidLogin}>
          <VStack space="lg">
             <CustomInputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                icon={MailIcon}
              />

            <VStack space="sm">
             <CustomInputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                icon={LockIcon}
                isPassword
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
              />
              <Text className="text-right">Forgot password?</Text>
            </VStack>

            <Button 
              className="rounded-xl" 
              size="xl" 
              variant="solid" 
              action="primary"
              onPress={handleSignIn}
              isDisabled={invalidForm}
            >
              {!loading && <ButtonText>Sign in</ButtonText>}
              {loading && <Spinner/>}
            </Button>

            <FormControlError className="justify-center">
              <FormControlErrorIcon as={CloseCircleIcon}/>
              <FormControlErrorText>Sorry, incorrect email or password. Please try again.</FormControlErrorText>
            </FormControlError>
          </VStack>
        </FormControl>

        {/* Additional Sign In Options */}
        <HStack 
          className="items-center space-x-4" 
          space="md"
        >
          <View className="flex-1 h-px bg-background-100" />
          <Text className="text-background-300">OR</Text>
          <View className="flex-1 h-px bg-background-100" />
        </HStack>

        <VStack space="sm">
          <Button 
            className="rounded-xl" 
            size="xl" 
            variant="outline" 
            action="primary"
          >
            <ButtonText>Sign in with Google</ButtonText>
          </Button>
          <Button 
            className="rounded-xl" 
            size="xl" 
            variant="outline" 
            action="primary"
          >
            <ButtonText>Sign in with Apple</ButtonText>
          </Button>
        </VStack>

        <Text className="text-center">
        Don't have an account?{" "}
          {/* this doesn't work on web */}
          <Link href="/sign-up" className="text-typography-950 font-bold">
            Sign Up
          </Link>
        </Text>
      </VStack>

    </View>
  );
}
