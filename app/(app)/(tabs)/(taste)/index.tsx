import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "@/configs/queries";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import Recommendations from "@/components/ui/custom-recommendations";

export default function Taste() {
  const { user } = useAuth();

  const { loading: profileLoading, error: profileError, data: profile, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { uid: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });
  
  const tasteStats = [
    {taste: 'Salty', percentage: 0.75},
    {taste: 'Sweet', percentage: 0.10},
    {taste: 'Umami', percentage: 0.05},
    {taste: 'Spicy', percentage: 0.05},
    {taste: 'Bitter', percentage: 0},
    {taste: 'Sour', percentage: 0},
  ];

  const TASTE_COLORS: Record<string, string> = {
    Salty: "bg-blue-500 border-blue-500",
    Sweet: "bg-pink-500 border-pink-500",
    Sour: "bg-yellow-500 border-yellow-500",
    Bitter: "bg-green-700 border-pgreen-700",
    Umami: "bg-purple-500 border-purple-500",
    Spicy: "bg-red-500 border-red-500",
  };


  const GRADIENT_COLORS: [string, string, ...string[]] = [
    "#37232f", "#34222e", "#30212c", "#2d202a", 
    "#2a1f29", "#271e27", "#241d25", "#221c23", 
    "#1f1b20", "#1c1a1e", "#1a181c", "#181719"
  ];
  
  const GRADIENT_LOCATIONS: [number, number, ...number[]] = [
    0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7
  ];

  return (
    <View
      className="bg-background-dark px-5 lg:px-40"
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: -0.5 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hi user */}
        <Text className="font-[Rashfield] mt-5 pt-8" size="5xl">
          Hi, {profile?.getUsers?.[0]?.displayName}!
        </Text> 
        
        <VStack space="lg" className="mb-5">
          {/* Food for thought */}
          <Box 
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'rgba(67, 61, 73, 0.27)', // Adjust alpha as needed
            }}
          >
            <Text className="font-[Rashfield] pt-2 mb-1" size="2xl">
              Food for thought
            </Text>
            <Text className="text-white mb-2">
              You cooked 3 new recipes this month and explored 4 taste profiles, with Salty being your favorite. Keep it up!
            </Text>
            <Text className="text-white italic">
              🔥 Tip: You haven’t tried any spicy recipes yet—how about a quick Thai curry or shakshuka next?
            </Text>
          </Box>

          {/* Taste profile bar chart */}
          <Box 
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'rgba(67, 61, 73, 0.27)', // Adjust alpha as needed
            }}
          >            
            <VStack space="md">
              <Text className="font-[Rashfield] pt-2" size="2xl">Tastes you enjoyed the most this month</Text>
              <HStack
                space="sm"
                className="justify-between"
                style={{
                  width: '100%',
                  alignItems: 'flex-end', // ensures bars align at bottom
                }}
              >
                {tasteStats.map((stat, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Box
                      className={`rounded-xl ${TASTE_COLORS[stat.taste] || "bg-background-dark"} opacity-60`}                      
                      style={{
                        width: '100%',
                        height: 300 * stat.percentage,
                      }}
                    />
                    <Text className="text-white text-center mt-2 font-medium" size="sm">
                      {stat.taste}
                    </Text>
                  </View>
                ))}
              </HStack>
            </VStack>
          </Box>
          
          {/* Recommendations */}
          <Box 
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'rgba(67, 61, 73, 0.27)', // Adjust alpha as needed
            }}
          >   
            <VStack space="md">
              <View>
                <Text className="font-[Rashfield] pt-2" size="2xl">Recommendations</Text>
                <Text>Your friends are cooking up these recipes and we think you'll love them.</Text>
              </View>
              <Recommendations/>     
            </VStack> 
          </Box>

        </VStack>
      </ScrollView>
    </View>
  );
}
