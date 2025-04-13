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
  modalTitle: String;
  modalBody: String;
  modalActionText: String;
  modalAction: () => void;
  modalIcon: React.ElementType;
}

export default function CustomModal({ isOpen, onClose, modalTitle, modalBody, modalActionText, modalAction, modalIcon }: CustomModalProps) {  
    const router = useRouter();

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="rounded-xl border-0 items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-100 items-center justify-center">
              <Icon as={modalIcon} size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody>
            <Heading size="lg" className="text-typography-950 text-center">
              {modalTitle}
            </Heading>
            <Text size="md" className="text-typography-500 text-center">
              {modalBody}
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
              onPress={modalAction}
              size="sm"
              className="flex-grow"
            >
              <ButtonText>{modalActionText}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}
