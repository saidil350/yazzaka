#!/usr/bin/env node
/**
 * reorganize-gambar-bucket.mjs
 * -----------------------------
 * Merapikan bucket Neon "gambar" (branch staging): memindahkan objek dari
 * prefix lama news/2026/10/ (semua unggahan dulu menumpuk di sana) ke folder
 * per jenis konten — berita/ hero/ program/ agenda/ tim/ galeri/ — lalu
 * memperbarui SEMUA referensi URL di database staging & production, lalu
 * memindahkan salinan lokal di storage/uploads mengikuti struktur baru.
 *
 * Prasyarat:
 *   - storage/gambar-presign.json  → URL presign PUT per key baru
 *     (dibuat lewat Neon MCP presign_storage_object; kedaluwarsa 3 jam).
 *   - .env.staging.local & .env.production.local berisi DATABASE_URL(_UNPOOLED).
 *   - Berkas sumber lokal utuh di storage/uploads/news/2026/10/.
 *
 * Urutan aman (berhenti di titik kegagalan pertama):
 *   unggah key baru → verifikasi URL publik (200 + ukuran cocok) →
 *   update DB staging → update DB production → verifikasi nol referensi lama →
 *   pindahkan berkas lokal.
 *
 * Objek lama di bucket TIDAK dihapus skrip ini — hapus prefix news/ lewat
 * Neon MCP setelah hasil skrip diverifikasi manual.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync, renameSync, mkdirSync, rmdirSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PRESIGN_FILE = path.join(ROOT, "storage", "gambar-presign.json");
const OLD_DIR = path.join(ROOT, "storage", "uploads", "news", "2026", "10");
const OLD_PREFIX = "news/2026/10";

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

/** Kategori folder berdasarkan nama berkas (slug setelah UUID). */
function folderFor(fileName) {
  const slug = fileName.replace(/^[0-9a-f-]{36}-/, "");
  if (slug.startsWith("hero-")) return "hero";
  if (slug.startsWith("program-")) return "program";
  if (slug.startsWith("agenda-")) return "agenda";
  if (slug.startsWith("tim-")) return "tim";
  if (slug.startsWith("berita-")) return "berita";
  return "galeri";
}

// ---------- 1) Peta migrasi dari berkas lokal ----------

if (!existsSync(OLD_DIR)) fail(`Folder sumber ${OLD_DIR} tidak ditemukan.`);
const presign = JSON.parse(readFileSync(PRESIGN_FILE, "utf8"));
const localFiles = readdirSync(OLD_DIR).filter((f) => statSync(path.join(OLD_DIR, f)).isFile());

const mapping = localFiles.map((fileName) => {
  const folder = folderFor(fileName);
  const oldKey = `${OLD_PREFIX}/${fileName}`;
  // berita tetap kronologis (berita/YYYY/MM/), folder lain datar.
  const newKey = folder === "berita" ? `berita/2026/10/${fileName}` : `${folder}/${fileName}`;
  return { fileName, folder, oldKey, newKey, localPath: path.join(OLD_DIR, fileName) };
});

const missing = mapping.filter((m) => !presign[m.newKey]);
if (missing.length > 0) {
  fail(`URL presign belum lengkap utk: ${missing.map((m) => m.newKey).join(", ")}`);
}
if (mapping.length === 0) fail("Tidak ada berkas lokal untuk dipindahkan.");

// Base URL publik diturunkan dari URL presign (…/<bucket>/<key>?tanda-tangan).
const sampleUrl = presign[mapping[0].newKey];
const publicBase = sampleUrl.split("?")[0].slice(0, -(1 + mapping[0].newKey.length));

const counts = mapping.reduce((acc, m) => ({ ...acc, [m.folder]: (acc[m.folder] ?? 0) + 1 }), {});
console.log(`• ${mapping.length} berkas → ${JSON.stringify(counts)}`);
console.log(`• Base publik: ${publicBase}`);

// ---------- 2) Unggah ke key baru via URL presign ----------

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
for (const m of mapping) {
  const body = readFileSync(m.localPath);
  const res = await fetch(presign[m.newKey], {
    method: "PUT",
    headers: { "Content-Type": MIME[path.extname(m.fileName).toLowerCase()] ?? "application/octet-stream" },
    body,
  });
  if (!res.ok) fail(`Unggah gagal (${res.status}) utk ${m.newKey}`);
  process.stdout.write(`↑ ${m.newKey}\n`);
}

// ---------- 3) Verifikasi URL publik baru ----------

for (const m of mapping) {
  const url = `${publicBase}/${m.newKey}`;
  const res = await fetch(url, { method: "GET" });
  const expected = statSync(m.localPath).size;
  if (!res.ok) fail(`Verifikasi gagal (${res.status}) utk ${url}`);
  const len = Number(res.headers.get("content-length"));
  if (len !== expected) fail(`Ukuran beda utk ${m.newKey}: ${len} ≠ ${expected}`);
}
console.log(`✓ Semua ${mapping.length} URL baru hidup & ukurannya cocok.`);

// ---------- 4) Perbarui referensi di kedua database ----------

const URL_COLS = [
  ["programs", "image_url"],
  ["articles", "cover_image"],
  ["events", "cover_image"],
  ["organization_members", "photo_url"],
  ["website_settings", "og_image"],
];

/** Ganti semua kemunculan URL lama → baru dalam struktur jsonb (rekursif). */
function rewriteJson(node, replaces) {
  if (typeof node === "string") {
    let out = node;
    for (const [from, to] of replaces) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(node)) return node.map((n) => rewriteJson(n, replaces));
  if (node && typeof node === "object") {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, rewriteJson(v, replaces)]));
  }
  return node;
}

async function migrateDb(label, envFile) {
  loadEnvFile(envFile, { clear: true });
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) fail(`${label}: DATABASE_URL tidak ada di ${envFile}`);
  const sql = neon(url);

  /** Satu UPDATE replace() per tabel (identifier statis — aman utk driver Neon). */
  function urlReplaceStatement(table, from, to, like) {
    const q = {
      programs: () => sql`UPDATE programs SET image_url = replace(image_url, ${from}, ${to}) WHERE image_url LIKE ${like}`,
      articles: () => sql`UPDATE articles SET cover_image = replace(cover_image, ${from}, ${to}) WHERE cover_image LIKE ${like}`,
      events: () => sql`UPDATE events SET cover_image = replace(cover_image, ${from}, ${to}) WHERE cover_image LIKE ${like}`,
      organization_members: () => sql`UPDATE organization_members SET photo_url = replace(photo_url, ${from}, ${to}) WHERE photo_url LIKE ${like}`,
      website_settings: () => sql`UPDATE website_settings SET og_image = replace(og_image, ${from}, ${to}) WHERE og_image LIKE ${like}`,
    };
    const builder = q[table];
    if (!builder) throw new Error(`Tabel tak dikenal: ${table}`);
    return builder();
  }

  const replaces = mapping.map((m) => [`${publicBase}/${m.oldKey}`, `${publicBase}/${m.newKey}`]);

  // hero jsonb dibaca dulu agar statement transaksi bisa dibangun lengkap.
  const heroRow = await sql`SELECT hero FROM school_profile LIMIT 1`;
  const newHero = rewriteJson(heroRow[0]?.hero ?? null, replaces);

  const statements = [];
  for (const m of mapping) {
    statements.push(
      sql`UPDATE media_items SET storage_key = ${m.newKey}, file_url = ${`${publicBase}/${m.newKey}`} WHERE storage_key = ${m.oldKey}`
    );
  }
  for (const [table] of URL_COLS) {
    for (const m of mapping) {
      const from = `${publicBase}/${m.oldKey}`;
      const to = `${publicBase}/${m.newKey}`;
      const like = `%${m.oldKey}%`;
      statements.push(urlReplaceStatement(table, from, to, like));
    }
  }
  statements.push(sql`UPDATE school_profile SET hero = ${JSON.stringify(newHero)}::jsonb`);

  await sql.transaction(statements);

  // Verifikasi: tidak ada referensi prefix lama yang tersisa.
  const left = await sql`
    SELECT
      (SELECT count(*) FROM media_items WHERE storage_key LIKE ${OLD_PREFIX + "/%"} OR file_url LIKE ${"%/" + OLD_PREFIX + "/%"}) AS media,
      (SELECT count(*) FROM programs WHERE image_url LIKE ${"%/" + OLD_PREFIX + "/%"}) AS programs,
      (SELECT count(*) FROM articles WHERE cover_image LIKE ${"%/" + OLD_PREFIX + "/%"}) AS articles,
      (SELECT count(*) FROM events WHERE cover_image LIKE ${"%/" + OLD_PREFIX + "/%"}) AS events,
      (SELECT count(*) FROM organization_members WHERE photo_url LIKE ${"%/" + OLD_PREFIX + "/%"}) AS org,
      (SELECT count(*) FROM school_profile WHERE hero::text LIKE ${"%/" + OLD_PREFIX + "/%"}) AS hero,
      (SELECT count(*) FROM website_settings WHERE og_image LIKE ${"%/" + OLD_PREFIX + "/%"}) AS og
  `;
  const total = Object.values(left[0]).reduce((a, b) => a + Number(b), 0);
  if (total > 0) fail(`${label}: masih ada ${total} referensi lama: ${JSON.stringify(left[0])}`);
  const touched = mapping.length; // media_items minimal
  console.log(`✓ ${label}: referensi diperbarui, nol sisa prefix lama (${touched} kunci dipetakan).`);
}

await migrateDb("staging", ".env.staging.local");
await migrateDb("production", ".env.production.local");

// ---------- 5) Pindahkan berkas lokal mengikuti struktur baru ----------

for (const m of mapping) {
  const dest = path.join(ROOT, "storage", "uploads", ...m.newKey.split("/"));
  mkdirSync(path.dirname(dest), { recursive: true });
  renameSync(m.localPath, dest);
}
// Bersihkan folder news/ lokal HANYA bila sudah kosong (aman utk berkas baru).
for (const dir of ["10", "2026", "news"]) {
  const target = path.join(ROOT, "storage", "uploads", "news", dir);
  try {
    if (existsSync(target) && readdirSync(target).length === 0) rmdirSync(target);
  } catch {
    // terkunci / tidak kosong — biarkan
  }
}

// Arsipkan peta migrasi untuk jejak audit.
mkdirSync(path.join(ROOT, "backups"), { recursive: true });
const audit = { dibuat: new Date().toISOString(), publicBase, mapping: mapping.map(({ fileName, oldKey, newKey }) => ({ fileName, oldKey, newKey })) };
writeFileSync(path.join(ROOT, "backups", "gambar-reorganize-map.json"), JSON.stringify(audit, null, 1));
console.log(`✓ ${mapping.length} berkas lokal dipindah; peta tersimpan di backups/gambar-reorganize-map.json.`);
console.log("✓ Selesai. Hapus prefix news/ di bucket lewat Neon MCP setelah verifikasi manual.");
