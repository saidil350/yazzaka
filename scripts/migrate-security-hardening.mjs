// Migrasi skema pendukung hardening keamanan (audit OWASP 2026-11):
// 1. Tabel "rateLimit" utk rate-limit Better Auth storage:"database" —
//    counter brute-force login dibagi antar instansi serverless Vercel.
// 2. Kolom contact_messages.ip_address utk rate-limit form kontak publik.
//
// Jalankan per branch (kredensial via .env.local):
//   npm run env:staging   && node scripts/migrate-security-hardening.mjs
//   npm run env:production && node scripts/migrate-security-hardening.mjs
// Atau langsung: node scripts/migrate-security-hardening.mjs --env-file .env.production.local

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

// ── argumen ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const envFileIdx = args.indexOf("--env-file");
const envFile = envFileIdx !== -1 ? args[envFileIdx + 1] : ".env.local";

function loadEnvFile() {
  try {
    const content = readFileSync(new URL(`../${envFile}`, import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    console.error(`✗ File env tidak dapat dibaca: ${envFile}`);
    process.exit(1);
  }
}

loadEnvFile();

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan via npm run env:staging / env:production dulu.");
  process.exit(1);
}

console.log(`Target DB: ${new URL(DATABASE_URL).hostname}`);
const sql = neon(DATABASE_URL);

async function main() {
  // 1. Tabel rate limit Better Auth — nama & kolom persis seperti yang
  //    diharapkan adapter (model "rateLimit", field key/count/lastRequest).
  await sql`
    CREATE TABLE IF NOT EXISTS "rateLimit" (
      "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "key" TEXT NOT NULL,
      "count" INTEGER NOT NULL DEFAULT 1,
      "lastRequest" BIGINT NOT NULL
    )
  `;
  // Pencarian per-key dijalankan pada tiap permintaan auth.
  await sql`CREATE INDEX IF NOT EXISTS "rateLimit_key_idx" ON "rateLimit" ("key")`;
  // Baris kedaluwarsa dihapus Better Auth lewat lastRequest (epoch ms).
  await sql`CREATE INDEX IF NOT EXISTS "rateLimit_lastRequest_idx" ON "rateLimit" ("lastRequest")`;
  console.log('✓ Tabel "rateLimit" siap');

  // 2. Kolom IP untuk rate-limit form kontak publik (nullable — baris lama
  //    tanpa IP tetap valid; juga dipakai jejak audit ringan).
  await sql`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS ip_address TEXT`;
  console.log("✓ Kolom contact_messages.ip_address siap");
}

main()
  .then(() => {
    console.log("✓ Migrasi security hardening selesai.");
  })
  .catch((err) => {
    console.error("✗ Migrasi gagal:", err.message);
    process.exit(1);
  });
