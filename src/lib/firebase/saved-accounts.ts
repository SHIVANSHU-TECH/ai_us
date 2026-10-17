export interface SavedGoogleAccount {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  lastUsedAt: number;
}

const KEY = "usemeai_google_accounts";
const MAX = 6;

export function getSavedGoogleAccounts(): SavedGoogleAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedGoogleAccount[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((a) => a && typeof a.email === "string")
      .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function rememberGoogleAccount(input: {
  email: string | null | undefined;
  displayName?: string | null;
  photoURL?: string | null;
}) {
  if (typeof window === "undefined" || !input.email) return;
  const email = input.email.trim().toLowerCase();
  if (!email) return;

  const prev = getSavedGoogleAccounts().filter((a) => a.email !== email);
  const next: SavedGoogleAccount[] = [
    {
      email,
      displayName: input.displayName || null,
      photoURL: input.photoURL || null,
      lastUsedAt: Date.now(),
    },
    ...prev,
  ].slice(0, MAX);

  localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeSavedGoogleAccount(email: string) {
  if (typeof window === "undefined") return;
  const next = getSavedGoogleAccounts().filter(
    (a) => a.email !== email.trim().toLowerCase()
  );
  localStorage.setItem(KEY, JSON.stringify(next));
}
