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

                return auth().signInWithCredential(googleCredential)
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
        checkUserExistance: async () => {
            const usernameQuery = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(usernameQuery);

            return !querySnapshot.empty;
        },
        createUserDB: async (username) => {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: username,
                profilePicture: "",
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