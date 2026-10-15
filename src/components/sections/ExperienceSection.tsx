"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";
import { ExternalLink } from "lucide-react";

export function ExperienceSection() {
  return (
    <section className="space-y-4">
      <header>
        <div className="label-caps">Employment History</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Experience</h2>
        <p className="mt-2 text-sm text-mute">
          Dates and responsibilities from the verified resume PDF.
        </p>
      </header>

      <div className="space-y-3">
        {resumeKnowledge.experience.map((exp) => (
          <article key={exp.id} className="panel p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-soft">{exp.role}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-mint">
                  <span>{exp.company}</span>
                  {"link" in exp && exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-cyanx hover:underline"
                    >
                      link <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right font-mono text-[11px] text-mute">
                <div>{exp.period}</div>
                <div>{exp.location}</div>
              </div>
            </div>

            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
              {exp.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="border border-line px-2 py-0.5 font-mono text-[10px] text-cyanx"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
