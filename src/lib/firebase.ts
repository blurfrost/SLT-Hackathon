import { getApp, getApps, initializeApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let analyticsInstance: Analytics | null = null;

export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (Platform.OS !== "web") {
    return null;
  }

  if (analyticsInstance) {
    return analyticsInstance;
  }

  const { getAnalytics, isSupported } = await import("firebase/analytics");
  const analyticsSupported = await isSupported().catch(() => false);

  if (!analyticsSupported) {
    return null;
  }

  analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}
