export type UserRole = "super_admin" | "admin" | "editor" | "admission_staff" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface SchoolProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  npsn: string;
  accreditation: string;
  establishedYear: number;
  studentCount: number;
  teacherCount: number;
  alumniCount: number;
  hafizCount: number;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapsEmbedUrl: string;
  principal: {
    name: string;
    title: string;
    photoUrl: string;
    welcomeMessage: string;
    signatureUrl?: string;
  };
  vision: string;
  mission: string[];
  values: {
    title: string;
    description: string;
  }[];
  branding: {
    primaryColor: string;
    accentColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
  };
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  category: "Akademik" | "Keagamaan / Tahfiz" | "Bahasa Asing" | "Sains & Riset" | "Kepemimpinan & Karakter";
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  iconName: string;
  features: string[];
  status: "published" | "draft";
  orderIndex: number;
  targetCompetencies: string[];
}

export interface Facility {
  id: string;
  name: string;
  category: "Ruang Belajar" | "Laboratorium & Riset" | "Asrama & Hunian" | "Sarana Ibadah & Olahraga" | "Penunjang";
  description: string;
  capacity?: string;
  imageUrl: string;
  status: "published" | "draft";
  orderIndex: number;
}

export interface Achievement {
  id: string;
  title: string;
  category: "Akademik & Sains" | "Tahfiz & Agama" | "Bahasa & Debat" | "Olahraga & Seni" | "Inovasi";
  studentName: string;
  competitionName: string;
  level: "Kabupaten / Kota" | "Provinsi" | "Nasional" | "Internasional";
  year: number;
  date: string;
  imageUrl: string;
  description: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: "Berita Sekolah" | "Wawasan & Opini" | "Prestasi" | "Kegiatan Santri" | "Pengumuman";
  tags: string[];
  author: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  status: "published" | "draft";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "Akademik" | "Penerimaan Siswa" | "Seminar & Parenting" | "Kegiatan Santri" | "Wisuda & Pameran";
  coverImage: string;
  registrationUrl?: string;
  status: "upcoming" | "completed";
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: "image" | "video" | "document";
  fileSize: string;
  category: "Galeri" | "Fasilitas" | "Kegiatan" | "Dokumen PPDB" | "Banner";
  altText: string;
  uploadedAt: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  roleTitle: string;
  department: "Pimpinan Yayasan & Sekolah" | "Tenaga Pendidik (Guru)" | "Kepengasuhan Asrama" | "Staf Administrasi";
  photoUrl: string;
  bio: string;
  qualifications: string;
  orderIndex: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: "Wali Murid" | "Alumni" | "Siswa Aktif" | "Tokoh Pendidikan";
  photoUrl: string;
  graduationYear?: number;
  childName?: string;
  isFeatured: boolean;
}

export interface AdmissionFeeItem {
  name: string;
  amount: number;
  category: "Pendaftaran" | "Uang Pangkal / Sarpras" | "SPP Bulanan" | "Seragam & Kit Santri";
  notes?: string;
}

export interface AdmissionTimelineStep {
  phase: string;
  dateRange: string;
  description: string;
  isCurrent: boolean;
}

export interface AdmissionFAQ {
  id: string;
  question: string;
  answer: string;
  category: "Pendaftaran" | "Biaya" | "Kehidupan Asrama" | "Akademik";
}

export interface AdmissionInfo {
  periodName: string;
  academicYear: string;
  isOpen: boolean;
  registrationUrl: string;
  consultationWhatsapp: string;
  timeline: AdmissionTimelineStep[];
  requirements: string[];
  fees: AdmissionFeeItem[];
  faqs: AdmissionFAQ[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: "new" | "read" | "replied" | "archived";
}

export interface PageSectionConfig {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  isEnabled: boolean;
  orderIndex: number;
}

export interface WebsiteSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  googleVerification?: string;
  socialMedia: {
    instagram: string;
    youtube: string;
    facebook: string;
    tiktok: string;
    linkedin: string;
  };
  navigation: {
    headerLinks: { label: string; href: string }[];
    footerLinks: { label: string; href: string }[];
  };
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}
