import {
  SchoolProfile,
  HeroContent,
  Program,
  Achievement,
  Article,
  SchoolEvent,
  MediaItem,
  OrganizationMember,
  Testimonial,
  ContactMessage,
  WebsiteSettings,
  User,
  PageSectionConfig,
} from "../types";

// Konten default HeroSection (src/components/public/HeroSection.tsx).
// Dipakai sebagai fallback saat school_profile.hero belum diisi dari CMS,
// dan sebagai nilai awal form di /admin/content/hero. imageUrl dibiarkan
// kosong — foto asli diunggah via CMS, bukan foto stok.
export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Pendidikan Islam Holistik & Berwawasan Global",
  headline: "Belajar Lebih Tenang, Tumbuh Berkarakter Qur'ani.",
  body: "Membina Iman & Akhlak Umat, Mencetak Generasi Berilmu & Berdaya Saing Tinggi. Di Yayasan Bina Iman Akhlak Yazzakka, proses pendidikan memadukan kedalaman tradisi keilmuan Islam, tahfiz Al-Qur'an 30 juz bersanad, penguasaan bahasa Arab & Inggris aktif, serta kurikulum sains modern berbasis riset.",
  imageUrl: "",
  badges: ["Terdaftar Resmi Kemenkumham RI", "Tahfiz 30 Juz Bersanad", "Bahasa Arab & Inggris 24 Jam"],
  gallery: [],
};

export const initialSchoolProfile: SchoolProfile = {
  id: "profile-yazzaka",
  name: "Yayasan Bina Iman Akhlak Yazzakka",
  tagline: "Membina Iman & Akhlak Umat, Mencetak Generasi Berilmu & Berdaya Saing Tinggi.",
  description:
    "Yayasan Bina Iman Akhlak Yazzakka (Yazzakka Aceh) adalah lembaga sosial-keagamaan dan pendidikan Islam berbadan hukum resmi (SK Kemenkumham RI No. AHU-0005614.AH.01.04. Tahun 2022) yang berpusat di Kota Sigli, Kabupaten Pidie, Aceh. Dipimpin oleh Dr. Amri Fatmi, Lc., M.A., yayasan ini menaungi unit pendidikan TPA, TKIT, Sekolah Anak Shalih, PKBM, Darul Quran, serta menginisiasi pembangunan Pesantren Peradaban 6.0.",
  npsn: "AHU-0005614.AH.01.04.2022",
  accreditation: "Terdaftar Resmi Kemenkumham RI",
  establishedYear: 2022,
  studentCount: 480,
  teacherCount: 42,
  alumniCount: 920,
  hafizCount: 135,
  address: "Jalan Selanga, Desa Blang Asan, Kota Sigli",
  city: "Kabupaten Pidie",
  province: "Aceh 24112",
  phone: "+62 853-6299-9090",
  email: "yayasanyazzakka@gmail.com",
  whatsapp: "6285362999090",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sBlang+Asan,+Kota+Sigli,+Pidie,+Aceh,+Indonesia!6i14!3m1!1sid!5m1!1sid",
  principal: {
    name: "Dr. Amri Fatmi, Lc., M.A.",
    title: "Pembina & Pendiri Yayasan Bina Iman Akhlak Yazzakka",
    photoUrl: "/uploads/foto-pimpinan-amri-fatmi.jpg",
    welcomeMessage:
      "Assalamu'alaikum Warahmatullahi Wabarakatuh. Segala puji bagi Allah SWT. Selamat datang di portal resmi Yayasan Bina Iman Akhlak Yazzakka (Yazzakka Aceh). Kami hadir di bumi Serambi Mekkah dengan tekad teguh membina iman dan akhlak umat, serta melahirkan generasi yang kokoh akidahnya, mulia akhlaknya, cerdas keilmuannya, dan siap berkontribusi bagi peradaban masyarakat.",
  },
  vision:
    "Menjadi yayasan unggulan dalam membina iman dan akhlak umat, serta mencetak generasi yang berilmu, berakhlak mulia, dan berdaya saing tinggi di tengah masyarakat.",
  mission: [
    "Menjadi mitra strategis dalam membangun masyarakat madani yang berlandaskan nilai-nilai Islam.",
    "Menyelenggarakan pendidikan Islam yang berkualitas dan inklusif.",
    "Membina akhlak sosial masyarakat melalui program dakwah dan pembinaan karakter.",
    "Membangun ketahanan keluarga melalui pendidikan keislaman dan pemberdayaan ekonomi.",
  ],
  hero: DEFAULT_HERO,
  values: [
    {
      title: "Iman & Akidah (Shahihah)",
      description: "Menanamkan tauhid yang murni dan keyakinan yang kokoh sebagai pondasi seluruh aktivitas pembinaan.",
    },
    {
      title: "Akhlakul Karimah (Adab)",
      description: "Mengedepankan keteladanan budi pekerti luhur, kesantunan sosial, dan integritas moral.",
    },
    {
      title: "Ilmu & Wawasan Peradaban",
      description: "Mengintegrasikan kedalaman pemahaman dirasah Islamiyah dengan kompetensi sains dan keilmuan masa depan.",
    },
    {
      title: "Ketahanan Keluarga",
      description: "Mendampingi orang tua dan keluarga dalam mendidik anak berbasis fitrah dan keharmonisan rumah tangga.",
    },
    {
      title: "Khidmah Sosial & Madani",
      description: "Memberikan kontribusi nyata, kepedulian sosial, serta pemberdayaan ekonomi dan keumatan.",
    },
  ],
  branding: {
    primaryColor: "#0F2B48",
    accentColor: "#FA6400",
    secondaryColor: "#F4F6F8",
    logoUrl: "/yazzakka.png",
    faviconUrl: "/yazzakka.png",
  },
};

// Semua fallback koleksi di bawah sengaja dikosongkan (2026-10-23) — tidak ada
// lagi foto stok/template sebagai data demo. Data nyata selalu dari database
// via /api/school-data; saat API gagal halaman menampilkan state kosong yang
// jujur, bukan konten fiktif.

export const initialPrograms: Program[] = [];

export const initialAchievements: Achievement[] = [];

export const initialArticles: Article[] = [];

export const initialEvents: SchoolEvent[] = [];

export const initialMedia: MediaItem[] = [];

export const initialOrganization: OrganizationMember[] = [];

// Fallback testimoni kosong — testimoni fiktif dihapus 2026-10-23.
// Testimoni nyata diisi via CMS /admin/testimoni.
export const initialTestimonials: Testimonial[] = [];

export const initialContactMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Bambang Sudirman",
    email: "bambang.sudirman@gmail.com",
    phone: "081298765432",
    subject: "Konsultasi Jalur Beasiswa Tahfiz 10 Juz",
    message:
      "Assalamu'alaikum. Putra saya saat ini kelas 9 MTs dan sudah menyelesaikan hafalan 10 Juz. Apakah bisa mengajukan tes seleksi lebih awal untuk gelombang 1?",
    submittedAt: "2026-08-22 10:15",
    status: "new",
  },
  {
    id: "msg-2",
    name: "Ibu Nur Laila",
    email: "nurlaila88@yahoo.co.id",
    phone: "085712345678",
    subject: "Jadwal Visitasi & Kunjungan Sekolah",
    message:
      "Selamat pagi admin. Kami sekeluarga dari Sigli berencana berkunjung ke unit sekolah Yazzakka akhir pekan ini untuk melihat sarana kelas. Apakah perlu reservasi jadwal terlebih dahulu?",
    submittedAt: "2026-08-20 14:30",
    status: "read",
  },
];

export const initialWebsiteSettings: WebsiteSettings = {
  siteTitle: "Yayasan Yazzakka Aceh - Lembaga Pendidikan Islam Unggul & Berkarakter",
  metaDescription:
    "Portal resmi Yayasan Yazzakka Aceh. Memadukan kurikulum pendidikan formal, kesetaraan vokasi, tahfiz Al-Qur'an 30 juz, serta pembinaan karakter generasi qurani.",
  // Aset asli yang benar-benar ada di public/ — bukan foto stok.
  ogImage: "/yazzakka.png",
  socialMedia: {
    instagram: "https://instagram.com/yazzakka.official",
    youtube: "https://youtube.com/@yazzakkaofficial",
    facebook: "https://facebook.com/yazzakka.official",
    tiktok: "https://tiktok.com/@yazzakka.official",
    linkedin: "https://linkedin.com/company/yazzakka-aceh",
  },
  navigation: {
    headerLinks: [
      { label: "Beranda", href: "/" },
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Program", href: "/program" },
      { label: "Berita", href: "/berita" },
      { label: "Agenda", href: "/agenda" },
      { label: "Galeri", href: "/galeri" },
      { label: "Kontak", href: "/kontak" },
    ],
    footerLinks: [
      { label: "Profil Sekolah", href: "/tentang-kami" },
      { label: "Program Unggulan", href: "/program" },
      { label: "Berita & Pengumuman", href: "/berita" },
      { label: "Hubungi Kami", href: "/kontak" },
    ],
  },
};

export const initialUsers: User[] = [
  {
    id: "usr-1",
    name: "Ust. Fathurrahman, S.Kom.",
    email: "admin@yazzakka.sch.id",
    role: "super_admin",
    avatarUrl: "",
    createdAt: "2026-01-10",
  },
  {
    id: "usr-2",
    name: "Usth. Maryam Salsabila, S.Pd.",
    email: "editor@yazzakka.sch.id",
    role: "editor",
    avatarUrl: "",
    createdAt: "2026-02-15",
  },
];

export const initialSections: PageSectionConfig[] = [
  { id: "sec-1", key: "hero", title: "Hero Banner", subtitle: "Visual utama dan pesan pimpinan", isEnabled: true, orderIndex: 1 },
  { id: "sec-10", key: "news_carousel", title: "Berita Unggulan", subtitle: "Karousel warta pilihan pesantren", isEnabled: true, orderIndex: 2 },
  { id: "sec-2", key: "stats", title: "Statistik Kredibilitas", subtitle: "Angka kunci akreditasi & capaian", isEnabled: true, orderIndex: 2 },
  { id: "sec-3", key: "about", title: "Sambutan & Profil", subtitle: "Editorial pengenalan sekolah", isEnabled: true, orderIndex: 3 },
  { id: "sec-4", key: "programs", title: "Program Unggulan", subtitle: "Daftar kurikulum akademik & tahfiz", isEnabled: true, orderIndex: 4 },
  { id: "sec-5", key: "whyus", title: "Keunggulan Yazzakka", subtitle: "Mengapa memilih pendidikan di sini", isEnabled: true, orderIndex: 5 },
  { id: "sec-6", key: "berita", title: "Warta & Berita", subtitle: "Artikel dan kabar terkini sekolah", isEnabled: true, orderIndex: 6 },
  { id: "sec-7", key: "achievements", title: "Prestasi Siswa", subtitle: "Catatan kejuaraan tingkat nasional", isEnabled: false, orderIndex: 7 },
  { id: "sec-8", key: "testimonials", title: "Testimoni", subtitle: "Kesan wali murid dan kiprah alumni", isEnabled: true, orderIndex: 8 },
  { id: "sec-team", key: "organization", title: "Pimpinan & Dewan Asatidz", subtitle: "Pendidik berdedikasi tinggi yang memadukan kedalaman tradisi keilmuan Islam dan kompetensi sains modern.", isEnabled: true, orderIndex: 10 },
];
