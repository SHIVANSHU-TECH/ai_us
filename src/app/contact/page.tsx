import { SiteShell } from "@/components/SiteShell";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  return (
    <SiteShell title="Contact" modeLabel="contact">
      <ContactSection />
    </SiteShell>
  );
}
