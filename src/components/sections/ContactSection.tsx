"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  const p = resumeKnowledge.profile;
  const [copied, setCopied] = useState<string | null>(null);

  const items = [
    { key: "email", label: "Email", value: p.email, href: `mailto:${p.email}` },
    { key: "phone", label: "Phone", value: p.phone, href: `tel:${p.phone}` },
    { key: "github", label: "GitHub", value: p.github, href: p.github },
    { key: "portfolio", label: "Portfolio", value: p.portfolio, href: p.portfolio },
    { key: "linkedin", label: "LinkedIn", value: p.linkedin, href: p.linkedin },
  ];

  return (
    <section className="w-full min-w-0 space-y-4">
      <header className="min-w-0">
        <div className="label-caps">Outbound Channels</div>
        <h2 className="mt-1 text-lg font-semibold text-soft sm:text-xl">Contact</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
          Prefer email for recruiting conversations. All links are copyable.
        </p>
      </header>

      <div className="grid min-w-0 gap-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="panel flex min-w-0 items-start gap-2 px-3 py-3 sm:items-center sm:justify-between sm:gap-3 sm:px-4"
          >
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="label-caps">{item.label}</div>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="mt-0.5 inline-flex max-w-full items-start gap-1 break-all font-mono text-[11px] leading-snug text-cyanx hover:underline sm:items-center sm:text-xs"
              >
                <span className="min-w-0">{item.value}</span>
                {item.href.startsWith("http") && (
                  <ExternalLink size={11} className="mt-0.5 shrink-0 sm:mt-0" />
                )}
              </a>
            </div>
            <button
              type="button"
              className="shrink-0 border border-line p-2 text-mute hover:text-mint"
              aria-label={`Copy ${item.label}`}
              onClick={async () => {
                await navigator.clipboard.writeText(item.value);
                setCopied(item.key);
                setTimeout(() => setCopied(null), 1400);
              }}
            >
              {copied === item.key ? (
                <Check size={14} className="text-mint" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
