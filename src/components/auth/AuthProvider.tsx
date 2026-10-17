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
  getClientAuth,
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
  /** Triggers Firebase Google popup (used by chat login gate). */
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
    // Read latest user from auth — avoids stale closure when called right after login.
    const current = getClientAuth().currentUser;
    if (!current) return null;
    const token = await current.getIdToken(true);
    setIdToken(token);
    return token;
  }, []);

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
