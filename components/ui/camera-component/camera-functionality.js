import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
  const [photo, setPhoto] = useState(null);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Camera access is required to take a photo!");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      return uri;
    }

    return null;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access photos is required!");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      return uri;
    }

    return null;
  };

  const uploadImage = async (uri, storage, userId, path = "misc") => {
    if (!uri || !storage || !userId) return "";
  
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${path}/${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
 
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Upload failed:", error);
      return "";
    }
  };

  return { photo, setPhoto, takePhoto, pickImage, uploadImage };
};