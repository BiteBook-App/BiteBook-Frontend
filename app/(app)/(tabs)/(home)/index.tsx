import { View, TouchableOpacity } from "react-native";
import {Link, useRouter} from 'expo-router';
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { signOut } = useAuth();
    const router = useRouter();

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
        justifyContent: "center",
        width: "100%", 
      }}
    >
      <Text>This is the home page</Text>
      <Link href={"/recipe" as any} className="text-typography-800 font-bold">Go to the recipe page</Link>
    </View>
  );
}