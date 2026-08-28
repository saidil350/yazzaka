import {
  SchoolProfile,
  Program,
  Facility,
  Achievement,
  Article,
  SchoolEvent,
  MediaItem,
  OrganizationMember,
  Testimonial,
  AdmissionInfo,
  ContactMessage,
  WebsiteSettings,
  User,
  PageSectionConfig,
} from "../types";

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
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.989201509376!2d109.789234!3d-7.010234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMzYuOCJTIDEwOcKwNDcnMjEuMiJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid",
  principal: {
    name: "Dr. Amri Fatmi, Lc., M.A.",
    title: "Pembina & Pendiri Yayasan Bina Iman Akhlak Yazzakka",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
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

export const initialPrograms: Program[] = [
  {
    id: "prog-1",
    slug: "tpa-yazzakka",
    title: "TPA Yazzakka (Taman Pendidikan Al-Qur'an)",
    category: "Pendidikan Al-Qur'an",
    shortDesc:
      "Pembinaan dasar baca-tulis Al-Qur'an dengan metode tartil tajwid, hafalan surat pendek, doa harian, dan adab islami anak.",
    fullDesc:
      "TPA Yazzakka membimbing anak-anak sejak usia dini untuk mencintai Al-Qur'an melalui metode pembelajaran interaktif, talaqqi makharijul huruf, tajwid praktis, setoran hafalan juz 'amma, serta penanaman adab dan akhlak keseharian.",
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
    iconName: "BookOpen",
    features: [
      "Bimbingan talaqqi fashahah & tajwid praktis",
      "Target tuntas Juz 'Amma dan doa harian",
      "Pembiasaan adab shalat dan akhlak mulia",
      "Evaluasi munaqasyah dan wisuda santri",
    ],
    targetCompetencies: [
      "Fasih membaca Al-Qur'an sesuai kaidah tajwid",
      "Hafal Juz 30 dan surat-surat pilihan",
      "Terbiasa menjalankan shalat dan adab harian",
    ],
    status: "published",
    orderIndex: 1,
  },
  {
    id: "prog-2",
    slug: "tkit-yazzakka",
    title: "TKIT Yazzakka (TK Islam Terpadu)",
    category: "Anak Usia Dini",
    shortDesc:
      "Pendidikan anak usia dini berbasis fitrah, penguatan akidah, pembiasaan akhlak mulia, dan stimulasi motorik-kognitif ceria.",
    fullDesc:
      "TKIT Yazzakka memadukan kurikulum PAUD terpadu nasional dengan kurikulum kekhasan Islam. Menghadirkan lingkungan belajar yang aman, ramah anak, dan penuh kasih sayang untuk menumbuhkan kecintaan pada Allah dan Rasul-Nya sejak dini.",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
    iconName: "Sparkles",
    features: [
      "Sentra bermain peran, seni, dan kreativitas",
      "Tahfiz Al-Qur'an surat-surat pendek dan hadits pilihan",
      "Smart classroom ramah anak ber-AC",
      "Laporan perkembangan karakter dan psikomotorik",
    ],
    targetCompetencies: [
      "Kemampuan sosialisasi dan kemandirian anak",
      "Mengenal huruf hijaiyah dan dasar baca-tulis",
      "Memiliki adab sopan santun kepada orang tua dan guru",
    ],
    status: "published",
    orderIndex: 2,
  },
  {
    id: "prog-3",
    slug: "sekolah-anak-shalih",
    title: "Sekolah Anak Shalih Yazzakka",
    category: "Pembinaan Karakter",
    shortDesc:
      "Program penguatan karakter, akhlak sosial, dan kepemimpinan islami anak melalui kelas tematik dan pembiasaan ibadah.",
    fullDesc:
      "Sekolah Anak Shalih didesain untuk memperkuat nilai-nilai adab dan akhlak sosial di era digital. Membekali anak-anak dengan wawasan keislaman komprehensif, kepemimpinan diri, empati sosial, dan ketahanan mental islami.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    iconName: "HeartHandshake",
    features: [
      "Kelas tematik parenting dan karakter santri",
      "Halaqah adab dan keteladanan Rasulullah SAW",
      "Aktivitas sosial dan bakti kebaikan",
      "Mentoring kepribadian dan public speaking",
    ],
    targetCompetencies: [
      "Kepribadian santun, percaya diri, dan peduli sesama",
      "Kecakapan berkomunikasi dan memimpin kelompok",
      "Integritas moral dan kedisiplinan ibadah",
    ],
    status: "published",
    orderIndex: 3,
  },
  {
    id: "prog-4",
    slug: "pkbm-yazzakka",
    title: "PKBM Yazzakka (Pendidikan Kesetaraan & Vokasi)",
    category: "Pemberdayaan Umat",
    shortDesc:
      "Pusat Kegiatan Belajar Masyarakat untuk pendidikan kesetaraan (Paket A/B/C), literasi Al-Qur'an dewasa, dan vokasi keahlian.",
    fullDesc:
      "PKBM Yazzakka menyediakan akses pendidikan non-formal yang berkualitas dan inklusif bagi masyarakat. Menyelenggarakan program keaksaraan, kesetaraan pendidikan formal, kursus vokasi kemandirian, serta pemberdayaan ekonomi keluarga berbasis syariah.",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1000&q=80",
    iconName: "GraduationCap",
    features: [
      "Pendidikan Kesetaraan Paket A, B, dan C resmi",
      "Kelas tahsin dan literasi Al-Qur'an untuk dewasa/lansia",
      "Pelatihan keterampilan vokasi & wirausaha syariah",
      "Jadwal belajar fleksibel berbasis tatap muka & daring",
    ],
    targetCompetencies: [
      "Mendapatkan ijazah kelulusan kesetaraan resmi",
      "Menguasai keterampilan kerja mandiri & bisnis keluarga",
      "Melek baca Al-Qur'an dan pemahaman dasar ibadah",
    ],
    status: "published",
    orderIndex: 4,
  },
  {
    id: "prog-5",
    slug: "darul-quran-yazzakka",
    title: "Darul Quran Yazzakka (Tahfiz Intensif)",
    category: "Tahfiz & Keilmuan",
    shortDesc:
      "Program karantina dan pembinaan tahfiz 30 juz intensif dengan bimbingan asatidz bersanad dan kajian dirasah Islamiyah.",
    fullDesc:
      "Darul Quran Yazzakka memfokuskan pembinaan santri dalam menghafal Al-Qur'an 30 juz mutqin disertai pendalaman kaidah bahasa Arab, fiqih ibadah, dan kajian kitab tauhid di bawah bimbingan langsung para masyaikh dan asatidz.",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
    iconName: "Award",
    features: [
      "Target mutqin 30 juz dengan bimbingan bersanad",
      "Karantina tahfiz dan setoran harian intensif",
      "Kajian akidah dan dirasah Islamiyah terstruktur",
      "Tasmi' hafalan terbuka sekali duduk",
    ],
    targetCompetencies: [
      "Hafal 30 juz dengan kaidah tajwid dan makhraj mutqin",
      "Memahami dasar-dasar akidah ahlussunnah wal jama'ah",
      "Kesiapan menjadi imam, da'i, dan penerima sanad",
    ],
    status: "published",
    orderIndex: 5,
  },
  {
    id: "prog-6",
    slug: "pesantren-peradaban-60",
    title: "Wakaf Pesantren Peradaban 6.0 Pidie",
    category: "Program Strategis",
    shortDesc:
      "Ikhtiar pembangunan kawasan pesantren peradaban modern berbasis wakaf umat di Cot Rheng, Pidie untuk melahirkan pemimpin umat masa depan.",
    fullDesc:
      "Program strategis Yayasan Yazzakka untuk mendirikan Pesantren Peradaban 6.0 di Kabupaten Pidie, Aceh. Mengintegrasikan kemuliaan tradisi keilmuan Islam Serambi Mekkah dengan keunggulan sains masa depan, kepemimpinan global, dan kemandirian peradaban.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    iconName: "Globe",
    features: [
      "Pembebasan lahan wakaf dan pembangunan masterplan terpadu",
      "Fasilitas asrama, masjid peradaban, dan laboratorium riset",
      "Pendidikan kader ulama intelektual berwawasan dunia",
      "Peluang amal jariyah wakaf produktif untuk kaum muslimin",
    ],
    targetCompetencies: [
      "Membangun peradaban Islam masa depan berlandaskan Al-Qur'an & Sunnah",
      "Mencetak generasi pemimpin yang tangguh dan berwawasan global",
      "Pusat rujukan studi peradaban Islam di Aceh dan Asia Tenggara",
    ],
    status: "published",
    orderIndex: 6,
  },
];

export const initialFacilities: Facility[] = [
  {
    id: "fac-1",
    name: "Masjid & Pusat Dakwah Yazzakka Sigli",
    category: "Sarana Ibadah",
    description: "Pusat spiritual, shalat berjamaah, kajian rutin tafsir & akidah Dr. Amri Fatmi, serta halaqah Al-Qur'an.",
    capacity: "800 Jamaah",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 1,
  },
  {
    id: "fac-2",
    name: "Kawasan Wakaf Pesantren Peradaban 6.0 Cot Rheng",
    category: "Pusat Peradaban",
    description: "Lahan wakaf seluas kawasan terpadu di Cot Rheng, Pidie, yang disiapkan untuk ekosistem pesantren peradaban modern.",
    capacity: "Kawasan Terpadu",
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 2,
  },
  {
    id: "fac-3",
    name: "Gedung Pembelajaran Smart TKIT & TPA Yazzakka",
    category: "Ruang Belajar",
    description: "Ruang kelas ceria ramah anak ber-AC dilengkapi media interaktif, sudut baca Al-Qur'an, dan alat peraga edukasi.",
    capacity: "25 Santri / Kelas",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 3,
  },
  {
    id: "fac-4",
    name: "Aula Serbaguna & Gedung Pertemuan Umat",
    category: "Gedung Pertemuan",
    description: "Gedung aula representatif untuk seminar parenting, tabligh akbar, pelatihan vokasi PKBM, dan kegiatan sosial.",
    capacity: "350 Kursi",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 4,
  },
  {
    id: "fac-5",
    name: "Perpustakaan & Pojok Literasi Islam",
    category: "Ruang Belajar",
    description: "Koleksi kitab rujukan keilmuan Islam, tafsir, hadits, literatur keluarga sakinah, dan ensiklopedia sains.",
    capacity: "60 Pemustaka",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 5,
  },
  {
    id: "fac-6",
    name: "Area Ketangkasan & Taman Bermain Santri",
    category: "Area Outdoor",
    description: "Sarana bermain motorik santri cilik, lapangan olahraga mini, dan area hijau edukasi alam.",
    capacity: "150 Anak",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 6,
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Medali Emas Olimpiade Sains Nasional (OSN) Bidang Biologi",
    category: "Akademik & Sains",
    studentName: "Muhammad Farhan Al-Ghifari",
    competitionName: "Olimpiade Sains Nasional (OSN) Kemendikbudristek",
    level: "Nasional",
    year: 2025,
    date: "2025-10-18",
    imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1000&q=80",
    description: "Meraih nilai tertinggi praktikum sel molekuler di antara 150 finalis dari 38 provinsi se-Indonesia.",
  },
  {
    id: "ach-2",
    title: "Juara 1 Musabaqah Hifdzil Qur'an (MHQ) 30 Juz Tingkat Internasional",
    category: "Tahfiz & Agama",
    studentName: "Aisyah Zahira Putri",
    competitionName: "International Quranic Memorization Award",
    level: "Internasional",
    year: 2025,
    date: "2025-08-14",
    imageUrl: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=1000&q=80",
    description: "Menampilkan bacaan fashahah mutqin dan tajwid sempurna di ajang tahfiz bergengsi.",
  },
  {
    id: "ach-3",
    title: "Juara 1 Debat Bahasa Arab Nasional Tingkat SMA/MA",
    category: "Bahasa & Debat",
    studentName: "Tim Debat Bahasa Arab Yazzaka",
    competitionName: "Festival Bahasa Timur Tengah Universitas Indonesia",
    level: "Nasional",
    year: 2025,
    date: "2025-05-20",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
    description: "Menang mutlak pada babak final melawan tim unggulan dari berbagai pesantren terkemuka.",
  },
  {
    id: "ach-4",
    title: "Juara Umum Robotika & Inovasi Teknologi IoT Remaja",
    category: "Inovasi",
    studentName: "Rizky Ramadhan & Hilman Hakim",
    competitionName: "National Youth Innovation Challenge (NYIC)",
    level: "Nasional",
    year: 2024,
    date: "2024-11-10",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80",
    description: "Mengembangkan prototipe irigasi cerdas hemat air berbasis kecerdasan buatan untuk pesantren mandiri pangan.",
  },
];

export const initialArticles: Article[] = [
  {
    id: "art-1",
    slug: "penerimaan-santri-baru-tahun-ajaran-2026-2027",
    title: "Penerimaan Santri Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka",
    excerpt:
      "SMA & Pesantren Modern Yazzaka membuka pendaftaran calon peserta didik baru Gelombang 1 dengan kuota terbatas dan beasiswa prestasi.",
    content: `SMA & Pesantren Modern Yazzaka secara resmi membuka pendaftaran santri dan peserta didik baru (PPDB) untuk Tahun Ajaran 2026/2027. Pada periode tahun ini, Yazzaka menyediakan program reguler dan beasiswa santri berprestasi bagi lulusan SMP/MTs sederajat dari seluruh Indonesia.

Pendaftaran dilakukan secara terintegrasi melalui portal online dengan tahapan registrasi akun, pengunggahan berkas rapor, tes potensi akademik, tes lisan tahfiz, dan wawancara komitmen wali santri.

Pimpinan Yazzaka menegaskan komitmen sekolah untuk terus mempertahankan kualitas pengasuhan dengan rasio pendampingan santri yang ideal. Bagi calon pendaftar yang memiliki prestasi juara olimpiade sains minimal tingkat provinsi atau tahfiz minimal 5 juz, sekolah menyediakan jalur beasiswa bebas uang sarana prasarana.`,
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    category: "Pengumuman",
    tags: ["PPDB 2026", "Pendaftaran", "Beasiswa", "Santri Baru"],
    author: "Tim Humas & SPMB",
    authorRole: "Panitia Penerimaan Santri",
    publishedDate: "2026-08-01",
    readTime: "3 menit",
    status: "published",
    featured: true,
    seoTitle: "Penerimaan Santri Baru PPDB 2026/2027 - SMA Yazzaka",
    seoDescription: "Informasi resmi jadwal, persyaratan, alur pendaftaran santri baru SMA & Pesantren Yazzaka TA 2026/2027.",
  },
  {
    id: "art-2",
    slug: "tips-mendampingi-anak-siap-mandiri-di-pesantren-modern",
    title: "Membangun Kesiapan Mental dan Kemandirian Anak Memasuki Kehidupan Asrama",
    excerpt:
      "Panduan praktis bagi orang tua dalam membangun komunikasi positif dan melatih kemandirian anak sebelum memasuki lingkungan pesantren.",
    content: `Transisi dari lingkungan keluarga menuju kehidupan asrama seringkali menjadi fase penting bagi anak dan orang tua. Pondok pesantren modern menawarkan ruang tumbuhnya kedisiplinan dan kepemimpinan diri yang luar biasa, namun membutuhkan kesiapan mental yang matang.

1. **Komunikasi Terbuka tentang Tujuan Hidup**: Ajak anak berdialog tentang impian mereka dan bagaimana lingkungan pesantren dapat membantu mewujudkan cita-cita tersebut tanpa paksaan sepihak.
2. **Latihan Kemandirian Praktis**: Biasakan anak merapikan tempat tidur, mencuci pakaian pribadi sederhana, dan mengelola uang saku harian.
3. **Membangun Mindset Bertumbuh**: Tanamkan pemahaman bahwa rasa rindu (homesick) adalah proses alami adaptasi yang akan melahirkan ketangguhan jiwa.`,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    category: "Wawasan & Opini",
    tags: ["Parenting", "Edukasi Santri", "Kemandirian", "Keluarga"],
    author: "Ust. H. Nashirudin, M.Psi.",
    authorRole: "Konselor Pendidikan & Pengasuhan",
    publishedDate: "2026-07-20",
    readTime: "4 menit",
    status: "published",
    featured: false,
    seoTitle: "Kiat Mendampingi Anak Memasuki Pesantren Modern - Yazzaka Edu",
    seoDescription: "Wawasan parenting Islami tentang mempersiapkan kemandirian santri baru di lingkungan asrama.",
  },
  {
    id: "art-3",
    slug: "santri-yazzaka-raih-medali-emas-osn-biologi-2025",
    title: "Santri Yazzaka Harumkan Nama Daerah dengan Meraih Emas OSN Biologi 2025",
    excerpt:
      "Prestasi gemilang diraih ananda Muhammad Farhan setelah melalui babak penyisihan ketat dan ujian praktikum sains tingkat nasional.",
    content: `Kabar membanggakan datang dari panggung Olimpiade Sains Nasional (OSN) 2025. Santri kelas 11 SMA Yazzaka, Muhammad Farhan Al-Ghifari, berhasil membawa pulang Medali Emas pada cabang Biologi tingkat SMA/MA.

Keberhasilan ini merupakan buah dari pembinaan intensif Club Sains Yazzaka yang mengombinasikan telaah teori ilmiah mendalam dan praktikum laboratorium secara berkala di bawah bimbingan guru-guru master sains. Farhan menyatakan rasa syukur dan mendedikasikan medali ini untuk kedua orang tua, para guru, dan seluruh teman santri di asrama.`,
    coverImage: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80",
    category: "Prestasi",
    tags: ["Prestasi OSN", "Medali Emas", "Sains Yazzaka", "Olimpiade"],
    author: "Redaksi Yazzaka Post",
    authorRole: "Divisi Publikasi & Jurnalistik",
    publishedDate: "2025-10-22",
    readTime: "3 menit",
    status: "published",
    featured: false,
    seoTitle: "Santri Yazzaka Sabet Emas OSN Biologi Nasional 2025",
    seoDescription: "Liputan prestasi santri SMA Yazzaka meraih medali emas OSN Biologi tingkat nasional.",
  },
];

export const initialEvents: SchoolEvent[] = [
  {
    id: "evt-1",
    title: "Penerimaan Santri Baru (PPDB) Gelombang 1",
    description: "Pendaftaran online berkas dan ujian seleksi masuk online/offline untuk calon santri TA 2026/2027.",
    date: "2026-09-01",
    time: "08:00 - 15:00 WIB",
    location: "Kompleks Pendidikan Yazzakka & Online Portal",
    category: "Penerimaan Siswa",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    registrationUrl: "/pendaftaran",
    status: "upcoming",
  },
  {
    id: "evt-2",
    title: "Seminar Parenting Akbar: Mendidik Generasi Alpha Berjiwa Pemimpin",
    description: "Menghadirkan pakar psikologi anak dan praktisi pendidikan karakter Islam nasional untuk wali murid dan umum.",
    date: "2026-09-20",
    time: "09:00 - 12:30 WIB",
    location: "Aula Utama Yayasan Yazzakka",
    category: "Seminar & Parenting",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    registrationUrl: "/kontak",
    status: "upcoming",
  },
  {
    id: "evt-3",
    title: "Haflah Khotmil Qur'an & Wisuda Tahfiz 30 Juz Angkatan IX",
    description: "Uji publik hafalan Al-Qur'an 30 juz sekali duduk dan penganugerahan sanad tajwid bagi para wisudawan.",
    date: "2026-10-15",
    time: "07:30 - 13:00 WIB",
    location: "Masjid Baiturrahim Yazzakka",
    category: "Wisuda & Pameran",
    coverImage: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    registrationUrl: "",
    status: "upcoming",
  },
];

export const initialMedia: MediaItem[] = [
  {
    id: "med-1",
    fileName: "gedung-sekolah-yazzaka.jpg",
    fileUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    fileType: "image",
    fileSize: "1.8 MB",
    category: "Fasilitas",
    altText: "Gedung Utama dan Halaman Asri Sekolah Terpadu Yazzakka",
    uploadedAt: "2026-08-01",
  },
  {
    id: "med-2",
    fileName: "santri-tahfiz-quran.jpg",
    fileUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    fileType: "image",
    fileSize: "2.1 MB",
    category: "Kegiatan",
    altText: "Aktivitas Halaqah Tahfiz Al-Qur'an Pagi Santri Yazzakka",
    uploadedAt: "2026-08-05",
  },
  {
    id: "med-3",
    fileName: "praktikum-laboratorium-sains.jpg",
    fileUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    fileType: "image",
    fileSize: "2.4 MB",
    category: "Fasilitas",
    altText: "Praktikum Siswa di Laboratorium Pembelajaran Terpadu",
    uploadedAt: "2026-08-10",
  },
  {
    id: "med-4",
    fileName: "brosur-ppdb-yazzaka-2026.pdf",
    fileUrl: "/docs/brosur-ppdb-yazzaka-2026.pdf",
    fileType: "document",
    fileSize: "4.5 MB",
    category: "Dokumen PPDB",
    altText: "Brosur Resmi Panduan Pendaftaran Siswa Baru TA 2026/2027",
    uploadedAt: "2026-08-15",
  },
  {
    id: "med-5",
    fileName: "video-profil-sekolah-2026.mp4",
    fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    fileType: "video",
    fileSize: "45.0 MB",
    category: "Kegiatan",
    altText: "Video Profil Dokumentasi Sekolah dan Keseharian Santri",
    uploadedAt: "2026-08-18",
  },
];

export const initialOrganization: OrganizationMember[] = [
  {
    id: "org-1",
    name: "Dr. KH. Ahmad Zaki Mubarak, Lc., M.Phil.",
    roleTitle: "Pimpinan & Pengasuh Pesantren",
    department: "Darul Quran Yazzakka",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    bio: "Alumnus Universitas Al-Azhar Kairo dan Doktoral UIN Sunan Kalijaga dengan pengalaman 20+ tahun dalam manajemen pendidikan Islam terpadu.",
    qualifications: "S1 Syari'ah (Al-Azhar), S2 Islamic Studies (Leiden/UIN), S3 Pendidikan Islam",
    orderIndex: 1,
  },
  {
    id: "org-2",
    name: "Drs. H. M. Furqon Al-Hafiz, M.Pd.",
    roleTitle: "Kepala Sekolah Anak Shalih",
    department: "Sekolah Anak Shalih Yazzakka",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Pendidik teladan dengan dedikasi tinggi pada pengembangan kurikulum sains modern dan sistem evaluasi mutu sekolah bertaraf nasional.",
    qualifications: "S1 Pendidikan Fisika (UNNES), S2 Manajemen Pendidikan (UNY), Hafiz 30 Juz",
    orderIndex: 2,
  },
  {
    id: "org-3",
    name: "Ust. Muhammad Ridwan, Lc., M.A.",
    roleTitle: "Kepala TPA & Pembina Tahfiz",
    department: "Taman Pendidikan Al-Qur'an (TPA)",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Pakar pengajaran bahasa Arab komunikatif dan pembina metode pembelajaran Al-Qur'an tartil & tahfiz usia dini.",
    qualifications: "S1 Bahasa Arab (Univ. Islam Madinah), S2 Linguistik Terapan",
    orderIndex: 3,
  },
  {
    id: "org-4",
    name: "Dr. Siti Nurhaliza, M.Si.",
    roleTitle: "Koordinator Program Kesetaraan & Vokasi",
    department: "PKBM Yazzakka",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    bio: "Peneliti dan penggerak program pendidikan non-formal dan vokasi untuk mencetak santri mandiri dan berdaya saing.",
    qualifications: "S1 Biologi (UGM), S2 & S3 Bioteknologi (ITB)",
    orderIndex: 4,
  },
  {
    id: "org-5",
    name: "Usth. Fatimah Az-Zahra, S.Pd.I.",
    roleTitle: "Kepala TKIT Yazzakka",
    department: "TKIT Yazzakka",
    photoUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80",
    bio: "Praktisi pendidikan anak usia dini berbasis adab Islam dan stimulasi kecerdasan majemuk ramah anak.",
    qualifications: "S1 Pendidikan Islam Anak Usia Dini (UIN Ar-Raniry)",
    orderIndex: 5,
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    quote:
      "Menyekolahkan anak di Yazzaka adalah keputusan terbaik keluarga kami. Farhan tidak hanya menguasai sains hingga meraih emas OSN, tetapi yang paling membuat kami terharu adalah hafalan 30 Juz dan kelembutan adabnya saat pulang ke rumah.",
    name: "dr. H. Hendra Setiawan, Sp.A.",
    role: "Wali Murid",
    childName: "M. Farhan Al-Ghifari (Siswa Kelas 11)",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    isFeatured: true,
  },
  {
    id: "test-2",
    quote:
      "Tradisi bahasa aktif dan kedisiplinan organisasi di Yazzaka menjadi bekal sangat berharga ketika saya melanjutkan kuliah di Al-Azhar Kairo. Saya mampu beradaptasi sangat cepat dengan perkuliahan bahasa Arab tingkat tinggi.",
    name: "Ahmad Rayhan Al-Fatih, Lc.",
    role: "Alumni",
    graduationYear: 2022,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    isFeatured: true,
  },
  {
    id: "test-3",
    quote:
      "Sistem pendampingan santri di asrama sangat humanis dan profesional. Fasilitas modern dan guru-guru yang tulus membuat anak kami merasa aman, bahagia, dan termotivasi untuk terus berprestasi setiap hari.",
    name: "Hj. Ratna Kusumastuti, S.E.",
    role: "Wali Murid",
    childName: "Aisyah Zahira (Siswi Kelas 10)",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    isFeatured: true,
  },
];

export const initialAdmissionInfo: AdmissionInfo = {
  periodName: "Penerimaan Peserta Didik Baru (PPDB) 2026/2027",
  academicYear: "2026/2027",
  isOpen: true,
  startDate: "2026-09-01",
  endDate: "2026-11-30",
  hideFormWhenClosed: true,
  closedMessage: "Pendaftaran santri baru untuk periode ini sedang ditutup. Untuk informasi jadwal gelombang berikutnya atau konsultasi langsung, silakan hubungi sekretariat PPDB kami melalui WhatsApp.",
  registrationUrl: "/pendaftaran",
  consultationWhatsapp: "6281234567890",
  timeline: [
    {
      phase: "Gelombang 1 (Jalur Prestasi & Reguler)",
      dateRange: "1 September 2026 - 30 November 2026",
      description: "Pendaftaran online berkas portofolio prestasi dan rapor semester 1-4.",
      isCurrent: true,
    },
    {
      phase: "Ujian Seleksi & Wawancara",
      dateRange: "6 Desember 2026",
      description: "Tes potensi akademik online/offline, tes baca Quran/tahfiz, dan wawancara wali santri.",
      isCurrent: false,
    },
    {
      phase: "Pengumuman Hasil Seleksi",
      dateRange: "12 Desember 2026",
      description: "Pengumuman kelulusan resmi melalui dashboard portal pendaftar.",
      isCurrent: false,
    },
    {
      phase: "Daftar Ulang & Pengukuran Seragam",
      dateRange: "14 Desember - 24 Desember 2026",
      description: "Pemberkasan fisik, konfirmasi biaya masuk, dan registrasi santri.",
      isCurrent: false,
    },
  ],
  requirements: [
    "Lulusan SMP/MTs/sederajat atau siswa kelas 9 pada tahun ajaran berjalan.",
    "Mengisi formulir pendaftaran online secara lengkap dan benar.",
    "Mengunggah pasfoto resmi terbaru ukuran 3x4 (latar belakang biru/merah).",
    "Scan/Foto Rapor SMP/MTs Semester 1 sampai Semester 4.",
    "Scan Akta Kelahiran dan Kartu Keluarga (KK).",
    "Sertifikat piagam kejuaraan minimal tingkat kabupaten (khusus Jalur Prestasi).",
    "Surat keterangan sehat dan bebas narkoba dari fasilitas kesehatan resmi.",
  ],
  fees: [
    {
      name: "Biaya Formulir & Seleksi Masuk",
      amount: 350000,
      category: "Pendaftaran",
      notes: "Dibayarkan sekali saat verifikasi pendaftaran akun.",
    },
    {
      name: "Infaq Pengembangan Sarana & Prasarana",
      amount: 14500000,
      category: "Uang Pangkal / Sarpras",
      notes: "Hanya sekali selama masa studi 3 tahun (Dapat diangsur 3x).",
    },
    {
      name: "Paket Seragam Lengkap (5 Stel) & Kasur Asrama",
      amount: 2800000,
      category: "Seragam & Kit Santri",
      notes: "Termasuk jas almamater, seragam harian, seragam olahraga, seprai & lemari santri.",
    },
    {
      name: "Iuran Bulanan / SPP Terpadu",
      amount: 1650000,
      category: "SPP Bulanan",
      notes: "Sudah mencakup biaya asrama ber-AC, makan 3x sehari bergizi, pengasuhan & kesehatan.",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      category: "Pendaftaran",
      question: "Apakah santri yang belum hafal Al-Qur'an sama sekali bisa mendaftar?",
      answer:
        "Tentu bisa. Untuk jalur reguler, syarat minimal adalah lancar membaca Al-Qur'an sesuai kaidah tajwid dasar. Pembimbingan hafalan tahfiz akan dimulai secara bertahap dan terstruktur dari juz 30 dengan pendampingan intensif musyrif/ah.",
    },
    {
      id: "faq-2",
      category: "Kehidupan Asrama",
      question: "Bagaimana aturan penggunaan gadget dan komunikasi santri dengan orang tua?",
      answer:
        "Untuk menjaga fokus ibadah dan belajar, santri tidak diperkenankan memegang smartphone pribadi selama hari efektif. Komunikasi dengan orang tua disediakan melalui telepon resmi kepengasuhan pada jadwal berkala setiap akhir pekan. Fasilitas lab komputer berinternet tersedia terawasi untuk keperluan riset materi akademik.",
    },
    {
      id: "faq-3",
      category: "Biaya",
      question: "Apakah tersedia program beasiswa bagi calon santri berprestasi?",
      answer:
        "Ya, Yazzaka menyediakan Beasiswa Kader Prestasi berupa potongan hingga 100% biaya sarana prasarana untuk santri yang memiliki hafalan 10 juz mutqin atau juara 1-3 olimpiade sains tingkat provinsi/nasional.",
    },
    {
      id: "faq-4",
      category: "Akademik",
      question: "Apakah lulusan SMA Yazzaka dapat melanjutkan ke Perguruan Tinggi Umum (PTN)?",
      answer:
        "Sangat bisa. Kurikulum SMA Yazzaka terdaftar resmi di Kemendikbudristek (NPSN Terakreditasi A). Lulusan kami memiliki hak penuh mengikuti seleksi SNBP, SNBT, Kedinasan, serta seleksi beasiswa luar negeri seperti Al-Azhar Mesir, Turki, Jepang, dan negara-negara Eropa.",
    },
  ],
};

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
  keywords: "yayasan yazzakka aceh, sekolah islam terpadu, tkit, tpa, pkbm, pesantren peradaban, tahfiz quran 30 juz, ppdb 2026, pendidikan formal sigli",
  ogImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
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
      { label: "Fasilitas", href: "/fasilitas" },
      { label: "Berita", href: "/berita" },
      { label: "Agenda", href: "/agenda" },
      { label: "Galeri", href: "/galeri" },
      { label: "Pendaftaran", href: "/pendaftaran" },
      { label: "Kontak", href: "/kontak" },
    ],
    footerLinks: [
      { label: "Profil Sekolah", href: "/tentang-kami" },
      { label: "Program Unggulan", href: "/program" },
      { label: "Brosur & Biaya PPDB", href: "/pendaftaran" },
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
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-10",
  },
  {
    id: "usr-2",
    name: "Usth. Maryam Salsabila, S.Pd.",
    email: "editor@yazzakka.sch.id",
    role: "editor",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-02-15",
  },
];

export const initialSections: PageSectionConfig[] = [
  { id: "sec-1", key: "hero", title: "Hero Banner", subtitle: "Visual utama dan pesan pimpinan", isEnabled: true, orderIndex: 1 },
  { id: "sec-2", key: "stats", title: "Statistik Kredibilitas", subtitle: "Angka kunci akreditasi & capaian", isEnabled: true, orderIndex: 2 },
  { id: "sec-3", key: "about", title: "Sambutan & Profil", subtitle: "Editorial pengenalan sekolah", isEnabled: true, orderIndex: 3 },
  { id: "sec-4", key: "programs", title: "Program Unggulan", subtitle: "Daftar kurikulum akademik & tahfiz", isEnabled: true, orderIndex: 4 },
  { id: "sec-5", key: "whyus", title: "Keunggulan Yazzakka", subtitle: "Mengapa memilih pendidikan di sini", isEnabled: true, orderIndex: 5 },
  { id: "sec-6", key: "facilities", title: "Fasilitas Sekolah", subtitle: "Galeri sarana prasarana modern", isEnabled: false, orderIndex: 6 },
  { id: "sec-7", key: "achievements", title: "Prestasi Siswa", subtitle: "Catatan kejuaraan tingkat nasional", isEnabled: false, orderIndex: 7 },
  { id: "sec-8", key: "testimonials", title: "Testimoni", subtitle: "Kesan wali murid dan kiprah alumni", isEnabled: true, orderIndex: 8 },
  { id: "sec-9", key: "admission_cta", title: "Banner Konversi PPDB", subtitle: "Ajakan mendaftar siswa baru", isEnabled: true, orderIndex: 9 },
  { id: "sec-team", key: "organization", title: "Pimpinan & Dewan Asatidz", subtitle: "Pendidik berdedikasi tinggi yang memadukan kedalaman tradisi keilmuan Islam dan kompetensi sains modern.", isEnabled: true, orderIndex: 10 },
];
