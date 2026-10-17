"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getSavedGoogleAccounts,
  removeSavedGoogleAccount,
  type SavedGoogleAccount,
} from "@/lib/firebase/saved-accounts";
import {
  getGoogleClientId,
  initGisOneTap,
  loadGisScript,
  renderGisButton,
} from "@/lib/firebase/gis";

export function AuthButton() {
  const {
    user,
    loading,
    configured,
    signIn,
    signInWithIdToken,
    signOut,
    authMenuNonce,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SavedGoogleAccount[]>([]);
  const gisBtnRef = useRef<HTMLDivElement>(null);

  const refreshAccounts = () => setAccounts(getSavedGoogleAccounts());

  useEffect(() => {
    refreshAccounts();
  }, [user, open]);

  // Chat / other UI can request the connect menu to open
  useEffect(() => {
    if (authMenuNonce > 0 && !user) {
      setOpen(true);
      setError(null);
      refreshAccounts();
    }
  }, [authMenuNonce, user]);

  useEffect(() => {
    if (!open || user || !configured) return;

    let cancelled = false;
    const run = async () => {
      const clientId = getGoogleClientId();
      if (!clientId) return;

      const onCred = async (idToken: string) => {
        setBusy(true);
        setError(null);
        try {
          await signInWithIdToken(idToken);
          setOpen(false);
        } catch {
          setError("Could not connect Google account. Please try again.");
        } finally {
          setBusy(false);
        }
      };

      const ok = await initGisOneTap(onCred);
      if (cancelled || !ok) return;
      await loadGisScript();
      if (cancelled || !gisBtnRef.current) return;
      renderGisButton(gisBtnRef.current, onCred);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [open, user, configured, signInWithIdToken]);

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
          onClick={() => {
            setError(null);
            setOpen((v) => !v);
            refreshAccounts();
          }}
          className="inline-flex items-center gap-2 border border-mint/40 bg-mint/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mint hover:bg-mint/20 disabled:opacity-50"
        >
          <UserRound size={12} />
          {busy ? "Connecting…" : "Connect Google"}
          <ChevronDown size={12} className={open ? "rotate-180" : ""} />
        </button>

        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-20 cursor-default"
              aria-label="Close account menu"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-full z-30 mt-1 w-[260px] border border-line bg-panel p-2 shadow-mint">
              <div className="label-caps px-1 pb-1.5">Choose an account</div>

              {accounts.length > 0 ? (
                <div className="mb-2 space-y-1">
                  {accounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        setError(null);
                        try {
                          // Direct hint — no full multi-account Google modal
                          await signIn({ loginHint: acc.email });
                          setOpen(false);
                        } catch {
                          setError(
                            "Could not connect that account. Try again or use another."
                          );
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="flex w-full items-center gap-2 border border-transparent px-2 py-1.5 text-left hover:border-mint/30 hover:bg-panel2 disabled:opacity-50"
                    >
                      {acc.photoURL ? (
                        <Image
                          src={acc.photoURL}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint/20 text-[11px] text-mint">
                          {(acc.displayName || acc.email).slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs text-soft">
                          {acc.displayName || acc.email.split("@")[0]}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-mute">
                          {acc.email}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mb-2 px-1 font-mono text-[10px] text-mute">
                  Pick a Google account below to continue.
                </p>
              )}

              {/* Compact GIS button when Web client ID is configured */}
              <div ref={gisBtnRef} className="mb-2 flex justify-center" />

              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    await signIn({ pickAccount: true });
                    setOpen(false);
                  } catch {
                    setError("Could not connect Google account. Please try again.");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="flex w-full items-center gap-2 border border-line px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute hover:border-mint/40 hover:text-mint disabled:opacity-50"
              >
                <UserRound size={12} />
                Use another account
              </button>

              {accounts.length > 0 && (
                <button
                  type="button"
                  className="mt-1 w-full px-1 py-1 text-left font-mono text-[9px] text-mute/70 hover:text-mute"
                  onClick={() => {
                    accounts.forEach((a) => removeSavedGoogleAccount(a.email));
                    refreshAccounts();
                  }}
                >
                  Clear saved accounts
                </button>
              )}

              {error && (
                <div className="mt-2 border border-red-500/30 bg-red-500/10 p-2 font-mono text-[10px] text-red-200">
                  {error}
                </div>
              )}
            </div>
          </>
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
