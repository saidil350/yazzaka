// Migrasi fitur berita: kategori, workflow status, media R2, dan lampiran.
// Jalankan ke SETIAP branch Neon: npm run env:staging (atau env:production)
// lalu node scripts/migrate-news.mjs
//
// Semua perubahan bersifat ADDITIF dan idempotent — aman dijalankan berulang.
// Tidak ada kolom/tabel lama yang dihapus atau diubah tipenya.

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
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan npm run env:staging dulu.");
  process.exit(1);
}

const sql = neon(connectionString);

// Kategori hardcoded lama di /admin/content/berita — dipindah ke tabel categories.
const DEFAULT_CATEGORIES = [
  "Berita Sekolah",
  "Wawasan & Opini",
  "Prestasi",
  "Kegiatan Santri",
  "Pengumuman",
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

async function main() {
  console.log("→ Migrasi fitur berita dimulai...\n");

  // ── 1. Tabel categories ────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ categories");

  for (const name of DEFAULT_CATEGORIES) {
    await sql`
      INSERT INTO categories (id, name, slug)
      VALUES (${`cat-${slugify(name)}`}, ${name}, ${slugify(name)})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("✓ seed kategori default");

  // ── 2. Kolom baru di articles ──────────────────────────────────────────
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_id TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_id TEXT`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_doc JSONB`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ`;
  await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS cover_media_id TEXT`;
  console.log("✓ kolom articles (category_id, author_id, content_doc, published_at, cover_media_id)");

  // Backfill category_id dari kolom teks category (match nama persis).
  await sql`
    UPDATE articles a
    SET category_id = c.id
    FROM categories c
    WHERE a.category_id IS NULL AND a.category = c.name
  `;
  // Backfill published_at dari published_date (format ISO YYYY-MM-DD).
  const rows = await sql`SELECT id, published_date FROM articles WHERE published_at IS NULL`;
  for (const row of rows) {
    const ts = row.published_date ? new Date(row.published_date) : null;
    if (ts && !isNaN(ts.getTime())) {
      await sql`UPDATE articles SET published_at = ${ts.toISOString()}::timestamptz WHERE id = ${row.id}`;
    }
  }
  console.log("✓ backfill category_id & published_at");

  await sql`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles (category_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles (author_id)`;
  console.log("✓ index articles");

  // ── 3. Kolom baru di media_items ───────────────────────────────────────
  await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS storage_key TEXT`;
  await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS mime_type TEXT`;
  await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS size_bytes BIGINT`;
  await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS kind TEXT DEFAULT 'image'`;
  await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private'`;
  await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS uploaded_by TEXT`;
  // Baris lama adalah registry URL galeri yang sudah tampil publik.
  await sql`UPDATE media_items SET visibility = 'public' WHERE storage_key IS NULL AND visibility = 'private'`;
  await sql`CREATE INDEX IF NOT EXISTS idx_media_items_storage_key ON media_items (storage_key)`;
  console.log("✓ kolom media_items (storage_key, mime_type, size_bytes, kind, visibility, uploaded_by)");

  // ── 4. Tabel article_attachments ───────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS article_attachments (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
      media_id TEXT NOT NULL REFERENCES media_items (id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (article_id, media_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_article_attachments_article ON article_attachments (article_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_article_attachments_media ON article_attachments (media_id)`;
  console.log("✓ article_attachments");

  console.log("\n✔ Migrasi fitur berita selesai.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("✗ Migrasi gagal:", error.message);
    process.exit(1);
  });
