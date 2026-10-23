// Bersihkan gambar dummy/template (Unsplash) & path mati di DB → placeholder
// jujur yang bisa diganti foto asli via CMS. Jalankan di staging:
//   node scripts/clean-dummy-images.mjs
// Untuk production: npm run env:production lalu jalankan script yang sama
// secara sadar setelah merge staging→main (pola clean-demo-data.mjs).
//
// Yang dilakukan (idempoten):
// - school_profile: ALTER tambah kolom about_image_url (foto gedung
//   /tentang-kami), buang imageUrl dari JSONB hero.
// - programs.image_url, events.cover_image, articles.cover_image,
//   organization_members.photo_url, users.avatar_url: URL Unsplash → NULL.
// - media_items legacy (storage_key NULL): baris Unsplash & path /docs/* mati
//   dihapus — galeri otomatis kosong sampai unggahan nyata via /admin/media.
// - website_settings.og_image: '/og-image.jpg' (path mati) → NULL (fallback
//   kode memakai /yazzakka.png).
//
// TIDAK menyentuh: principal_photo_url (sudah berkas asli /uploads/*),
// artikel berita dengan cover /api/files/* nyata, media modul berita.

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

const connectionString =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan via npm run env:staging / env:production dulu.");
  process.exit(1);
}

const host = new URL(connectionString).hostname;
console.log(`Target DB: ${host}`);
if (host.includes("ep-round-surf")) {
  console.error("✗ Ini host PRODUCTION. Untuk production, jalankan secara sadar setelah merge — hentikan dulu.");
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  // 1) Kolom foto gedung untuk /tentang-kami
  await sql`ALTER TABLE school_profile ADD COLUMN IF NOT EXISTS about_image_url text`;
  console.log("✓ school_profile.about_image_url siap");

  // 2) URL Unsplash → NULL
  const tables = [
    ["programs", "image_url"],
    ["events", "cover_image"],
    ["articles", "cover_image"],
    ["organization_members", "photo_url"],
  ];
  for (const [table, column] of tables) {
    // table & column dari whitelist di atas (bukan input pengguna)
    const res = await sql.query(
      `UPDATE ${table} SET ${column} = NULL WHERE ${column} LIKE $1 RETURNING id`,
      ["%images.unsplash.com%"]
    );
    console.log(`✓ ${table}.${column}: ${res.length} URL Unsplash di-NULL-kan`);
  }

  const hasAvatarCol = await sql`
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'avatar_url' LIMIT 1`;
  if (hasAvatarCol.length > 0) {
    const res = await sql`
      UPDATE users SET avatar_url = NULL
      WHERE avatar_url LIKE '%images.unsplash.com%' RETURNING id`;
    console.log(`✓ users.avatar_url: ${res.length} URL Unsplash di-NULL-kan`);
  } else {
    console.log("- users.avatar_url tidak ada, lewati");
  }

  // 3) Media legacy (tanpa storage_key): Unsplash & path mati
  const del = await sql`
    DELETE FROM media_items
    WHERE storage_key IS NULL
      AND (file_url LIKE '%images.unsplash.com%' OR file_url LIKE '/docs/%')
    RETURNING id`;
  console.log(`✓ media_items legacy: ${del.length} baris dihapus`);

  // 4) Buang imageUrl dummy dari JSONB hero
  const hero = await sql`
    UPDATE school_profile SET hero = hero - 'imageUrl'
    WHERE hero ? 'imageUrl' RETURNING id`;
  console.log(`✓ school_profile.hero: ${hero.length} baris imageUrl dibuang`);

  // 5) og_image path mati / Unsplash → NULL (fallback kode: /yazzakka.png)
  const og = await sql`
    UPDATE website_settings SET og_image = NULL
    WHERE og_image LIKE '/og-image%' OR og_image LIKE '%images.unsplash.com%'
    RETURNING id`;
  console.log(`✓ website_settings.og_image: ${og.length} nilai mati di-NULL-kan`);

  console.log("\nSelesai. Unggah foto asli via CMS: /admin/content/hero, /admin/content/program,");
  console.log("/admin/content/kegiatan, /admin/organization/profil (foto gedung), /admin/organization/tim,");
  console.log("/admin/media (galeri), /admin/settings/seo (og image).");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("✗ Gagal:", e.message);
    process.exit(1);
  });
