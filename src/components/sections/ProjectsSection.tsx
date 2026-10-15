"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export function ProjectsSection({
  onAskFollowUp,
}: {
  onAskFollowUp?: (prompt: string) => void;
}) {
  return (
    <section className="space-y-4">
      <header>
        <div className="label-caps">Selected Builds</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Projects</h2>
        <p className="mt-2 text-sm text-mute">
          Verified outcomes only — no fabricated benchmarks or repository claims.
        </p>
      </header>

      <div className="space-y-4">
        {resumeKnowledge.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onAskFollowUp={onAskFollowUp}
          />
        ))}
      </div>

      <article className="panel p-4 md:p-5">
        <div className="label-caps">Founder / Product</div>
        <h3 className="mt-1 text-lg font-semibold text-soft">CollegeXConnect</h3>
        <p className="mt-2 text-sm text-mute">
          All-in-one student platform founded by Shivanshu — internships, jobs, events,
          and academic resources.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {resumeKnowledge.experience
            .find((e) => e.id === "collegexconnect")
            ?.metrics?.map((m) => (
              <span
                key={m}
                className="border border-mint/25 bg-mint/5 px-2 py-1 font-mono text-[11px] text-mint"
              >
                {m}
              </span>
            ))}
        </div>
        <a
          href="https://collegexconnect.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-cyanx hover:underline"
        >
          collegexconnect.com <ExternalLink size={12} />
        </a>
      </article>
    </section>
  );
}

function ProjectCard({
  project,
  onAskFollowUp,
}: {
  project: (typeof resumeKnowledge.projects)[number];
  onAskFollowUp?: (prompt: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (!project.liveUrl) return;
    await navigator.clipboard.writeText(project.liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="panel p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-mono text-[11px] text-mint">
            {project.number} — {project.year}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-soft">{project.title}</h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
            {project.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.liveUrl && (
            <>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 border border-mint/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mint hover:bg-mint/10"
              >
                Live demo <ExternalLink size={10} />
              </a>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="inline-flex items-center gap-1 border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:text-mint"
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                Copy link
              </button>
            </>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:text-cyanx"
            >
              GitHub <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Block title="Problem" body={project.problem} />
        <Block title="Technical approach" body={project.approach} />
      </div>

      <div className="mt-3">
        <div className="label-caps mb-1">Architecture / workflow</div>
        {project.workflow.map((w) => (
          <code
            key={w}
            className="mt-1 block border border-line bg-ink/40 px-2 py-1.5 font-mono text-[11px] text-cyanx"
          >
            {w}
          </code>
        ))}
        <ul className="mt-2 space-y-1 text-sm text-mute">
          {project.architectureNotes.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <div className="label-caps mb-1">Verified outcome</div>
        <ul className="space-y-1 text-sm text-soft">
          {project.outcomes.map((o) => (
            <li key={o}>• {o}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="border border-line px-2 py-0.5 font-mono text-[10px] text-cyanx"
          >
            {t}
          </span>
        ))}
      </div>

      {onAskFollowUp && (
        <button
          type="button"
          onClick={() =>
            onAskFollowUp(
              `Explain ${project.title} in more detail — architecture, trade-offs, and verified outcomes.`
            )
          }
          className="mt-4 border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:border-mint/40 hover:text-mint"
        >
          Ask assistant about {project.title}
        </button>
      )}
    </article>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel-2 p-3">
      <div className="label-caps">{title}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-mute">{body}</p>
    </div>
  );
}
