"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";
import { Download, FileText } from "lucide-react";

export function ResumeSection() {
  return (
    <section className="space-y-4">
      <header>
        <div className="label-caps">Document Store</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">Resume</h2>
        <p className="mt-2 text-sm text-mute">
          Download the verified PDF used as the knowledge source for this assistant.
        </p>
      </header>

      <div className="panel p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center border border-mint/35 bg-mint/10 text-mint">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-soft">Shivanshu_resume_Swe.pdf</h3>
            <p className="mt-1 font-mono text-[11px] text-mute">
              Path: /public/Shivanshu_resume_Swe.pdf
            </p>
            <a
              href={resumeKnowledge.profile.resumePdf}
              download
              className="mt-4 inline-flex items-center gap-2 border border-mint/40 bg-mint/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20"
            >
              <Download size={14} />
              Download Resume PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
