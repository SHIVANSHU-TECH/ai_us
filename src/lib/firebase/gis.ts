"use client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (cb?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          cancel: () => void;
          renderButton: (parent: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const SCRIPT = "https://accounts.google.com/gsi/client";

export function getGoogleClientId(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || null;
}

let scriptPromise: Promise<void> | null = null;

export function loadGisScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("GIS load failed")));
      if (window.google?.accounts?.id) resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("GIS load failed"));
    document.head.appendChild(s);
  });

  return scriptPromise;
}

export async function initGisOneTap(
  onCredential: (idToken: string) => void | Promise<void>
): Promise<boolean> {
  const clientId = getGoogleClientId();
  if (!clientId) return false;

  try {
    await loadGisScript();
    if (!window.google?.accounts?.id) return false;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (response.credential) void onCredential(response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      context: "signin",
      ux_mode: "popup",
      use_fedcm_for_prompt: true,
    });
    return true;
  } catch {
    return false;
  }
}

/** Compact Google account prompt (FedCM / One Tap) — not the full OAuth modal. */
export function promptGisAccounts(): void {
  window.google?.accounts?.id?.prompt();
}

export function renderGisButton(
  parent: HTMLElement,
  onCredential: (idToken: string) => void | Promise<void>
): boolean {
  const clientId = getGoogleClientId();
  if (!clientId || !window.google?.accounts?.id) return false;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential?: string }) => {
      if (response.credential) void onCredential(response.credential);
    },
    auto_select: false,
    cancel_on_tap_outside: true,
    context: "signin",
    ux_mode: "popup",
    use_fedcm_for_prompt: true,
  });

  parent.innerHTML = "";
  window.google.accounts.id.renderButton(parent, {
    type: "standard",
    theme: "filled_black",
    size: "medium",
    text: "continue_with",
    shape: "rectangular",
    width: 220,
    logo_alignment: "left",
  });
  return true;
}
