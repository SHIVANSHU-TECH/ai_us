# Shivanshu's AI Resume

Production conversational resume for **Shivanshu Shukla** — a terminal-inspired command center where recruiters chat with an AI assistant grounded in verified resume data.

Stack: **Next.js App Router · TypeScript · Tailwind CSS · Groq (server-side)**

---

## 1. Installation

```bash
cd ai-resume
npm install
```

## 2. Environment variables

Copy the example file and add your Groq key:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | API key from [console.groq.com/keys](https://console.groq.com/keys) |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-20b` (fast). Optional: `openai/gpt-oss-120b`, `qwen/qwen3.8-27b` |
| `NEXT_TELEMETRY_DISABLED` | No | Set to `1` on Vercel (also set in `vercel.json`) |
| `NEXT_PUBLIC_FIREBASE_*` | Yes (for Google login) | Web app config from Firebase Console → Project settings |
| `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON` | Yes (for saving chats) | Local `usemeai.json` path, or JSON string on Vercel |

### Firebase setup
1. Keep `usemeai.json` **private** (gitignored). Never commit it.
2. In Firebase Console for project `example-69600`: enable **Authentication → Google**, add a **Web app**, copy the web config into `.env.local`.
3. Add authorized domains: `localhost`, your Vercel domain (`usemeai.vercel.app`).
4. Firestore collections used: `users`, `conversations` (+ `messages` subcollection), `userInsights`, `toolRequests`.

Google sign-in uses a **popup account chooser** (not a full-page redirect), ChatGPT-style.

`package.json` includes an `allowScripts` policy so `sharp` and `unrs-resolver` install scripts can run on modern npm / Vercel.

Never commit `.env.local` or real secrets. The chat API runs only on the server (`POST /api/chat`).

## 3. Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `GROQ_API_KEY`, the UI still loads; chat returns a clear setup message (HTTP 503) instead of a fake answer.

## 4. AI provider setup (Groq)

1. Create an account at [groq.com](https://groq.com).
2. Generate an API key.
3. Set `GROQ_API_KEY` in `.env.local`.
4. Restart `npm run dev`.

The assistant uses a version-controlled knowledge file (`src/lib/resume-knowledge.ts`) plus a separate system prompt. Recruiter messages are treated as untrusted input.

## 5. Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel (root directory: `ai-resume` if monorepo).
3. Add `GROQ_API_KEY` (and optional `GROQ_MODEL`) in Project → Settings → Environment Variables.
4. Deploy.

```bash
npm run build
npm start
```

## 6. Resume PDF and profile photo

| Asset | Path |
|-------|------|
| Resume PDF | `public/Shivanshu_resume_Swe.pdf` |
| Profile photo | `public/images/shivanshu.jpeg` |

Replace these files in place (same filenames) when updating assets. The Download Resume button points at `/Shivanshu_resume_Swe.pdf`.

## 7. Updating resume knowledge

1. Update the PDF in `public/`.
2. Edit `src/lib/resume-knowledge.ts` — profile, experience, projects, skills, achievements, architecture notes.
3. Keep metrics and employers **exactly** as documented. Do not invent details.
4. Bump `version` in that file.
5. Redeploy.

ClientScout AI is included from verified public product documentation (`https://clientscout.in`) in addition to the resume PDF projects.

---

## Routes

| Path | Purpose |
|------|---------|
| `/` | AI Resume chat (recruiter Q&A) |
| `/consult` | Business consult — founders/recruiters describe problems; assistant listens, then maps where Shivanshu fits |
| `/clients` | Client work: Aviva Beauty, Creator.co.ai, Connect Astro |
| `/systems` `/experience` `/projects` `/skills` `/resume` `/contact` | Profile sections |

Client knowledge source: `docs/client-work.md` + `src/lib/resume-knowledge.ts` → `clientWork`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Quality notes

- Chat history is bounded server-side (message length + turn count).
- No API keys in client bundles.
- Job-description comparison mode instructs the model to separate matches / adjacent experience / missing evidence.
- Compensation discussions cite verified impact and ownership; the model must not invent salary figures.
