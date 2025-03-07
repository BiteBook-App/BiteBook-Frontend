import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {collection, doc, getDocs, query, serverTimestamp, setDoc, where} from "firebase/firestore";
import {FIREBASE_DB} from "@/configs/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    GoogleSignin.configure({
        webClientId: '41319305564-lkglp2v2m1n55avq36hl5ffm43ptgm5n.apps.googleusercontent.com',
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // For Phone Number Method
    const [confirm, setConfirm] = useState(null);

    const db = FIREBASE_DB;

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        confirm,
        login: async (email, password) => {
            try {
                await auth().signInWithEmailAndPassword(email, password);
            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
        },
        signInWithGoogle: async () => {
            try{
                await GoogleSignin.hasPlayServices();
                const response = await GoogleSignin.signIn();

                const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);

                const userCredential = await auth().signInWithCredential(googleCredential);

                if (userCredential && userCredential.additionalUserInfo.isNewUser) {
                    console.log("New User logged in.")
                    const username = userCredential.user.email.split("@")[0];
                    const profilePicture = userCredential.user.photoURL;

                    await value.createUserDB(username, profilePicture, userCredential.user.uid);

                    console.log("New User from Google Sign In Created.")
                }
            }
            catch (error) {
                console.error("Google Sign In error:", error);
                throw error;
            }
        },
        signInWithPhoneNumber: async (phoneNumber) => {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        },
        confirmPhoneNumberCode: async (code) => {
            try {
                await confirm.confirm(code);
                setConfirm(null);
            } catch (error) {
                console.log('Invalid code.');
            }
        },
        register: async (email, password) => {
            try {
                await auth().createUserWithEmailAndPassword(email, password);
            } catch (error) {
                console.error("Registration error:", error);
                throw error;
            }
        },
        signOut: async () => {
            try {
                await auth().signOut();
                setUser(null)
            } catch (error) {
                console.error("Logout error:", error);
            }
        },
        checkUserExistance: async (uid = "") => {
            let userUID = uid;

            if (userUID === "") {
                userUID = user.uid;
            }

            const usernameQuery = query(collection(db, "users"), where("uid", "==", userUID));
            const querySnapshot = await getDocs(usernameQuery);

            return !querySnapshot.empty;
        },
        createUserDB: async (username, profilePicture = "", uid = "") => {
            let userUID = uid;

            if (userUID === "") {
                userUID = user.uid;
            }

            await setDoc(doc(db, "users", userUID), {
                uid: userUID,
                displayName: username,
                profilePicture: profilePicture,
                createdAt: serverTimestamp(),
            });
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};