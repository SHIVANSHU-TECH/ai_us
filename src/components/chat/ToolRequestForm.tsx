"use client";

import { useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface ToolRequestFormProps {
  defaultTools?: string;
  /** resume = tool access; consult = hire / project contact */
  variant?: "resume" | "consult";
  onSubmitted?: () => void;
}

export function ToolRequestForm({
  defaultTools = "",
  variant = "resume",
  onSubmitted,
}: ToolRequestFormProps) {
  const { user, idToken, refreshToken } = useAuth();
  const isConsult = variant === "consult";
  const [name, setName] = useState(user?.displayName || "");
  const [toolsWanted, setToolsWanted] = useState(defaultTools);
  const [email, setEmail] = useState(user?.email || "");
  const [positionCompany, setPositionCompany] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="border border-mint/35 bg-mint/5 px-3 py-3 text-sm text-soft">
        {isConsult
          ? "Request sent. Shivanshu will review it and follow up."
          : "Request sent. Shivanshu will review it and follow up on access for the tools you asked about."}
      </div>
    );
  }

  return (
    <form
      className="space-y-2 border border-line bg-panel2 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          const token = idToken || (await refreshToken());
          const res = await fetch("/api/tool-request", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              name,
              toolsWanted,
              email,
              positionCompany,
              problem,
              source: variant,
            }),
          });
          const data = (await res.json()) as { error?: string };
          if (!res.ok) {
            setError(
              typeof data.error === "string" && data.error.length < 120
                ? data.error
                : "Failed to send"
            );
            return;
          }
          setDone(true);
          onSubmitted?.();
        } catch {
          setError("Failed to send. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="label-caps">
        {isConsult ? "Contact / project request" : "Tool access request"}
      </div>
      <p className="text-xs text-mute">
        {isConsult
          ? "Share a few details and we will follow up. Same secure form as tool requests — saved for Shivanshu."
          : "ClientScout is open at clientscout.in. For other tools, send this and we'll get back to you."}
      </p>

      <Field label="Name" value={name} onChange={setName} required />
      <Field
        label={isConsult ? "What you need help with" : "Tools you want to try"}
        value={toolsWanted}
        onChange={setToolsWanted}
        required
        placeholder={
          isConsult
            ? "Shopify site, AI reels, hiring, automation…"
            : "CompanyBrain, Voice Assistant, ApplyAI…"
        }
      />
      <Field label="Email" value={email} onChange={setEmail} required type="email" />
      <Field
        label="Position / company"
        value={positionCompany}
        onChange={setPositionCompany}
        required
      />
      <label className="block">
        <span className="label-caps">Problem you are facing now</span>
        <textarea
          required
          rows={3}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="mt-1 w-full resize-none border border-line bg-ink/50 px-2 py-1.5 text-sm text-soft"
        />
      </label>

      {error && (
        <div className="font-mono text-[11px] text-red-200">{error}</div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-1.5 border border-mint/40 bg-mint/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20 disabled:opacity-50"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <SendHorizontal size={14} />}
        Send
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line bg-ink/50 px-2 py-1.5 text-sm text-soft placeholder:text-mute/60"
      />
    </label>
  );
}
