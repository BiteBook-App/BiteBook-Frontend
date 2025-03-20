import { View } from "react-native";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import CustomInputField from "@/components/ui/custom-input-field";
import { Icon, MailIcon, ArrowLeftIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner"
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import CustomModal from "@/components/ui/custom-modal";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
  const handleResetPassword = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log("password reset email sent")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("email could not be sent")
        // ..
      })
      .finally(() => {
        setLoading(false); // Hide spinner when call finishes
        setShowModal(true);
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
          "#37232f", "#34222e", "#30212c", "#2d202a", 
          "#2a1f29", "#271e27", "#241d25", "#221c23", 
          "#1f1b20", "#1c1a1e", "#1a181c", "#181719"
        ]}
        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: -0.6 }}
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

      <Text 
        className="font-[Rashfield] leading-[69px] lg:leading-[55px]"
        size="5xl"
      >
        Forgot Password
      </Text>

      <VStack space="xl">
        <Text size="xl">No worries, we'll send you reset instructions. Enter the address associated with your account.</Text>
        <VStack space="xl">
          <CustomInputField 
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            icon={MailIcon}
          />
          <Button 
            className="rounded-xl" 
            size="xl" 
            variant="solid" 
            action="primary"
            onPress={handleResetPassword}
          >
            {!loading && <ButtonText>Reset Password</ButtonText>}
            {loading && <Spinner/>}
          </Button>
        </VStack>
      </VStack>
      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}
