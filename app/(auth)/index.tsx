import { View } from "react-native";
import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text } from "@/components/ui/text";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { MailIcon, LockIcon, CloseCircleIcon, PhoneIcon, createIcon, InfoIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from "expo-router";
import { Spinner } from "@/components/ui/spinner";
import CustomInputField from "@/components/ui/custom-input-field";
import { Path } from "react-native-svg";
import { useAuth } from '@/configs/authProvider';
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert"

SplashScreen.preventAutoHideAsync();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false); // Tracks invalid credentials to display error message
  const [invalidForm, setInvalidForm] = useState(true); // Tracks invalid form requirements to disable log in button
  const [loading, setLoading] = useState(false);

  // Google Sign In Error
  const [googleError, setGoogleError] = useState(false);

  const { user, login, register, signInWithGoogle } = useAuth();

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    }
    catch (error) {
      setGoogleError(true);
    }
  }

  useEffect(() => {
    setInvalidForm(!(email.trim() && password.trim())); // invalidForm is false if both fields are non-empty - disable log in button

    if (!email.trim() || !password.trim())
      setInvalidLogin(false); // Reset error message when fields are cleared
  }, [email, password]);

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

  const handleSignIn = () => {
    setLoading(true);
    login(email, password)
      .then(() => {
        // Signed in
        router.replace("/(app)/(tabs)");
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("An unknown error occurred");
        }
        setInvalidLogin(!invalidLogin);
      })
      .finally(() => {
        setLoading(false); // Hide spinner when call finishes
      });
  };

  const handlePhoneSignIn = async () => {
    router.push("/phone-sign-in")
  }

  const GoogleIcon = createIcon({
    viewBox: "0,0,256,256",
    path: ( <>
      <Path
          d="M26 2C13.309 2 3 12.309 3 25s10.309 23 23 23c9.918 0 15.973-4.563 19.125-10.219 3.152-5.656 3.55-12.3 2.594-16.843l-.188-.782h-.781L26 20.125h-1v10.406h11.438c-1.727 4-5.243 6.75-10.438 6.75-6.79 0-12.281-5.492-12.281-12.281 0-6.79 5.492-12.281 12.281-12.281 3.05 0 5.82 1.129 7.969 2.969l.718.593 6.844-6.843.719-.75L41.5 8C37.414 4.277 31.96 2 26 2zm0 2c5.074 0 9.652 1.855 13.281 4.844l-4.812 4.812c-2.38-1.777-5.27-2.937-8.469-2.937-7.871 0-14.281 6.41-14.281 14.281S18.129 39.281 26 39.281c6.55 0 11.262-4.015 12.938-9.468l.406-1.282H27v-6.406l18.844.031c.664 4.035.222 9.828-2.469 14.657C40.515 41.937 35.32 46 26 46 14.387 46 5 36.61 5 25S14.387 4 26 4z"
          transform="scale(5.12)"
          fill="#fff"
          strokeMiterlimit={10}
      />
    </>)
  })


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
            source={require('assets/images/App_Icon.png')}
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
              <Link href={"/forgot-password" as any} className="text-right text-typography-800">
                Forgot password?
              </Link>
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
            onPress={handlePhoneSignIn}
          >
            <ButtonIcon as={PhoneIcon}></ButtonIcon>
            <ButtonText>Sign In with Phone</ButtonText>
          </Button>
          <Button 
            className="rounded-xl" 
            size="xl" 
            variant="outline" 
            action="primary"
            onPress={handleGoogleSignIn}
          >
            <ButtonIcon as={GoogleIcon}></ButtonIcon>
            <ButtonText>Sign In with Google</ButtonText>
          </Button>

          {
            googleError ?
                <Alert action="error" variant="solid">
                  <AlertIcon as={InfoIcon} />
                  <AlertText>Something went wrong. Please try again.</AlertText>
                </Alert>
                : null
          }
        </VStack>

        <Text className="text-center">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-typography-800 font-bold">
            Sign Up
          </Link>
        </Text>
      </VStack>

    </View>
  );
}
