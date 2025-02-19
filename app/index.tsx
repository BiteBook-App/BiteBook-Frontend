import { View } from "react-native";
import "@/global.css";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { MailIcon, LockIcon, EyeOffIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

export default function Login() {
  return (
    <View
      className="bg-background-dark px-5"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%", 
      }}
    >
      <VStack space="4xl">
        <HStack className="justify-center items-center" space="lg" reversed={false} >
          <Image
            size="md"
            source={{
              uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            }}
            alt="bitebook logo"
          />
          <Heading size="4xl" className="text-primary-900">Welcome to BiteBook!</Heading>
        </HStack>
        <FormControl>
          <VStack space="lg">
            <Input
              className="bg-background-50 rounded-xl border-0"
              size="xl"
            >
              <InputSlot className="pl-4">
                <InputIcon as={MailIcon}></InputIcon>
              </InputSlot>
              <InputField placeholder="Email"/>
            </Input>

            <VStack space="sm">
              <Input
                className="bg-background-50 rounded-xl border-0"
                size="xl"
              >
                <InputSlot className="pl-4">
                  <InputIcon as={LockIcon}></InputIcon>
                </InputSlot>
                <InputField placeholder="Password"/>
                <InputSlot className="pr-4">
                  <InputIcon as={EyeOffIcon}></InputIcon>
                </InputSlot>
              </Input>
              <Text className="text-right">Forgot password?</Text>
            </VStack>

            <Button className="rounded-xl" size="xl" variant="solid" action="primary">
              <ButtonText>Sign in</ButtonText>
            </Button>
          </VStack>
        </FormControl>

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

        <Text className="text-center">Don't have an account? Sign Up</Text>

      </VStack>

    </View>
  );
}
