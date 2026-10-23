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
const sql = neon(DATABASE_URL);

async function seed() {
  console.log("🌱 Menjalankan Seeding Organization Members & Media Items...");

  // === ORGANIZATION MEMBERS ===
  const organization = [
    {
      id: "org-1",
      name: "Dr. KH. Ahmad Zaki Mubarak, Lc., M.Phil.",
      role_title: "Pimpinan & Pengasuh Pesantren",
      department: "Pimpinan Yayasan & Sekolah",
      photo_url: null,
      bio: "Alumnus Universitas Al-Azhar Kairo dan Doktoral UIN Sunan Kalijaga dengan pengalaman 20+ tahun dalam manajemen pendidikan Islam terpadu.",
      qualifications: "S1 Syari'ah (Al-Azhar), S2 Islamic Studies (Leiden/UIN), S3 Pendidikan Islam",
      order_index: 1,
    },
    {
      id: "org-2",
      name: "Drs. H. M. Furqon Al-Hafiz, M.Pd.",
      role_title: "Kepala SMA Unggulan Yazzaka",
      department: "Pimpinan Yayasan & Sekolah",
      photo_url: null,
      bio: "Pendidik teladan dengan dedikasi tinggi pada pengembangan kurikulum sains modern dan sistem evaluasi mutu sekolah bertaraf nasional.",
      qualifications: "S1 Pendidikan Fisika (UNNES), S2 Manajemen Pendidikan (UNY), Hafiz 30 Juz",
      order_index: 2,
    },
    {
      id: "org-3",
      name: "Ust. Muhammad Ridwan, Lc., M.A.",
      role_title: "Direktur Pengasuhan Santri & Bahasa",
      department: "Kepengasuhan Asrama",
      photo_url: null,
      bio: "Pakar pengajaran bahasa Arab komunikatif dan pembina iklim kedisiplinan asrama berbasis adab keteladanan.",
      qualifications: "S1 Bahasa Arab (Univ. Islam Madinah), S2 Linguistik Terapan",
      order_index: 3,
    },
    {
      id: "org-4",
      name: "Dr. Siti Nurhaliza, M.Si.",
      role_title: "Koordinator Riset Sains & Olimpiade",
      department: "Tenaga Pendidik (Guru)",
      photo_url: null,
      bio: "Peneliti muda di bidang bioteknologi dan pembina tim olimpiade sains yang telah mengantar santri meraih berbagai medali emas nasional.",
      qualifications: "S1 Biologi (UGM), S2 & S3 Bioteknologi (ITB)",
      order_index: 4,
    },
  ];

  for (const o of organization) {
    await sql`
      INSERT INTO organization_members (
        id, name, role_title, department, photo_url, bio, qualifications, order_index
      ) VALUES (
        ${o.id}, ${o.name}, ${o.role_title}, ${o.department}, ${o.photo_url}, 
        ${o.bio}, ${o.qualifications}, ${o.order_index}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role_title = EXCLUDED.role_title,
        department = EXCLUDED.department,
        -- photo_url sengaja tidak di-update: jangan menimpa foto asli unggahan admin
        bio = EXCLUDED.bio,
        qualifications = EXCLUDED.qualifications,
        order_index = EXCLUDED.order_index;
    `;
  }
  console.log(`✓ Berhasil seed ${organization.length} anggota organisasi!`);

  // === MEDIA ITEMS ===
  // Media dummy (Unsplash & brosur path mati) dihapus 2026-10-23.
  // Galeri diisi unggahan nyata via /admin/media.
  const media = [];

  for (const m of media) {
    await sql`
      INSERT INTO media_items (
        id, file_name, file_url, file_type, file_size, category, alt_text
      ) VALUES (
        ${m.id}, ${m.file_name}, ${m.file_url}, ${m.file_type}, 
        ${m.file_size}, ${m.category}, ${m.alt_text}
      )
      ON CONFLICT (id) DO UPDATE SET
        file_name = EXCLUDED.file_name,
        file_url = EXCLUDED.file_url,
        file_type = EXCLUDED.file_type,
        file_size = EXCLUDED.file_size,
        category = EXCLUDED.category,
        alt_text = EXCLUDED.alt_text;
    `;
  }
  console.log(`✓ Berhasil seed ${media.length} item media library!`);
}

seed()
  .then(() => {
    console.log("🎉 Seeding selesai dengan sukses!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  });
