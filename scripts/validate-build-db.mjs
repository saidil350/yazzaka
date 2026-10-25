#!/usr/bin/env node
/**
 * validate-build-db.mjs — pre-build validation (dijalankan otomatis via
 * `npm run build` lewat hook "prebuild").
 *
 * Tujuan: memastikan database target build dapat diakses dan konfigurasi
 * page_sections wajib lengkap SEBELUM `next build` mem-prerender, sehingga
 * hasil prerender fail-closed (homepage kosong karena DB gagal saat build)
 * tidak pernah diterima sebagai artefak build yang valid.
 *
 * Env dimuat dengan presedensi yang sama seperti `next build`
 * (.env.production.local > .env.local, env shell menang). Tidak pernah
 * mencetak connection string — hanya hostname target.
 *
 * Override daftar key wajib (opsional, dipisah koma):
 *   REQUIRED_SECTIONS_KEYS="hero,stats" npm run build
 */
import nextEnvPkg from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnvPkg;

// Key yang dikonsumsi Header (topbar) dan isSectionEnabled di halaman beranda.
const DEFAULT_REQUIRED_KEYS = [
  "topbar",
  "hero",
  "news_carousel",
  "stats",
  "about",
  "programs",
  "whyus",
  "berita",
  "achievements",
  "testimonials",
];

// Paritas dengan `next build`: production env files, env shell tetap menang.
loadEnvConfig(process.cwd(), false);

const override = process.env.REQUIRED_SECTIONS_KEYS;
const requiredKeys = (
  override && override.trim() ? override.split(",").map((k) => k.trim()) : DEFAULT_REQUIRED_KEYS
).filter(Boolean);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "✗ Build gagal: DATABASE_URL tidak tersedia untuk build (periksa .env.production.local / env shell)."
  );
  process.exit(1);
}

let targetHost;
try {
  targetHost = new URL(connectionString).hostname;
} catch {
  console.error("✗ Build gagal: DATABASE_URL tidak valid (bukan URL koneksi).");
  process.exit(1);
}
console.log(`Validasi DB target build: ${targetHost}`);

const sql = neon(connectionString);

try {
  const rows = await sql`SELECT key FROM page_sections`;
  const existing = new Set(rows.map((r) => r.key));
  const missing = requiredKeys.filter((k) => !existing.has(k));
  if (missing.length > 0) {
    console.error(
      `✗ Build gagal: konfigurasi section wajib belum lengkap di DB target build. Key hilang: ${missing.join(", ")}`
    );
    console.error("  Jalankan script migrasi section (add-*.mjs) pada DB tersebut sebelum build.");
    process.exit(1);
  }
  console.log(`✓ DB dapat diakses & ${requiredKeys.length} key section wajib lengkap. Build boleh lanjut.`);
} catch (err) {
  console.error("✗ Build gagal: database target build tidak dapat diakses.");
  console.error(`  Detail: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
