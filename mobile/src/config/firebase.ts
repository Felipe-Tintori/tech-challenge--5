import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import { Platform } from "react-native";

const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
} = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const isNew = getApps().length === 0;
export const firebaseApp = isNew ? initializeApp(firebaseConfig) : getApp();

if (isNew) {
  if (Platform.OS === "web") {
    // Web: use browser localStorage persistence
    initializeAuth(firebaseApp, { persistence: browserLocalPersistence });
  } else {
    // Native: use AsyncStorage persistence
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getReactNativePersistence } = require("firebase/auth");
    initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
