import {ScrollView, View, RefreshControl} from "react-native";
import { Text } from "@/components/ui/text";
import {LinearGradient} from "expo-linear-gradient";
import {VStack} from "@/components/ui/vstack";
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert"
import {ExternalLinkIcon, SearchIcon, StarIcon} from "@/components/ui/icon"
import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from "@/components/ui/avatar"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input"
import { Pressable } from "@/components/ui/pressable"
import {useCallback, useEffect, useState} from "react";
import { createURL } from 'expo-linking';
import {useLocalSearchParams} from "expo-router";
import {useAuth} from "@/configs/authProvider";
import Share from 'react-native-share';
import CustomModal from "@/components/ui/custom-modal";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {CREATE_RELATIONSHIP, GET_FRIENDS, GET_PROFILE} from "@/configs/queries";
import dayjs from 'dayjs';
import {
    useToast,
    Toast,
    ToastTitle,
    ToastDescription,
  } from "@/components/ui/toast"
  import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";

export default function Friends() {
    const [searchTerm, setSearchTerm] = useState('');
    const {user} = useAuth();
    const {id} = useLocalSearchParams();

    const [invitationModalOpen, setInvitationModalOpen] = useState(false);

    const { loading: friendsLoading, error: friendsError, data: friendsData, refetch: friendsRefetch} = useQuery(GET_FRIENDS, {
        variables: { userId: user.uid },
      });

    const [addFriend, {loading: friendLoading, error: friendError, data: friendData}] = useMutation(CREATE_RELATIONSHIP);

    const [filteredFriends, setFilteredFriends] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
          await friendsRefetch();
        } catch (error) {
          console.error("Error during refetch:", error);
        } finally {
          setRefreshing(false);
        }
      }, [friendsRefetch]);

    useEffect(() => {
        if (friendsData?.getFriends) {
          setFilteredFriends(friendsData.getFriends);
        }
      }, [friendsData]);

    useEffect(() => {
        if (id) {
            setInvitationModalOpen(true);
        }
    }, [id]);

    const toast = useToast()
    const [toastId, setToastId] = useState("0")

    const showNewToast = (status: String, text: String) => {
        const newId = Math.random().toString()

        setToastId(newId)

        if (status == "success") {
            toast.show({
                id: newId,
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = "toast-" + id
                  return (
                    <Toast nativeID={uniqueToastId} action="success" variant="solid">
                      <ToastTitle>Success</ToastTitle>
                      <ToastDescription>
                        {text}
                      </ToastDescription>
                    </Toast>
                  )
                },
            })
        }
        else if (status == "error") {
            toast.show({
                id: newId,
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = "toast-" + id
                  return (
                    <Toast nativeID={uniqueToastId} action="error" variant="solid">
                      <ToastTitle>Error</ToastTitle>
                      <ToastDescription>
                        {text}
                      </ToastDescription>
                    </Toast>
                  )
                },
            })
        }
      }

    const handleToast = (status: String, text: String) => {
        if (!toast.isActive(toastId)) {
            showNewToast(status, text)
        }
    }

    const acceptFriendRequest = () => {
        addFriend({variables: {
                relationshipData: {firstUserId: user.uid, secondUserId: id}
            }}).then((res) => {
            setInvitationModalOpen(false);
            friendsRefetch()
            handleToast('success', "You got a new friend!")
        }).catch((error) => {
            setInvitationModalOpen(false);
            handleToast('error', "Please try again later.")
        })
    }

    const handleInvitation = () => {
        const invitationURL = createURL("friends", {
            queryParams: {id: user.uid}
        })

        Share.open({message: "Invite friends to BiteBook!", title: "BiteBook Invitation", url: invitationURL})
            .then((res) => handleToast('success', "Link was copied to your clipboard!"));
    }

    // The search function that filters by name or username - Fixed for React Native
    const handleSearch = (text: any) => {
        setSearchTerm(text);

        if (!friendsData?.getFriends) return;

        // Filter friends based on the search term
        if (!text.trim()) {
            setFilteredFriends(friendsData.getFriends);
            return;
        }

        const term = text.toLowerCase();
        const results = friendsData.getFriends.filter(friend => {
            // Check if username/displayName exists before calling toLowerCase()
            const usernameMatch = friend.displayName ? friend.displayName.toLowerCase().includes(term) : false;

            return usernameMatch;
        });

        setFilteredFriends(results);
    };

    return (
        <View
            className="bg-background-dark px-5 lg:px-40"
            style={{
                flex: 1,
                justifyContent: "center",
            }}
        >
            <LinearGradient
                colors={[
                    "#02332b",
                    "#01312e",
                    "#032e30",
                    "#072b31",
                    "#0d2830",
                    "#11252f",
                    "#15222c",
                    "#182029",
                    "#1a1d25",
                    "#1a1b21",
                    "#1a191d",
                    "#181719"
                ]}
                locations={[0.0, 0.05, 0.09, 0.14, 0.18, 0.23, 0.27, 0.32, 0.36, 0.41, 0.45, 0.5]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: -0.5 }}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0, // Ensures full height
                    justifyContent: 'center', // Centers content vertically
                    alignItems: 'center', // Centers content horizontally
                }}
            />
            <CustomModal
                isOpen={invitationModalOpen}
                onClose={() => setInvitationModalOpen(false)}
                modalTitle="Friend Request"
                modalBody="A new user asked to be your friend! Do you wish to accept?"
                modalActionText="Accept"
                modalAction={acceptFriendRequest}
                modalIcon={StarIcon}
            />
            <VStack>
                <Pressable onPress={handleInvitation}>
                    <Alert className="p-5 flex justify-between bg-background-0 rounded-xl">
                        <AlertText size='lg'>
                            Invite friends to join you on BiteBook!
                        </AlertText>
                        <AlertIcon as={ExternalLinkIcon}></AlertIcon>
                    </Alert>
                </Pressable>
                <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px] mt-5" size="4xl">
                    Friends
                </Text>
                <Input
                    size="lg"
                    className="p-3 rounded-xl"
                >
                    <InputSlot>
                        <InputIcon as={SearchIcon}></InputIcon>
                    </InputSlot>
                    <InputField
                        placeholder="Search friends"
                        value={searchTerm}
                        onChangeText={handleSearch}  // Changed to onChangeText for React Native
                    />
                </Input>

                <ScrollView className="h-[50vh] max-h-[50vh] w-full mt-3" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    {
                        friendsLoading ?
                        <Spinner size="large" color={colors.amber[600]} /> :
                        filteredFriends?.map(user => (
                            <HStack space="md" className="mt-5" key={user.uid} style={{display: "flex", alignItems: "center"}}>
                                <Avatar>
                                    <AvatarFallbackText>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallbackText>
                                    <AvatarImage
                                        source={{
                                            uri: user.profilePicture,
                                        }}
                                    />
                                </Avatar>
                                <VStack>
                                    <Heading size="sm">@{user.displayName}</Heading>
                                    <Text size="sm">Joined on {dayjs(user.createdAt).format('MMMM D, YYYY')}</Text>
                                </VStack>
                            </HStack>
                        ))
                    }

                    {filteredFriends.length === 0 && searchTerm !== "" && (
                        <VStack className="py-8 items-center justify-center">
                            <Text className="text-gray-400 text-center">
                                No friends found matching "{searchTerm}"
                            </Text>
                        </VStack>
                    )}
                </ScrollView>

                <Text className="text-gray-400 text-sm mt-4">
                    Showing {filteredFriends.length} friends
                </Text>
            </VStack>
        </View>
    );
}