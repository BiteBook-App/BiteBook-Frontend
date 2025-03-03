import { View, TouchableOpacity } from "react-native";
import {Link, useRouter} from 'expo-router';
import { Text } from "@/components/ui/text";
import {useAuth} from "@/configs/authProvider";

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
      <Link href="/recipe" className="text-typography-800">
        Go to a recipe
      </Link>
        <TouchableOpacity onPress={async () => {
            await signOut()
            router.navigate("/")
        }}>
            <Text>Sign Out</Text>
        </TouchableOpacity>
    </View>
  );
}