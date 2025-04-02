import { View } from "react-native";
import { useRouter } from 'expo-router';
import { Text } from "@/components/ui/text";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal"
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, CloseIcon, ArrowLeftIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "react-native";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomModal({ isOpen, onClose }: CustomModalProps) {  
    const router = useRouter();
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="rounded-xl border-0">
          <ModalHeader>
            <Heading size="lg" className="text-typography-950">
                Email successfully delivered!
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text size="md" className="text-typography-500">
                Check your inbox for instructions on how to reset your password.
            </Text>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Pressable onPress={() => router.back()}>
              <HStack 
                space="sm" 
                className="justify-center"
              >
                <Icon 
                  as={ArrowLeftIcon} 
                  className="text-background-400"
                />
                <Text className="text-background-400">
                  Back to sign in
                </Text>
              </HStack>
            </Pressable>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}
