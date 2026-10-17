"use client";

import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  getFirebaseApp,
  isFirebaseClientConfigured,
} from "@/lib/firebase/client";

let analytics: Analytics | null = null;
let started = false;

/** Start Firebase / Google Analytics once in the browser. */
export async function initFirebaseAnalytics(): Promise<void> {
  if (started || typeof window === "undefined") return;
  if (!isFirebaseClientConfigured()) return;
  started = true;

  try {
    const ok = await isSupported();
    if (!ok) return;
    analytics = getAnalytics(getFirebaseApp());
  } catch {
    started = false;
  }
}

export function getFirebaseAnalytics(): Analytics | null {
  return analytics;
}
