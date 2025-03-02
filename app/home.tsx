import { View, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { Text } from "@/components/ui/text";
import auth from '@react-native-firebase/auth';

export default function Home() {
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
      <Link href="/recipe" className="text-typography-800">
        Go to a recipe
      </Link>
        <TouchableOpacity onPress={() => auth().signOut()}>
            <Text>Sign Out</Text>
        </TouchableOpacity>
    </View>
  );
}