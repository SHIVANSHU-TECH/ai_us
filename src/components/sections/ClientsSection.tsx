"use client";

import { ExternalLink } from "lucide-react";
import { resumeKnowledge } from "@/lib/resume-knowledge";

export function ClientsSection() {
  return (
    <section className="space-y-4">
      <header>
        <div className="label-caps">Delivered for founders</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Client Work</h2>
        <p className="mt-2 text-sm text-mute">
          Real client engagements — Shopify D2C, AI reel automation, and desktop
          delivery. Proof points the consult assistant can cite when problems match.
        </p>
      </header>

      <div className="space-y-4">
        {resumeKnowledge.clientWork.map((client, index) => (
          <article key={client.id} className="panel p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-mono text-[11px] text-mint">
                  {String(index + 1).padStart(2, "0")} — {client.category}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-soft">
                  {client.client}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-mute">
                  Contact: {client.contactPerson}
                </p>
              </div>
              {client.liveUrl && (
                <a
                  href={client.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 border border-mint/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mint hover:bg-mint/10"
                >
                  Live site <ExternalLink size={10} />
                </a>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-mute">{client.summary}</p>

            <div className="mt-3">
              <div className="label-caps mb-1">Scope</div>
              <ul className="space-y-1.5 text-sm text-soft">
                {client.scope.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {client.tech.map((t) => (
                <span
                  key={t}
                  className="border border-line px-2 py-0.5 font-mono text-[10px] text-cyanx"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-3 panel-2 p-3">
              <div className="label-caps">Pitch when</div>
              <ul className="mt-1.5 space-y-1 text-sm text-mute">
                {client.pitchingAngles.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
