/**
 * Verified resume knowledge for Shivanshu Shukla.
 * Source of truth: public/Shivanshu_resume_Swe.pdf (+ ClientScout from verified public product docs).
 * Update this file when the resume changes. Do not invent metrics or employers.
 */

export const resumeKnowledge = {
  version: "2026-10-17",
  profile: {
    name: "Shivanshu Shukla",
    title: "SOFTWARE ENGINEER / FULL STACK / AI / CLOUD",
    location: "New Delhi, India",
    summary:
      "I build production-ready full-stack applications, AI-powered systems, REST APIs, RAG workflows, and cloud infrastructure.",
    resumeSummary:
      "Experienced in building AI-powered applications, scalable full-stack platforms, REST APIs, RAG systems, workflow automation, and cloud-native applications using Next.js, Node.js, FastAPI, AWS, and LLM APIs.",
    email: "shivanshushukla2022@gmail.com",
    phone: "+91-9560137315",
    portfolio: "https://shivanshushukla.vercel.app",
    github: "https://github.com/shivanshu-tech",
    linkedin: "https://www.linkedin.com/in/shivanshu-shukla-3626322b5/",
    photo: "/images/shivanshu-linkedin.jpg",
    resumePdf: "/Shivanshu_resume_Swe.pdf",
  },
  education: [
    {
      school: "Guru Gobind Singh Indraprastha University (GGSIPU)",
      degree: "B.Tech in Computer Science",
      location: "New Delhi, India",
      period: "2020 – 2024",
      cgpa: "8.6/10",
    },
  ],
  experience: [
    {
      id: "binary-geckos",
      company: "Binary Geckos",
      role: "Full Stack Developer",
      period: "Apr 2026 – Present",
      location: "Remote",
      highlights: [
        "Developed and maintained 30+ production-ready websites for multiple telehealth and healthcare brands using React.js, delivering responsive, SEO-friendly, and high-performance user experiences.",
        "Built complete customer-facing platforms including landing pages, member portals, checkout flows, and admin interfaces, implementing end-to-end functionality based on client requirements and business workflows.",
        "Integrated Stripe Payment Gateway, GA4 analytics, webhooks, and third-party APIs to enable secure payments, user tracking, marketing automation, and seamless platform integrations.",
        "Implemented PAP (Post Affiliate Pro) tracking scripts for affiliate marketing; collaborated with clients on feature enhancements, bug fixes, and production-ready solutions across multiple brands.",
      ],
      tech: ["React.js", "Stripe", "GA4", "Webhooks", "Third-party APIs", "Post Affiliate Pro"],
    },
    {
      id: "arora",
      company: "Arora Innovation LLC (Cosmiron)",
      role: "Full Stack Developer",
      period: "Dec 2025 – Mar 2026",
      location: "Remote",
      link: "https://cosmiron.com",
      highlights: [
        "Developed and maintained production-grade full-stack applications using React.js, Node.js, REST APIs, and Meta Graph API.",
        "Redesigned AWS cloud infrastructure by optimizing EC2, ECS, VPC, NAT Gateways, and VPC Endpoints, improving deployment efficiency while reducing infrastructure complexity and operational costs.",
        "Implemented secure webhook integrations, production deployment workflows, and GitHub Actions-based CI/CD pipelines.",
      ],
      tech: ["React.js", "Node.js", "REST APIs", "Meta Graph API", "AWS", "GitHub Actions"],
    },
    {
      id: "collegexconnect",
      company: "CollegeXConnect",
      role: "Founder & Product Lead",
      period: "Jun 2024 – Present",
      location: "New Delhi, India",
      link: "https://collegexconnect.com",
      highlights: [
        "Founded and scaled an all-in-one student platform serving 3,000+ registered users and attracting over 250,000+ visitors.",
        "Architected the complete platform using Next.js, Node.js, MongoDB, Firebase, REST APIs, and Cloudinary — owning frontend, backend, authentication, database design, and deployment.",
        "Built automated content ingestion and moderation workflows, hosting 55+ academic resources and publishing 100+ verified job opportunities.",
        "Expanded through partnerships with 30+ colleges, a 2,000+ member student community, and 3 community collaborations.",
      ],
      tech: ["Next.js", "Node.js", "MongoDB", "Firebase", "REST APIs", "Cloudinary"],
      metrics: [
        "3,000+ registered users",
        "250,000+ visitors",
        "55+ academic resources",
        "100+ verified job opportunities",
        "30+ college partnerships",
        "2,000+ member student community",
      ],
    },
    {
      id: "tikk18",
      company: "Tikk18",
      role: "Web Developer Associate",
      period: "May 2025 – Aug 2025",
      location: "Remote / New Delhi, India",
      highlights: [
        "Developed and deployed the official company website using Next.js, Firebase, Tailwind CSS, Shadcn UI, and Framer Motion.",
        "Integrated backend APIs, optimized Core Web Vitals, implemented on-page SEO best practices, and collaborated with founders on performance and UX.",
      ],
      tech: ["Next.js", "Firebase", "Tailwind CSS", "Shadcn UI", "Framer Motion"],
    },
    {
      id: "vital-vistara",
      company: "Vital-Vistara (ASM Cognitive)",
      role: "Web Developer Intern",
      period: "May 2024 – Jul 2024",
      location: "New Delhi, India",
      highlights: [
        "Developed responsive landing pages and internal web tools using React, Firebase, and Tailwind CSS.",
        "Improved navigation flow, responsive layouts, and UI consistency across desktop and mobile devices.",
      ],
      tech: ["React", "Firebase", "Tailwind CSS"],
    },
    {
      id: "salesforce",
      company: "Salesforce",
      role: "Web Developer Intern",
      period: "Jul 2022 – Sep 2022",
      location: "New Delhi, India",
      highlights: [
        "Developed secure backend workflows using TLS encryption, object-level access control, and rule-based authorization.",
        "Implemented secure data access logic using the Salesforce Platform and JavaScript for authentication, authorization, and compliance-focused processes.",
      ],
      tech: ["Salesforce Platform", "JavaScript", "TLS", "Access control"],
    },
  ],
  projects: [
    {
      id: "companybrain",
      number: "01",
      title: "CompanyBrain",
      subtitle: "Enterprise Knowledge Search Platform (RAG)",
      year: "2025",
      problem:
        "Enterprise teams struggle to find accurate answers across large collections of PDFs and internal documents using keyword search alone.",
      approach:
        "Built a Retrieval-Augmented Generation platform for conversational semantic search across enterprise documents and PDFs.",
      workflow: [
        "PDF → Parsing → Chunking → Vector Index → Retrieval → Contextual Answer",
      ],
      architectureNotes: [
        "Document parsing, chunking, indexing, and vector retrieval pipelines to improve answer relevance.",
        "Offline vector caching strategy to reduce retrieval latency while minimizing compute cost.",
      ],
      tech: ["React", "Vector Search", "PDF Parsing"],
      outcomes: [
        "Documented retrieval latency of approximately 1.3 seconds with offline vector caching.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
    },
    {
      id: "voice-assistant",
      number: "02",
      title: "AI Voice Assistant",
      subtitle: "Desktop AI Automation Agent",
      year: "2025",
      problem:
        "Repetitive desktop tasks and fragmented assistant experiences slow down day-to-day engineering workflows.",
      approach:
        "Built a desktop AI assistant with conversational memory, request routing, and controlled local system automation.",
      workflow: [
        "User Request → Intent Routing → Gated Action → Controlled Execution",
      ],
      architectureNotes: [
        "Modular AI agent workflows with gated execution and structured action routing.",
        "Persistent conversational state management for follow-up context.",
      ],
      tech: ["React", "Electron.js", "WebSockets", "Gemini API"],
      outcomes: [
        "Approximately 65% reduction in repetitive user interactions through conversational memory and intelligent task routing.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
    },
    {
      id: "applyai",
      number: "03",
      title: "ApplyAI",
      subtitle: "AI Resume Screening Platform",
      year: "2024",
      problem:
        "Manual resume screening is slow and inconsistent when matching candidates to role requirements at scale.",
      approach:
        "Built an AI-powered recruitment assistant for automated resume parsing, semantic candidate ranking, and job-role similarity analysis.",
      workflow: [
        "Resume Upload → Parsing → Semantic Scoring → Role Similarity → AI Recommendations",
      ],
      architectureNotes: [
        "Resume parsing and scoring algorithms with AI-generated improvement recommendations.",
        "Gemini API for semantic analysis and intelligent resume evaluation.",
        "RBAC for secure multi-user recruitment workflows.",
      ],
      tech: ["Next.js", "Gemini API", "Resume Parser", "Shadcn UI", "RBAC"],
      outcomes: [
        "Designed to reduce manual candidate screening effort via automated ranking and recommendations.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
    },
    {
      id: "clientscout",
      number: "04",
      title: "ClientScout AI",
      subtitle: "AI-Powered Business Lead Discovery",
      year: "2025–2026",
      problem:
        "Freelancers and agencies waste time finding local businesses, verifying contacts, and writing first-touch outreach.",
      approach:
        "Built an AI-powered lead generation product that discovers local businesses, scores opportunity fit, surfaces public contacts when available, and helps generate outreach.",
      workflow: [
        "Service + Industry + City → Live Lead Search → Fit Scoring → Contacts → Outreach / Export",
      ],
      architectureNotes: [
        "Live lead search for real local businesses (not fabricated lists).",
        "High / Medium / Low potential scoring with why-this-fits rationale.",
        "Public phone, site, or email when discoverable; CSV/PDF export; outreach message generation.",
        "Credits-based usage model with saved leads and search history.",
      ],
      tech: ["AI lead discovery", "Business verification", "Opportunity scoring", "Outreach generation"],
      outcomes: [
        "Live product available at https://clientscout.in for freelancers and agencies.",
      ],
      liveUrl: "https://clientscout.in",
      githubUrl: null as string | null,
      sourceNote:
        "ClientScout is a verified public product built by Shivanshu (live at clientscout.in). Detailed employer-style bullets are not listed on the resume PDF; describe only documented product capabilities.",
    },
    {
      id: "alphafind",
      number: "05",
      title: "AlphaFind",
      subtitle: "Alphabet Prediction / Demo Betting Game",
      year: "2025–2026",
      problem:
        "Need a fun, demo-safe prediction game with fair randomness and Firebase-backed accounts — without real on-chain money.",
      approach:
        "Casino-style alphabet game: bet demo USDC on vowel / consonant / exact letter, with Firebase Auth + Realtime Database and an Express API.",
      workflow: [
        "Sign in → Place demo bet → Provably fair HMAC-SHA256 roll → Payout demo balance",
      ],
      architectureNotes: [
        "React + Vite frontend; Express backend; Firebase Auth + Realtime Database.",
        "Provably fair HMAC-SHA256 RNG; starting demo balance 1000.",
        "Multipliers: VOWEL 4.8x, CONSONANT 1.18x, EXACT 24x — balances are in-app demo coins, not real USDC.",
      ],
      tech: ["React", "Vite", "Express", "Firebase Auth", "Realtime Database"],
      outcomes: [
        "Playable demo betting loop with fair RNG and Firebase persistence.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder alpha-find). Demo coins only — never claim real crypto or on-chain USDC.",
    },
    {
      id: "automate-work",
      number: "06",
      title: "Automate Work",
      subtitle: "Agency Website Analyzer → CRM → AI Proposals",
      year: "2025–2026",
      problem:
        "Agencies need one workspace to analyze prospect sites, manage CRM, draft AI proposals, and produce social/outreach assets.",
      approach:
        "End-to-end agency monorepo: prospect site analysis, CRM, AI proposals, LinkedIn/X generators, and URL shortener.",
      workflow: [
        "Prospect URL → Analyze (Playwright/Lighthouse) → CRM → AI proposal → Export / social drafts",
      ],
      architectureNotes: [
        "npm monorepo: Next.js 15 web + Express API; Firestore persistence; Groq for AI; Playwright + Lighthouse for analysis.",
        "User-scoped Firestore data; JWT after Firebase Auth; export PDF/DOCX/HTML/MD.",
        "Older docs mentioning SQLite are outdated — persistence is Firestore.",
      ],
      tech: [
        "Next.js 15",
        "Express",
        "Firestore",
        "Firebase Auth",
        "Groq",
        "Playwright",
        "Lighthouse",
      ],
      outcomes: [
        "Unified agency workspace from site analysis through proposal export and social drafts.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder Automation-Only / brand Automate Work). npm name may appear as ai-proposal-generator.",
    },
    {
      id: "browsy",
      number: "07",
      title: "Browsy",
      subtitle: "Local Playwright Outreach Agent (IG + LinkedIn)",
      year: "2025–2026",
      problem:
        "Teams want visible-browser outreach on Instagram and LinkedIn without private APIs or CAPTCHA solvers.",
      approach:
        "Local Playwright agent that drives a real Chrome UI for Instagram DMs, LinkedIn connect/message, and Promote-a-post — with a dashboard over Express + WebSocket.",
      workflow: [
        "Queue job → Visible Chrome automation → Security challenge pause if needed → Local JSON result",
      ],
      architectureNotes: [
        "TypeScript, Playwright (Chrome), optional Groq, Express + WebSocket dashboard on port 3847.",
        "No private APIs / CAPTCHA solvers; security challenges pause the agent; data stored in local JSON files.",
        "Pairs with Circulation (outreach-amplifier): promote jobs can be queued to Browsy.",
      ],
      tech: ["TypeScript", "Playwright", "Express", "WebSocket", "Groq"],
      outcomes: [
        "Local, human-visible outreach automation for IG/LI with challenge-aware pauses.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder browser agent / brand Browsy). Never claim scraped DMs, spam, or CAPTCHA bypass.",
    },
    {
      id: "onecircle",
      number: "08",
      title: "OneCircle",
      subtitle: "Consent-Based Live Location + Safety Circles",
      year: "2025–2026",
      problem:
        "Families need consent-based location sharing and distance alerts without creepy always-on tracking.",
      approach:
        "Safety circles with live location (opt-in) and distance alerts vs circle admin.",
      workflow: [
        "Join circle → Consent to share location → Live updates → Distance alerts",
      ],
      architectureNotes: [
        "Express + MongoDB + Socket.io backend; Next.js web; Expo mobile.",
        "Backend API is functional; web/mobile UIs are mostly prototypes not yet fully wired to the API.",
        "Alert bands: >10 km info, >50 km warning, >200 km emergency vs circle admin.",
      ],
      tech: ["Express", "MongoDB", "Socket.io", "Next.js", "Expo"],
      outcomes: [
        "Working location/safety API with defined distance alert thresholds; client UIs still maturing.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder onecircle). Be honest that web/mobile UIs are prototypes vs the API.",
    },
    {
      id: "circulation",
      number: "09",
      title: "Circulation",
      subtitle: "Impression-Target Campaign Planner (Approve-before-send)",
      year: "2025–2026",
      problem:
        "Creators need an honest organic vs paid plan for a post’s impression target — without fake views or spam.",
      approach:
        "Paste a live post URL + impression target → plan → draft → human approve before send; optional Meta Ads created PAUSED; can queue IG/LI shares via Browsy.",
      workflow: [
        "Post URL + target → Organic/paid plan → Draft → Approve → Send / queue Browsy",
      ],
      architectureNotes: [
        "Express, Zod, optional Groq, SSE desk UI, JSON persistence (port 4060).",
        "Approve-before-send; Meta Ads created PAUSED; can POST promote jobs to Browsy (:3847).",
        "Out of scope: spam, fake views, scraped DMs, virality guarantees.",
      ],
      tech: ["Express", "Zod", "Groq", "SSE", "JSON persistence"],
      outcomes: [
        "Campaign desk that plans impressions and only acts after explicit approval.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder outreach-amplifier / brand Circulation). Sibling of Browsy.",
    },
    {
      id: "promptie",
      number: "10",
      title: "Promptie",
      subtitle: "Multi-Brand Prompt Library + Checkout Flow Tests",
      year: "2025–2026",
      problem:
        "Multi-brand ops need reusable prompts, member data, and checkout flow checks without rewriting everything per site.",
      approach:
        "Brand ops platform: reusable {{slot}} prompts, companies, Groq chat, Google Sheet site/widget lookup, member JSON, and headless Chrome checkout flow tests.",
      workflow: [
        "Brand + slots → Prompt library / Groq chat → Sheet lookup → Optional live checkout flow test",
      ],
      architectureNotes: [
        "Next.js 16, Firebase Auth/Firestore, Groq, headless Chrome for flow tests.",
        "Google sign-in required; Chat needs GROQ_API_KEY; flow tests hit live stores + temp mail.",
      ],
      tech: ["Next.js 16", "Firebase Auth", "Firestore", "Groq", "Headless Chrome"],
      outcomes: [
        "Central prompt/ops desk with optional live checkout flow verification.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder promptie). Do not invent store URLs or private sheet contents.",
    },
    {
      id: "halcyon-desk",
      number: "11",
      title: "Halcyon Desk",
      subtitle: "Paper-First Crypto/Stock Trading Copilot",
      year: "2025–2026",
      problem:
        "Traders want a disciplined paper desk that scans opportunities and enforces profit filters — without reckless auto-loss selling.",
      approach:
        "Paper-first trading copilot: scan CoinDCX/CoinSwitch + stocks, 10-check profit filter, +10%/+20% take-profits, kill switch on by default for live.",
      workflow: [
        "Scan markets → 10-check filter → Paper (or gated live) idea → Take-profit levels / kill switch",
      ],
      architectureNotes: [
        "Express, JSON DB, SSE UI, optional Groq, optional live CoinDCX/CoinSwitch (port 4050).",
        "Never auto-sells at a loss; kill switch on by default for live; agent budget caps open notional.",
        "Not investment advice.",
      ],
      tech: ["Express", "JSON DB", "SSE", "Groq", "CoinDCX", "CoinSwitch"],
      outcomes: [
        "Paper-first desk with strict risk gates and optional live exchange hooks.",
      ],
      liveUrl: null as string | null,
      githubUrl: "https://github.com/shivanshu-tech",
      sourceNote:
        "Local portfolio product (folder trading-platform / brand Halcyon Desk). Never present as financial advice or guaranteed returns.",
    },
  ],
  achievements: [
    "Founded and scaled a cross-college student community across GGSIPU to 10,000+ active members.",
    "Led planning and execution of 5+ large-scale technical and cultural events.",
    "Solved 200+ DSA problems with a 100-day continuous CodeChef coding streak.",
    "Recognized as a Google Developer Student Clubs (GDSC) Web Associate.",
    "Awarded Silver Medal at the Inter-University Sports Competition.",
  ],
  skills: {
    frontend: ["React", "Next.js", "Electron.js", "Vite", "Shadcn UI", "Framer Motion", "Tailwind CSS"],
    backend: [
      "Node.js",
      "Express.js",
      "FastAPI (Python)",
      "REST APIs",
      "Authentication",
      "JWT",
      "API Design",
      "Middleware",
      "WebSockets",
      "Webhooks",
      "RBAC",
    ],
    ai: [
      "Gemini API",
      "OpenAI API",
      "HuggingFace Hub",
      "Vector Search (RAG)",
      "Prompt Engineering",
      "AI Agents",
      "LLM Integration",
      "Semantic Search",
    ],
    databases: ["MongoDB", "Firebase", "PostgreSQL", "Supabase"],
    cloud: [
      "AWS",
      "Vercel",
      "Netlify",
      "Render",
      "Docker",
      "Firebase Hosting",
      "Cloudinary",
      "GitHub Actions",
      "CI/CD",
    ],
    security: ["JWT", "RBAC", "TLS", "Authentication", "Webhook security", "Access control"],
    languages: ["JavaScript", "TypeScript", "C++", "C", "Java"],
  },
  architectureOverview: {
    disclaimer:
      "High-level representation of Shivanshu's skills and experience across projects — not a claim that every project uses every technology.",
    layers: [
      {
        id: "frontend",
        label: "Frontend",
        tech: ["React", "Next.js", "Electron"],
      },
      {
        id: "api",
        label: "API Layer",
        tech: ["Node.js", "FastAPI", "REST APIs"],
      },
      {
        id: "auth",
        label: "Authentication",
        tech: ["JWT", "RBAC"],
      },
      {
        id: "ai",
        label: "AI / RAG",
        tech: ["Gemini", "LLM APIs", "RAG", "Vector search"],
      },
      {
        id: "data",
        label: "Database",
        tech: ["MongoDB", "Firebase", "PostgreSQL"],
      },
    ],
  },
  valueSignals: {
    note: "Use these only when discussing fit, compensation context, or role suitability. Ground claims in verified outcomes; never invent salary figures.",
    points: [
      "Ships production systems end-to-end: Binary Geckos (30+ healthcare/telehealth sites), Cosmiron (full-stack + AWS), CollegeXConnect (founder-owned platform).",
      "AI systems depth: RAG (CompanyBrain ~1.3s retrieval), desktop agents (Voice Assistant ~65% interaction reduction), ApplyAI screening, ClientScout lead discovery.",
      "Broader portfolio products: Automate Work (agency CRM/proposals), Browsy + Circulation (approve-before-send outreach), Promptie (brand prompts + flow tests), OneCircle (safety location), AlphaFind (demo game), Halcyon Desk (paper trading).",
      "Client delivery: Aviva Beauty live Shopify OS 2.0 theme; Creator.co.ai AI short-form video automation; Connect Astro astrology consultation platform for founder Gautam.",
      "Cloud & reliability: AWS EC2/ECS/VPC redesign, GitHub Actions CI/CD, Stripe/webhooks/third-party integrations in production.",
      "Product ownership: founded CollegeXConnect with 3,000+ users and 250,000+ visitors — demonstrates ownership beyond ticket-level execution.",
      "Academic signal: B.Tech CSE, CGPA 8.6/10; GDSC Web Associate; 200+ DSA problems.",
    ],
  },
  /**
   * Verified client engagements (source of truth also in docs/client-work.md).
   * Do not invent metrics, revenue, or unpublished URLs.
   */
  clientWork: [
    {
      id: "aviva-beauty",
      client: "Aviva Beauty",
      contactPerson: "Vanshika (Founder)",
      category: "Shopify / D2C ecommerce",
      liveUrl: "https://avivabeauty.in",
      summary:
        "Custom Shopify Online Store 2.0 theme for Aviva Beauty — brand-specific Indian D2C skincare storefront (not a stock Dawn skin): homepage storytelling, product discovery, cart offers, reviews, and checkout-ready UX.",
      scope: [
        "Custom homepage (hero, promos, featured products, actives, rituals, gift potli, retail banners)",
        "Shop all / collections with product cards; PDP with gallery, offers, ingredients/FAQ, Judge.me reviews",
        "About Us (brand + founder story), Contact, blog, cart drawer, search, 404",
        "Cart drawer with Buy 2 @ ₹799 / Buy 3 @ ₹1149 progress tracker, coupon UX, upsells",
        "Product image fade rotation; Watch & Shop video tiles with mute/unmute (one unmuted at a time)",
        "Theme settings for Judge.me, Aviva Concierge chat, GA4, WhatsApp; Fastrr/Shiprocket checkout via store apps",
      ],
      tech: [
        "Shopify OS 2.0",
        "Liquid",
        "theme.js",
        "Judge.me",
        "Fastrr / Shiprocket",
        "GA4",
        "WhatsApp",
      ],
      pitchingAngles: [
        "D2C / ecommerce founders who need a custom Shopify theme + conversion-focused cart UX",
        "Skincare / beauty brands wanting homepage storytelling + offers UX for India",
        "Stores that need theme look/UX separate from Admin discount math (Fastrr / bundle apps)",
      ],
      notes:
        "Theme guides offer UX; actual ₹799/₹1149 pricing must be configured in Shopify Discounts / Fastrr / bundle apps. Store support contacts on live site: +91 8595300801, Support@Avivabeauty.in, New Delhi.",
    },
    {
      id: "creator-co-ai",
      client: "Creator.co.ai",
      contactPerson: "Rohit Bamola",
      category: "AI content automation / Reels",
      liveUrl:
        "https://res.cloudinary.com/dpfmxzkr/video/upload/v1791141530/ai-agents-vishal-sikka/regen-avatar2/final/ai-agents-vishal-sikka-avatar2-final.mp4",
      linkLabel: "Demo reel",
      summary:
        "Built AI-powered short-form video automation for Creator.co.ai — systems that help turn content ideas into finished Instagram-style reels with voice, visuals, and delivery, managed with Rohit Bamola.",
      scope: [
        "Created AI reel / short-form video automation workflows for the brand",
        "Automated path from idea → script → voice → presenter visuals → finished reel",
        "Designed for repeatable creator content production (not one-off manual edits)",
      ],
      tech: ["AI video automation", "Voice generation", "Avatar video", "Content workflows"],
      pitchingAngles: [
        "Creators or agencies that need repeatable AI reel / short-form video automation",
        "Founders who want content production systems instead of one-off ChatGPT prompts",
        "AI / automation problems similar to Creator.co.ai work with Rohit Bamola",
      ],
      notes:
        "Keep explanations simple — what was built and the outcome. Do not name internal skill repos, avatar engine versions, or step-by-step tool pipelines. Share the Cloudinary demo reel URL when relevant.",
    },
    {
      id: "connect-astro",
      client: "Connect Astro",
      contactPerson: "Gautam (Founder)",
      category: "Astrology consultation platform",
      liveUrl: null as string | null,
      summary:
        "Built Connect Astro for founder Gautam — an astrology consultation platform in the same category as AstroTalk, where users can connect with astrologers and take consultations.",
      scope: [
        "Astrology consultation product where users connect with astrologers",
        "Consultation / ask-an-astrologer style experience similar to AstroTalk",
        "Client product work for founder Gautam under the Connect Astro brand",
      ],
      tech: ["Full-stack product", "Consultation marketplace", "Consumer web app"],
      pitchingAngles: [
        "Founders building consultation / marketplace apps (book or chat with experts)",
        "Astrology or wellness platforms that need product + engineering delivery",
        "Consumer apps where users connect with professionals for paid guidance",
      ],
      notes:
        "This is an astrology consultation platform (not a desktop app). Do not invent live URLs or metrics until provided.",
    },
  ],
} as const;

export type ResumeKnowledge = typeof resumeKnowledge;

export const SUGGESTED_PROMPTS = [
  "Give me a quick overview of Shivanshu's background.",
  "Explain the architecture of CompanyBrain.",
  "What has he built using React and Next.js?",
  "Tell me about his experience at Binary Geckos.",
  "Explain ClientScout AI and how it works.",
  "What is Browsy and how does it work with Circulation?",
  "Tell me about Automate Work and Halcyon Desk.",
  "Show me his experience relevant to an AI Engineer role.",
  "Compare his experience with a job description.",
] as const;

export function buildKnowledgeContext(): string {
  const k = resumeKnowledge;
  return [
    `PROFILE: ${k.profile.name} — ${k.profile.title}`,
    `LOCATION: ${k.profile.location}`,
    `SUMMARY: ${k.profile.resumeSummary}`,
    `CONTACT: ${k.profile.email} | ${k.profile.phone} | ${k.profile.portfolio} | ${k.profile.github}`,
    "",
    "EDUCATION:",
    ...k.education.map(
      (e) => `- ${e.degree}, ${e.school} (${e.period}), CGPA ${e.cgpa}`
    ),
    "",
    "EXPERIENCE:",
    ...k.experience.flatMap((exp) => [
      `- ${exp.role} @ ${exp.company} (${exp.period}, ${exp.location})`,
      ...exp.highlights.map((h) => `  • ${h}`),
      `  Tech: ${exp.tech.join(", ")}`,
    ]),
    "",
    "PROJECTS:",
    ...k.projects.flatMap((p) => [
      `- ${p.title} (${p.subtitle}, ${p.year})`,
      `  Problem: ${p.problem}`,
      `  Approach: ${p.approach}`,
      `  Workflow: ${p.workflow.join(" | ")}`,
      ...p.architectureNotes.map((n) => `  Arch: ${n}`),
      `  Tech: ${p.tech.join(", ")}`,
      ...p.outcomes.map((o) => `  Outcome: ${o}`),
      p.liveUrl ? `  Live: ${p.liveUrl}` : "  Live: not publicly listed",
      "sourceNote" in p && p.sourceNote ? `  Note: ${p.sourceNote}` : "",
    ]),
    "",
    "ACHIEVEMENTS:",
    ...k.achievements.map((a) => `- ${a}`),
    "",
    "SKILLS:",
    `Frontend: ${k.skills.frontend.join(", ")}`,
    `Backend: ${k.skills.backend.join(", ")}`,
    `AI: ${k.skills.ai.join(", ")}`,
    `Databases: ${k.skills.databases.join(", ")}`,
    `Cloud: ${k.skills.cloud.join(", ")}`,
    `Security: ${k.skills.security.join(", ")}`,
    `Languages: ${k.skills.languages.join(", ")}`,
    "",
    "CLIENT WORK:",
    ...k.clientWork.map(
      (c) =>
        `- ${c.client} (${c.contactPerson}): ${c.category}. ${c.summary} ${c.liveUrl ? `URL: ${c.liveUrl}` : ""}`
    ),
    "",
    "VALUE SIGNALS (for fit / compensation discussions):",
    ...k.valueSignals.points.map((p) => `- ${p}`),
    `Note: ${k.valueSignals.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}
