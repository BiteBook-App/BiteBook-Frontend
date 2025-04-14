import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/configs/authProvider";
import { useQuery } from "@apollo/client";
import { GET_PROFILE, GET_TASTE_PROFILE } from "@/configs/queries";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { LinearGradient } from "expo-linear-gradient";
import Recommendations from "@/components/ui/custom-recommendations";
import BarChart from "@/components/ui/custom-bar-chart";
import PlaceholderPost from "@/components/ui/custom-placeholder-post";
import Tips from "@/components/ui/custom-taste-tips";

export default function Taste() {
  const { user } = useAuth();

  const { loading: profileLoading, error: profileError, data: profile, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { uid: user?.uid }, // Ensure the userId is passed correctly
    skip: !user?.uid, // Prevents running query if user.uid is undefined
  });

  const { loading: tasteLoading, error: tasteError, data: tasteProfile, refetch: refetchTaste } = useQuery(GET_TASTE_PROFILE, {
    variables: { userId: user?.uid }, // Ensure the userId is passed correctly
  });

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
        <Text className="font-[Rashfield] mt-8 pt-8" style={{ marginBottom: -15 }}size="5xl">
          Hi, {profile?.getUsers?.[0]?.displayName}
        </Text> 
        <Text className="font-medium">🍳 Let's take a look at your <Text bold={true}>monthly</Text> kitchen recap!</Text>

        
        <VStack space="lg" className="mt-5 mb-5">
          <Box 
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'rgba(67, 61, 73, 0.27)',
            }}
          >
            <Text className="font-[Rashfield] pt-2" size="2xl">
              Overall...
            </Text>
            {tasteProfile?.getTastePageInfo?.tastePercentages?.length === 0 ? 
              <Tips showPlaceholder={true}/> : <Tips numRecipes={tasteProfile?.getTastePageInfo?.numRecipes} numTastes={tasteProfile?.getTastePageInfo?.numTasteProfiles} favoriteTaste={tasteProfile?.getTastePageInfo?.tastePercentages?.[0].taste}/>
            }
          </Box>

          {/* Taste profile bar chart */}
          <Box 
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'rgba(67, 61, 73, 0.27)', // Adjust alpha as needed
            }}
          >            
            <Text className="font-[Rashfield] pt-2" size="2xl">Tastes you enjoyed the most</Text>
            {tasteProfile?.getTastePageInfo?.tastePercentages?.length === 0 ? 
              <BarChart/> : <BarChart tasteProfile={tasteProfile?.getTastePageInfo?.tastePercentages}/>
            }
          </Box>
          
          {/* Recommendations */}
          <Box 
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'rgba(67, 61, 73, 0.27)', // Adjust alpha as needed
            }}
          >   
            <View>
              <Text className="font-[Rashfield] pt-2" size="2xl">Explore your friends' recipes</Text>
            </View>
            <Text className="mb-3">Your friends are cooking up these recipes and we think you'll love them.</Text>
            {tasteProfile?.getTastePageInfo?.recommendations?.length === 0 ? <PlaceholderPost/> : <Recommendations recommendations={tasteProfile?.getTastePageInfo?.recommendations}/>}
          </Box>

        </VStack>
      </ScrollView>
    </View>
  );
}
