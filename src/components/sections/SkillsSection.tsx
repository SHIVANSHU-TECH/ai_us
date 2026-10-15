"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";

const GROUPS: { key: keyof typeof resumeKnowledge.skills; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend and APIs" },
  { key: "ai", label: "AI and LLMs" },
  { key: "databases", label: "Databases" },
  { key: "cloud", label: "Cloud and DevOps" },
  { key: "security", label: "Security and integrations" },
  { key: "languages", label: "Languages" },
];

export function SkillsSection() {
  return (
    <section className="space-y-4">
      <header>
        <div className="label-caps">Capability Matrix</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Skills</h2>
        <p className="mt-2 text-sm text-mute">
          Grouped from the resume — no arbitrary percentage ratings.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {GROUPS.map((group) => (
          <div key={group.key} className="panel p-4">
            <div className="label-caps">{group.label}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {resumeKnowledge.skills[group.key].map((skill) => (
                <span
                  key={skill}
                  className="border border-line bg-panel2 px-2 py-1 font-mono text-[11px] text-soft"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
