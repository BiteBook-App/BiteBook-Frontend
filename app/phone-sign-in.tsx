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
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert"
import {ArrowLeftIcon, Icon, InfoIcon} from "@/components/ui/icon"

const PhoneSignIn = () => {
    // Verification Code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');

    const phoneInput = useRef<PhoneInput>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    // Errors
    const [phoneNumberError, setphoneNumberError] = useState(false);
    const [verificationError, setVerificationError] = useState(false);

    const {user, confirm, signInWithPhoneNumber, confirmPhoneNumberCode, checkUserExistance} = useAuth();

    const router = useRouter();

    // Load custom font
    const [loaded, error] = useFonts({
        'Rashfield': require('assets/fonts/VVDSRashfield-Normal.ttf'),
    });

    const handlePhoneEntry = async () => {
        if(phoneInput.current.isValidNumber(phoneNumber)) {
            try{
                await signInWithPhoneNumber(phoneNumber);
            }
            catch (e) {
                setphoneNumberError(true);
            }
        }
        else {
            setphoneNumberError(true);
        }
    }

    const handleCodeConfirmation = async () => {
        try {
            await confirmPhoneNumberCode(code)
        }
        catch (e) {
            setVerificationError(true);
        }
    }

    useEffect(() => {
        checkUserExistance().then((userExists) => {
            if (userExists) {
                router.navigate("/home");
            } else {
                router.navigate("/phone-sign-up")
            }
        })
    }, [user]);

    return (
        <View
            className="bg-background-dark px-5 lg:px-40"
            style={{
                flex: 1,
                justifyContent: "center",
                width: "100%"
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
                    bottom: 0
                }}
            />
                <Button size="xl" style={{position: "absolute", left: 20, top: 100,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'}} onPress={() => {router.back()}}>
                    <ButtonIcon as={ArrowLeftIcon} style={{color: "white"}}/>
                </Button>
            <VStack space="3xl">
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
                                {
                                    phoneNumberError ?
                                    <Alert action="error" variant="solid">
                                        <AlertIcon as={InfoIcon} />
                                        <AlertText>Phone Number is not valid. Please try again.</AlertText>
                                    </Alert>
                                    : null
                                }
                                <Button
                                    className="rounded-xl font-[Rashfield]"
                                    size="xl"
                                    variant="solid"
                                    action="primary"
                                    onPress={handlePhoneEntry}
                                >
                                    <ButtonText>Sign In</ButtonText>
                                </Button>
                            </VStack>
                        </>
                        :
                        <>
                            <OtpInput numberOfDigits={6} focusColor="orange"
                                      onFilled={(inputCode) => setCode(inputCode)} theme={{
                                pinCodeTextStyle: {color: "white"}
                            }}/>
                            {
                                verificationError ?
                                    <Alert action="error" variant="solid">
                                        <AlertIcon as={InfoIcon} />
                                        <AlertText>Something went wrong. Please try again.</AlertText>
                                    </Alert>
                                    : null
                            }
                            <Button className="rounded-xl font-[Rashfield]"
                                    size="xl"
                                    variant="solid"
                                    action="primary" onPress={handleCodeConfirmation}>
                                <ButtonText>Done!</ButtonText>
                            </Button>
                        </>
                }
            </VStack>
        </View>
    )
}

export default PhoneSignIn