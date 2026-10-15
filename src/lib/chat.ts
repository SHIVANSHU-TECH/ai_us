export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_HISTORY_MESSAGES = 16;
export const MAX_HISTORY_CHARS = 12000;

export const INITIAL_ASSISTANT_MESSAGE =
  "Welcome! I'm Shivanshu's AI Resume Assistant. Ask me about his engineering experience, projects, system architecture, technical decisions, or suitability for a role. I'll answer using his verified professional profile.";

export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

export function boundHistory(
  history: Array<{ role: ChatRole; content: string }>
): Array<{ role: ChatRole; content: string }> {
  const trimmed = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? "").slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_HISTORY_MESSAGES);

  let total = 0;
  const result: Array<{ role: ChatRole; content: string }> = [];
  for (let i = trimmed.length - 1; i >= 0; i--) {
    const next = trimmed[i];
    total += next.content.length;
    if (total > MAX_HISTORY_CHARS) break;
    result.unshift(next);
  }
  return result;
}

export function detectRelatedProjects(text: string): string[] {
  const lower = text.toLowerCase();
  const refs: string[] = [];
  if (lower.includes("companybrain") || lower.includes("company brain") || lower.includes("rag")) {
    refs.push("CompanyBrain");
  }
  if (lower.includes("voice assistant") || lower.includes("electron")) {
    refs.push("AI Voice Assistant");
  }
  if (lower.includes("applyai") || lower.includes("resume screen")) {
    refs.push("ApplyAI");
  }
  if (lower.includes("clientscout") || lower.includes("client scout") || lower.includes("lead")) {
    refs.push("ClientScout AI");
  }
  if (lower.includes("collegex") || lower.includes("college x")) {
    refs.push("CollegeXConnect");
  }
  return [...new Set(refs)];
}
