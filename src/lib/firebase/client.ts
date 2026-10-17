import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { rememberGoogleAccount } from "@/lib/firebase/saved-accounts";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured()) {
    throw new Error("Sign-in is unavailable right now.");
  }
  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

export function getClientAuth() {
  return getAuth(getFirebaseApp());
}

export function getClientDb() {
  return getFirestore(getFirebaseApp());
}

function rememberFromUser(user: User) {
  rememberGoogleAccount({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });
}

/**
 * Sign in with Google.
 * - With loginHint: targets that account (skips full account-chooser when possible).
 * - pickAccount: shows Google account list (only for "Use another account").
 */
export async function signInWithGoogle(options?: {
  loginHint?: string;
  pickAccount?: boolean;
}): Promise<User> {
  const auth = getClientAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");

  const params: Record<string, string> = {};
  if (options?.loginHint) {
    // Targets one account — skips the multi-account chooser when Chrome session exists.
    params.login_hint = options.loginHint;
  } else if (options?.pickAccount) {
    params.prompt = "select_account";
  }
  if (Object.keys(params).length) {
    provider.setCustomParameters(params);
  }

  const result = await signInWithPopup(auth, provider);
  rememberFromUser(result.user);
  return result.user;
}

/** Complete sign-in from Google Identity Services ID token (no account modal). */
export async function signInWithGoogleIdToken(idToken: string): Promise<User> {
  const auth = getClientAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  rememberFromUser(result.user);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(getClientAuth());
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getClientAuth(), callback);
}
