import { getAdminDb } from "@/lib/firebase/admin";
import type {
  ChatMode,
  StoredMessage,
  UserInsightSummary,
} from "@/lib/firebase/types";

export async function ensureUserProfile(input: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}) {
  const db = getAdminDb();
  if (!db) return;

  const ref = db.collection("users").doc(input.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      knownName: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return;
  }

  await ref.set(
    {
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function getUserChatMeta(uid: string): Promise<{
  knownName: string | null;
  namePrompted: boolean;
}> {
  const db = getAdminDb();
  if (!db) return { knownName: null, namePrompted: false };
  const snap = await db.collection("users").doc(uid).get();
  const data = snap.data();
  return {
    knownName: typeof data?.knownName === "string" ? data.knownName : null,
    namePrompted: Boolean(data?.namePrompted),
  };
}

export async function getKnownName(uid: string): Promise<string | null> {
  const meta = await getUserChatMeta(uid);
  return meta.knownName;
}

export async function setKnownName(uid: string, name: string) {
  const db = getAdminDb();
  if (!db) return;
  await db.collection("users").doc(uid).set(
    {
      knownName: name,
      namePrompted: true,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function markNamePrompted(uid: string) {
  const db = getAdminDb();
  if (!db) return;
  await db.collection("users").doc(uid).set(
    {
      namePrompted: true,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

export async function appendConversationMessages(input: {
  uid: string;
  conversationId: string;
  mode: ChatMode;
  messages: StoredMessage[];
}) {
  const db = getAdminDb();
  if (!db) return;

  const ref = db.collection("conversations").doc(input.conversationId);
  const existing = await ref.get();
  const prevCount =
    typeof existing.data()?.messageCount === "number"
      ? (existing.data()!.messageCount as number)
      : 0;

  await ref.set(
    {
      uid: input.uid,
      mode: input.mode,
      updatedAt: Date.now(),
      createdAt: existing.exists
        ? existing.data()?.createdAt || Date.now()
        : Date.now(),
      messageCount: prevCount + input.messages.length,
    },
    { merge: true }
  );

  const batch = db.batch();
  for (const msg of input.messages) {
    const msgRef = ref.collection("messages").doc(msg.id);
    batch.set(msgRef, msg, { merge: true });
  }
  await batch.commit();
}

export async function saveUserInsight(
  uid: string,
  summary: UserInsightSummary
) {
  const db = getAdminDb();
  if (!db) return;
  await db.collection("userInsights").doc(uid).set(summary, { merge: true });
}

export async function saveToolRequest(input: {
  uid: string | null;
  emailFromAuth: string | null;
  name: string;
  toolsWanted: string;
  email: string;
  positionCompany: string;
  problem: string;
  source?: "resume" | "consult";
}) {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase admin is not configured");

  const ref = db.collection("toolRequests").doc();
  await ref.set({
    id: ref.id,
    uid: input.uid,
    emailFromAuth: input.emailFromAuth,
    name: input.name,
    toolsWanted: input.toolsWanted,
    email: input.email,
    positionCompany: input.positionCompany,
    problem: input.problem,
    source: input.source || "resume",
    createdAt: Date.now(),
    status: "new",
  });
  return ref.id;
}
