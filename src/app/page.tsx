import { Suspense } from "react";
import { SiteShell } from "@/components/SiteShell";
import { HomeView } from "@/components/HomeView";

export default function HomePage() {
  return (
    <SiteShell title="Shivanshu's AI Resume" modeLabel="home">
      <Suspense fallback={<div className="panel p-4 text-sm text-mute">Loading…</div>}>
        <HomeView />
      </Suspense>
    </SiteShell>
  );
}
