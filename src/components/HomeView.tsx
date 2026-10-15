"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProfilePanel } from "@/components/ProfilePanel";
import { ChatInterface } from "@/components/ChatInterface";

export function HomeView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  useEffect(() => {
    const ask = searchParams.get("ask");
    if (ask) {
      setExternalPrompt(ask);
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <>
      <ProfilePanel />
      <ChatInterface
        mode="resume"
        externalPrompt={externalPrompt}
        onExternalPromptConsumed={() => setExternalPrompt(null)}
      />
    </>
  );
}
