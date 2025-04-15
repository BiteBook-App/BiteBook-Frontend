import React, { useState } from "react";
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from 'expo-router';
import { Pressable } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_FROM_RECIPE, DELETE_RECIPE } from "@/configs/queries";
import { useAuth } from "@/configs/authProvider";
import CustomModal from "@/components/ui/custom-modal";
import { TrashIcon } from "@/components/ui/icon";
import { createURL } from "expo-linking";
import Share from 'react-native-share';

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast"

interface CustomProps {
  showActionsheet: boolean;
  handleClose: () => void;
  recipeId: String;
}
	
export default function CustomActionsheet({ showActionsheet, handleClose, recipeId }: CustomProps){
  const router = useRouter();
  const { user } = useAuth();
  const { loading, error, data, refetch } = useQuery(GET_USER_FROM_RECIPE, {
    variables: { recipeUid: recipeId }
  });
  const [deleteRecipeMutation, { loading: mutationLoading, error: mutationError }] = useMutation(DELETE_RECIPE);
  const [showModal, setShowModal] = useState(false);

  const toast = useToast()
    const [toastId, setToastId] = useState("0")

    const showNewToast = (status: String, text: String) => {
        const newId = Math.random().toString()

        setToastId(newId)

        if (status == "success") {
            toast.show({
                id: newId,
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = "toast-" + id
                  return (
                    <Toast nativeID={uniqueToastId} action="success" variant="solid">
                      <ToastTitle>Success</ToastTitle>
                      <ToastDescription>
                        {text}
                      </ToastDescription>
                    </Toast>
                  )
                },
            })
        }
        else if (status == "error") {
            toast.show({
                id: newId,
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = "toast-" + id
                  return (
                    <Toast nativeID={uniqueToastId} action="error" variant="solid">
                      <ToastTitle>Error</ToastTitle>
                      <ToastDescription>
                        {text}
                      </ToastDescription>
                    </Toast>
                  )
                },
            })
        }
      }

    const handleToast = (status: String, text: String) => {
        if (!toast.isActive(toastId)) {
            showNewToast(status, text)
        }
    }

  const handleShare = () => {
    const shareURL = createURL("recipes", {
      queryParams: {id: recipeId}
    })

    Share.open({message: "Share a new recipe with friends!", title: "Recipe Sharing", url: shareURL})
            .then((res) => handleToast('success', "Link was copied to your clipboard!"))
            .catch((err) => handleToast('error', "Please try again later."));
  }

  return (
    <>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop/>
        <ActionsheetContent className="border-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {data?.getRecipe?.user.uid == user.uid && 
            <ActionsheetItem                 
              onPress={() => {
                handleClose();
                router.push(`/(app)/(tabs)/(profile)/(editRecipe)/${recipeId}`);
              }}
            >
              <ActionsheetItemText size="md">Edit</ActionsheetItemText>
            </ActionsheetItem>
          }
          <ActionsheetItem onPress={() => {
            handleShare();
            handleClose();
            }}>
            <ActionsheetItemText size="md">Share</ActionsheetItemText>
          </ActionsheetItem>
          {data?.getRecipe?.user.uid == user.uid && 
            <ActionsheetItem                 
              onPress={() => {
                setShowModal(true);
              }}
            >
              <ActionsheetItemText size="md">Delete</ActionsheetItemText>
            </ActionsheetItem>
          }
        </ActionsheetContent>
      </Actionsheet>

      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        modalTitle="Delete Recipe"
        modalBody="Are you sure you want to delete this recipe? This action cannot be undone."
        modalActionText="Delete"
        modalAction={async () => {
          try {
            await deleteRecipeMutation({
              variables: {
                recipeId: recipeId,
              },
            });

            router.dismissAll();
            router.replace("/(profile)");
            
          } catch (error) {
            console.error("Error deleting recipe:", error);
          } finally {
            setShowModal(false);
            handleClose();
          }
        }}
        modalIcon={TrashIcon}
      />
    </>
  );
}