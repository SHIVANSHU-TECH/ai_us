import { resumeKnowledge } from "./resume-knowledge";

/** Tiny always-on profile card (~few hundred tokens). */
export function buildCoreProfile(): string {
  const k = resumeKnowledge;
  const edu = k.education[0];
  return [
    `${k.profile.name} | ${k.profile.title} | ${k.profile.location}`,
    k.profile.resumeSummary,
    `Contact: ${k.profile.email} | ${k.profile.phone} | ${k.profile.portfolio} | ${k.profile.github}`,
    `Education: ${edu.degree}, ${edu.school} (${edu.period}), CGPA ${edu.cgpa}`,
    "Roles: Binary Geckos (Full Stack, Apr 2026–Present, 30+ healthcare sites, React/Stripe/GA4); Arora Innovation/Cosmiron (Full Stack, Dec 2025–Mar 2026, React/Node/AWS/CI-CD); CollegeXConnect Founder (Jun 2024–Present, 3k+ users, 250k+ visitors, Next.js/Node/MongoDB/Firebase); Tikk18; Vital-Vistara; Salesforce intern.",
    "Projects: CompanyBrain RAG (~1.3s retrieval); AI Voice Assistant Electron/Gemini (~65% fewer repetitive actions); ApplyAI resume screening; ClientScout AI (https://clientscout.in).",
    "Client work: Aviva Beauty Shopify OS 2.0 (Vanshika, https://avivabeauty.in); Creator.co.ai AI reel automation (Rohit Bamola); Connect Astro desktop (Gautam, founder).",
    `Skills: ${[
      ...k.skills.frontend.slice(0, 5),
      ...k.skills.backend.slice(0, 6),
      ...k.skills.ai.slice(0, 5),
      ...k.skills.cloud.slice(0, 5),
      ...k.skills.databases,
    ].join(", ")}`,
  ].join("\n");
}

function detailClients(ids?: string[]): string {
  const list =
    ids && ids.length > 0
      ? resumeKnowledge.clientWork.filter((c) => ids.includes(c.id))
      : resumeKnowledge.clientWork;
  return list
    .map((c) => {
      const live = c.liveUrl ? ` Live: ${c.liveUrl}` : "";
      return `${c.client} (${c.contactPerson}) — ${c.category}. ${c.summary} Scope: ${c.scope.slice(0, 4).join("; ")}. Pitch when: ${c.pitchingAngles[0]}.${live}${c.notes ? ` Note: ${c.notes}` : ""}`;
    })
    .join("\n");
}

function detailExperience(ids: string[]): string {
  return resumeKnowledge.experience
    .filter((e) => ids.includes(e.id))
    .map(
      (e) =>
        `${e.role} @ ${e.company} (${e.period}): ${e.highlights.slice(0, 2).join(" ")} Tech: ${e.tech.join(", ")}`
    )
    .join("\n");
}

function detailProjects(ids: string[]): string {
  return resumeKnowledge.projects
    .filter((p) => ids.includes(p.id))
    .map((p) => {
      const live = p.liveUrl ? ` Live: ${p.liveUrl}` : "";
      return `${p.title}: ${p.approach} Flow: ${p.workflow[0]}. Outcomes: ${p.outcomes.join("; ")}. Tech: ${p.tech.join(", ")}.${live}`;
    })
    .join("\n");
}

/**
 * Build a lean knowledge pack for the current question.
 * Keeps prompt small so Groq responds much faster.
 */
export function buildRelevantKnowledge(query: string): string {
  const q = query.toLowerCase();
  const parts = [buildCoreProfile()];

  const wantsOverview =
    /overview|background|about|who is|summary|quick|tell me about shivanshu|introduce/.test(
      q
    );
  const wantsJd =
    /job description|jd\b|compare|requirements|fit for|role fit|hiring for/.test(
      q
    );
  const wantsSalary = /salary|compensat|offer|pay|package|underpaid|worth/.test(
    q
  );
  const wantsSkills =
    /skill|react|next|node|aws|cloud|backend|frontend|stack|fastapi|mongo|postgres/.test(
      q
    );
  const wantsAi =
    /ai engineer|llm|rag|gemini|openai|vector|agent|automation|reel|heygen|elevenlabs/.test(
      q
    );
  const wantsClients =
    /client|aviva|shopify|d2c|ecommerce|e-commerce|skincare|beauty|vanshika|creator\.co|rohit|bamola|reel|connect.?astro|gautam|desktop app|freelance|agency|brand/.test(
      q
    );

  if (wantsSalary || wantsJd || wantsAi) {
    parts.push(
      "Fit notes: " + resumeKnowledge.valueSignals.points.slice(0, 5).join(" ")
    );
  }

  if (wantsClients || wantsOverview) {
    parts.push(
      wantsOverview || /client work|clients|portfolio of clients/.test(q)
        ? detailClients()
        : detailClients(
            [
              /aviva|shopify|d2c|ecommerce|beauty|skincare|vanshika/.test(q)
                ? "aviva-beauty"
                : "",
              /creator|rohit|bamola|reel|heygen|short.?form|instagram/.test(q)
                ? "creator-co-ai"
                : "",
              /connect.?astro|gautam|desktop/.test(q) ? "connect-astro" : "",
            ].filter(Boolean)
          )
    );
  }

  if (/binary|geckos|telehealth|healthcare|stripe/.test(q)) {
    parts.push(detailExperience(["binary-geckos"]));
  }
  if (/arora|cosmiron|aws|ecs|vpc/.test(q)) {
    parts.push(detailExperience(["arora"]));
  }
  if (/college|founder|collegex/.test(q)) {
    parts.push(detailExperience(["collegexconnect"]));
  }
  if (/tikk18/.test(q)) parts.push(detailExperience(["tikk18"]));
  if (/vital|vistara|asm/.test(q)) parts.push(detailExperience(["vital-vistara"]));
  if (/salesforce/.test(q)) parts.push(detailExperience(["salesforce"]));

  if (/companybrain|rag|document search|vector|chunk/.test(q)) {
    parts.push(detailProjects(["companybrain"]));
  }
  if (/voice assistant|electron|desktop automation/.test(q)) {
    parts.push(detailProjects(["voice-assistant"]));
  }
  if (/applyai|resume screen|candidate rank/.test(q)) {
    parts.push(detailProjects(["applyai"]));
  }
  if (/clientscout|lead|prospect|client scout/.test(q)) {
    parts.push(detailProjects(["clientscout"]));
  }

  // For focused skill/AI questions, add compact skills + top AI projects once.
  if (wantsSkills && !wantsOverview) {
    parts.push(
      `Frontend: ${resumeKnowledge.skills.frontend.join(", ")}`,
      `Backend: ${resumeKnowledge.skills.backend.join(", ")}`,
      `AI: ${resumeKnowledge.skills.ai.join(", ")}`,
      `Cloud: ${resumeKnowledge.skills.cloud.join(", ")}`
    );
  }

  if (wantsAi && !/companybrain|voice|applyai|clientscout/.test(q)) {
    parts.push(detailProjects(["companybrain", "voice-assistant", "applyai", "clientscout"]));
  }

  // Experience deep-dive without a named company → include current + founder briefly already in core.
  if (/experience|work history|employment|intern/.test(q) && parts.length === 1) {
    parts.push(
      detailExperience(["binary-geckos", "arora", "collegexconnect"])
    );
  }

  return parts.filter(Boolean).join("\n\n");
}
