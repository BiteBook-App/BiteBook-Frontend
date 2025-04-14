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
          <ActionsheetItem onPress={handleClose}>
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