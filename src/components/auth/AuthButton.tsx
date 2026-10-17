"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function AuthButton() {
  const { user, loading, configured, signIn, signOut, authMenuNonce } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn();
    } catch {
      setError("Could not connect Google account. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // Chat login gate → open Firebase Google popup directly
  useEffect(() => {
    if (authMenuNonce > 0 && !user && configured && !busy) {
      void connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMenuNonce]);

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
      <div className="relative shrink-0">
        <button
          type="button"
          disabled={busy}
          onClick={() => void connect()}
          className="inline-flex items-center gap-2 border border-mint/40 bg-mint/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20 disabled:opacity-50"
        >
          <UserRound size={12} />
          <span className="sm:hidden">{busy ? "…" : "Google"}</span>
          <span className="hidden sm:inline">
            {busy ? "Connecting…" : "Connect Google"}
          </span>
        </button>
        {error && (
          <div className="absolute right-0 top-full z-30 mt-1 w-52 border border-red-500/30 bg-panel p-2 font-mono text-[10px] text-red-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-[160px] items-center gap-2 border border-line bg-panel2 px-2 py-1 text-left hover:border-mint/35 sm:max-w-[220px]"
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
