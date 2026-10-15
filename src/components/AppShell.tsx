"use client";

import { useState } from "react";
import { Sidebar, type NavId } from "@/components/Sidebar";
import { ProfilePanel } from "@/components/ProfilePanel";
import { ChatInterface } from "@/components/ChatInterface";
import { SystemsSection } from "@/components/sections/SystemsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { ContactSection } from "@/components/sections/ContactSection";

export function AppShell() {
  const [active, setActive] = useState<NavId>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  const askAndGoHome = (prompt: string) => {
    setActive("home");
    setExternalPrompt(prompt);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        active={active}
        onNavigate={setActive}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-ink/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pl-12 md:pl-0">
            <div>
              <div className="font-mono text-[11px] text-mint">
                shivanshu@portfolio:~$
              </div>
              <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-soft md:text-xl">
                Shivanshu&apos;s AI Resume
              </h1>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              mode/{active}
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
          {active === "home" && (
            <>
              <ProfilePanel />
              <ChatInterface
                externalPrompt={externalPrompt}
                onExternalPromptConsumed={() => setExternalPrompt(null)}
              />
            </>
          )}
          {active === "systems" && <SystemsSection />}
          {active === "experience" && <ExperienceSection />}
          {active === "projects" && (
            <ProjectsSection onAskFollowUp={askAndGoHome} />
          )}
          {active === "skills" && <SkillsSection />}
          {active === "resume" && <ResumeSection />}
          {active === "contact" && <ContactSection />}
        </main>

        <footer className="border-t border-line px-4 py-3 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
            <span>sys.status // grounded_answers_only</span>
            <span className="text-mint">latency: provider-dependent</span>
            <span>© {new Date().getFullYear()} Shivanshu Shukla</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
