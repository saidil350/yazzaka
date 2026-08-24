import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";

/**
 * GET /api/school-data
 * Mengambil semua data sekolah sekaligus untuk initial load SchoolDataContext.
 * Mengurangi jumlah request saat halaman pertama kali dibuka.
 */
export async function GET() {
  try {
    const sql = getDb();

    // Ambil semua data secara paralel untuk efisiensi
    const [
      profiles,
      programs,
      facilities,
      achievements,
      articles,
      events,
      testimonials,
      admissions,
      messages,
      settings,
      organization,
      users,
      sections,
      media,
    ] = await Promise.all([
      sql`SELECT * FROM school_profile LIMIT 1`,
      sql`SELECT * FROM programs ORDER BY order_index ASC`,
      sql`SELECT * FROM facilities ORDER BY order_index ASC`,
      sql`SELECT * FROM achievements ORDER BY year DESC, created_at DESC`,
      sql`SELECT * FROM articles ORDER BY published_date DESC`,
      sql`SELECT * FROM events ORDER BY date ASC`,
      sql`SELECT * FROM testimonials ORDER BY created_at ASC`,
      sql`SELECT * FROM admission_info LIMIT 1`,
      sql`SELECT * FROM contact_messages ORDER BY created_at DESC`,
      sql`SELECT * FROM website_settings LIMIT 1`,
      sql`SELECT * FROM organization_members ORDER BY order_index ASC`,
      sql`SELECT * FROM users ORDER BY created_at ASC`,
      sql`SELECT * FROM page_sections ORDER BY order_index ASC`,
      sql`SELECT * FROM media_items ORDER BY created_at DESC`,
    ]);

    const profile = profiles[0] ?? null;
    const admission = admissions[0] ?? null;
    const websiteSettings = settings[0] ?? null;

    return NextResponse.json({
      profile: profile ? mapProfile(profile) : null,
      programs: programs.map(mapProgram),
      facilities: facilities.map(mapFacility),
      achievements: achievements.map(mapAchievement),
      articles: articles.map(mapArticle),
      events: events.map(mapEvent),
      testimonials: testimonials.map(mapTestimonial),
      admission: admission ? mapAdmission(admission) : null,
      messages: messages.map(mapMessage),
      settings: websiteSettings ? mapSettings(websiteSettings) : null,
      organization: organization.map(mapMember),
      users: users.map(mapUser),
      sections: sections.map(mapSection),
      media: media.map(mapMedia),
    });
  } catch (error) {
    console.error("GET /api/school-data error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari database" },
      { status: 500 }
    );
  }
}

// ===================== MAPPERS (snake_case DB → camelCase TS) =====================

export function mapProfile(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    npsn: r.npsn,
    accreditation: r.accreditation,
    establishedYear: r.established_year,
    studentCount: r.student_count,
    teacherCount: r.teacher_count,
    alumniCount: r.alumni_count,
    hafizCount: r.hafiz_count,
    address: r.address,
    city: r.city,
    province: r.province,
    phone: r.phone,
    email: r.email,
    whatsapp: r.whatsapp,
    mapsEmbedUrl: r.maps_embed_url,
    principal: {
      name: r.principal_name,
      title: r.principal_title,
      photoUrl: r.principal_photo_url,
      welcomeMessage: r.principal_welcome_message,
      signatureUrl: r.principal_signature_url,
    },
    vision: r.vision,
    mission: r.mission,
    values: r.values,
    branding: r.branding,
  };
}

export function mapProgram(r: Record<string, unknown>) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    shortDesc: r.short_desc,
    fullDesc: r.full_desc,
    imageUrl: r.image_url,
    iconName: r.icon_name,
    features: r.features,
    targetCompetencies: r.target_competencies,
    status: r.status,
    orderIndex: r.order_index,
  };
}

export function mapFacility(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    capacity: r.capacity,
    imageUrl: r.image_url,
    status: r.status,
    orderIndex: r.order_index,
  };
}

export function mapAchievement(r: Record<string, unknown>) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    studentName: r.student_name,
    competitionName: r.competition_name,
    level: r.level,
    year: r.year,
    date: r.date,
    imageUrl: r.image_url,
    description: r.description,
  };
}

export function mapArticle(r: Record<string, unknown>) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    coverImage: r.cover_image,
    category: r.category,
    tags: r.tags,
    author: r.author,
    authorRole: r.author_role,
    publishedDate: r.published_date,
    readTime: r.read_time,
    status: r.status,
    featured: r.featured,
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
  };
}

export function mapEvent(r: Record<string, unknown>) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    date: r.date,
    time: r.time,
    location: r.location,
    category: r.category,
    coverImage: r.cover_image,
    registrationUrl: r.registration_url,
    status: r.status,
  };
}

export function mapTestimonial(r: Record<string, unknown>) {
  return {
    id: r.id,
    quote: r.quote,
    name: r.name,
    role: r.role,
    photoUrl: r.photo_url,
    graduationYear: r.graduation_year,
    childName: r.child_name,
    isFeatured: r.is_featured,
  };
}

export function mapAdmission(r: Record<string, unknown>) {
  return {
    periodName: r.period_name,
    academicYear: r.academic_year,
    isOpen: r.is_open,
    registrationUrl: r.registration_url,
    consultationWhatsapp: r.consultation_whatsapp,
    timeline: r.timeline,
    requirements: r.requirements,
    fees: r.fees,
    faqs: r.faqs,
  };
}

export function mapMessage(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    submittedAt: r.submitted_at,
    status: r.status,
  };
}

export function mapSettings(r: Record<string, unknown>) {
  return {
    siteTitle: r.site_title,
    metaDescription: r.meta_description,
    keywords: r.keywords,
    ogImage: r.og_image,
    googleVerification: r.google_verification,
    socialMedia: r.social_media,
    navigation: r.navigation,
  };
}

export function mapMember(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    roleTitle: r.role_title,
    department: r.department,
    photoUrl: r.photo_url,
    bio: r.bio,
    qualifications: r.qualifications,
    orderIndex: r.order_index,
  };
}

export function mapUser(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    avatarUrl: r.avatar_url,
    createdAt: r.created_at,
  };
}

export function mapSection(r: Record<string, unknown>) {
  return {
    id: r.id,
    key: r.key,
    title: r.title,
    subtitle: r.subtitle,
    isEnabled: r.is_enabled,
    orderIndex: r.order_index,
  };
}

export function mapMedia(r: Record<string, unknown>) {
  return {
    id: r.id,
    fileName: r.file_name,
    fileUrl: r.file_url,
    fileType: r.file_type,
    fileSize: r.file_size,
    category: r.category,
    altText: r.alt_text,
    uploadedAt: r.uploaded_at,
  };
}
