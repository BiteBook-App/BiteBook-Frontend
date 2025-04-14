import {ScrollView, View} from "react-native";
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
import {useEffect, useState} from "react";
import { createURL } from 'expo-linking';
import {useLocalSearchParams} from "expo-router";
import {useAuth} from "@/configs/authProvider";
import Share from 'react-native-share';
import CustomModal from "@/components/ui/custom-modal";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {CREATE_RELATIONSHIP, GET_PROFILE} from "@/configs/queries";

export default function Friends() {
    const testData = [
        {
            name: "Friend One",
            username: "friendone",
            profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s",
            uuid: "frienduuid1"
        },
        {
            name: "Friend Two",
            username: "friendtwo", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid2"
        },
        {
            name: "Friend 3",
            username: "friend3", // Fixed username
            profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s",
            uuid: "frienduuid3"
        },
        {
            name: "Friend 4",
            username: "friend4", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid4"
        },
        {
            name: "Friend 5",
            username: "friend5", // Fixed username
            profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s",
            uuid: "frienduuid5"
        },
        {
            name: "Friend 6",
            username: "friend6", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid6"
        },
        {
            name: "Friend 7",
            username: "friend7", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid7"
        },
        {
            name: "Friend 8",
            username: "friend8", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid8"
        },
        {
            name: "Friend 9",
            username: "friend9", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid9"
        },
        {
            name: "Friend 10",
            username: "friend10", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid10"
        },
        {
            name: "Friend 11",
            username: "friend11", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid11"
        },
        {
            name: "Friend 12",
            username: "friend12", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid12"
        },
        {
            name: "Friend 13",
            username: "friend13", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid13"
        },
        {
            name: "Friend 14",
            username: "friend14", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid14"
        },
        {
            name: "Friend 15",
            username: "friend15", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid15"
        },
        {
            name: "Friend 16",
            username: "friend16", // Fixed username
            profilePhoto: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
            uuid: "frienduuid16"
        }
    ]

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFriends, setFilteredFriends] = useState(testData);
    const {user} = useAuth();
    const {id} = useLocalSearchParams();

    const [invitationModalOpen, setInvitationModalOpen] = useState(false);
    const [getUserData, { loading: profileLoading, error: profileError, data: profile, refetch: refetchProfile }] = useLazyQuery(GET_PROFILE);
    const [addFriend, {loading: friendLoading, error: friendError, data: friendData}] = useMutation(CREATE_RELATIONSHIP);

    useEffect(() => {
        if (id) {
            setInvitationModalOpen(true);
        }
    }, [id]);

    const acceptFriendRequest = () => {
        addFriend({variables: {
                relationshipData: {firstUserId: user.uid, secondUserId: id}
            }}).then((res) => {
            setInvitationModalOpen(false);
        })
    }

    const handleInvitation = () => {
        const invitationURL = createURL("friends", {
            queryParams: {id: user.uid}
        })

        Share.open({message: "Invite friends to BiteBook!", title: "BiteBook Invitation", url: invitationURL})
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }

    // The search function that filters by name or username - Fixed for React Native
    const handleSearch = (text: any) => {
        // Update the search term state
        setSearchTerm(text);

        // Filter friends based on the search term
        if (!text.trim()) {
            setFilteredFriends(testData);
            return;
        }

        const term = text.toLowerCase();
        const results = testData.filter(friend => {
            // Check if name exists before calling toLowerCase()
            const nameMatch = friend.name ? friend.name.toLowerCase().includes(term) : false;

            // Check if username exists before calling toLowerCase()
            const usernameMatch = friend.username ? friend.username.toLowerCase().includes(term) : false;

            return nameMatch || usernameMatch;
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
                    "#141f30", "#151d2e", "#161b2c", "#171a2a", "#181928", "#181826", "#1a1923", "#1a1921", "#1a181f", "#1a181d", "#19181b", "#181719"
                ]}
                locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
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
                    <Alert className="p-5 flex justify-between mt-28">
                        <AlertText size='lg'>
                            Invite friends to join you in BiteBook!
                        </AlertText>
                        <AlertIcon as={ExternalLinkIcon}></AlertIcon>
                    </Alert>
                </Pressable>
                <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px] mt-5" size="3xl">
                    Friends
                </Text>
                <Input
                    size="lg"
                    className="p-3"
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

                <ScrollView className="h-[50vh] max-h-[50vh] w-full mt-3">
                    {
                        filteredFriends.map(user => (
                            <HStack space="md" className="mt-5" key={user.uuid}>
                                <Avatar>
                                    <AvatarFallbackText>{user.name.substring(0, 2).toUpperCase()}</AvatarFallbackText>
                                    <AvatarImage
                                        source={{
                                            uri: user.profilePhoto,
                                        }}
                                    />
                                </Avatar>
                                <VStack>
                                    <Heading size="sm">{user.name}</Heading>
                                    <Text size="sm">@{user.username}</Text>
                                </VStack>
                            </HStack>
                        ))
                    }

                    {filteredFriends.length === 0 && (
                        <VStack className="py-8 items-center justify-center">
                            <Text className="text-gray-400 text-center">
                                No friends found matching "{searchTerm}"
                            </Text>
                        </VStack>
                    )}
                </ScrollView>

                <Text className="text-gray-400 text-sm mt-4">
                    Showing {filteredFriends.length} of {testData.length} friends
                </Text>
            </VStack>
        </View>
    );
}