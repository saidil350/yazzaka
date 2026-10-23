export type UserRole = "super_admin" | "editor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  badges: string[];
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
  hero: Partial<HeroContent>;
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
  category: string;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  iconName: string;
  features: string[];
  status: "published" | "draft";
  orderIndex: number;
  targetCompetencies: string[];
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  studentName: string;
  competitionName: string;
  level: "Kabupaten / Kota" | "Provinsi" | "Nasional" | "Internasional" | string;
  year: number;
  date: string;
  imageUrl: string;
  description: string;
}

// Tipe domain berita kini didefinisikan di src/lib/news/types.ts —
// diekspor ulang di sini agar konsumen lama tetap bekerja.
export type { Article, NewsStatus, NewsCategory, NewsMedia } from "./news/types";

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  coverImage: string;
  registrationUrl?: string;
  status: "upcoming" | "completed";
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: "image" | "video" | "document" | string;
  fileSize: string;
  category: string;
  altText: string;
  uploadedAt: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
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
  // Kategori bebas (diedit via CMS), bukan union tertutup — nilai yang
  // tampil publik hanya sebagai teks badge/kolom tabel.
  category: string;
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
  startDate?: string;
  endDate?: string;
  hideFormWhenClosed?: boolean;
  closedMessage?: string;
  showHeaderCta: boolean;
  showHeroCta: boolean;
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
