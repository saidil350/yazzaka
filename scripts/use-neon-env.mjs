#!/usr/bin/env node
/**
 * use-neon-env.mjs
 * -----------------
 * Menyalin env Neon sesuai git branch ke .env.local.
 *
 * Mapping:
 *   git staging (atau nama apa pun yang punya .env.<nama>.local)
 *     -> .env.<nama>.local  ->  .env.local
 *   git main -> .env.production.local (alias)
 *
 * Pemakaian:
 *   node scripts/use-neon-env.mjs staging
 *   node scripts/use-neon-env.mjs production
 *   node scripts/use-neon-env.mjs            # deteksi otomatis dari git branch
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const target = ".env.local";
const ALIASES = { main: "production", master: "production", prod: "production" };

function currentGitBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function resolveName(arg) {
  const raw = arg || currentGitBranch();
  if (!raw) return null;
  const name = ALIASES[raw] || raw;
  return /^[a-z0-9-]+$/i.test(name) ? name : null;
}

const name = resolveName(process.argv[2]);
if (!name) {
  console.error("Tidak bisa menentukan branch. Contoh: node scripts/use-neon-env.mjs staging");
  process.exit(1);
}

const source = resolve(root, `.env.${name}.local`);
if (!existsSync(source)) {
  console.error(`File ${`.env.${name}.local`} tidak ditemukan.`);
  console.error("Buat file tersebut dengan DATABASE_URL, DATABASE_URL_UNPOOLED, dan AUTH_SECRET branch Neon terkait.");
  process.exit(1);
}

copyFileSync(source, resolve(root, target));

// Tulis komentar penanda di baris pertama agar jelas env mana yang aktif.
const content = readFileSync(resolve(root, target), "utf8");
writeFileSync(
  resolve(root, target),
  `# ── ENV AKTIF: ${name} (sinkron dari .env.${name}.local) ──\n${content}`
);

console.log(`✅ .env.local sekarang memakai env "${name}".`);
