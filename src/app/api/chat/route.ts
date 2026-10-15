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

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
}

function isConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
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

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.35,
      max_tokens: 1200,
      messages: [
        { role: "system", content: getSystemPrompt() },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      "I could not generate a response. Please try again.";

    return NextResponse.json({
      answer,
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
