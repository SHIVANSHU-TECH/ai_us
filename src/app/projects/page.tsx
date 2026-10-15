"use client";

import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <SiteShell title="Projects" modeLabel="projects">
      <ProjectsSection
        onAskFollowUp={(prompt) => {
          // Resume chat lives on home; open consult for business-fit questions,
          // otherwise send people to home with a hint via query is overkill — home chat.
          router.push(`/?ask=${encodeURIComponent(prompt)}`);
        }}
      />
    </SiteShell>
  );
}
