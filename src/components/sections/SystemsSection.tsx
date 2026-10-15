"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";
import { ArrowRight } from "lucide-react";

export function SystemsSection() {
  const layers = resumeKnowledge.architectureOverview.layers;

  return (
    <section className="space-y-4">
      <header>
        <div className="label-caps">Architecture Map</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Systems</h2>
        <p className="mt-2 max-w-3xl text-sm text-mute">
          {resumeKnowledge.architectureOverview.disclaimer}
        </p>
      </header>

      <div className="panel p-4 md:p-5">
        <div className="label-caps mb-4">Reference Flow</div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
          {layers.map((layer, idx) => (
            <div key={layer.id} className="flex min-w-0 flex-1 items-stretch gap-2">
              <div className="panel-2 flex w-full flex-col px-3 py-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mint">
                  {String(idx + 1).padStart(2, "0")} · {layer.label}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {layer.tech.map((t) => (
                    <span
                      key={t}
                      className="border border-line px-2 py-0.5 font-mono text-[10px] text-cyanx"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {idx < layers.length - 1 && (
                <div className="hidden items-center text-mute lg:flex">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-mute">
          Frontend → API Layer → Authentication → AI / RAG → Database
        </div>
      </div>
    </section>
  );
}
