import { View } from "react-native";
import "@/global.css";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { MailIcon, LockIcon, EyeOffIcon, EyeIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

export default function Login() {
  // Hide password functionality
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
        <HStack className="justify-center items-center" space="lg" reversed={false} >
          <Image
            size="lg"
            source={require('../assets/images/App_Icon.png')}
            alt="bitebook logo"
            className="rounded-xl"
          />
          <VStack className="mt-8 lg:mt-3" space="xs">
            <Text className="font-light" size="4xl">Welcome to</Text>
            <Text 
              className="font-[Rashfield] leading-[69px] lg:leading-[55px]"
              size="5xl" 
            >
                BiteBook
            </Text>
          </VStack>
        </HStack>

        {/* Manual Sign In */}
        <FormControl>
          <VStack space="lg">
            <Input
              className="bg-background-0 rounded-xl border-0 opacity-70"
              size="xl"
            >
              <InputSlot className="pl-4">
                <InputIcon as={MailIcon}></InputIcon>
              </InputSlot>
              <InputField placeholder="Email"/>
            </Input>

            <VStack space="sm">
              <Input
                className="bg-background-0 rounded-xl border-0 opacity-70"
                size="xl"
              >
                <InputSlot className="pl-4">
                  <InputIcon as={LockIcon}></InputIcon>
                </InputSlot>
                <InputField placeholder="Password" type={showPassword ? "text" : "password"}/>
                <InputSlot className="pr-4" onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon}></InputIcon>
                </InputSlot>
              </Input>
              <Text className="text-right">Forgot password?</Text>
            </VStack>

            <Button className="rounded-xl" size="xl" variant="solid" action="primary">
              <ButtonText>Sign in</ButtonText>
            </Button>
          </VStack>
        </FormControl>

        {/* Additional Sign In Options */}
        <HStack className="items-center space-x-4" space="md">
          <View className="flex-1 h-px bg-background-100" />
          <Text className="text-background-300">OR</Text>
          <View className="flex-1 h-px bg-background-100" />
        </HStack>

        <VStack space="sm">
          <Button className="rounded-xl" size="xl" variant="outline" action="primary">
            <ButtonText>Sign in with Google</ButtonText>
          </Button>
          <Button className="rounded-xl" size="xl" variant="outline" action="primary">
            <ButtonText>Sign in with Apple</ButtonText>
          </Button>
        </VStack>

        <Text className="text-center">
          Don't have an account? <Text className="font-bold">Sign Up</Text>
        </Text>
      </VStack>

    </View>
  );
}
