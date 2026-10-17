import { NextResponse } from "next/server";
import { verifyIdToken, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { saveToolRequest } from "@/lib/chat-persistence";
import { safeError } from "@/lib/safe-log";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Could not save request right now. Please try again later." },
        { status: 503 }
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body.name || "").trim();
    const toolsWanted = String(body.toolsWanted || "").trim();
    const email = String(body.email || "").trim();
    const positionCompany = String(body.positionCompany || "").trim();
    const problem = String(body.problem || "").trim();
    const source = body.source === "consult" ? "consult" : "resume";

    if (!name || !toolsWanted || !email || !positionCompany || !problem) {
      return NextResponse.json(
        { error: "Please fill all fields." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const decoded = token ? await verifyIdToken(token) : null;

    await saveToolRequest({
      uid: decoded?.uid || null,
      emailFromAuth: decoded?.email || null,
      name: name.slice(0, 120),
      toolsWanted: toolsWanted.slice(0, 300),
      email: email.slice(0, 200),
      positionCompany: positionCompany.slice(0, 200),
      problem: problem.slice(0, 2000),
      source,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    safeError("tool-request", error);
    return NextResponse.json({ error: "Could not save request." }, { status: 500 });
  }
}
