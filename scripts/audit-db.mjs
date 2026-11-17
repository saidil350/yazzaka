import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

// Muat .env.local bila ada — pilih branch DB via npm run env:staging /
// env:production. Kredensial tidak pernah di-hardcode di skrip ini.
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

const DATABASE_URL =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan via npm run env:staging / env:production dulu.");
  process.exit(1);
}

console.log(`Target DB: ${new URL(DATABASE_URL).hostname}`);
const sql = neon(DATABASE_URL);

async function runAudit() {
  console.log("=== AUDIT DATABASE NEON ===");
  
  const results = await Promise.all([
    sql`SELECT count(*) as c FROM school_profile`,
    sql`SELECT count(*) as c FROM programs`,
    sql`SELECT count(*) as c FROM achievements`,
    sql`SELECT count(*) as c FROM articles`,
    sql`SELECT count(*) as c FROM events`,
    sql`SELECT count(*) as c FROM testimonials`,
    sql`SELECT count(*) as c FROM contact_messages`,
    sql`SELECT count(*) as c FROM website_settings`,
    sql`SELECT count(*) as c FROM organization_members`,
    sql`SELECT count(*) as c FROM users`,
    sql`SELECT count(*) as c FROM page_sections`,
    sql`SELECT count(*) as c FROM media_items`,
  ]);

  const names = [
    "school_profile", "programs", "achievements",
    "articles", "events", "testimonials",
    "contact_messages", "website_settings", "organization_members",
    "users", "page_sections", "media_items"
  ];

  names.forEach((name, i) => {
    console.log(`- ${name.padEnd(22)} : ${results[i][0].c} data baris`);
  });
}

runAudit().catch(console.error);
