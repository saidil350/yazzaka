// Sisipkan baris page_sections untuk seksi "Berita Unggulan" (carousel berita)
// di halaman beranda — muncul sebagai toggle di admin /admin/pages/beranda.
//
// Jalankan PER BRANCH Neon (staging sekarang, production saat merge ke main):
//   npm run env:staging   && node scripts/add-news-carousel-section.mjs
//   npm run env:production && node scripts/add-news-carousel-section.mjs
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
  await sql`
    INSERT INTO page_sections (id, key, title, subtitle, is_enabled, order_index)
    VALUES ('sec-news-carousel', 'news_carousel', 'Berita Unggulan', 'Karousel warta pilihan pesantren', true, 2)
    ON CONFLICT (key) DO NOTHING
  `;
  console.log("✓ Baris page_sections 'news_carousel' disisipkan (aktif) — dilewati bila sudah ada");

  const rows = await sql`SELECT id, key, title, is_enabled, order_index FROM page_sections ORDER BY order_index ASC, key ASC`;
  console.log("Current page_sections:", rows);
  console.log("✓ Selesai.");
}

run().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
