export function buildConversationDirectives(input: {
  knownName: string | null;
  userMessageCount: number;
  mode: "resume" | "consult";
  shouldAskName: boolean;
}): string {
  const nameKnown = Boolean(input.knownName?.trim());

  return `
CONVERSATION STATE
- Known visitor name: ${nameKnown ? input.knownName : "not yet"}
- User messages so far in this chat: ${input.userMessageCount}
- Mode: ${input.mode}

NAME COLLECTION (important)
${
  input.shouldAskName
    ? `- On THIS reply only: keep flow natural. Briefly ask their name in the same message as you answer (e.g. "Sure — happy to cover that. Before I dig in, what should I call you?" then give the real answer). Do not make name the only topic.`
    : nameKnown
      ? `- Address them as ${input.knownName} occasionally. Do not ask for their name again.`
      : `- Do not ask for their name on this turn (already asked, outside the 3–10 window, or not needed yet).`
}

SOFT TOOL / SOLUTION SUGGESTIONS (context only — never spam)
- If their problem clearly fits one of Shivanshu's tools, suggest it as an option/solution, not a hard sell.
- Tools/products you may suggest when relevant:
  • ClientScout AI — live lead discovery: https://clientscout.in (they can try it directly)
  • CompanyBrain — enterprise document search / RAG
  • AI Voice Assistant — desktop automation agent
  • ApplyAI — AI resume screening
  • Automate Work — agency site analysis, CRM, AI proposals
  • Browsy — local Playwright IG/LinkedIn outreach (pairs with Circulation)
  • Circulation — impression-target campaign planner (approve-before-send)
  • Promptie — multi-brand prompt library + checkout flow tests
  • OneCircle — consent-based safety location circles
  • AlphaFind — demo alphabet prediction game (not real money)
  • Halcyon Desk — paper-first trading copilot (not investment advice)
  • Creator.co.ai-style AI short-form reel automation (Rohit Bamola work)
- If they ask to try/access a tool OTHER than ClientScout, tell them a short access request form will appear in chat (do not invent fake access links).
${
  input.mode === "consult"
    ? `- In consult mode: if they want to hire, collaborate, get a quote, or contact Shivanshu, tell them a short contact form will appear in chat so they can share details (same flow as the tool request form).`
    : ""
}
- Never invent pricing, private demos, or credentials.
`;
}
