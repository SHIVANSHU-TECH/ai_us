import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Admin SDK + service account must never run in the browser bundle.
if (typeof window !== "undefined") {
  throw new Error("firebase-admin is server-only");
}

function loadServiceAccount(): ServiceAccount | null {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (fromEnv) {
    try {
      return JSON.parse(fromEnv) as ServiceAccount;
    } catch {
      console.error("[firebase-admin] Invalid service account JSON in env");
      return null;
    }
  }

  const path =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ||
    join(process.cwd(), "usemeai.json");

  if (!existsSync(path)) return null;

  try {
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    console.error("[firebase-admin] Failed to read service account file");
    return null;
  }
}

function getAdminApp(): App | null {
  if (getApps().length) return getApps()[0]!;

  const sa = loadServiceAccount();
  if (!sa) return null;

  return initializeApp({
    credential: cert(sa),
    projectId: sa.projectId || (sa as { project_id?: string }).project_id,
  });
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(loadServiceAccount());
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export async function verifyIdToken(idToken: string) {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return await getAuth(app).verifyIdToken(idToken);
  } catch {
    return null;
  }
}
