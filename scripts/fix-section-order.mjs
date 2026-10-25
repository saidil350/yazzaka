#!/usr/bin/env node
/**
 * fix-section-order.mjs
 * ---------------------
 * Menyelaraskan order_index tabel page_sections dengan urutan render
 * aktual beranda publik (src/app/page.tsx). Tanpa ini, daftar seksi di
 * /admin/pages/beranda bisa tidak sinkron dengan yang tampil di situs
 * (contoh: stats tercantum sebelum news_carousel).
 *
 * Jalankan per branch Neon:
 *   npm run env:staging && node scripts/fix-section-order.mjs
 *   npm run env:production && node scripts/fix-section-order.mjs
 */
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

// Urutan = urutan render aktual beranda publik. topbar tetap 0 (posisi
// tetap di atas header). Seksi yang tidak dirender di beranda diparkir
// setelah seksi aktif.
const order = [
  ["topbar", 0],
  ["hero", 1],
  ["news_carousel", 2],
  ["stats", 3],
  ["about", 4],
  ["programs", 5],
  ["whyus", 6],
  ["berita", 7],
  ["achievements", 8],
  ["testimonials", 9],
  ["organization", 10],
  ["news", 11],
  ["admission_cta", 12],
];

async function run() {
  for (const [key, idx] of order) {
    const res = await sql`UPDATE page_sections SET order_index = ${idx} WHERE key = ${key} RETURNING key`;
    if (res.length === 0) console.warn(`  ! key tidak ditemukan (dilewati): ${key}`);
  }

  const rows = await sql`SELECT key, order_index, is_enabled FROM page_sections ORDER BY order_index ASC`;
  console.table(rows);
  console.log("✓ Urutan page_sections diselaraskan dengan urutan render beranda.");
}

run().catch((err) => {
  console.error("Error updating page_sections:", err);
  process.exit(1);
});
