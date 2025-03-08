import {View, Text} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {LinearGradient} from "expo-linear-gradient";
import PhoneInput from "react-native-phone-number-input";
import {VStack} from "@/components/ui/vstack";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {useFonts} from "expo-font";
import { OtpInput } from "react-native-otp-entry";
import {useRouter} from "expo-router";
import {useAuth} from "@/configs/authProvider";

const PhoneSignIn = () => {
    // Verification Code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');

    const phoneInput = useRef<PhoneInput>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    const {user, confirm, signInWithPhoneNumber, confirmPhoneNumberCode, checkUserExistance} = useAuth();

    const router = useRouter();

    // Load custom font
    const [loaded, error] = useFonts({
        'Rashfield': require('assets/fonts/VVDSRashfield-Normal.ttf'),
    });

    useEffect(() => {
        checkUserExistance().then((userExists: boolean) => {
            if (userExists) {
                router.replace("/(app)/(tabs)");
            } else {
                router.push("/phone-sign-up")
            }
        })
    }, [user]);

    return (
        <View
            className="bg-background-dark px-5 lg:px-40"
            style={{
                flex: 1,
                justifyContent: "center",
                width: "100%",
            }}
        >
            <LinearGradient
                colors={[
                    "#181719", "#1b181c", "#1e181e", "#221820",
                    "#261821", "#2a1821", "#2e1820", "#32191f",
                    "#36191d", "#39191a", "#3b1a17", "#3d1c13"
                ]}
                locations={[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />
            <VStack space="xs">
                {/* Heading */}
                <VStack space="xs">
                    <Text className="font-[Rashfield] leading-[69px] lg:leading-[55px] text-white text-5xl">
                        {
                            !confirm ? "Phone Sign In" : "Confirm Code"
                        }
                    </Text>
                    <Text className="text-white text-xl mb-8">
                        {
                            !confirm ? "Please input your phone number to sign in." : "Please check your messages in the phone number provided and input the code."
                        }
                    </Text>
                </VStack>
                {
                    !confirm ?
                        <>
                            <VStack space="3xl">
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
                                    containerStyle={{borderRadius: "5%", width: "100%"}}
                                    textContainerStyle={{borderRadius: "5%"}}
                                />
                                <Button
                                    className="rounded-xl font-[Rashfield]"
                                    size="xl"
                                    variant="solid"
                                    action="primary"
                                    onPress={async () => {
                                        await signInWithPhoneNumber(phoneNumber)
                                    }}
                                >
                                    <ButtonText>Sign In</ButtonText>
                                </Button>
                            </VStack>
                        </>
                        :
                        <>
                        <VStack space="4xl">
                            <OtpInput numberOfDigits={6} focusColor="orange"
                                        onFilled={(inputCode) => setCode(inputCode)} theme={{
                                pinCodeTextStyle: {color: "white"}
                            }}/>
                            <Button className="rounded-xl font-[Rashfield]"
                                    size="xl"
                                    variant="solid"
                                    action="primary" onPress={async () => {
                                await confirmPhoneNumberCode(code)
                            }}>
                                <ButtonText>Done!</ButtonText>
                            </Button>
                        </VStack>
                        </>
                }
            </VStack>
        </View>
    )
}

export default PhoneSignIn