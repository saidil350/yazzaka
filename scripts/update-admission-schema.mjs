import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const content = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env.local opsional
  }
}

loadEnvLocal();

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan via npm run env:staging / env:production dulu.");
  process.exit(1);
}

console.log(`Target DB: ${new URL(DATABASE_URL).hostname}`);

const sql = neon(DATABASE_URL);

async function run() {
  console.log("Migrating admission_info table...");
  
  await sql`
    ALTER TABLE admission_info 
    ADD COLUMN IF NOT EXISTS start_date TEXT DEFAULT '2026-09-01',
    ADD COLUMN IF NOT EXISTS end_date TEXT DEFAULT '2026-11-30',
    ADD COLUMN IF NOT EXISTS hide_form_when_closed BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS closed_message TEXT DEFAULT 'Pendaftaran santri baru untuk periode ini sedang ditutup. Untuk informasi jadwal gelombang berikutnya atau konsultasi langsung, silakan hubungi sekretariat PPDB kami melalui WhatsApp.';
  `;
  
  const [data] = await sql`SELECT id, period_name, is_open, start_date, end_date, hide_form_when_closed FROM admission_info LIMIT 1`;
  console.log("Updated admission_info row:", data);
}

run().catch(console.error);
