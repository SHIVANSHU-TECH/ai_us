import { NextResponse } from "next/server";
import { getFirebaseAdminStatus } from "@/lib/firebase/admin";

export const runtime = "nodejs";

/** Safe health check — no secrets. Use to verify Vercel Admin / Firestore wiring. */
export async function GET() {
  const status = getFirebaseAdminStatus();
  return NextResponse.json({
    ok: status.configured,
    source: status.source,
    projectId: status.projectId,
    error: status.error,
    hint: status.configured
      ? "Admin ready. Signed-in chats should write to users / conversations / userInsights."
      : "Add FIREBASE_SERVICE_ACCOUNT_JSON on Vercel (full usemeai.json as one line, or base64). Then redeploy.",
  });
}
