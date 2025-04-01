import { useRouter } from 'expo-router';
import { Text } from "@/components/ui/text";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal"
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, TrashIcon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { useAuth } from "@/configs/authProvider";


interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomModal({ isOpen, onClose }: CustomModalProps) {  
    const router = useRouter();
    const { signOut, deleteUser } = useAuth();
    
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="rounded-xl border-0 items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
              <Icon as={TrashIcon} className="stroke-error-600" size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody>
            <Heading size="lg" className="text-typography-950 text-center">
                Delete account
            </Heading>
            <Text size="md" className="text-typography-500 text-center">
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={onClose}
              className="flex-grow"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={async () => await deleteUser()}
              size="sm"
              className="flex-grow"
            >
              <ButtonText>Delete</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}
