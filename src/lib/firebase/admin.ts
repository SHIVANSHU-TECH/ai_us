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

type SaRecord = ServiceAccount & {
  project_id?: string;
  client_email?: string;
  private_key?: string;
  privateKey?: string;
};

let cachedSa: SaRecord | null | undefined;
let cachedApp: App | null | undefined;
let lastLoadError: string | null = null;

function normalizeServiceAccount(raw: SaRecord): SaRecord {
  const privateKey = (raw.private_key || raw.privateKey || "").replace(
    /\\n/g,
    "\n"
  );
  return {
    ...raw,
    projectId: raw.projectId || raw.project_id,
    clientEmail: raw.clientEmail || raw.client_email,
    privateKey,
    // Keep snake_case too — cert() accepts either shape from JSON files
    project_id: raw.project_id || raw.projectId,
    client_email: raw.client_email || raw.clientEmail,
    private_key: privateKey,
  };
}

function loadServiceAccount(): SaRecord | null {
  if (cachedSa !== undefined) return cachedSa;

  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (fromEnv) {
    try {
      // Support raw JSON or base64(JSON) for easier Vercel pasting
      let jsonText = fromEnv;
      if (!fromEnv.startsWith("{")) {
        jsonText = Buffer.from(fromEnv, "base64").toString("utf8");
      }
      cachedSa = normalizeServiceAccount(JSON.parse(jsonText) as SaRecord);
      lastLoadError = null;
      return cachedSa;
    } catch {
      lastLoadError = "Invalid FIREBASE_SERVICE_ACCOUNT_JSON";
      console.error("[firebase-admin]", lastLoadError);
      cachedSa = null;
      return null;
    }
  }

  const path =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ||
    join(process.cwd(), "usemeai.json");

  if (!existsSync(path)) {
    lastLoadError = "No service account file or FIREBASE_SERVICE_ACCOUNT_JSON";
    cachedSa = null;
    return null;
  }

  try {
    const raw = readFileSync(path, "utf8");
    cachedSa = normalizeServiceAccount(JSON.parse(raw) as SaRecord);
    lastLoadError = null;
    return cachedSa;
  } catch {
    lastLoadError = "Failed to read service account file";
    console.error("[firebase-admin]", lastLoadError);
    cachedSa = null;
    return null;
  }
}

function getAdminApp(): App | null {
  if (cachedApp !== undefined) return cachedApp;
  if (getApps().length) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }

  const sa = loadServiceAccount();
  if (!sa) {
    cachedApp = null;
    return null;
  }

  try {
    cachedApp = initializeApp({
      credential: cert(sa as ServiceAccount),
      projectId: sa.projectId || sa.project_id,
    });
    return cachedApp;
  } catch (err) {
    lastLoadError =
      err instanceof Error ? err.message.slice(0, 120) : "Admin init failed";
    console.error("[firebase-admin] init failed");
    cachedApp = null;
    return null;
  }
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(loadServiceAccount());
}

/** Safe status for debugging (no secrets). */
export function getFirebaseAdminStatus(): {
  configured: boolean;
  source: "env" | "file" | "none";
  projectId: string | null;
  error: string | null;
} {
  const fromEnv = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim());
  const sa = loadServiceAccount();
  return {
    configured: Boolean(sa),
    source: sa ? (fromEnv ? "env" : "file") : "none",
    projectId: sa?.projectId || sa?.project_id || null,
    error: sa ? null : lastLoadError,
  };
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : "verify failed";
    console.error("[firebase-admin] verifyIdToken:", msg.slice(0, 120));
    return null;
  }
}
