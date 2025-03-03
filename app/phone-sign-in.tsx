import {View, Text, SafeAreaView, TouchableOpacity, TextInput} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
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
import {useRouter} from "expo-router";
import {useAuth} from "@/configs/authProvider";

const PhoneSignIn = () => {
    // Verification Code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');

    const phoneInput = useRef<PhoneInput>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    const {user, confirm, signInWithPhoneNumber, confirmPhoneNumberCode} = useAuth();

    const router = useRouter();

    // Load custom font
    const [loaded, error] = useFonts({
        'Rashfield': require('assets/fonts/VVDSRashfield-Normal.ttf'),
    });

    // If user already exits, go to Home page
    if(user) {
        router.navigate("/home");
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
                    {
                        !confirm ?
                            <>
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
                            </>
                            :
                            <>
                                <OtpInput numberOfDigits={6} focusColor="orange" onFilled={(inputCode) => setCode(inputCode)} theme={{
                                    pinCodeTextStyle: {color: "white"}
                                }}/>
                                <Button className="rounded-xl font-[Rashfield]"
                                        size="xl"
                                        variant="solid"
                                        action="primary" onPress={() => confirmPhoneNumberCode(code)}>
                                    <ButtonText>Confirm Code</ButtonText>
                                </Button>
                            </>
                    }
                </VStack>
            </VStack>
        </SafeAreaView>
    )
}

export default PhoneSignIn