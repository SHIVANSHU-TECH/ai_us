import { SiteShell } from "@/components/SiteShell";
import { SystemsSection } from "@/components/sections/SystemsSection";

export default function SystemsPage() {
  return (
    <SiteShell title="Systems" modeLabel="systems">
      <SystemsSection />
    </SiteShell>
  );
}
