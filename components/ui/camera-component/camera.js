import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { HStack } from "@/components/ui/hstack";
import { useImagePicker } from "./camera-functionality";

const CameraComponent = ({
  photo,
  setPhoto,
  renderButtons = true,
  containerStyle = {},
  imageStyle = {},
}) => {
  const { takePhoto, pickImage } = useImagePicker();

  const handlePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setPhoto?.(uri);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setPhoto?.(uri);
    }
  };

  const clearPhoto = () => {
    setPhoto?.(null);
  };

  return (
    <View style={containerStyle}>
      {renderButtons && (
        <HStack space="md">
          <Button
            className="rounded-full bg-background-0 opacity-70"
            size="xl"
            variant="solid"
            action="secondary"
            onPress={handlePhoto}
          >
            <Feather name="camera" size={24} color="white" />
          </Button>

          <Button
            className="rounded-full bg-background-0 opacity-70"
            size="xl"
            variant="solid"
            action="secondary"
            onPress={handlePickImage}
          >
            <MaterialIcons name="photo-library" size={24} color="white" />
          </Button>
        </HStack>
      )}

      {photo && (
        <View style={{ position: "relative", marginTop: 10 }}>
          <Image
            source={{ uri: photo }}
            style={{
              width: "100%",
              height: 350,
              borderRadius: 10,
              ...imageStyle,
            }}
          />
          <TouchableOpacity
            onPress={clearPhoto}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              padding: 10,
            }}
          >
            <Icon as={CloseIcon} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CameraComponent;