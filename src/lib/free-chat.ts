/** Anonymous users get this many free user messages before Google login is required. */
export const FREE_CHAT_LIMIT = 3;

export const FREE_CHAT_COOKIE = "usemeai_free_msgs";

export function parseFreeCount(raw: string | undefined | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(200, Math.floor(n));
}
