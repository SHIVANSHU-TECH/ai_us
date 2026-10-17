/**
 * Writes FIREBASE_SERVICE_ACCOUNT_JSON helpers for Vercel (never prints secrets).
 * Usage: node scripts/print-firebase-env.mjs
 * Paste either generated file into Vercel env, then redeploy.
 */
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "usemeai.json");

if (!existsSync(path)) {
  console.error("Missing usemeai.json in project root.");
  process.exit(1);
}

const sa = JSON.parse(readFileSync(path, "utf8"));
const oneLine = JSON.stringify(sa);
const b64 = Buffer.from(oneLine, "utf8").toString("base64");

const outJson = join(root, ".vercel-firebase-sa.oneline.txt");
const outB64 = join(root, ".vercel-firebase-sa.b64.txt");
writeFileSync(outJson, oneLine, "utf8");
writeFileSync(outB64, b64, "utf8");

console.log("Wrote (gitignored — do not commit):");
console.log("  ", outJson);
console.log("  ", outB64);
console.log("\nPaste ONE of those files into Vercel → FIREBASE_SERVICE_ACCOUNT_JSON");
console.log("Then redeploy. Check GET /api/firebase-status → ok: true\n");
