/** Strip secrets / tokens from strings before any server logging. */
export function redactSecrets(input: unknown): string {
  let text = typeof input === "string" ? input : String(input ?? "");

  text = text
    // Groq / OpenAI-style keys
    .replace(/\bgsk_[A-Za-z0-9]{10,}\b/g, "[redacted]")
    .replace(/\bsk-[A-Za-z0-9_-]{10,}\b/g, "[redacted]")
    // Bearer / JWT
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, "Bearer [redacted]")
    .replace(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9._\-]+\.[A-Za-z0-9._\-]+\b/g,
      "[redacted-jwt]"
    )
    // PEM / service account fragments
    .replace(
      /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
      "[redacted-private-key]"
    )
    .replace(/"private_key"\s*:\s*"[^"]*"/g, '"private_key":"[redacted]"')
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[redacted-google-key]")
    // Env-style assignments that might appear in stack traces
    .replace(
      /\b(GROQ_API_KEY|FIREBASE_SERVICE_ACCOUNT_JSON|FIREBASE_SERVICE_ACCOUNT_PATH)\s*=\s*\S+/gi,
      "$1=[redacted]"
    );

  return text.slice(0, 240);
}

export function safeError(scope: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[${scope}]`, redactSecrets(msg));
}
