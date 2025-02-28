import {View, Text, SafeAreaView, TouchableOpacity, TextInput} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
// import { Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import {LinearGradient} from "expo-linear-gradient";
import { Input, InputField } from "@/components/ui/input"
import PhoneInput from "react-native-phone-number-input";
import {VStack} from "@/components/ui/vstack";
import {HStack} from "@/components/ui/hstack";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useFonts} from "expo-font";
import { OtpInput } from "react-native-otp-entry";

const PhoneSignIn = () => {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    // verification code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const phoneInput = useRef<PhoneInput>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    // Load custom font
    const [loaded, error] = useFonts({
        'Rashfield': require('assets/fonts/VVDSRashfield-Normal.ttf'),
    });

    // Handle login
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
            await confirm.confirm(code);
        } catch (error) {
            console.log('Invalid code.');
        }
    }

    if(!user) {
        if (!confirm) {
            return (
                <SafeAreaView className="bg-background-dark px-5 lg:px-40"
                    style={{
                    flex: 1,
                    justifyContent: "center",
                    width: "100%",
                }}>
                    <LinearGradient
                        colors={[
                        "#232d37", "#232b34", "#222832", "#22262f", "#21242c",
                        "#202229", "#1f2027", "#1e1e24", "#1d1c21", "#1b1a1e",
                        "#1a191c", "#181719"
                        ]}
                        locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
                        start={{x: 1, y: 0}}
                        end={{x: 0, y: 1}}
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
                    <VStack className="items-center">
                        <VStack space="3xl">
                            <Text
                                className="font-[Rashfield] leading-[69px] lg:leading-[55px] text-white"
                                size="6xl"
                            >
                                Phone Sign In
                            </Text>
                            <PhoneInput
                                ref={phoneInput}
                                defaultValue={phoneNumber}
                                defaultCode="US"
                                layout="first"
                                onChangeFormattedText={(text) => {
                                    setPhoneNumber(text);
                                }}
                                autoFocus
                                withDarkTheme
                                containerStyle={{borderRadius: "5%"}}
                                textContainerStyle={{borderRadius: "5%"}}
                            />
                            <Button
                                className="rounded-xl font-[Rashfield]"
                                size="xl"
                                variant="solid"
                                action="primary"
                                onPress={() => signInWithPhoneNumber(phoneNumber)}
                            >
                                <ButtonText>Sign in</ButtonText>
                            </Button>
                        </VStack>
                    </VStack>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView className="bg-background-dark px-5 lg:px-40"
                          style={{
                              flex: 1,
                              justifyContent: "center",
                              width: "100%",
                          }}>
                <LinearGradient
                    colors={[
                        "#232d37", "#232b34", "#222832", "#22262f", "#21242c",
                        "#202229", "#1f2027", "#1e1e24", "#1d1c21", "#1b1a1e",
                        "#1a191c", "#181719"
                    ]}
                    locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 1}}
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
                <VStack className="items-center">
                    <VStack space="3xl">
                        <OtpInput numberOfDigits={6} focusColor="orange" onFilled={(inputCode) => setCode(inputCode)} theme={{
                            pinCodeTextStyle: {color: "white"}
                        }}/>
                        <Button className="rounded-xl font-[Rashfield]"
                                size="xl"
                                variant="solid"
                                action="primary" onPress={() => confirmCode()}>
                            <ButtonText>Confirm Code</ButtonText>
                        </Button>
                    </VStack>
                </VStack>
            </SafeAreaView>
        );
    }

    return (
        <View>
            <Text>Welcome {user.email}</Text>
            <TouchableOpacity onPress={() => auth().signOut()}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PhoneSignIn