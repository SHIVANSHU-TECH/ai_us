import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ClientsSection } from "@/components/sections/ClientsSection";

export const metadata: Metadata = {
  title: "Client Work | Aviva Beauty, Creator.co.ai, Connect Astro",
  description:
    "Client delivery: Aviva Beauty Shopify theme (Vanshika), Creator.co.ai AI reel automation (Rohit Bamola), and Connect Astro desktop (Gautam).",
};

export default function ClientsPage() {
  return (
    <SiteShell title="Client Work" modeLabel="clients">
      <ClientsSection />
    </SiteShell>
  );
}
