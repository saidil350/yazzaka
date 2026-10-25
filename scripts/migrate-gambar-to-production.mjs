#!/usr/bin/env node
/**
 * migrate-gambar-to-production.mjs
 * ---------------------------------
 * Memindahkan 20 gambar bucket "gambar" dari branch STAGING ke branch
 * PRODUCTION: mengunggah salinan berkunci sama ke bucket production, lalu
 * menukar host URL di database PRODUCTION (br-steep-scene → br-raspy-moon)
 * sehingga tiap branch memakai bucket-nya sendiri:
 *   staging DB  → bucket staging  (tidak disentuh)
 *   production  → bucket production (baru)
 *
 * Prasyarat:
 *   - storage/gambar-presign-production.json → URL presign PUT per key
 *     (dibuat lewat Neon MCP utk branch production; kedaluwarsa 3 jam).
 *   - .env.production.local berisi DATABASE_URL(_UNPOOLED) production.
 *   - Berkas sumber lokal utuh di storage/uploads/ (struktur folder baru).
 *
 * Urutan aman (berhenti di titik kegagalan pertama):
 *   unggah ke bucket production → verifikasi URL publik (200 + ukuran cocok)
 *   → backup kolom terdampak → UPDATE host di 7 lokasi (transaksi) →
 *   verifikasi nol referensi host-staging.
 *
 * Skrip ini TIDAK menghapus apa pun di bucket staging.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PRESIGN_FILE = path.join(ROOT, "storage", "gambar-presign-production.json");
const UPLOADS_DIR = path.join(ROOT, "storage", "uploads");

const OLD_BASE = "https://br-steep-scene-azgoi9z4.storage.c-3.ap-southeast-1.aws.neon.tech/gambar";
const NEW_BASE = "https://br-raspy-moon-aze0f1do.storage.c-3.ap-southeast-1.aws.neon.tech/gambar";

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function loadEnvFile(file, { clear = false } = {}) {
  if (clear) {
    delete process.env.DATABASE_URL;
    delete process.env.DATABASE_URL_UNPOOLED;
  }
  try {
    const content = readFileSync(path.join(ROOT, file), "utf8");
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

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

// ---------- 1) Unggah salinan berkunci sama ke bucket production ----------

const presign = JSON.parse(readFileSync(PRESIGN_FILE, "utf8"));
const localFiles = walk(UPLOADS_DIR).map((f) => ({
  key: path.relative(UPLOADS_DIR, f).split(path.sep).join("/"),
  localPath: f,
}));

const toUpload = localFiles.filter((f) => presign[f.key]);
if (toUpload.length === 0) fail("Tidak ada berkas lokal yang cocok dgn URL presign.");
if (toUpload.length !== localFiles.length) {
  const orphan = localFiles.filter((f) => !presign[f.key]).map((f) => f.key);
  console.log(`• Lewati (tanpa presign, di luar migrasi): ${orphan.join(", ")}`);
}

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
for (const f of toUpload) {
  const body = readFileSync(f.localPath);
  const res = await fetch(presign[f.key], {
    method: "PUT",
    headers: { "Content-Type": MIME[path.extname(f.key).toLowerCase()] ?? "application/octet-stream" },
    body,
  });
  if (!res.ok) fail(`Unggah gagal (${res.status}) utk ${f.key}`);
  process.stdout.write(`↑ ${f.key}\n`);
}

// ---------- 2) Verifikasi URL publik bucket production ----------

for (const f of toUpload) {
  const url = `${NEW_BASE}/${f.key}`;
  const res = await fetch(url, { method: "GET" });
  const expected = statSync(f.localPath).size;
  if (!res.ok) fail(`Verifikasi gagal (${res.status}) utk ${url}`);
  const len = Number(res.headers.get("content-length"));
  if (len !== expected) fail(`Ukuran beda utk ${f.key}: ${len} ≠ ${expected}`);
}
console.log(`✓ Semua ${toUpload.length} URL bucket production hidup & ukurannya cocok.`);

// ---------- 3) Backup + tukar host URL di database production ----------

loadEnvFile(".env.production.local", { clear: true });
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) fail("DATABASE_URL production tidak ada di .env.production.local.");
const sql = neon(url);

// Backup kolom terdampak untuk rollback.
const backup = { _meta: { dibuat: new Date().toISOString(), tujuan: "rollback migrasi host bucket staging→production" } };
backup.media_items = await sql`SELECT id, file_url FROM media_items`;
backup.programs = await sql`SELECT id, image_url FROM programs`;
backup.articles = await sql`SELECT id, cover_image FROM articles`;
backup.events = await sql`SELECT id, cover_image FROM events`;
backup.organization_members = await sql`SELECT id, photo_url FROM organization_members`;
backup.school_profile = await sql`SELECT id, hero FROM school_profile`;
backup.website_settings = await sql`SELECT id, og_image FROM website_settings`;
writeFileSync(path.join(ROOT, "backups", "prod-url-host-before-production-bucket.json"), JSON.stringify(backup, null, 1));
console.log("✓ Backup kolom terdampak → backups/prod-url-host-before-production-bucket.json");

/** Ganti host lama → baru dalam struktur jsonb (rekursif). */
function rewriteJson(node) {
  if (typeof node === "string") return node.split(`${OLD_BASE}/`).join(`${NEW_BASE}/`);
  if (Array.isArray(node)) return node.map(rewriteJson);
  if (node && typeof node === "object") {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, rewriteJson(v)]));
  }
  return node;
}

const heroRow = await sql`SELECT hero FROM school_profile LIMIT 1`;
const newHero = rewriteJson(heroRow[0]?.hero ?? null);

const from = `${OLD_BASE}/`;
const to = `${NEW_BASE}/`;
await sql.transaction([
  sql`UPDATE media_items SET file_url = replace(file_url, ${from}, ${to}) WHERE file_url LIKE ${"%" + from + "%"}`,
  sql`UPDATE programs SET image_url = replace(image_url, ${from}, ${to}) WHERE image_url LIKE ${"%" + from + "%"}`,
  sql`UPDATE articles SET cover_image = replace(cover_image, ${from}, ${to}) WHERE cover_image LIKE ${"%" + from + "%"}`,
  sql`UPDATE events SET cover_image = replace(cover_image, ${from}, ${to}) WHERE cover_image LIKE ${"%" + from + "%"}`,
  sql`UPDATE organization_members SET photo_url = replace(photo_url, ${from}, ${to}) WHERE photo_url LIKE ${"%" + from + "%"}`,
  sql`UPDATE website_settings SET og_image = replace(og_image, ${from}, ${to}) WHERE og_image LIKE ${"%" + from + "%"}`,
  sql`UPDATE school_profile SET hero = ${JSON.stringify(newHero)}::jsonb`,
]);

// ---------- 4) Verifikasi: nol referensi host staging tersisa ----------

const left = await sql`
  SELECT
    (SELECT count(*) FROM media_items WHERE file_url LIKE ${"%" + from + "%"}) AS media,
    (SELECT count(*) FROM programs WHERE image_url LIKE ${"%" + from + "%"}) AS programs,
    (SELECT count(*) FROM articles WHERE cover_image LIKE ${"%" + from + "%"}) AS articles,
    (SELECT count(*) FROM events WHERE cover_image LIKE ${"%" + from + "%"}) AS events,
    (SELECT count(*) FROM organization_members WHERE photo_url LIKE ${"%" + from + "%"}) AS org,
    (SELECT count(*) FROM school_profile WHERE hero::text LIKE ${"%" + from + "%"}) AS hero,
    (SELECT count(*) FROM website_settings WHERE og_image LIKE ${"%" + from + "%"}) AS og
`;
const total = Object.values(left[0]).reduce((a, b) => a + Number(b), 0);
if (total > 0) fail(`Masih ada ${total} referensi host staging: ${JSON.stringify(left[0])}`);

const now = await sql`
  SELECT
    (SELECT count(*) FROM media_items WHERE file_url LIKE ${"%" + to + "%"}) AS media,
    (SELECT count(*) FROM programs WHERE image_url LIKE ${"%" + to + "%"}) AS programs,
    (SELECT count(*) FROM articles WHERE cover_image LIKE ${"%" + to + "%"}) AS articles,
    (SELECT count(*) FROM events WHERE cover_image LIKE ${"%" + to + "%"}) AS events,
    (SELECT count(*) FROM organization_members WHERE photo_url LIKE ${"%" + to + "%"}) AS org,
    (SELECT count(*) FROM school_profile WHERE hero::text LIKE ${"%" + to + "%"}) AS hero,
    (SELECT count(*) FROM website_settings WHERE og_image LIKE ${"%" + to + "%"}) AS og
`;
console.log(`✓ DB production kini memakai bucket production (${JSON.stringify(now[0])}).`);
console.log("✓ Selesai. Bucket staging TIDAK dihapus (dipakai DB staging & preview Vercel).");
console.log("• Jangan lupa ubah NEON_STORAGE_PUBLIC_BASE produksi → " + NEW_BASE);
