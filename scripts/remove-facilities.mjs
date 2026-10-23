// Cleanup fitur fasilitas (dihapus 2026-10-23):
//  1. DROP TABLE facilities
//  2. Hapus baris page_sections fasilitas, sisipkan baris seksi "berita"
//  3. Buang link "/fasilitas" dari JSON website_settings.navigation
//
// Jalankan PER BRANCH Neon (staging lalu production saat merge ke main):
//   npm run env:staging   && node scripts/remove-facilities.mjs
//   npm run env:production && node scripts/remove-facilities.mjs
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
  await sql`DROP TABLE IF EXISTS facilities`;
  console.log("✓ Tabel facilities dihapus");

  await sql`
    DELETE FROM page_sections
    WHERE key = 'facilities' OR id IN ('sec-facilities', 'sec-6')
  `;
  console.log("✓ Baris page_sections fasilitas dihapus");

  await sql`DELETE FROM page_sections WHERE key = 'berita'`;
  await sql`
    INSERT INTO page_sections (id, key, title, subtitle, is_enabled, order_index)
    VALUES ('sec-berita', 'berita', 'Warta & Berita', 'Artikel dan kabar terkini sekolah', true, 6)
  `;
  console.log("✓ Baris page_sections 'berita' disisipkan (aktif, urutan 6)");

  const settings = await sql`SELECT id, navigation FROM website_settings LIMIT 1`;
  if (settings[0]?.navigation) {
    const nav =
      typeof settings[0].navigation === "string"
        ? JSON.parse(settings[0].navigation)
        : settings[0].navigation;
    const strip = (links) =>
      Array.isArray(links) ? links.filter((l) => l?.href !== "/fasilitas") : links;
    const before = JSON.stringify(nav);
    nav.headerLinks = strip(nav.headerLinks);
    nav.footerLinks = strip(nav.footerLinks);
    if (JSON.stringify(nav) !== before) {
      await sql`UPDATE website_settings SET navigation = ${JSON.stringify(nav)}::jsonb WHERE id = ${settings[0].id}`;
      console.log("✓ Link /fasilitas dibuang dari website_settings.navigation");
    } else {
      console.log("• navigation sudah bersih dari /fasilitas");
    }
  }

  const rows = await sql`SELECT id, key, title, is_enabled, order_index FROM page_sections ORDER BY order_index ASC`;
  console.log("Current page_sections:", rows);
  console.log("✓ Selesai — fitur fasilitas dibersihkan dari database.");
}

run().catch((err) => {
  console.error("Error cleaning database:", err);
  process.exit(1);
});
