import React from "react";
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from 'expo-router';
import { Pressable } from "react-native";

interface CustomProps {
  showActionsheet: boolean;
  handleClose: () => void;
  recipeId: String;
}
	
export default function CustomActionsheet({ showActionsheet, handleClose, recipeId }: CustomProps){
  const router = useRouter();
  console.log(recipeId)
  return (
    <>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop/>
        <ActionsheetContent className="border-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
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
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText size="md">Share</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem isDisabled onPress={handleClose}>
            <ActionsheetItemText size="md">Delete</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}