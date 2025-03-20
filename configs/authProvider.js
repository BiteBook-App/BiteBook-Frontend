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
        db,
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
                console.error("Unable to sign in with Google. Error: ", error);
                throw error;
            }
        },
        signInWithPhoneNumber: async (phoneNumber) => {
            try {
                const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
                setConfirm(confirmation);
            }
            catch (error) {
                console.log(`Unable to sign in with phone number. Error: ${error}`);
                throw error;
            }
        },
        confirmPhoneNumberCode: async (code) => {
            try {
                await confirm.confirm(code);
                setConfirm(null);
            } catch (error) {
                console.log(`Unable to confirm code. Error: ${error}`);
                throw error;
            }
        },
        register: async (email, password) => {
            try {
                const userCredential = await auth().createUserWithEmailAndPassword(email, password);
                console.log("User registered successfully");
                return userCredential.user;
            } catch (error) {
                console.error("Registration error:", error.code, error.message);
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
        checkDuplicateUsername: async (username) => {
            const usernameQuery = query(collection(db, "users"), where("displayName", "==", username));
            console.log(username);
            const querySnapshot = await getDocs(usernameQuery);
            console.log(querySnapshot)

            return !querySnapshot.empty;
        },
        createUserDB: async (username, uid = null, profilePicture = "") => {
            const userId = uid || user?.uid;
            if (!userId) {
                console.error("Error: No valid UID found for user.");
                return;
            }
            await setDoc(doc(db, "users", userId), {
                uid: userId,
                displayName: username,
                profilePicture: profilePicture,
                createdAt: serverTimestamp(),
            });
        },
        getUserProfile: async () => {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            try {
              const querySnapshot = await getDocs(q);

              if (querySnapshot.empty) {
                console.log("No user found.");
                return null; // Return null if no user is found
              }

              const userData = querySnapshot.docs[0].data();
              return {
                displayName: userData.displayName,
                profilePicture: userData.profilePicture,
              };

            } catch (error) {
              console.error("Error fetching user data:", error);
              return null; // Return null in case of an error
            }
        },
        deleteUser: async () => {
            try {
                // Delete user with associated uid from all collections
                const userCollections = ["users"];
                for (const col of userCollections) {
                    await deleteDoc(doc(db, col, user.uid));
                }

                // Delete user from Firebase Authentication
                await deleteUser(user);

                setUser(null);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
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