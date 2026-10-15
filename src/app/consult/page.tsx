import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ChatInterface } from "@/components/ChatInterface";

export const metadata: Metadata = {
  title: "Consult | Where Shivanshu Fits",
  description:
    "Tell us about your business, flow, or hiring need. Get practical guidance on AI, automation, and web — and where Shivanshu can help.",
};

export default function ConsultPage() {
  return (
    <SiteShell title="Consult — Use Your Route" modeLabel="consult">
      <section className="panel p-4 md:p-5">
        <div className="label-caps">For founders · cofounders · recruiters</div>
        <h2 className="mt-1 text-xl font-semibold text-soft">
          Share the problem. We&apos;ll map the fit.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mute">
          Describe your business, product flow, or hiring need. This assistant listens
          first, helps you think through AI / agents / automation / websites / tech,
          then explains where Shivanshu can plug in — only when it actually makes sense.
        </p>
        <div className="mt-3 font-mono text-[11px] text-cyanx">
          Route:{" "}
          <Link href="/consult" className="underline hover:text-mint">
            /consult
          </Link>
        </div>
      </section>

      <ChatInterface mode="consult" />
    </SiteShell>
  );
}
