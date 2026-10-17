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
  signInWithGooglePopup,
  signOutUser,
  subscribeAuth,
} from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  idToken: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsub = subscribeAuth(async (next) => {
      setUser(next);
      if (next) {
        const token = await next.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  const signIn = useCallback(async () => {
    await signInWithGooglePopup();
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

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      idToken,
      signIn,
      signOut,
      refreshToken,
    }),
    [user, loading, configured, idToken, signIn, signOut, refreshToken]
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
