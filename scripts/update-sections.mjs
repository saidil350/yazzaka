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

const DATABASE_URL =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan via npm run env:staging / env:production dulu.");
  process.exit(1);
}

console.log(`Target DB: ${new URL(DATABASE_URL).hostname}`);

const sql = neon(DATABASE_URL);

async function run() {
  console.log("Updating page_sections in Neon Database...");

  // Remove news and events sections if exists
  await sql`
    DELETE FROM page_sections 
    WHERE key IN ('news', 'events') OR id IN ('sec-news', 'sec-events', 'sec-8', 'sec-9');
  `;

  const rows = await sql`SELECT id, key, title, is_enabled, order_index FROM page_sections ORDER BY order_index ASC`;
  console.log("Current page_sections in DB:", rows);
  console.log("✓ Berhasil memperbarui page_sections di database!");
}

run().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
