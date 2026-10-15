"use client";

import Image from "next/image";
import { resumeKnowledge } from "@/lib/resume-knowledge";
import { Check, Copy, ExternalLink, Mail, Phone } from "lucide-react";
import { useState, type ReactNode } from "react";

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function ProfilePanel() {
  const p = resumeKnowledge.profile;
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = async (key: string, value: string) => {
    await copyText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section className="panel accent-glow p-4 md:p-5">
      <div className="label-caps mb-3">$ whoami</div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-line bg-panel2 sm:h-24 sm:w-24">
          <Image
            src={p.photo}
            alt={`${p.name} profile photo`}
            fill
            className="object-cover object-top"
            sizes="96px"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-soft md:text-2xl">
            {p.name}
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mint">
            {p.title}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">
            {p.summary}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <LinkRow
              label="Portfolio"
              value={p.portfolio}
              href={p.portfolio}
              copied={copied === "portfolio"}
              onCopy={() => onCopy("portfolio", p.portfolio)}
            />
            <LinkRow
              label="GitHub"
              value={p.github}
              href={p.github}
              copied={copied === "github"}
              onCopy={() => onCopy("github", p.github)}
            />
            <LinkRow
              label="Email"
              value={p.email}
              href={`mailto:${p.email}`}
              icon={<Mail size={12} />}
              copied={copied === "email"}
              onCopy={() => onCopy("email", p.email)}
            />
            <LinkRow
              label="Phone"
              value={p.phone}
              href={`tel:${p.phone}`}
              icon={<Phone size={12} />}
              copied={copied === "phone"}
              onCopy={() => onCopy("phone", p.phone)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LinkRow({
  label,
  value,
  href,
  icon,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  href: string;
  icon?: ReactNode;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border border-line bg-panel2 px-2.5 py-2">
      <div className="min-w-0 flex-1">
        <div className="label-caps">{label}</div>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="mt-0.5 flex items-center gap-1 truncate font-mono text-[11px] text-cyanx hover:underline"
        >
          {icon}
          <span className="truncate">{value.replace(/^https?:\/\//, "")}</span>
          {href.startsWith("http") && <ExternalLink size={10} className="shrink-0 opacity-70" />}
        </a>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 border border-line p-1.5 text-mute hover:border-mint/40 hover:text-mint"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check size={12} className="text-mint" /> : <Copy size={12} />}
      </button>
    </div>
  );
}
