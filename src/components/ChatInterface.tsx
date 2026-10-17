"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Eraser,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import {
  createMessage,
  INITIAL_ASSISTANT_MESSAGE,
  type ChatMessage,
} from "@/lib/chat";
import { SUGGESTED_PROMPTS } from "@/lib/resume-knowledge";
import {
  CONSULT_INITIAL_MESSAGE,
  CONSULT_SUGGESTED_PROMPTS,
} from "@/lib/consult-prompt";
import { formatAssistantText } from "@/lib/format";
import { ToolRequestForm } from "@/components/chat/ToolRequestForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { FREE_CHAT_LIMIT } from "@/lib/free-chat";
import clsx from "clsx";

export type ChatMode = "resume" | "consult";

interface ChatInterfaceProps {
  mode?: ChatMode;
  externalPrompt?: string | null;
  onExternalPromptConsumed?: () => void;
}

function getOrCreateConversationId(mode: ChatMode): string {
  if (typeof window === "undefined") return `${mode}-ssr`;
  const key = `usemeai_conversation_${mode}`;
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = `${mode}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(key, id);
  return id;
}

export function ChatInterface({
  mode = "resume",
  externalPrompt,
  onExternalPromptConsumed,
}: ChatInterfaceProps) {
  const { idToken, refreshToken, user, openAuthMenu } = useAuth();
  const initial =
    mode === "consult" ? CONSULT_INITIAL_MESSAGE : INITIAL_ASSISTANT_MESSAGE;
  const prompts =
    mode === "consult" ? CONSULT_SUGGESTED_PROMPTS : SUGGESTED_PROMPTS;
  const userLabel = mode === "consult" ? "visitor" : "recruiter";
  const title =
    mode === "consult" ? "Business Consult Assistant" : "AI Resume Assistant";
  const subtitle =
    mode === "consult" ? "Listen → Align → Suggest fit" : "Conversational Interface";
  const placeholder =
    mode === "consult"
      ? "Describe your business, flow, hiring need, or tech problem…"
      : "Ask about projects, architecture, Binary Geckos, JD fit…";

  const conversationId = useMemo(() => getOrCreateConversationId(mode), [mode]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", initial),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [related, setRelated] = useState<string[]>([]);
  const [showToolForm, setShowToolForm] = useState(false);
  const [toolFormDefault, setToolFormDefault] = useState("");
  const [namePromptedLocal, setNamePromptedLocal] = useState(false);
  const [knownNameLocal, setKnownNameLocal] = useState<string | null>(null);
  const [anonUsed, setAnonUsed] = useState(0);
  const [loginGate, setLoginGate] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const freeRemaining = Math.max(0, FREE_CHAT_LIMIT - anonUsed);
  const needsLogin = !user && anonUsed >= FREE_CHAT_LIMIT;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setNamePromptedLocal(
      localStorage.getItem(`usemeai_name_prompted_${mode}`) === "1"
    );
    setKnownNameLocal(localStorage.getItem(`usemeai_known_name_${mode}`));
    const used = Number(localStorage.getItem("usemeai_anon_used") || "0");
    setAnonUsed(Number.isFinite(used) ? Math.max(0, Math.floor(used)) : 0);
  }, [mode]);

  useEffect(() => {
    if (user) {
      setLoginGate(false);
      setAnonUsed(0);
      if (typeof window !== "undefined") {
        localStorage.removeItem("usemeai_anon_used");
      }
    }
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showToolForm]);

  const submitMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;

    if (!user && anonUsed >= FREE_CHAT_LIMIT) {
      setLoginGate(true);
      openAuthMenu();
      setError(
        "Please login with Google to continue the chat. You have used your 3 free messages."
      );
      return;
    }

    setError(null);
    setRelated([]);
    setLoginGate(false);
    const userMsg = createMessage("user", text);
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const userMessageCount = nextMessages.filter((m) => m.role === "user").length;

    try {
      const history = nextMessages
        .filter((m) => !(m.role === "assistant" && m.content === initial))
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const token = idToken || (await refreshToken());

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          history,
          mode,
          conversationId: user
            ? `${user.uid}_${conversationId}`
            : conversationId,
          userMessageCount,
          namePrompted: namePromptedLocal,
          knownName: knownNameLocal,
        }),
      });

      const data = (await res.json()) as {
        answer?: string;
        error?: string;
        code?: string;
        relatedProjects?: string[];
        showToolForm?: boolean;
        knownName?: string | null;
        namePrompted?: boolean;
        freeRemaining?: number | null;
      };

      if (!res.ok) {
        if (res.status === 401 || data.code === "LOGIN_REQUIRED") {
          setLoginGate(true);
          setAnonUsed(FREE_CHAT_LIMIT);
          if (typeof window !== "undefined") {
            localStorage.setItem("usemeai_anon_used", String(FREE_CHAT_LIMIT));
          }
          openAuthMenu();
          setMessages((prev) => [
            ...prev,
            createMessage(
              "assistant",
              "You have used your 3 free messages. Please login with Google (top right) to continue the chat."
            ),
          ]);
          setError("Please login with Google to continue the chat.");
          return;
        }
        throw new Error("Request failed");
      }

      if (!user) {
        const nextUsed = anonUsed + 1;
        setAnonUsed(nextUsed);
        if (typeof window !== "undefined") {
          localStorage.setItem("usemeai_anon_used", String(nextUsed));
        }
        if (nextUsed >= FREE_CHAT_LIMIT) {
          setLoginGate(true);
        }
      }

      setMessages((prev) => [
        ...prev,
        createMessage("assistant", data.answer || "No response."),
      ]);
      setRelated(data.relatedProjects || []);

      if (data.namePrompted || data.knownName) {
        setNamePromptedLocal(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(`usemeai_name_prompted_${mode}`, "1");
        }
      }
      if (data.knownName) {
        setKnownNameLocal(data.knownName);
        if (typeof window !== "undefined") {
          localStorage.setItem(`usemeai_known_name_${mode}`, data.knownName);
        }
      }

      if (data.showToolForm) {
        setToolFormDefault(text.slice(0, 120));
        setShowToolForm(true);
      }
    } catch {
      const msg =
        "Something went wrong. Please try again, or email shivanshushukla2022@gmail.com.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", `I couldn't complete that request.\n\n${msg}`),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!externalPrompt || loading) return;
    const prompt = externalPrompt;
    onExternalPromptConsumed?.();
    void submitMessage(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  const clearChat = () => {
    if (loading) return;
    setMessages([createMessage("assistant", initial)]);
    setError(null);
    setRelated([]);
    setShowToolForm(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`usemeai_conversation_${mode}`);
    }
  };

  return (
    <section className="panel flex min-h-[520px] flex-1 flex-col overflow-hidden md:min-h-[560px]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <div className="label-caps">{subtitle}</div>
          <h3 className="mt-1 text-sm font-semibold text-soft">{title}</h3>
          {!user && (
            <p className="mt-1 font-mono text-[10px] text-mute">
              {freeRemaining > 0
                ? `${freeRemaining} free message${freeRemaining === 1 ? "" : "s"} left · then Google login`
                : "Free messages used · login with Google to continue"}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={clearChat}
          disabled={loading}
          className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:border-mint/40 hover:text-mint disabled:opacity-40"
        >
          <Eraser size={12} />
          Clear
        </button>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-3 py-4 md:px-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "fade-up flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={clsx(
                "max-w-[92%] border px-3 py-2.5 md:max-w-[85%]",
                msg.role === "user"
                  ? "border-mint/30 bg-mint/10 text-soft"
                  : "border-line bg-panel2 text-soft"
              )}
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                  {msg.role === "user" ? userLabel : "assistant"}
                </span>
                {msg.role === "assistant" && (
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(msg.content);
                      setCopiedId(msg.id);
                      setTimeout(() => setCopiedId(null), 1400);
                    }}
                    className="inline-flex items-center gap-1 text-mute hover:text-mint"
                    aria-label="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check size={12} className="text-mint" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                )}
              </div>
              <div
                className="prose-chat text-sm"
                dangerouslySetInnerHTML={{
                  __html: formatAssistantText(msg.content),
                }}
              />
            </div>
          </div>
        ))}

        {showToolForm && (
          <div className="max-w-[92%] md:max-w-[85%]">
            <ToolRequestForm
              defaultTools={toolFormDefault}
              onSubmitted={() => {
                setMessages((prev) => [
                  ...prev,
                  createMessage(
                    "assistant",
                    "Got it — your tool access request is saved. Shivanshu will review and follow up."
                  ),
                ]);
              }}
            />
          </div>
        )}

        {(loginGate || needsLogin) && !user && (
          <div className="max-w-[92%] border border-mint/35 bg-mint/5 px-3 py-3 md:max-w-[85%]">
            <p className="text-sm text-soft">
              You have used your {FREE_CHAT_LIMIT} free messages. Please login
              with Google to continue the chat.
            </p>
            <button
              type="button"
              onClick={() => openAuthMenu()}
              className="mt-2 inline-flex items-center gap-1.5 border border-mint/40 bg-mint/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20"
            >
              Connect Google
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 px-1 font-mono text-xs text-mute">
            <Loader2 size={14} className="animate-spin text-mint" />
            <span>processing</span>
            <span className="inline-flex gap-1">
              <span className="typing-dot h-1 w-1 rounded-full bg-mint" />
              <span className="typing-dot h-1 w-1 rounded-full bg-mint" />
              <span className="typing-dot h-1 w-1 rounded-full bg-mint" />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {related.length > 0 && (
        <div className="border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
          Related: <span className="text-cyanx">{related.join(" · ")}</span>
        </div>
      )}

      <div className="border-t border-line px-3 py-3 md:px-4">
        <div className="label-caps mb-2">Suggested prompts</div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={loading || needsLogin}
              onClick={() => void submitMessage(prompt)}
              className="max-w-full truncate border border-line bg-ink/40 px-2 py-1 font-mono text-[10px] text-mute transition-colors hover:border-mint/40 hover:text-mint disabled:opacity-40"
              title={prompt}
            >
              {prompt}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-2 border border-red-500/30 bg-red-500/10 px-2.5 py-2 font-mono text-[11px] text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitMessage(input);
          }}
          className="flex items-end gap-2"
        >
          <label className="sr-only" htmlFor={`chat-input-${mode}`}>
            Message
          </label>
          <textarea
            id={`chat-input-${mode}`}
            rows={2}
            value={input}
            disabled={loading || needsLogin}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submitMessage(input);
              }
            }}
            placeholder={
              needsLogin
                ? "Login with Google to continue chatting…"
                : placeholder
            }
            className="min-h-[44px] w-full resize-none border border-line bg-ink/50 px-3 py-2.5 text-sm text-soft placeholder:text-mute/70 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || needsLogin}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 border border-mint/40 bg-mint/10 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20 disabled:opacity-40"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <SendHorizontal size={14} />
            )}
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
