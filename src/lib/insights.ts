import Groq from "groq-sdk";
import type { UserInsightSummary } from "@/lib/firebase/types";

/** Lightweight insight extraction — runs after chat, keep short. */
export async function buildInsightSummary(input: {
  email: string | null;
  displayName: string | null;
  knownName: string | null;
  messageCount: number;
  recentTranscript: string;
}): Promise<UserInsightSummary> {
  const fallback: UserInsightSummary = {
    displayName: input.displayName,
    knownName: input.knownName,
    email: input.email,
    whoTheySeemToBe: "Unknown yet",
    topicsDiscussed: [],
    peopleOrCompaniesNamed: [],
    toolsInterestedIn: [],
    lastIntent: "general chat",
    notesForShivanshu: "Not enough signal yet.",
    updatedAt: Date.now(),
    messageCount: input.messageCount,
  };

  if (!process.env.GROQ_API_KEY?.trim() || input.recentTranscript.length < 20) {
    return fallback;
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b",
      temperature: 0.2,
      max_tokens: 280,
      messages: [
        {
          role: "system",
          content:
            "Summarize a recruiter/founder chat for Shivanshu. Return ONLY compact JSON with keys: whoTheySeemToBe (string), topicsDiscussed (string[] max 6), peopleOrCompaniesNamed (string[] max 8), toolsInterestedIn (string[] max 6), lastIntent (string), notesForShivanshu (string, 1-2 sentences). No markdown.",
        },
        {
          role: "user",
          content: `Known name: ${input.knownName || "unknown"}\nEmail: ${input.email || "unknown"}\n\nTranscript:\n${input.recentTranscript.slice(-3500)}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;

    const parsed = JSON.parse(jsonMatch[0]) as Partial<UserInsightSummary>;
    return {
      displayName: input.displayName,
      knownName: input.knownName,
      email: input.email,
      whoTheySeemToBe:
        typeof parsed.whoTheySeemToBe === "string"
          ? parsed.whoTheySeemToBe
          : fallback.whoTheySeemToBe,
      topicsDiscussed: Array.isArray(parsed.topicsDiscussed)
        ? parsed.topicsDiscussed.map(String).slice(0, 6)
        : [],
      peopleOrCompaniesNamed: Array.isArray(parsed.peopleOrCompaniesNamed)
        ? parsed.peopleOrCompaniesNamed.map(String).slice(0, 8)
        : [],
      toolsInterestedIn: Array.isArray(parsed.toolsInterestedIn)
        ? parsed.toolsInterestedIn.map(String).slice(0, 6)
        : [],
      lastIntent:
        typeof parsed.lastIntent === "string"
          ? parsed.lastIntent
          : fallback.lastIntent,
      notesForShivanshu:
        typeof parsed.notesForShivanshu === "string"
          ? parsed.notesForShivanshu
          : fallback.notesForShivanshu,
      updatedAt: Date.now(),
      messageCount: input.messageCount,
    };
  } catch {
    return fallback;
  }
}

export function extractPossibleName(
  userMessage: string,
  assistantAskedForName: boolean
): string | null {
  if (!assistantAskedForName && !/\bmy name is\b|\bi'm\b|\bi am\b/i.test(userMessage)) {
    return null;
  }

  const patterns = [
    /(?:my name is|i'm|i am|this is|call me)\s+([A-Z][a-zA-Z'’-]{1,30}(?:\s+[A-Z][a-zA-Z'’-]{1,30})?)/i,
    /^([A-Z][a-zA-Z'’-]{1,30})$/,
  ];

  for (const re of patterns) {
    const m = userMessage.trim().match(re);
    if (m?.[1]) {
      const name = m[1].trim();
      if (name.length >= 2 && name.length <= 40) return name;
    }
  }
  return null;
}

export function shouldShowToolForm(
  message: string,
  mode: "resume" | "consult" = "resume"
): boolean {
  const q = message.toLowerCase();

  // Consult: show the same in-chat contact form for hire / work-together intents
  if (mode === "consult") {
    const engage =
      /\b(hire|hiring|contact|reach out|get in touch|work with|work together|collaborate|book a call|let'?s talk|connect with|engage|onboard|start a project|need (you|shiv|shivanshu)|want (you|shiv|shivanshu)|interested in (working|hiring)|send (a )?proposal|quote|pricing)\b/.test(
        q
      );
    if (engage) return true;
  }

  // ClientScout is public — no form needed unless another private tool is named too
  if (
    /\bclient\s*scout\b|clientscout\.in/.test(q) &&
    !/\b(companybrain|applyai|voice assistant|browser agent)\b/.test(q)
  ) {
    return false;
  }

  const namedTool =
    /\b(companybrain|company brain|voice assistant|applyai|apply ai|browser agent)\b/.test(
      q
    );
  const accessIntent =
    /\b(try|access|demo|use|interested|want to|can i|how do i get|request|trial|sign up|onboard)\b/.test(
      q
    );

  if (namedTool && accessIntent) return true;
  if (namedTool && /\b(want|need|get|show|give)\b/.test(q)) return true;
  return (
    accessIntent &&
    /\b(tool|product|platform|automation)\b/.test(q) &&
    !/\bclient\s*scout\b/.test(q)
  );
}
