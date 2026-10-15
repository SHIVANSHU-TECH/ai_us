import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  boundHistory,
  detectRelatedProjects,
  MAX_MESSAGE_LENGTH,
  type ChatRole,
} from "@/lib/chat";
import { getSystemPrompt } from "@/lib/system-prompt";

export const runtime = "nodejs";

/** Preferred chat models on Groq for this product (reasoning / text). */
const GROQ_CHAT_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
] as const;

const GROQ_MODEL =
  process.env.GROQ_MODEL?.trim() || GROQ_CHAT_MODELS[0];

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
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
            "AI provider is not configured. Add GROQ_API_KEY to your environment (see .env.example), then restart the server.",
          code: "MISSING_API_KEY",
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

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = boundHistory(
      rawHistory.map((item) => {
        const row = item as { role?: unknown; content?: unknown };
        return {
          role: (row.role === "assistant" ? "assistant" : "user") as ChatRole,
          content: typeof row.content === "string" ? row.content : "",
        };
      })
    );

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const messages = [
      { role: "system" as const, content: getSystemPrompt() },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: message },
    ];

    // Try preferred model first, then fall back across the supported chat models.
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
          temperature: 0.55,
          max_tokens: 900,
          messages,
        });
        answer = extractAnswer(completion);
        usedModel = model;
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[api/chat] model ${model} failed:`, msg.slice(0, 200));
      }
    }

    if (lastError || !answer) {
      throw lastError || new Error("All Groq chat models failed.");
    }

    return NextResponse.json({
      answer,
      model: usedModel,
      relatedProjects: detectRelatedProjects(`${message}\n${answer}`),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown provider error";
    // Do not log secrets or full request bodies
    console.error("[api/chat] provider error:", message.slice(0, 200));

    return NextResponse.json(
      {
        error:
          "The AI service is temporarily unavailable. Please try again in a moment, or email shivanshushukla2022@gmail.com.",
        code: "PROVIDER_ERROR",
      },
      { status: 502 }
    );
  }
}
