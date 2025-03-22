import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

// Set persistence based on platform
const persistence = Platform.OS === "web" 
  ? browserLocalPersistence 
  : getReactNativePersistence(ReactNativeAsyncStorage);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, { persistence });

export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);