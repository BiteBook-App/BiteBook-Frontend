import React from "react";
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from 'expo-router';
import { Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER_FROM_RECIPE } from "@/configs/queries";
import { useAuth } from "@/configs/authProvider";

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

  return (
    <>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop/>
        <ActionsheetContent className="border-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {data?.getRecipe?.user.uid == user.uid && 
            <ActionsheetItem onPress={handleClose}>
              <Pressable 
                onPress={() => {
                  handleClose();
                  router.push(`/(app)/(tabs)/(profile)/(editRecipe)/${recipeId}`);
                }}
              >
                <ActionsheetItemText size="md">Edit</ActionsheetItemText>
              </Pressable>
            </ActionsheetItem>
          }
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText size="md">Share</ActionsheetItemText>
          </ActionsheetItem>
          {data?.getRecipe?.user.uid == user.uid && 
            <ActionsheetItem isDisabled onPress={handleClose}>
              <ActionsheetItemText size="md">Delete</ActionsheetItemText>
            </ActionsheetItem>
          }
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}