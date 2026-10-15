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
    <section className="space-y-4">
      <header>
        <div className="label-caps">Outbound Channels</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Contact</h2>
        <p className="mt-2 text-sm text-mute">
          Prefer email for recruiting conversations. All links are copyable.
        </p>
      </header>

      <div className="grid gap-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="panel flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="label-caps">{item.label}</div>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-0.5 inline-flex items-center gap-1 truncate font-mono text-xs text-cyanx hover:underline"
              >
                {item.value}
                {item.href.startsWith("http") && <ExternalLink size={11} />}
              </a>
            </div>
            <button
              type="button"
              className="border border-line p-2 text-mute hover:text-mint"
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
