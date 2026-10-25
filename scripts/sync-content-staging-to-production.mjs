#!/usr/bin/env node
/**
 * sync-content-staging-to-production.mjs
 * ---------------------------------------
 * Menyalin DATA KONTEN dari Neon staging ke Neon production:
 *   categories, media_items, programs, articles, events,
 *   organization_members + UPDATE school_profile & website_settings.
 *
 * TIDAK disentuh (state per-branch / data asli production):
 *   page_sections, users, account, session, verification,
 *   contact_messages, admission_info, website_settings.navigation.
 *
 * Urutan aman: backup production -> transaksi (DELETE urut FK lalu INSERT)
 * -> verifikasi. Tanpa kredensial di output.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function loadEnvFile(file) {
  try {
    const content = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // opsional
  }
}

loadEnvFile(".env.staging.local");
const STAGING_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
delete process.env.DATABASE_URL;
delete process.env.DATABASE_URL_UNPOOLED;
loadEnvFile(".env.production.local");
const PROD_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!STAGING_URL || !PROD_URL) {
  console.error("✗ URL staging/production tidak lengkap.");
  process.exit(1);
}
const host = (u) => new URL(u).hostname;
console.log(`Sumber (staging)   : ${host(STAGING_URL)}`);
console.log(`Target (production): ${host(PROD_URL)}`);
if (host(STAGING_URL) === host(PROD_URL)) {
  console.error("✗ Sumber dan target sama — batalkan.");
  process.exit(1);
}

const sqlS = neon(STAGING_URL);
const sqlP = neon(PROD_URL);

const TABLES = [
  "categories",
  "media_items",
  "programs",
  "articles",
  "events",
  "organization_members",
];

// Kolom jsonb (dikirim sebagai teks JSON + cast ::jsonb)
const JSONB = new Set(["content_doc", "hero", "branding", "values", "mission", "social_media", "navigation"]);

// 1) Backup production -> backups/ (untuk rollback)
const dump = { _meta: { dibuat: new Date().toISOString(), tujuan: "rollback sinkronisasi konten staging->production" } };
for (const t of TABLES) {
  dump[t] = await sqlP.query(`SELECT * FROM ${t}`);
}
dump.school_profile = await sqlP.query("SELECT * FROM school_profile");
dump.website_settings = await sqlP.query("SELECT * FROM website_settings");
const backupFile = path.join("backups", "prod-content-before-sync.json");
writeFileSync(backupFile, JSON.stringify(dump, null, 1));
const totalRows = TABLES.reduce((a, t) => a + dump[t].length, 0);
console.log(`✓ Backup production: ${backupFile} (${totalRows} baris + 2 tabel tunggal)`);

// 2) Deteksi kolom jsonb secara dinamis (jangan menebak per kolom)
const ALL_TABLES = [...TABLES, "school_profile", "website_settings"];
const jsonbCols = new Set(
  (
    await sqlP.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema='public' AND data_type='jsonb'
         AND table_name IN (${ALL_TABLES.map((t) => `'${t}'`).join(",")})`
    )
  ).map((r) => `${r.table_name}.${r.column_name}`)
);
const isJsonb = (table, col) => jsonbCols.has(`${table}.${col}`);

// Kolom yang ada di production saja (drift skema antar branch disinkronkan
// secara irisan — kolom khusus staging dilaporkan, bukan gagal).
const prodCols = {};
const skippedCols = [];
for (const t of ALL_TABLES) {
  prodCols[t] = new Set(
    (
      await sqlP.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='${t}'`
      )
    ).map((r) => r.column_name)
  );
}
function commonColumns(table, stagingRow) {
  const common = Object.keys(stagingRow).filter((c) => prodCols[table].has(c));
  for (const c of Object.keys(stagingRow)) {
    if (!prodCols[table].has(c)) skippedCols.push(`${table}.${c}`);
  }
  return common;
}

// 3) Data staging
const staging = {};
for (const t of TABLES) {
  staging[t] = await sqlS.query(`SELECT * FROM ${t}`);
}
staging.school_profile = await sqlS.query("SELECT * FROM school_profile LIMIT 1");
staging.website_settings = await sqlS.query("SELECT * FROM website_settings LIMIT 1");

// 4) Bangun statement (parameterized via sql.query)
function insertStatements(table, rows) {
  if (rows.length === 0) return [];
  const columns = commonColumns(table, rows[0]);
  if (columns.length === 0) return [];
  return rows.map((row) => {
    // Kolom jsonb dikirim sebagai teks JSON — driver Neon men-serialisasi
    // array/objek JS sebagai literal array Postgres, bukan JSON.
    const values = columns.map((c) =>
      isJsonb(table, c) ? JSON.stringify(row[c] ?? null) : row[c]
    );
    const ph = columns
      .map((c, i) => (isJsonb(table, c) ? `$${i + 1}::jsonb` : `$${i + 1}`))
      .join(", ");
    return sqlP.query(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${ph})`, values);
  });
}

const statements = [
  // hapus urut FK: attachments -> articles -> media_items -> lainnya
  sqlP.query("DELETE FROM article_attachments"),
  sqlP.query("DELETE FROM articles"),
  sqlP.query("DELETE FROM media_items"),
  sqlP.query("DELETE FROM programs"),
  sqlP.query("DELETE FROM events"),
  sqlP.query("DELETE FROM organization_members"),
  sqlP.query("DELETE FROM categories"),
  ...TABLES.flatMap((t) => insertStatements(t, staging[t])),
  // school_profile: update semua kolom konten (bukan id/created_at)
  (() => {
    const row = staging.school_profile[0];
    const columns = commonColumns("school_profile", row).filter((c) => !["id", "created_at"].includes(c));
    const sets = columns.map((c, i) => `${c} = ${isJsonb("school_profile", c) ? `$${i + 1}::jsonb` : `$${i + 1}`}`).join(", ");
    const values = columns.map((c) => (isJsonb("school_profile", c) ? JSON.stringify(row[c] ?? null) : row[c]));
    return sqlP.query(`UPDATE school_profile SET ${sets}`, values);
  })(),
  // website_settings: semua kolom KECUALI navigation (production baru bersih /fasilitas)
  (() => {
    const row = staging.website_settings[0];
    const columns = commonColumns("website_settings", row).filter((c) => !["id", "created_at", "navigation"].includes(c));
    const sets = columns.map((c, i) => `${c} = ${isJsonb("website_settings", c) ? `$${i + 1}::jsonb` : `$${i + 1}`}`).join(", ");
    const values = columns.map((c) => (isJsonb("website_settings", c) ? JSON.stringify(row[c] ?? null) : row[c]));
    return sqlP.query(`UPDATE website_settings SET ${sets}`, values);
  })(),
];

await sqlP.transaction(statements);
console.log(`✓ Transaksi commit: ${statements.length} statement.`);

// 5) Verifikasi
const verif = await sqlP.query(`
  SELECT
    (SELECT count(*) FROM media_items) AS media,
    (SELECT count(*) FROM programs) AS programs,
    (SELECT count(*) FROM articles) AS articles,
    (SELECT count(*) FROM articles WHERE content_doc IS NULL) AS artikel_legacy,
    (SELECT count(*) FROM events) AS events,
    (SELECT count(*) FROM organization_members) AS organization,
    (SELECT count(*) FROM programs WHERE image_url LIKE '%/api/files/%') AS url_lama_program,
    (SELECT count(*) FROM media_items WHERE file_url LIKE '%unsplash%') AS media_unsplash,
    (SELECT is_enabled FROM page_sections WHERE key='testimonials') AS testimonials,
    (SELECT is_enabled FROM page_sections WHERE key='hero') AS hero,
    (SELECT count(*) FROM page_sections) AS page_sections
`);
console.log("Verifikasi production:", JSON.stringify(verif[0]));
if (skippedCols.length > 0) {
  console.log(`• Kolom khusus staging (drift skema, dilewati): ${skippedCols.join(", ")}`);
}
console.log("✓ Sinkronisasi selesai.");
