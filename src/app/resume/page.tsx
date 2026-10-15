import { SiteShell } from "@/components/SiteShell";
import { ResumeSection } from "@/components/sections/ResumeSection";

export default function ResumePage() {
  return (
    <SiteShell title="Resume" modeLabel="resume">
      <ResumeSection />
    </SiteShell>
  );
}
