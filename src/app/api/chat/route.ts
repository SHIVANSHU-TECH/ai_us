import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  boundHistory,
  detectRelatedProjects,
  MAX_MESSAGE_LENGTH,
  type ChatRole,
} from "@/lib/chat";
import { getSystemPrompt } from "@/lib/system-prompt";
import { getConsultSystemPrompt } from "@/lib/consult-prompt";
import { buildConversationDirectives } from "@/lib/prompt-extras";
import {
  isFirebaseAdminConfigured,
  verifyIdToken,
} from "@/lib/firebase/admin";
import {
  appendConversationMessages,
  ensureUserProfile,
  getUserChatMeta,
  markNamePrompted,
  saveUserInsight,
  setKnownName,
} from "@/lib/chat-persistence";
import {
  buildInsightSummary,
  extractPossibleName,
  shouldShowToolForm,
} from "@/lib/insights";
import { createMessage } from "@/lib/chat";
import { safeError } from "@/lib/safe-log";
import {
  FREE_CHAT_COOKIE,
  FREE_CHAT_LIMIT,
  parseFreeCount,
} from "@/lib/free-chat";

export const runtime = "nodejs";

const GROQ_CHAT_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
] as const;

const GROQ_MODEL =
  process.env.GROQ_MODEL?.trim() || GROQ_CHAT_MODELS[0];

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
  mode?: unknown;
  conversationId?: unknown;
  userMessageCount?: unknown;
  namePrompted?: unknown;
  knownName?: unknown;
}

function isConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

function extractAnswer(completion: {
  choices?: Array<{ message?: { content?: string | null } | null } | null>;
}): string {
  return (
    completion.choices?.[0]?.message?.content?.trim() ||
    "I could not generate a response. Please try again."
  );
}

export async function POST(req: Request) {
  try {
    if (!isConfigured()) {
      return NextResponse.json(
        {
          error:
            "The AI service is temporarily unavailable. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    let body: ChatRequestBody;
    try {
      body = (await req.json()) as ChatRequestBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const mode = body.mode === "consult" ? "consult" : "resume";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const conversationId =
      typeof body.conversationId === "string" && body.conversationId.trim()
        ? body.conversationId.trim().slice(0, 80)
        : `anon-${Date.now()}`;

    const userMessageCount = Math.max(
      1,
      Math.min(
        200,
        typeof body.userMessageCount === "number"
          ? Math.floor(body.userMessageCount)
          : 1
      )
    );

    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const decoded =
      idToken && isFirebaseAdminConfigured()
        ? await verifyIdToken(idToken)
        : null;

    // Soft paywall: 3 free anonymous messages, then Google login required.
    const cookieHeader = req.headers.get("cookie") || "";
    const freeCookieMatch = cookieHeader.match(
      new RegExp(`(?:^|;\\s*)${FREE_CHAT_COOKIE}=(\\d+)`)
    );
    const freeUsed = parseFreeCount(freeCookieMatch?.[1]);
    if (!decoded && freeUsed >= FREE_CHAT_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Please login with Google to continue the chat. You have used your 3 free messages.",
          code: "LOGIN_REQUIRED",
        },
        { status: 401 }
      );
    }

    let knownName: string | null =
      typeof body.knownName === "string" && body.knownName.trim()
        ? body.knownName.trim().slice(0, 40)
        : null;
    let namePrompted = body.namePrompted === true;

    if (decoded?.uid && isFirebaseAdminConfigured()) {
      await ensureUserProfile({
        uid: decoded.uid,
        email: decoded.email || null,
        displayName: decoded.name || null,
        photoURL: (decoded as { picture?: string }).picture || null,
      });
      const meta = await getUserChatMeta(decoded.uid);
      if (meta.knownName) knownName = meta.knownName;
      if (meta.namePrompted) namePrompted = true;
    }

    const maybeName = extractPossibleName(message, namePrompted);
    if (maybeName) {
      knownName = maybeName;
      namePrompted = true;
      if (decoded?.uid) {
        await setKnownName(decoded.uid, maybeName);
      }
    }

    const shouldAskName =
      !knownName &&
      !namePrompted &&
      userMessageCount >= 3 &&
      userMessageCount <= 10;

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = boundHistory(
      rawHistory.map((item) => {
        const row = item as { role?: unknown; content?: unknown };
        return {
          role: (row.role === "assistant" ? "assistant" : "user") as ChatRole,
          content: typeof row.content === "string" ? row.content : "",
        };
      })
    ).slice(-6);

    const baseSystem =
      mode === "consult"
        ? getConsultSystemPrompt()
        : getSystemPrompt(message);

    const system = `${baseSystem}\n${buildConversationDirectives({
      knownName,
      userMessageCount,
      mode,
      shouldAskName,
    })}`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const messages = [
      { role: "system" as const, content: system },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: message },
    ];

    const modelCandidates = [
      GROQ_MODEL,
      ...GROQ_CHAT_MODELS.filter((m) => m !== GROQ_MODEL),
    ];

    let answer = "";
    let usedModel = GROQ_MODEL;
    let lastError: unknown;

    for (const model of modelCandidates) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          temperature: mode === "consult" ? 0.45 : 0.4,
          max_tokens: mode === "consult" ? 420 : 360,
          messages,
        });
        answer = extractAnswer(completion);
        usedModel = model;
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        safeError("api/chat", err);
      }
    }

    if (lastError || !answer) {
      throw lastError || new Error("Chat provider unavailable");
    }

    const showToolForm = shouldShowToolForm(message);
    const relatedProjects = detectRelatedProjects(`${message}\n${answer}`);

    // Persist when signed in + admin configured
    if (decoded?.uid && isFirebaseAdminConfigured()) {
      const userMsg = createMessage("user", message);
      const assistantMsg = createMessage("assistant", answer);
      try {
        if (shouldAskName) {
          await markNamePrompted(decoded.uid);
        }

        await appendConversationMessages({
          uid: decoded.uid,
          conversationId,
          mode,
          messages: [
            {
              id: userMsg.id,
              role: "user",
              content: message,
              createdAt: userMsg.createdAt,
            },
            {
              id: assistantMsg.id,
              role: "assistant",
              content: answer,
              createdAt: assistantMsg.createdAt,
            },
          ],
        });

        const transcript = [
          ...history,
          { role: "user" as const, content: message },
          { role: "assistant" as const, content: answer },
        ]
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n");

        const insight = await buildInsightSummary({
          email: decoded.email || null,
          displayName: decoded.name || null,
          knownName,
          messageCount: userMessageCount,
          recentTranscript: transcript,
        });
        await saveUserInsight(decoded.uid, insight);
      } catch (persistErr) {
        safeError("api/chat/persist", persistErr);
      }
    } else if (shouldAskName && decoded?.uid) {
      try {
        await markNamePrompted(decoded.uid);
      } catch {
        /* ignore */
      }
    }

    // Never return provider/model internals or secrets to the browser.
    void usedModel;
    const res = NextResponse.json({
      answer,
      mode,
      relatedProjects,
      showToolForm,
      knownName,
      namePrompted: namePrompted || shouldAskName,
      freeRemaining: decoded
        ? null
        : Math.max(0, FREE_CHAT_LIMIT - (freeUsed + 1)),
    });

    if (!decoded) {
      const nextCount = freeUsed + 1;
      res.cookies.set(FREE_CHAT_COOKIE, String(nextCount), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return res;
  } catch (error) {
    safeError("api/chat", error);

    return NextResponse.json(
      {
        error:
          "The AI service is temporarily unavailable. Please try again in a moment, or email shivanshushukla2022@gmail.com.",
      },
      { status: 502 }
    );
  }
}
