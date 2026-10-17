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
    <div className="flex flex-col gap-4 sm:gap-5">
      <ProfilePanel />
      <ChatInterface
        mode="resume"
        externalPrompt={externalPrompt}
        onExternalPromptConsumed={() => setExternalPrompt(null)}
      />
    </div>
  );
}
