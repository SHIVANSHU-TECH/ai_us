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
    `Skills: ${[
      ...k.skills.frontend.slice(0, 5),
      ...k.skills.backend.slice(0, 6),
      ...k.skills.ai.slice(0, 5),
      ...k.skills.cloud.slice(0, 5),
      ...k.skills.databases,
    ].join(", ")}`,
  ].join("\n");
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
  const wantsAi = /ai engineer|llm|rag|gemini|openai|vector|agent/.test(q);

  if (wantsSalary || wantsJd || wantsAi) {
    parts.push(
      "Fit notes: " + resumeKnowledge.valueSignals.points.slice(0, 4).join(" ")
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
