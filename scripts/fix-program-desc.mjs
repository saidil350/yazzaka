#!/usr/bin/env node
/**
 * fix-program-desc.mjs
 * --------------------
 * Mengganti teks deskripsi program di tabel programs yang berpola
 * "AI slop" (hasil audit 18 Nov 2026): ritme kalimat seragam, fragmen
 * tanpa subjek, adjektiva kosong ("interaktif", "komprehensif",
 * "berkualitas dan inklusif", "di era digital"), noun-stack
 * ("wadah pembentukan", "pemberdayaan ekonomi"), dan label puffery
 * ("Program strategis"). Teks konkret (angka, istilah, tempat)
 * dipertahankan apa adanya.
 *
 * Lingkup: staging saja (user memilih menunda sinkronisasi production).
 * Tidak ada file kode yang perlu disentuh: fallback initialPrograms
 * kosong (src/lib/data/initialData.ts:115) dan badge kategori publik
 * di-drive slug, bukan teks kategori (src/app/(public)/program/page.tsx).
 *
 * Jalankan:
 *   npm run env:staging && node scripts/fix-program-desc.mjs
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
  console.error("✗ DATABASE_URL tidak ditemukan. Jalankan via npm run env:staging dulu.");
  process.exit(1);
}

console.log(`Target DB: ${new URL(DATABASE_URL).hostname}`);

const sql = neon(DATABASE_URL);

// id -> kolom yang diganti. Kolom yang tidak tercantum (features,
// target_competencies kecuali prog-6, short_desc prog-1/4/5/6) sudah
// konkret dan sengaja tidak disentuh.
const updates = [
  {
    id: "prog-1",
    full_desc:
      "TPA Yazzakka membimbing anak-anak sejak usia dini untuk mencintai Al-Qur'an. Santri belajar talaqqi makharijul huruf, tajwid praktis, dan setoran hafalan juz 'amma, sambil dibiasakan beradab dalam keseharian.",
  },
  {
    id: "prog-2",
    short_desc:
      "Anak usia dini membiasakan akhlak mulia dan memperkuat akidah melalui bermain berbasis fitrah, sambil melatih motorik dan kognitifnya.",
    full_desc:
      "TKIT Yazzakka memadukan kurikulum PAUD terpadu nasional dengan kurikulum kekhasan Islam. Belajar berlangsung di kelas ramah anak ber-AC, dengan pembiasaan ibadah harian untuk menumbuhkan kecintaan pada Allah dan Rasul-Nya.",
  },
  {
    id: "prog-3",
    short_desc:
      "Kelas tematik dan pembiasaan ibadah membentuk karakter, akhlak sosial, dan kepemimpinan anak.",
    full_desc:
      "Sekolah Anak Shalih memperkuat adab dan akhlak sosial anak. Melalui kelas tematik, halaqah adab, bakti sosial, dan mentoring kepribadian, anak berlatih memimpin diri, peduli sesama, dan tetap teguh dalam ibadah.",
  },
  {
    id: "prog-4",
    category: "Kesetaraan & Vokasi",
    full_desc:
      "PKBM Yazzakka membuka pendidikan non-formal resmi bagi masyarakat dari berbagai umur. Programnya mencakup kelas keaksaraan, kesetaraan Paket A, B, dan C, kursus vokasi kemandirian, serta pelatihan usaha keluarga berbasis syariah.",
  },
  {
    id: "prog-5",
    full_desc:
      "Darul Quran Yazzakka membina santri menuju hafalan Al-Qur'an 30 juz mutqin, disertai pendalaman kaidah bahasa Arab, fiqih ibadah, dan kajian kitab tauhid di bawah bimbingan langsung para masyaikh dan asatidz.",
  },
  {
    id: "prog-6",
    full_desc:
      "Wakaf umat untuk mendirikan Pesantren Peradaban 6.0 di Kabupaten Pidie, Aceh. Santri mendalami keilmuan Islam warisan Serambi Mekkah bersama sains modern, di kawasan berisi asrama, masjid, laboratorium riset, dan pusat kaderisasi ulama.",
    // Item 1-2 dipertahankan verbatim dari DB; item 3 ("Pusat rujukan
    // studi peradaban Islam di Aceh dan Asia Tenggara") diganti kompetensi konkret.
    target_competencies: JSON.stringify([
      "Membangun peradaban Islam masa depan berlandaskan Al-Qur'an & Sunnah",
      "Mencetak generasi pemimpin yang tangguh dan berwawasan global",
      "Terbiasa mengkaji kitab klasik dan isu peradaban kontemporer",
    ]),
  },
];

const CASTS = { target_competencies: "::jsonb" };

async function run() {
  for (const { id, ...fields } of updates) {
    const cols = Object.keys(fields);
    const params = Object.values(fields);
    const sqlText = `UPDATE programs SET ${cols
      .map((c, i) => `${c} = $${i + 1}${CASTS[c] || ""}`)
      .join(", ")}, updated_at = NOW() WHERE id = $${cols.length + 1} RETURNING id, slug`;
    const res = await sql.query(sqlText, [...params, id]);
    if (res.length === 0) {
      console.warn(`  ! id tidak ditemukan (dilewati): ${id}`);
    } else {
      console.log(`  ✓ ${res[0].id} (${res[0].slug}): ${cols.join(", ")}`);
    }
  }

  console.log("\nHasil akhir:");
  const rows = await sql`SELECT id, slug, category, short_desc, full_desc, target_competencies FROM programs ORDER BY order_index ASC`;
  for (const r of rows) {
    console.log(`\n=== ${r.id} (${r.slug}) | kategori: ${r.category}`);
    console.log(`short_desc: ${r.short_desc}`);
    console.log(`full_desc : ${r.full_desc}`);
    console.log(`target    : ${JSON.stringify(r.target_competencies)}`);
  }
  console.log("\n✓ Deskripsi program staging diperbarui.");
}

run().catch((err) => {
  console.error("Error updating programs:", err);
  process.exit(1);
});
