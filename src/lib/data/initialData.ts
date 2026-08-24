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
  name: "SMA & Pesantren Modern Yazzaka",
  tagline: "Menumbuhkan Generasi Unggul, Berkarakter, dan Siap Memimpin Masa Depan.",
  description:
    "Institusi pendidikan terpadu yang memadukan keunggulan kurikulum nasional, sains modern, penguasaan bahasa internasional (Arab & Inggris), serta penanaman adab dan tahfiz Al-Qur'an 30 juz.",
  npsn: "69889210",
  accreditation: "A (Unggul)",
  establishedYear: 2012,
  studentCount: 1280,
  teacherCount: 94,
  alumniCount: 2450,
  hafizCount: 310,
  address: "Jl. Raya Bandar - Batang Km. 05, Desa Kauman, Kec. Bandar",
  city: "Kabupaten Batang",
  province: "Jawa Tengah 51254",
  phone: "(0285) 4489211",
  email: "info@yazzaka.sch.id",
  whatsapp: "6281234567890",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.989201509376!2d109.789234!3d-7.010234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMzYuOCJTIDEwOcKwNDcnMjEuMiJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid",
  principal: {
    name: "Dr. KH. Ahmad Zaki Mubarak, Lc., M.Phil.",
    title: "Pimpinan & Direktur Pendidikan Yazzaka",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    welcomeMessage:
      "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di portal resmi SMA & Pesantren Modern Yazzaka. Di era disrupsi informasi dan akselerasi teknologi, tantangan terbesar pendidikan bukanlah sekadar mentransfer pengetahuan kognitif, melainkan menumbuhkan jiwa yang beradab, berkarakter kokoh, dan berwawasan global.\n\nDi Yazzaka, kami mendampingi setiap anak didik untuk menemukan potensi fitrah terbaiknya. Melalui integrasi kurikulum sains modern, tradisi keilmuan Islam, dan penguasaan bahasa dunia, kami berikhtiar melahirkan generasi pemimpin masa depan yang berintegritas, mandiri, dan bermanfaat bagi peradaban umat.",
  },
  vision:
    "Menjadi pusat keunggulan pendidikan Islam modern terpadu terkemuka di Asia Tenggara yang melahirkan generasi berkarakter Qur'ani, berdaya saing sains global, dan berjiwa kepemimpinan peradaban.",
  mission: [
    "Menyelenggarakan pendidikan holistik berbasis nilai-nilai Islam dan sains teknologi mutakhir.",
    "Membina program tahfiz Al-Qur'an dan pendalaman dirasah Islamiyah yang mutqin dan kontekstual.",
    "Mengembangkan lingkungan bilingual interaktif bahasa Arab dan Inggris sebagai bahasa pengantar ilmu.",
    "Membangun ekosistem riset, sains terapan, dan kewirausahaan siswa berstandar global.",
    "Menanamkan karakter kepemimpinan, kemandirian santri, dan kepekaan sosial kemasyarakatan.",
  ],
  values: [
    {
      title: "Keikhlasan (Ikhlas)",
      description: "Mendasari setiap ikhtiar belajar, mengajar, dan beramal semata karena Allah SWT.",
    },
    {
      title: "Kemandirian (Berdikari)",
      description: "Menempa ketangguhan mental, kedisiplinan, dan daya juang hidup santri.",
    },
    {
      title: "Ukhuwah Islamiyah",
      description: "Menjalin persaudaraan yang kokoh di atas toleransi dan kasih sayang sesama.",
    },
    {
      title: "Kebebasan Berpikir (Intelektual)",
      description: "Berwawasan luas, terbuka terhadap kemajuan ilmu, serta kritis dan solutif.",
    },
    {
      title: "Kesederhanaan (Adab)",
      description: "Menjunjung tinggi kesahajaan, keteladanan akhlak, dan integritas moral.",
    },
  ],
  branding: {
    primaryColor: "#0F2B48",
    accentColor: "#D97706",
    secondaryColor: "#F4F6F8",
    logoUrl: "/logo-yazzaka.svg",
    faviconUrl: "/favicon.ico",
  },
};

export const initialPrograms: Program[] = [
  {
    id: "prog-1",
    slug: "tahfiz-al-quran-mutqin",
    title: "Program Tahfiz Al-Qur'an 30 Juz & Sanad",
    category: "Keagamaan / Tahfiz",
    shortDesc:
      "Bimbingan menghafal Al-Qur'an dengan metode talaqqi bersanad, mutqin tajwid, dan pemahaman tafsir praktis.",
    fullDesc:
      "Program Tahfiz Al-Qur'an dirancang untuk membina santri menghafal 30 Juz secara bertahap selama masa studi. Didukung oleh para asatidz bersanad, program ini memadukan takrir harian, karantina tahfiz, dan ujian hafalan terbuka (tasmi') di hadapan para penguji nasional.",
    imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80",
    iconName: "BookOpen",
    features: [
      "Target mutqin 30 Juz dengan ijazah sanad",
      "Karantina Tahfiz Intensif menjelang liburan",
      "Kajian Tafsir Jalalain dan Hadits Arba'in",
      "Tasmi' Al-Qur'an bil Ghaib sekali duduk",
    ],
    targetCompetencies: [
      "Hafal 30 Juz dengan makhraj & tajwid fasih",
      "Memahami kaidah bahasa Al-Qur'an",
      "Mampu menjadi imam rawatib & tarawih",
    ],
    status: "published",
    orderIndex: 1,
  },
  {
    id: "prog-2",
    slug: "kelas-unggulan-sains-riset",
    title: "Kelas Unggulan Sains, Robotika & Riset",
    category: "Sains & Riset",
    shortDesc:
      "Kurikulum penguatan STEM (Science, Technology, Engineering, Math) berbasis proyek riset terapan dan kecerdasan buatan.",
    fullDesc:
      "Kelas unggulan yang mempersiapkan siswa menguasai sains analitis, komputasi modern, robotika, dan riset ilmiah remaja. Siswa dibekali pendampingan intensif oleh pakar olimpiade sains untuk berkompetisi di tingkat nasional dan internasional.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
    iconName: "Cpu",
    features: [
      "Laboratorium sains canggih & IoT Workshop",
      "Klub Olimpiade Sains Nasional (OSN)",
      "Proyek Riset Ilmiah Remaja (KIR) tahunan",
      "Pelatihan dasar Coding & Artificial Intelligence",
    ],
    targetCompetencies: [
      "Lolos seleksi olimpiade sains daerah/nasional",
      "Mampu menulis karya tulis ilmiah terpublikasi",
      "Penguasaan pemecahan masalah algoritma",
    ],
    status: "published",
    orderIndex: 2,
  },
  {
    id: "prog-3",
    slug: "bahasa-internasional-bilingual",
    title: "Program Bahasa Internasional (Arab & Inggris)",
    category: "Bahasa Asing",
    shortDesc:
      "Ekosistem bahasa aktif 24 jam dengan sertifikasi TOEFL/IELTS dan TOAFL resmi untuk studi lanjut luar negeri.",
    fullDesc:
      "Menerapkan sistem *Language Immersion Area*. Seluruh santri dan civitas akademika berkomunikasi aktif menggunakan bahasa Arab dan Inggris dalam aktivitas harian, pidato mingguan (muhadharah 3 bahasa), serta debat bahasa internasional.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    iconName: "Globe",
    features: [
      "Muhadharah (Public Speaking) mingguan",
      "Native speaker workshop & Arabic Camp",
      "Persiapan tes TOEFL ITP & TOAFL",
      "Program pertukaran pelajar internasional",
    ],
    targetCompetencies: [
      "Skor TOEFL setara 550+ dan TOAFL setara Jayyid Jiddan",
      "Fasih berpidato dan berdebat dalam bahasa asing",
      "Kesiapan aplikasi beasiswa Al-Azhar, Timur Tengah & Barat",
    ],
    status: "published",
    orderIndex: 3,
  },
  {
    id: "prog-4",
    slug: "kurikulum-terpadu-nasional-cambridge",
    title: "Kurikulum Nasional & Pengayaan Cambridge",
    category: "Akademik",
    shortDesc:
      "Kurikulum Merdeka Belajar terakreditasi A dipadukan dengan standar pengayaan akademik internasional.",
    fullDesc:
      "Pembelajaran berpusat pada siswa dengan metodologi pembelajaran aktif, diferensiasi minat, dan persiapan matang menuju perguruan tinggi negeri favorit (SNBP, SNBT, SIMAK UI, UTUL UGM) maupun universitas luar negeri ternama.",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1000&q=80",
    iconName: "GraduationCap",
    features: [
      "Tryout UTBK-SNBT berkala sejak kelas 11",
      "Bimbingan studi lanjut ke PTN & PT Luar Negeri",
      "Kelas persiapan kedinasan & kedokteran",
      "Smart classroom dengan media interaktif",
    ],
    targetCompetencies: [
      "Tembus 10 Perguruan Tinggi Negeri Terbaik",
      "Indeks Prestasi Akademik unggul",
      "Kemampuan literasi & numerasi tingkat tinggi",
    ],
    status: "published",
    orderIndex: 4,
  },
  {
    id: "prog-5",
    slug: "leadership-entrepreneurship",
    title: "Leadership, Kepanduan & Entrepreneurship",
    category: "Kepemimpinan & Karakter",
    shortDesc:
      "Pembinaan organisasi santri mandiri, kepramukaan bertaraf nasional, dan inkubasi wirausaha santri.",
    fullDesc:
      "Santri dididik mengelola organisasi kesiswaan (OSIS/OPPM), kepanitiaan event besar, survival skill kepanduan, serta dasar-dasar kewirausahaan kreatif untuk membentuk mental pemimpin yang tangguh dan solutif.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
    iconName: "Award",
    features: [
      "Organisasi Pelajar Mandiri & Dewan Ambalan",
      "Perkemahan Akbar dan Ekspedisi Alam",
      "Business Plan Santri & Bazar Kewirausahaan",
      "Pelatihan Manajemen Organisasi & Retorika",
    ],
    targetCompetencies: [
      "Kecakapan manajerial & kepemimpinan tim",
      "Jiwa pantang menyerah dan solutif",
      "Keterampilan komunikasi publik meyakinkan",
    ],
    status: "published",
    orderIndex: 5,
  },
];

export const initialFacilities: Facility[] = [
  {
    id: "fac-1",
    name: "Masjid Raya Baiturrahman Yazzaka",
    category: "Sarana Ibadah & Olahraga",
    description: "Pusat spiritual dan peribadatan berkapasitas 2.000 jamaah dengan arsitektur elegan, sejuk, dan terawat.",
    capacity: "2.000 Jamaah",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 1,
  },
  {
    id: "fac-2",
    name: "Laboratorium Sains Terpadu & IoT",
    category: "Laboratorium & Riset",
    description: "Fasilitas praktikum Fisika, Kimia, Biologi, dan mikrokontroler robotika berstandar keselamatan tinggi.",
    capacity: "40 Siswa / Lab",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 2,
  },
  {
    id: "fac-3",
    name: "Perpustakaan Digital & Corner Riset",
    category: "Ruang Belajar",
    description: "Koleksi lebih dari 15.000 judul kitab kuning, literatur sains modern, dan akses jurnal internasional.",
    capacity: "120 Tempat Duduk",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 3,
  },
  {
    id: "fac-4",
    name: "Smart Classroom Ber-AC & Multimedia",
    category: "Ruang Belajar",
    description: "Ruang kelas ergonomis dilengkapi interactive smart board, proyektor laser, dan tata suara jernih.",
    capacity: "28 Siswa / Kelas",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 4,
  },
  {
    id: "fac-5",
    name: "Asrama Santri Modern & Sehat",
    category: "Asrama & Hunian",
    description: "Hunian santri berlantai keramik, ranjang bertingkat kokoh, sirkulasi udara alami, dan pendampingan wali kamar.",
    capacity: "40 Asrama",
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    status: "published",
    orderIndex: 5,
  },
  {
    id: "fac-6",
    name: "Gelanggang Olahraga & Lapangan Futsal",
    category: "Sarana Ibadah & Olahraga",
    description: "Kompleks sarana olahraga multifungsi untuk futsal, basket, voli, bulu tangkis, dan panahan standar nasional.",
    capacity: "500 Penonton",
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
    location: "Kampus Yazzaka & Online Portal",
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
    location: "Auditorium Utama Kampus Yazzaka",
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
    location: "Masjid Raya Baiturrahman Yazzaka",
    category: "Wisuda & Pameran",
    coverImage: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    registrationUrl: "",
    status: "upcoming",
  },
];

export const initialMedia: MediaItem[] = [
  {
    id: "med-1",
    fileName: "kampus-utama-yazzaka.jpg",
    fileUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    fileType: "image",
    fileSize: "1.8 MB",
    category: "Fasilitas",
    altText: "Gedung Utama dan Halaman Asri Kampus Terpadu Yazzaka",
    uploadedAt: "2026-08-01",
  },
  {
    id: "med-2",
    fileName: "santri-tahfiz-quran.jpg",
    fileUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    fileType: "image",
    fileSize: "2.1 MB",
    category: "Kegiatan",
    altText: "Aktivitas Halaqah Tahfiz Al-Qur'an Pagi Santri Yazzaka",
    uploadedAt: "2026-08-05",
  },
  {
    id: "med-3",
    fileName: "praktikum-laboratorium-sains.jpg",
    fileUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    fileType: "image",
    fileSize: "2.4 MB",
    category: "Fasilitas",
    altText: "Praktikum Siswa di Laboratorium Sains Terpadu",
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
    fileName: "video-profil-kampus-2026.mp4",
    fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    fileType: "video",
    fileSize: "45.0 MB",
    category: "Kegiatan",
    altText: "Video Profil Dokumentasi Kampus dan Keseharian Santri",
    uploadedAt: "2026-08-18",
  },
];

export const initialOrganization: OrganizationMember[] = [
  {
    id: "org-1",
    name: "Dr. KH. Ahmad Zaki Mubarak, Lc., M.Phil.",
    roleTitle: "Pimpinan & Pengasuh Pesantren",
    department: "Pimpinan Yayasan & Sekolah",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    bio: "Alumnus Universitas Al-Azhar Kairo dan Doktoral UIN Sunan Kalijaga dengan pengalaman 20+ tahun dalam manajemen pendidikan Islam terpadu.",
    qualifications: "S1 Syari'ah (Al-Azhar), S2 Islamic Studies (Leiden/UIN), S3 Pendidikan Islam",
    orderIndex: 1,
  },
  {
    id: "org-2",
    name: "Drs. H. M. Furqon Al-Hafiz, M.Pd.",
    roleTitle: "Kepala SMA Unggulan Yazzaka",
    department: "Pimpinan Yayasan & Sekolah",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Pendidik teladan dengan dedikasi tinggi pada pengembangan kurikulum sains modern dan sistem evaluasi mutu sekolah bertaraf nasional.",
    qualifications: "S1 Pendidikan Fisika (UNNES), S2 Manajemen Pendidikan (UNY), Hafiz 30 Juz",
    orderIndex: 2,
  },
  {
    id: "org-3",
    name: "Ust. Muhammad Ridwan, Lc., M.A.",
    roleTitle: "Direktur Pengasuhan Santri & Bahasa",
    department: "Kepengasuhan Asrama",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Pakar pengajaran bahasa Arab komunikatif dan pembina iklim kedisiplinan asrama berbasis adab keteladanan.",
    qualifications: "S1 Bahasa Arab (Univ. Islam Madinah), S2 Linguistik Terapan",
    orderIndex: 3,
  },
  {
    id: "org-4",
    name: "Dr. Siti Nurhaliza, M.Si.",
    roleTitle: "Koordinator Riset Sains & Olimpiade",
    department: "Tenaga Pendidik (Guru)",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    bio: "Peneliti muda di bidang bioteknologi dan pembina tim olimpiade sains yang telah mengantar santri meraih berbagai medali emas nasional.",
    qualifications: "S1 Biologi (UGM), S2 & S3 Bioteknologi (ITB)",
    orderIndex: 4,
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
    subject: "Jadwal Visitasi & Tur Kampus",
    message:
      "Selamat pagi admin. Kami sekeluarga dari Surabaya berencana berkunjung ke kampus Yazzaka akhir pekan ini untuk melihat asrama dan kelas. Apakah perlu reservasi jadwal terlebih dahulu?",
    submittedAt: "2026-08-20 14:30",
    status: "read",
  },
];

export const initialWebsiteSettings: WebsiteSettings = {
  siteTitle: "SMA & Pesantren Modern Yazzaka - Pendidikan Unggul & Berkarakter",
  metaDescription:
    "Portal resmi SMA & Pesantren Modern Yazzaka. Memadukan kurikulum sains terpadu, tahfiz Al-Qur'an 30 juz, bahasa Arab & Inggris aktif, serta pembinaan karakter kepemimpinan.",
  keywords: "pesantren modern, sma unggulan, tahfiz quran 30 juz, ppdb 2026, sekolah islam terbaik",
  ogImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  socialMedia: {
    instagram: "https://instagram.com/yazzakamodern",
    youtube: "https://youtube.com/@yazzakamodern",
    facebook: "https://facebook.com/yazzakamodern",
    tiktok: "https://tiktok.com/@yazzakamodern",
    linkedin: "https://linkedin.com/company/yazzaka-school",
  },
  navigation: {
    headerLinks: [
      { label: "Beranda", href: "/" },
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Program", href: "/program" },
      { label: "Fasilitas", href: "/fasilitas" },
      { label: "Prestasi", href: "/prestasi" },
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
    email: "admin@yazzaka.sch.id",
    role: "super_admin",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-10",
  },
  {
    id: "usr-2",
    name: "Usth. Maryam Salsabila, S.Pd.",
    email: "editor@yazzaka.sch.id",
    role: "editor",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-02-15",
  },
  {
    id: "usr-3",
    name: "Ahmad Wildan (SPMB Staff)",
    email: "spmb@yazzaka.sch.id",
    role: "admission_staff",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-03-01",
  },
];

export const initialSections: PageSectionConfig[] = [
  { id: "sec-1", key: "hero", title: "Hero Banner", subtitle: "Visual utama dan pesan pimpinan", isEnabled: true, orderIndex: 1 },
  { id: "sec-2", key: "stats", title: "Statistik Kredibilitas", subtitle: "Angka kunci akreditasi & capaian", isEnabled: true, orderIndex: 2 },
  { id: "sec-3", key: "about", title: "Sambutan & Profil", subtitle: "Editorial pengenalan sekolah", isEnabled: true, orderIndex: 3 },
  { id: "sec-4", key: "programs", title: "Program Unggulan", subtitle: "Daftar kurikulum akademik & tahfiz", isEnabled: true, orderIndex: 4 },
  { id: "sec-5", key: "whyus", title: "Keunggulan Yazzaka", subtitle: "Mengapa memilih pendidikan di sini", isEnabled: true, orderIndex: 5 },
  { id: "sec-6", key: "facilities", title: "Fasilitas Kampus", subtitle: "Galeri sarana prasarana modern", isEnabled: true, orderIndex: 6 },
  { id: "sec-7", key: "achievements", title: "Prestasi Siswa", subtitle: "Catatan kejuaraan tingkat nasional", isEnabled: true, orderIndex: 7 },
  { id: "sec-8", key: "news", title: "Berita & Wawasan", subtitle: "Artikel edukasi dan liputan terkini", isEnabled: true, orderIndex: 8 },
  { id: "sec-9", key: "events", title: "Agenda Kegiatan", subtitle: "Jadwal event dan agenda mendatang", isEnabled: true, orderIndex: 9 },
  { id: "sec-10", key: "testimonials", title: "Testimoni", subtitle: "Kesan wali murid dan kiprah alumni", isEnabled: true, orderIndex: 10 },
  { id: "sec-11", key: "admission_cta", title: "Banner Konversi PPDB", subtitle: "Ajakan mendaftar siswa baru", isEnabled: true, orderIndex: 11 },
];
