import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/configs/queries";

export default function Taste() {
  const { user } = useAuth();

  const { loading: profileLoading, error: profileError, data: profile, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { uid: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
    >
      <Text className="font-[Rashfield] mt-5 pt-8" size="5xl">
        Hi, {profile?.getUsers?.[0]?.displayName}!
      </Text> 

      <Text size="xl">The tastes you enjoyed the most this month</Text>
    </View>
  );
}
