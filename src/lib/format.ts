/** Lightweight markdown formatting for chat responses. */
export function formatAssistantText(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code first so we don't bold/italic inside fences.
  let html = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Soften markdown headings into readable emphasis.
  html = html.replace(/^#{1,3}\s+(.+)$/gm, "<strong>$1</strong>");

  // Turn simple "- " / "* " bullets into clearer lines.
  html = html.replace(/^[\-\*]\s+/gm, "• ");

  return html;
}
