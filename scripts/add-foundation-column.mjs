// Tambah kolom school_profile.foundation (jsonb) untuk data legal yayasan
// (nomor SK Kemenkumham, nomor induk, pendiri, ketua, CP, email) yang dirender
// di halaman /tentang-kami dan diedit via /admin/organization/profil.
//
// Jalankan PER BRANCH Neon (staging sekarang, production saat merge ke main):
//   npm run env:staging    && node scripts/add-foundation-column.mjs
//   npm run env:production && node scripts/add-foundation-column.mjs
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

// Data awal bersumber dari halaman resmi https://yazzakkaaceh.org/data-yayasan/
const FOUNDATION_SEED = {
  skNumber: "AHU-0005614.AH.01.04. Tahun 2022",
  registryNumber: "AZ 1871",
  founders: ["Siti Ruhayya, Lc.", "Munzir"],
  chairman: "Dr. Amri Fatmi, Lc., M.A.",
  contactPerson: "+62 853-6299-9090",
  email: "yayasanbinaimanakhlakyazzakka@gmail.com",
};

async function run() {
  await sql`
    ALTER TABLE school_profile
    ADD COLUMN IF NOT EXISTS foundation jsonb
  `;
  console.log("✓ Kolom school_profile.foundation (jsonb) siap");

  // Hanya isi bila masih NULL — script idempoten, tidak menimpa edit CMS.
  await sql`
    UPDATE school_profile
    SET foundation = ${JSON.stringify(FOUNDATION_SEED)}::jsonb
    WHERE id = 'profile-yazzaka' AND foundation IS NULL
  `;
  console.log("✓ Seed data yayasan diisi (dilewati bila sudah ada nilai)");

  const rows = await sql`SELECT foundation FROM school_profile WHERE id = 'profile-yazzaka'`;
  console.log("Current foundation:", rows[0]?.foundation);
  console.log("✓ Selesai.");
}

run().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
