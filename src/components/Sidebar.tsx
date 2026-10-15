"use client";

import { resumeKnowledge } from "@/lib/resume-knowledge";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export type NavId =
  | "home"
  | "systems"
  | "experience"
  | "projects"
  | "skills"
  | "resume"
  | "contact";

const NAV: { id: NavId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "systems", label: "Systems" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

interface SidebarProps {
  active: NavId;
  onNavigate: (id: NavId) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center border border-line bg-panel text-mint md:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => onMobileOpenChange(!mobileOpen)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
          aria-label="Close navigation overlay"
          onClick={() => onMobileOpenChange(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-line bg-panel px-4 py-5 transition-transform duration-200 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-mint/40 bg-panel2 font-mono text-sm font-semibold text-mint shadow-mint">
            SS
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-soft">
              {resumeKnowledge.profile.name}
            </div>
            <div className="label-caps mt-0.5">Command Center</div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onMobileOpenChange(false);
              }}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.12em] transition-colors",
                active === item.id
                  ? "border border-mint/35 bg-panel2 text-mint"
                  : "border border-transparent text-mute hover:border-line hover:bg-panel2 hover:text-soft"
              )}
            >
              <span className="text-cyanx/70">›</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 border-t border-line pt-4">
          <div className="label-caps mb-2">System Status</div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-mint">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-mint" />
            AI_ASSISTANT: ONLINE
          </div>
          <div className="mt-2 font-mono text-[10px] text-mute">
            CTX: VERIFIED_RESUME_V{resumeKnowledge.version.slice(0, 4)}
          </div>
        </div>
      </aside>
    </>
  );
}
