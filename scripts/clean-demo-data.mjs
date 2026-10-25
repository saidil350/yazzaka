// Bersihkan data seed fiktif di DB staging → placeholder jujur yang bisa
// diedit via CMS. Jalankan: npm run env:staging lalu node scripts/clean-demo-data.mjs
// (untuk production: npm run env:production — jalankan setelah merge staging→main).
//
// Yang dilakukan (idempoten):
// - achievements & testimonials: hapus semua baris fiktif.
// - page_sections: nonaktifkan seksi 'achievements' & 'testimonials' agar
//   beranda tidak menampilkan seksi kosong (aktifkan lagi via
//   /admin/pages/beranda setelah konten nyata diisi).
//
// TIDAK menyentuh: programs, articles, events, organization,
// media, profile, users. (admission_info ditinggalkan apa adanya —
// fitur PPDB dihapus 2026-10-25.)

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
  const delAch = await sql`DELETE FROM achievements`;
  console.log(`✓ achievements: semua baris fiktif dihapus.`);

  const delTesti = await sql`DELETE FROM testimonials`;
  console.log(`✓ testimonials: semua baris fiktif dihapus.`);

  const sec = await sql`
    UPDATE page_sections SET is_enabled = FALSE
    WHERE key IN ('achievements', 'testimonials') AND is_enabled = TRUE
  `;
  console.log(`✓ page_sections: seksi achievements & testimonials dinonaktifkan.`);

  console.log("\nSelesai. Isi konten nyata lewat CMS: /admin/berita, /admin/content/prestasi, /admin/content/testimoni.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("✗ Gagal:", e.message);
    process.exit(1);
  });
