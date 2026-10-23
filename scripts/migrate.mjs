// Script untuk menjalankan schema migration dan seed data ke Neon PostgreSQL.
// Jalankan per branch: npm run env:staging (atau env:production) lalu
// node scripts/migrate.mjs — skrip membaca .env.local, TIDAK lagi menembak
// production langsung (perilaku lama yang berbahaya sudah dihapus).

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

async function migrate() {
  console.log("🚀 Membuat tabel database...");

  await sql`
    CREATE TABLE IF NOT EXISTS school_profile (
      id TEXT PRIMARY KEY DEFAULT 'profile-yazzaka',
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      npsn TEXT,
      accreditation TEXT,
      established_year INTEGER,
      student_count INTEGER DEFAULT 0,
      teacher_count INTEGER DEFAULT 0,
      alumni_count INTEGER DEFAULT 0,
      hafiz_count INTEGER DEFAULT 0,
      address TEXT,
      city TEXT,
      province TEXT,
      phone TEXT,
      email TEXT,
      whatsapp TEXT,
      maps_embed_url TEXT,
      principal_name TEXT,
      principal_title TEXT,
      principal_photo_url TEXT,
      principal_welcome_message TEXT,
      principal_signature_url TEXT,
      vision TEXT,
      mission JSONB DEFAULT '[]',
      values JSONB DEFAULT '[]',
      branding JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ school_profile");

  await sql`
    CREATE TABLE IF NOT EXISTS programs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      short_desc TEXT,
      full_desc TEXT,
      image_url TEXT,
      icon_name TEXT,
      features JSONB DEFAULT '[]',
      target_competencies JSONB DEFAULT '[]',
      status TEXT DEFAULT 'published',
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ programs");

  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      student_name TEXT,
      competition_name TEXT,
      level TEXT,
      year INTEGER,
      date TEXT,
      image_url TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ achievements");

  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      cover_image TEXT,
      category TEXT NOT NULL,
      tags JSONB DEFAULT '[]',
      author TEXT,
      author_role TEXT,
      published_date TEXT,
      read_time TEXT,
      status TEXT DEFAULT 'published',
      featured BOOLEAN DEFAULT FALSE,
      seo_title TEXT,
      seo_description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ articles");

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      time TEXT,
      location TEXT,
      category TEXT NOT NULL,
      cover_image TEXT,
      registration_url TEXT,
      status TEXT DEFAULT 'upcoming',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ events");

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      quote TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      photo_url TEXT,
      graduation_year INTEGER,
      child_name TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ testimonials");

  await sql`
    CREATE TABLE IF NOT EXISTS admission_info (
      id TEXT PRIMARY KEY DEFAULT 'admission-yazzaka',
      period_name TEXT,
      academic_year TEXT,
      is_open BOOLEAN DEFAULT FALSE,
      start_date TEXT,
      end_date TEXT,
      hide_form_when_closed BOOLEAN DEFAULT TRUE,
      closed_message TEXT,
      registration_url TEXT,
      consultation_whatsapp TEXT,
      timeline JSONB DEFAULT '[]',
      requirements JSONB DEFAULT '[]',
      fees JSONB DEFAULT '[]',
      faqs JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ admission_info");

  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT,
      submitted_at TEXT,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ contact_messages");

  await sql`
    CREATE TABLE IF NOT EXISTS website_settings (
      id TEXT PRIMARY KEY DEFAULT 'settings-yazzaka',
      site_title TEXT,
      meta_description TEXT,
      keywords TEXT,
      og_image TEXT,
      google_verification TEXT,
      social_media JSONB DEFAULT '{}',
      navigation JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ website_settings");

  await sql`
    CREATE TABLE IF NOT EXISTS organization_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role_title TEXT,
      department TEXT,
      photo_url TEXT,
      bio TEXT,
      qualifications TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ organization_members");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'viewer',
      avatar_url TEXT,
      created_at TEXT
    )
  `;
  console.log("✓ users");

  await sql`
    CREATE TABLE IF NOT EXISTS page_sections (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      title TEXT,
      subtitle TEXT,
      is_enabled BOOLEAN DEFAULT TRUE,
      order_index INTEGER DEFAULT 0
    )
  `;
  console.log("✓ page_sections");

  await sql`
    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size TEXT,
      category TEXT,
      alt_text TEXT,
      uploaded_at TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✓ media_items");

  console.log("\n✅ Semua tabel berhasil dibuat!\n");
}

async function seed() {
  console.log("🌱 Seeding data awal...");

  // === SCHOOL PROFILE ===
  await sql`
    INSERT INTO school_profile (
      id, name, tagline, description, npsn, accreditation,
      established_year, student_count, teacher_count, alumni_count, hafiz_count,
      address, city, province, phone, email, whatsapp, maps_embed_url,
      principal_name, principal_title, principal_photo_url, principal_welcome_message,
      vision, mission, values, branding
    ) VALUES (
      'profile-yazzaka',
      'SMA & Pesantren Modern Yazzaka',
      'Menumbuhkan Generasi Unggul, Berkarakter, dan Siap Memimpin Masa Depan.',
      'Institusi pendidikan terpadu yang memadukan keunggulan kurikulum nasional, sains modern, penguasaan bahasa internasional (Arab & Inggris), serta penanaman adab dan tahfiz Al-Qur''an 30 juz.',
      '69889210',
      'A (Unggul)',
      2012, 1280, 94, 2450, 310,
      'Jl. Raya Bandar - Batang Km. 05, Desa Kauman, Kec. Bandar',
      'Kabupaten Batang',
      'Jawa Tengah 51254',
      '(0285) 4489211',
      'info@yazzaka.sch.id',
      '6281234567890',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.989201509376!2d109.789234!3d-7.010234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMzYuOCJTIDEwOcKwNDcnMjEuMiJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid',
      'Dr. KH. Ahmad Zaki Mubarak, Lc., M.Phil.',
      'Pimpinan & Direktur Pendidikan Yazzaka',
      '',
      'Assalamu''alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi SMA & Pesantren Modern Yazzaka.',
      'Menjadi pusat keunggulan pendidikan Islam modern terpadu terkemuka di Asia Tenggara yang melahirkan generasi berkarakter Qur''ani, berdaya saing sains global, dan berjiwa kepemimpinan peradaban.',
      '["Menyelenggarakan pendidikan holistik berbasis nilai-nilai Islam dan sains teknologi mutakhir.", "Membina program tahfiz Al-Qur''an dan pendalaman dirasah Islamiyah yang mutqin dan kontekstual.", "Mengembangkan lingkungan bilingual interaktif bahasa Arab dan Inggris sebagai bahasa pengantar ilmu.", "Membangun ekosistem riset, sains terapan, dan kewirausahaan siswa berstandar global.", "Menanamkan karakter kepemimpinan, kemandirian santri, dan kepekaan sosial kemasyarakatan."]',
      '[{"title":"Keikhlasan (Ikhlas)","description":"Mendasari setiap ikhtiar belajar, mengajar, dan beramal semata karena Allah SWT."},{"title":"Kemandirian (Berdikari)","description":"Menempa ketangguhan mental, kedisiplinan, dan daya juang hidup santri."},{"title":"Ukhuwah Islamiyah","description":"Menjalin persaudaraan yang kokoh di atas toleransi dan kasih sayang sesama."},{"title":"Kebebasan Berpikir (Intelektual)","description":"Berwawasan luas, terbuka terhadap kemajuan ilmu, serta kritis dan solutif."},{"title":"Kesederhanaan (Adab)","description":"Menjunjung tinggi kesahajaan, keteladanan akhlak, dan integritas moral."}]',
      '{"primaryColor":"#0F2B48","accentColor":"#D97706","secondaryColor":"#F4F6F8","logoUrl":"/logo-yazzaka.svg","faviconUrl":"/favicon.ico"}'
    ) ON CONFLICT (id) DO NOTHING
  `;
  console.log("✓ school_profile seeded");

  // === PROGRAMS ===
  const programs = [
    {
      id: "prog-1",
      slug: "tpa-yazzakka",
      title: "TPA Yazzakka (Taman Pendidikan Al-Qur'an)",
      category: "Pendidikan Al-Qur'an",
      short_desc: "Pembinaan dasar baca-tulis Al-Qur'an dengan metode tartil tajwid, hafalan surat pendek, doa harian, dan adab islami anak.",
      full_desc: "TPA Yazzakka membimbing anak-anak sejak usia dini untuk mencintai Al-Qur'an melalui metode pembelajaran interaktif, talaqqi makharijul huruf, tajwid praktis, setoran hafalan juz 'amma, serta penanaman adab dan akhlak keseharian.",
      image_url: "",
      icon_name: "BookOpen",
      features: JSON.stringify(["Bimbingan talaqqi fashahah & tajwid praktis", "Target tuntas Juz 'Amma dan doa harian", "Pembiasaan adab shalat dan akhlak mulia", "Evaluasi munaqasyah dan wisuda santri"]),
      target_competencies: JSON.stringify(["Fasih membaca Al-Qur'an sesuai kaidah tajwid", "Hafal Juz 30 dan surat-surat pilihan", "Terbiasa menjalankan shalat dan adab harian"]),
      status: "published",
      order_index: 1,
    },
    {
      id: "prog-2",
      slug: "tkit-yazzakka",
      title: "TKIT Yazzakka (TK Islam Terpadu)",
      category: "Anak Usia Dini",
      short_desc: "Pendidikan anak usia dini berbasis fitrah, penguatan akidah, pembiasaan akhlak mulia, dan stimulasi motorik-kognitif ceria.",
      full_desc: "TKIT Yazzakka memadukan kurikulum PAUD terpadu nasional dengan kurikulum kekhasan Islam. Menghadirkan lingkungan belajar yang aman, ramah anak, dan penuh kasih sayang untuk menumbuhkan kecintaan pada Allah dan Rasul-Nya sejak dini.",
      image_url: "",
      icon_name: "Sparkles",
      features: JSON.stringify(["Sentra bermain peran, seni, dan kreativitas", "Tahfiz Al-Qur'an surat-surat pendek dan hadits pilihan", "Smart classroom ramah anak ber-AC", "Laporan perkembangan karakter dan psikomotorik"]),
      target_competencies: JSON.stringify(["Kemampuan sosialisasi dan kemandirian anak", "Mengenal huruf hijaiyah dan dasar baca-tulis", "Memiliki adab sopan santun kepada orang tua dan guru"]),
      status: "published",
      order_index: 2,
    },
    {
      id: "prog-3",
      slug: "sekolah-anak-shalih",
      title: "Sekolah Anak Shalih Yazzakka",
      category: "Pembinaan Karakter",
      short_desc: "Program penguatan karakter, akhlak sosial, dan kepemimpinan islami anak melalui kelas tematik dan pembiasaan ibadah.",
      full_desc: "Sekolah Anak Shalih didesain untuk memperkuat nilai-nilai adab dan akhlak sosial di era digital. Membekali anak-anak dengan wawasan keislaman komprehensif, kepemimpinan diri, empati sosial, dan ketahanan mental islami.",
      image_url: "",
      icon_name: "HeartHandshake",
      features: JSON.stringify(["Kelas tematik parenting dan karakter santri", "Halaqah adab dan keteladanan Rasulullah SAW", "Aktivitas sosial dan bakti kebaikan", "Mentoring kepribadian dan public speaking"]),
      target_competencies: JSON.stringify(["Kepribadian santun, percaya diri, dan peduli sesama", "Kecakapan berkomunikasi dan memimpin kelompok", "Integritas moral dan kedisiplinan ibadah"]),
      status: "published",
      order_index: 3,
    },
    {
      id: "prog-4",
      slug: "pkbm-yazzakka",
      title: "PKBM Yazzakka (Pendidikan Kesetaraan & Vokasi)",
      category: "Pemberdayaan Umat",
      short_desc: "Pusat Kegiatan Belajar Masyarakat untuk pendidikan kesetaraan (Paket A/B/C), literasi Al-Qur'an dewasa, dan vokasi keahlian.",
      full_desc: "PKBM Yazzakka menyediakan akses pendidikan non-formal yang berkualitas dan inklusif bagi masyarakat. Menyelenggarakan program keaksaraan, kesetaraan pendidikan formal, kursus vokasi kemandirian, serta pemberdayaan ekonomi keluarga berbasis syariah.",
      image_url: "",
      icon_name: "GraduationCap",
      features: JSON.stringify(["Pendidikan Kesetaraan Paket A, B, dan C resmi", "Kelas tahsin dan literasi Al-Qur'an untuk dewasa/lansia", "Pelatihan keterampilan vokasi & wirausaha syariah", "Jadwal belajar fleksibel berbasis tatap muka & daring"]),
      target_competencies: JSON.stringify(["Mendapatkan ijazah kelulusan kesetaraan resmi", "Menguasai keterampilan kerja mandiri & bisnis keluarga", "Melek baca Al-Qur'an dan pemahaman dasar ibadah"]),
      status: "published",
      order_index: 4,
    },
    {
      id: "prog-5",
      slug: "darul-quran-yazzakka",
      title: "Darul Quran Yazzakka (Tahfiz Intensif)",
      category: "Tahfiz & Keilmuan",
      short_desc: "Program karantina dan pembinaan tahfiz 30 juz intensif dengan bimbingan asatidz bersanad dan kajian dirasah Islamiyah.",
      full_desc: "Darul Quran Yazzakka memfokuskan pembinaan santri dalam menghafal Al-Qur'an 30 juz mutqin disertai pendalaman kaidah bahasa Arab, fiqih ibadah, dan kajian kitab tauhid di bawah bimbingan langsung para masyaikh dan asatidz.",
      image_url: "",
      icon_name: "Award",
      features: JSON.stringify(["Target mutqin 30 juz dengan bimbingan bersanad", "Karantina tahfiz dan setoran harian intensif", "Kajian akidah dan dirasah Islamiyah terstruktur", "Tasmi' hafalan terbuka sekali duduk"]),
      target_competencies: JSON.stringify(["Hafal 30 juz dengan kaidah tajwid dan makhraj mutqin", "Memahami dasar-dasar akidah ahlussunnah wal jama'ah", "Kesiapan menjadi imam, da'i, dan penerima sanad"]),
      status: "published",
      order_index: 5,
    },
    {
      id: "prog-6",
      slug: "pesantren-peradaban-60",
      title: "Wakaf Pesantren Peradaban 6.0 Pidie",
      category: "Program Strategis",
      short_desc: "Ikhtiar pembangunan kawasan pesantren peradaban modern berbasis wakaf umat di Cot Rheng, Pidie untuk melahirkan pemimpin umat masa depan.",
      full_desc: "Program strategis Yayasan Yazzakka untuk mendirikan Pesantren Peradaban 6.0 di Kabupaten Pidie, Aceh. Mengintegrasikan kemuliaan tradisi keilmuan Islam Serambi Mekkah dengan keunggulan sains masa depan, kepemimpinan global, dan kemandirian peradaban.",
      image_url: "",
      icon_name: "Globe",
      features: JSON.stringify(["Pembebasan lahan wakaf dan pembangunan masterplan terpadu", "Fasilitas asrama, masjid peradaban, dan laboratorium riset", "Pendidikan kader ulama intelektual berwawasan dunia", "Peluang amal jariyah wakaf produktif untuk kaum muslimin"]),
      target_competencies: JSON.stringify(["Membangun peradaban Islam masa depan berlandaskan Al-Qur'an & Sunnah", "Mencetak generasi pemimpin yang tangguh dan berwawasan global", "Pusat rujukan studi peradaban Islam di Aceh dan Asia Tenggara"]),
      status: "published",
      order_index: 6,
    },
  ];

  for (const p of programs) {
    await sql`
      INSERT INTO programs (id, slug, title, category, short_desc, full_desc, image_url, icon_name, features, target_competencies, status, order_index)
      VALUES (${p.id}, ${p.slug}, ${p.title}, ${p.category}, ${p.short_desc}, ${p.full_desc}, ${p.image_url}, ${p.icon_name}, ${p.features}::jsonb, ${p.target_competencies}::jsonb, ${p.status}, ${p.order_index})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ programs seeded (6 records)");

  // === ACHIEVEMENTS ===
  // Tidak ada seed — data fiktif dihapus 2026-10-23. Isi prestasi nyata via CMS.
  const achievements = [];

  for (const a of achievements) {
    await sql`
      INSERT INTO achievements (id, title, category, student_name, competition_name, level, year, date, image_url, description)
      VALUES (${a.id}, ${a.title}, ${a.category}, ${a.student_name}, ${a.competition_name}, ${a.level}, ${a.year}, ${a.date}, ${a.image_url}, ${a.description})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ achievements seeded (0 records — isi via CMS)");

  // === ARTICLES ===
  const articles = [
    {
      id: "art-1",
      slug: "yazzaka-raih-medali-emas-osn-biologi-2025",
      title: "Yazzaka Raih Medali Emas OSN Biologi 2025: Bukti Keunggulan Riset Santri",
      excerpt: "Santri Yazzaka kembali mengukir prestasi gemilang di panggung nasional dengan meraih Medali Emas pada Olimpiade Sains Nasional bidang Biologi.",
      content: "Konten artikel lengkap tentang prestasi OSN Biologi 2025.",
      cover_image: "",
      category: "Prestasi",
      tags: JSON.stringify(["OSN", "Sains", "Prestasi", "Biologi"]),
      author: "Tim Humas Yazzaka",
      author_role: "Divisi Publikasi & Komunikasi",
      published_date: "2025-10-20",
      read_time: "4 menit",
      status: "published",
      featured: true,
      seo_title: "Yazzaka Raih Medali Emas OSN Biologi 2025",
      seo_description: "Santri Yazzaka meraih Medali Emas OSN Biologi 2025 nasional.",
    },
    {
      id: "art-2",
      slug: "pesantren-modern-vs-pesantren-tradisional",
      title: "Pesantren Modern vs. Tradisional: Mana yang Lebih Baik untuk Anak Anda?",
      excerpt: "Perdebatan antara pesantren modern dan tradisional terus berkembang. Artikel ini mengupas tuntas perbedaan, keunggulan, dan bagaimana Yazzaka menjawab tantangan keduanya.",
      content: "Konten artikel lengkap tentang perbandingan pesantren.",
      cover_image: "",
      category: "Wawasan & Opini",
      tags: JSON.stringify(["Pesantren", "Pendidikan Islam", "Parenting"]),
      author: "Dr. KH. Ahmad Zaki Mubarak",
      author_role: "Pimpinan Yazzaka",
      published_date: "2025-09-15",
      read_time: "8 menit",
      status: "published",
      featured: true,
      seo_title: "Pesantren Modern vs Tradisional: Panduan Lengkap",
      seo_description: "Perbandingan pesantren modern dan tradisional untuk membantu orang tua memilih.",
    },
    {
      id: "art-3",
      slug: "pembukaan-ppdb-tahun-ajaran-2026-2027",
      title: "Pengumuman Resmi: PPDB Yazzaka Tahun Ajaran 2026/2027 Telah Dibuka",
      excerpt: "Yazzaka membuka pendaftaran peserta didik baru (PPDB) untuk tahun ajaran 2026/2027. Kuota terbatas, segera daftarkan putra-putri Anda.",
      content: "Konten pengumuman PPDB lengkap.",
      cover_image: "",
      category: "Pengumuman",
      tags: JSON.stringify(["PPDB", "Pendaftaran", "2026"]),
      author: "Panitia PPDB Yazzaka",
      author_role: "Divisi Penerimaan Santri Baru",
      published_date: "2025-11-01",
      read_time: "3 menit",
      status: "published",
      featured: false,
      seo_title: "PPDB Yazzaka 2026/2027 Dibuka",
      seo_description: "Informasi resmi pembukaan PPDB Yazzaka tahun ajaran 2026/2027.",
    },
  ];

  for (const a of articles) {
    await sql`
      INSERT INTO articles (id, slug, title, excerpt, content, cover_image, category, tags, author, author_role, published_date, read_time, status, featured, seo_title, seo_description)
      VALUES (${a.id}, ${a.slug}, ${a.title}, ${a.excerpt}, ${a.content}, ${a.cover_image}, ${a.category}, ${a.tags}::jsonb, ${a.author}, ${a.author_role}, ${a.published_date}, ${a.read_time}, ${a.status}, ${a.featured}, ${a.seo_title}, ${a.seo_description})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ articles seeded (3 records)");

  // === EVENTS ===
  const events = [
    { id: "evt-1", title: "Open House & Hari Informasi PPDB 2026/2027", description: "Kunjungi sekolah Yazzakka secara langsung, temui para pengajar, dan dapatkan informasi lengkap tentang program & biaya pendidikan.", date: "2025-12-07", time: "08:00 - 14:00 WIB", location: "Kompleks Utama Yazzakka, Sigli", category: "Penerimaan Siswa", cover_image: "", registration_url: "#daftar", status: "upcoming" },
    { id: "evt-2", title: "Seminar Parenting: Mendidik Generasi Hafiz di Era Digital", description: "Seminar bersama pakar pendidikan Islam dan psikolog anak tentang strategi mendidik anak hafiz Al-Qur'an yang adaptif di era digital.", date: "2025-11-22", time: "08:30 - 12:00 WIB", location: "Aula Utama Yayasan Yazzakka", category: "Seminar & Parenting", cover_image: "", registration_url: "#seminar", status: "upcoming" },
    { id: "evt-3", title: "Wisuda & Haflah Akhirussanah ke-12 Yazzaka", description: "Perayaan wisuda santri angkatan ke-12 disertai penampilan seni, pameran karya siswa, dan penyerahan ijazah.", date: "2025-06-15", time: "07:00 - 17:00 WIB", location: "Sekolah Yazzakka & Area Terbuka", category: "Wisuda & Pameran", cover_image: "", status: "completed" },
  ];

  for (const e of events) {
    await sql`
      INSERT INTO events (id, title, description, date, time, location, category, cover_image, registration_url, status)
      VALUES (${e.id}, ${e.title}, ${e.description}, ${e.date}, ${e.time}, ${e.location}, ${e.category}, ${e.cover_image}, ${e.registration_url ?? null}, ${e.status})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ events seeded (3 records)");

  // === TESTIMONIALS ===
  // Tidak ada seed — testimoni fiktif dihapus 2026-10-23. Isi via CMS.
  const testimonials = [];

  for (const t of testimonials) {
    await sql`
      INSERT INTO testimonials (id, quote, name, role, photo_url, graduation_year, child_name, is_featured)
      VALUES (${t.id}, ${t.quote}, ${t.name}, ${t.role}, ${t.photo_url}, ${t.graduation_year ?? null}, ${t.child_name ?? null}, ${t.is_featured})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ testimonials seeded (0 records — isi via CMS)");

  // === ADMISSION INFO ===
  // Placeholder jujur (2026-10-23): biaya/jadwal/FAQ fiktif tidak di-seed.
  // Isi konten PPDB nyata via CMS /admin/content/pendaftaran.
  await sql`
    INSERT INTO admission_info (
      id, period_name, academic_year, is_open, registration_url, consultation_whatsapp,
      timeline, requirements, fees, faqs
    ) VALUES (
      'admission-yazzaka',
      'Penerimaan Santri Baru',
      '',
      true,
      '/pendaftaran',
      '6285362999090',
      '[]',
      '["Informasi persyaratan berkas akan diumumkan oleh panitia PPDB — silakan hubungi via WhatsApp."]',
      '[{"name":"Rincian biaya PPDB","category":"Menyusul","amount":0,"notes":"Informasi biaya akan diumumkan oleh panitia — silakan hubungi panitia PPDB via WhatsApp."}]',
      '[]'
    ) ON CONFLICT (id) DO NOTHING
  `;
  console.log("✓ admission_info seeded (placeholder — isi biaya/jadwal nyata via CMS)");

  // === WEBSITE SETTINGS ===
  await sql`
    INSERT INTO website_settings (
      id, site_title, meta_description, keywords, og_image, social_media, navigation
    ) VALUES (
      'settings-yazzaka',
      'Yayasan & Pesantren Yazzakka Aceh — Generasi Unggul Berkarakter',
      'Lembaga pendidikan Islam terpadu dan sekolah formal di Sigli Aceh. Program Tahfiz, Karakter Islami, Bahasa Arab, dan Kepemimpinan untuk mencetak generasi unggul.',
      'pesantren peradaban, sekolah islam, tahfiz quran, yayasan yazzakka aceh, sigli pidie',
      NULL,
      '{"instagram":"https://instagram.com/yazzakka.official","youtube":"https://youtube.com/@YazzakaOfficial","facebook":"https://facebook.com/yazzakka.official","tiktok":"https://tiktok.com/@yazzakka.official","linkedin":""}',
      '{"headerLinks":[{"label":"Beranda","href":"/"},{"label":"Tentang Kami","href":"/tentang-kami"},{"label":"Program","href":"/program"},{"label":"Prestasi","href":"/prestasi"},{"label":"Berita","href":"/berita"}],"footerLinks":[{"label":"Kebijakan Privasi","href":"/privasi"},{"label":"Sitemap","href":"/sitemap"}]}'
    ) ON CONFLICT (id) DO NOTHING
  `;
  console.log("✓ website_settings seeded");

  // === PAGE SECTIONS ===
  const sections = [
    { id: "sec-hero", key: "hero", title: "Hero / Banner Utama", subtitle: "Tampilan pertama pengunjung website", is_enabled: true, order_index: 1 },
    { id: "sec-trust", key: "trust", title: "Statistik Kepercayaan", subtitle: "Angka-angka capaian sekolah", is_enabled: true, order_index: 2 },
    { id: "sec-about", key: "about", title: "Tentang Sekolah", subtitle: "Sekilas profil dan visi misi", is_enabled: true, order_index: 3 },
    { id: "sec-programs", key: "programs", title: "Program Unggulan", subtitle: "Daftar program pendidikan", is_enabled: true, order_index: 4 },
    { id: "sec-why", key: "why", title: "Mengapa Yazzaka", subtitle: "Keunggulan kompetitif sekolah", is_enabled: true, order_index: 5 },
    { id: "sec-news", key: "news", title: "Berita & Agenda", subtitle: "Info terbaru dari sekolah", is_enabled: true, order_index: 8 },
    { id: "sec-testimonials", key: "testimonials", title: "Testimoni", subtitle: "Kata wali murid & alumni", is_enabled: true, order_index: 9 },
    { id: "sec-cta", key: "cta", title: "Ajakan Pendaftaran", subtitle: "Call to action pendaftaran PPDB", is_enabled: true, order_index: 10 },
  ];

  for (const s of sections) {
    await sql`
      INSERT INTO page_sections (id, key, title, subtitle, is_enabled, order_index)
      VALUES (${s.id}, ${s.key}, ${s.title}, ${s.subtitle}, ${s.is_enabled}, ${s.order_index})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ page_sections seeded (10 records)");

  // === USERS ===
  const users = [
    { id: "user-1", name: "Super Admin Yazzaka", email: "superadmin@yazzaka.sch.id", role: "super_admin", avatar_url: "", created_at: "2026-01-01" },
    { id: "user-2", name: "Admin Konten", email: "admin@yazzaka.sch.id", role: "admin", avatar_url: undefined, created_at: "2026-03-15" },
  ];

  for (const u of users) {
    await sql`
      INSERT INTO users (id, name, email, role, avatar_url, created_at)
      VALUES (${u.id}, ${u.name}, ${u.email}, ${u.role}, ${u.avatar_url ?? null}, ${u.created_at})
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log("✓ users seeded (2 records)");

  console.log("\n🎉 Semua data berhasil di-seed ke Neon PostgreSQL!\n");
}

async function main() {
  try {
    await migrate();
    await seed();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
