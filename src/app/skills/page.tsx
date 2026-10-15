import { SiteShell } from "@/components/SiteShell";
import { SkillsSection } from "@/components/sections/SkillsSection";

export default function SkillsPage() {
  return (
    <SiteShell title="Skills" modeLabel="skills">
      <SkillsSection />
    </SiteShell>
  );
}
