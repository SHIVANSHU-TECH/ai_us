"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function AuthButton() {
  const { user, loading, configured, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!configured) {
    return (
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
        auth offline
      </div>
    );
  }

  if (loading) {
    return (
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
        checking…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await signIn();
            } catch {
              // Never surface raw Firebase/provider errors (can mention config).
              setError("Could not connect Google account. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
          className="inline-flex items-center gap-2 border border-mint/40 bg-mint/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20 disabled:opacity-50"
        >
          <UserRound size={12} />
          {busy ? "Connecting…" : "Connect Google"}
        </button>
        {error && (
          <div className="absolute right-0 top-full z-30 mt-1 w-56 border border-red-500/30 bg-panel p-2 font-mono text-[10px] text-red-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-[220px] items-center gap-2 border border-line bg-panel2 px-2 py-1 text-left hover:border-mint/35"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={22}
            height={22}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-mint/20 text-[10px] text-mint">
            {(user.displayName || user.email || "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-soft">
          {user.displayName || user.email}
        </span>
        <ChevronDown size={12} className="shrink-0 text-mute" />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Close account menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-30 mt-1 w-56 border border-line bg-panel p-2 shadow-mint">
            <div className="label-caps px-1">Connected account</div>
            <div className="mt-1 truncate px-1 text-xs text-soft">
              {user.displayName || "Google user"}
            </div>
            <div className="truncate px-1 font-mono text-[10px] text-mute">
              {user.email}
            </div>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="mt-2 flex w-full items-center gap-2 border border-line px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:border-mint/40 hover:text-mint"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
