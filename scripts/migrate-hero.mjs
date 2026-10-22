// Migrasi konten Hero Beranda + seed Nilai Pokok (Why Us).
// Jalankan ke SETIAP branch Neon: npm run env:staging (atau env:production)
// lalu node scripts/migrate-hero.mjs
//
// Semua perubahan bersifat ADDITIF dan idempotent — aman dijalankan berulang.
// - Kolom `hero` (JSONB) menampung konten HeroSection yang sebelumnya hardcoded.
// - Seed `values` hanya diisi bila masih kosong, agar editor CMS dan tampilan
//   publik tidak berbeda (publik punya fallback hardcoded jika values kosong).

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
  console.error("❌ DATABASE_URL tidak ditemukan. Jalankan npm run env:staging atau env:production dulu.");
  process.exit(1);
}

const sql = neon(connectionString);

// Fallback di HeroSection.tsx / DEFAULT_HERO (src/lib/data/initialData.ts) —
// harus sinkron: konten yang sama dengan yang ditampilkan publik saat ini.
const DEFAULT_VALUES = [
  {
    title: "Bimbingan Ulama Al-Azhar Kairo",
    description:
      "Kurikulum dan nilai pembinaan dibimbing langsung oleh Dr. Amri Fatmi, Lc., M.A. (Doktor Akidah Filsafat Al-Azhar Kairo Summa Cum Laude).",
  },
  {
    title: "Pendidikan Fitrah & Akhlakul Karimah",
    description:
      "Fokus utama pada penanaman akidah yang kokoh, adab islami dalam kehidupan sehari-hari, serta pembentukan karakter santri yang santun dan berbudi luhur.",
  },
  {
    title: "Ekosistem Pendidikan Berjenjang",
    description:
      "Menaungi jenjang usia dini (TPA & TKIT), pembinaan karakter (Sekolah Anak Shalih), kesetaraan masyarakat (PKBM), hingga tahfiz Al-Qur'an 30 juz (Darul Quran).",
  },
  {
    title: "Ketahanan & Edukasi Keluarga",
    description:
      "Menjadikan keluarga sebagai pilar utama pembinaan melalui program parenting berkala, kajian tematik, dan sinergi aktif antara asatizah dan orang tua.",
  },
  {
    title: "Legalitas Resmi SK Kemenkumham RI",
    description:
      "Lembaga berbadan hukum resmi dengan SK Kemenkumham RI No. AHU-0005614.AH.01.04. Tahun 2022, menjamin tata kelola yayasan yang amanah dan akuntabel.",
  },
  {
    title: "Kawasan Pesantren Peradaban 6.0",
    description:
      "Inisiasi strategis pembangunan pesantren peradaban modern di Cot Rheng, Pidie, guna mencetak generasi ulama dan cendekiawan berwawasan global.",
  },
];

async function migrate() {
  console.log("🚀 Migrasi hero beranda & nilai pokok...");

  await sql`
    ALTER TABLE school_profile
    ADD COLUMN IF NOT EXISTS hero JSONB DEFAULT '{}'
  `;
  console.log("✓ Kolom school_profile.hero tersedia");

  const seeded = await sql`
    UPDATE school_profile
    SET values = ${JSON.stringify(DEFAULT_VALUES)}::jsonb
    WHERE id = 'profile-yazzaka'
      AND (values IS NULL OR values = '[]'::jsonb)
    RETURNING id
  `;
  if (seeded.length > 0) {
    console.log("✓ Nilai pokok (values) di-seed dengan 6 item default");
  } else {
    console.log("• Nilai pokok (values) sudah terisi — dilewati");
  }

  console.log("✅ Migrasi selesai.");
}

migrate().catch((err) => {
  console.error("❌ Migrasi gagal:", err);
  process.exit(1);
});
