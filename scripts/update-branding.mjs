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

async function run() {
  console.log("Updating school_profile in Neon Database...");
  
  const branding = {
    primaryColor: "#0F2B48",
    accentColor: "#FA6400",
    secondaryColor: "#F4F6F8",
    logoUrl: "/yazzakka.png",
    faviconUrl: "/yazzakka.png"
  };

  await sql`
    UPDATE school_profile 
    SET 
      name = 'Yayasan Yazzakka Aceh',
      branding = ${JSON.stringify(branding)}::jsonb,
      updated_at = NOW()
  `;

  const rows = await sql`SELECT id, name, branding FROM school_profile`;
  console.log("Updated rows:", rows);
  console.log("✓ Berhasil memperbarui data branding di database!");
}

run().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
