"use client";

import { useEffect, type ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { initFirebaseAnalytics } from "@/lib/firebase/analytics";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
