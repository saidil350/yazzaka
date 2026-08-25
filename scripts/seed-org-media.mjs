import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
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
      photo_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      bio: "Alumnus Universitas Al-Azhar Kairo dan Doktoral UIN Sunan Kalijaga dengan pengalaman 20+ tahun dalam manajemen pendidikan Islam terpadu.",
      qualifications: "S1 Syari'ah (Al-Azhar), S2 Islamic Studies (Leiden/UIN), S3 Pendidikan Islam",
      order_index: 1,
    },
    {
      id: "org-2",
      name: "Drs. H. M. Furqon Al-Hafiz, M.Pd.",
      role_title: "Kepala SMA Unggulan Yazzaka",
      department: "Pimpinan Yayasan & Sekolah",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      bio: "Pendidik teladan dengan dedikasi tinggi pada pengembangan kurikulum sains modern dan sistem evaluasi mutu sekolah bertaraf nasional.",
      qualifications: "S1 Pendidikan Fisika (UNNES), S2 Manajemen Pendidikan (UNY), Hafiz 30 Juz",
      order_index: 2,
    },
    {
      id: "org-3",
      name: "Ust. Muhammad Ridwan, Lc., M.A.",
      role_title: "Direktur Pengasuhan Santri & Bahasa",
      department: "Kepengasuhan Asrama",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      bio: "Pakar pengajaran bahasa Arab komunikatif dan pembina iklim kedisiplinan asrama berbasis adab keteladanan.",
      qualifications: "S1 Bahasa Arab (Univ. Islam Madinah), S2 Linguistik Terapan",
      order_index: 3,
    },
    {
      id: "org-4",
      name: "Dr. Siti Nurhaliza, M.Si.",
      role_title: "Koordinator Riset Sains & Olimpiade",
      department: "Tenaga Pendidik (Guru)",
      photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
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
        photo_url = EXCLUDED.photo_url,
        bio = EXCLUDED.bio,
        qualifications = EXCLUDED.qualifications,
        order_index = EXCLUDED.order_index;
    `;
  }
  console.log(`✓ Berhasil seed ${organization.length} anggota organisasi!`);

  // === MEDIA ITEMS ===
  const media = [
    {
      id: "med-1",
      file_name: "kampus-utama-yazzaka.jpg",
      file_url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      file_type: "image",
      file_size: "1.8 MB",
      category: "Fasilitas",
      alt_text: "Gedung Utama dan Halaman Asri Kampus Terpadu Yazzaka",
    },
    {
      id: "med-2",
      file_name: "santri-tahfiz-quran.jpg",
      file_url: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
      file_type: "image",
      file_size: "2.1 MB",
      category: "Kegiatan",
      alt_text: "Aktivitas Halaqah Tahfiz Al-Qur'an Pagi Santri Yazzaka",
    },
    {
      id: "med-3",
      file_name: "praktikum-laboratorium-sains.jpg",
      file_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      file_type: "image",
      file_size: "2.4 MB",
      category: "Fasilitas",
      alt_text: "Praktikum Siswa di Laboratorium Sains Terpadu",
    },
    {
      id: "med-4",
      file_name: "brosur-ppdb-yazzaka-2026.pdf",
      file_url: "/docs/brosur-ppdb-yazzaka-2026.pdf",
      file_type: "document",
      file_size: "4.5 MB",
      category: "Dokumen PPDB",
      alt_text: "Brosur Resmi Panduan Pendaftaran Siswa Baru TA 2026/2027",
    },
    {
      id: "med-5",
      file_name: "video-profil-kampus-2026.mp4",
      file_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      file_type: "video",
      file_size: "45.0 MB",
      category: "Kegiatan",
      alt_text: "Video Profil Dokumentasi Kampus dan Keseharian Santri",
    },
  ];

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
