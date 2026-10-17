"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  isFirebaseClientConfigured,
  signInWithGoogle,
  signInWithGoogleIdToken,
  signOutUser,
  subscribeAuth,
} from "@/lib/firebase/client";
import { rememberGoogleAccount } from "@/lib/firebase/saved-accounts";

export interface SignInOptions {
  loginHint?: string;
  pickAccount?: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  idToken: string | null;
  signIn: (options?: SignInOptions) => Promise<void>;
  signInWithIdToken: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  openAuthMenu: () => void;
  authMenuNonce: number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [authMenuNonce, setAuthMenuNonce] = useState(0);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsub = subscribeAuth(async (next) => {
      setUser(next);
      if (next) {
        rememberGoogleAccount({
          email: next.email,
          displayName: next.displayName,
          photoURL: next.photoURL,
        });
        const token = await next.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  const signIn = useCallback(async (options?: SignInOptions) => {
    await signInWithGoogle(options);
  }, []);

  const signInWithIdToken = useCallback(async (idTokenValue: string) => {
    await signInWithGoogleIdToken(idTokenValue);
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
  }, []);

  const refreshToken = useCallback(async () => {
    if (!user) return null;
    const token = await user.getIdToken(true);
    setIdToken(token);
    return token;
  }, [user]);

  const openAuthMenu = useCallback(() => {
    setAuthMenuNonce((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      idToken,
      signIn,
      signInWithIdToken,
      signOut,
      refreshToken,
      openAuthMenu,
      authMenuNonce,
    }),
    [
      user,
      loading,
      configured,
      idToken,
      signIn,
      signInWithIdToken,
      signOut,
      refreshToken,
      openAuthMenu,
      authMenuNonce,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
