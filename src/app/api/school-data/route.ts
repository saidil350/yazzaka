import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapArticleRow } from "@/lib/news/mappers";
import { getSessionUser } from "@/lib/news/api-helpers";
import { ADMIN_ROLES } from "@/lib/auth/server";

/**
 * GET /api/school-data
 * Mengambil semua data sekolah sekaligus untuk initial load SchoolDataContext.
 * Mengurangi jumlah request saat halaman pertama kali dibuka.
 *
 * Payload session-aware (endpoint ini juga dibaca pengunjung anonim):
 * - anonim → subset publik: programs hanya published, TANPA
 *   messages/users (PII), artikel hanya published tanpa isi/content, media
 *   hanya galeri — bukan berkas privat fitur berita;
 * - editor → data konten lengkap (termasuk draft) tapi tetap tanpa
 *   messages/users (modul pesan & manajemen user hanya untuk super_admin);
 * - super_admin → lengkap.
 * Key `messages`/`users` selalu ada (array kosong bila tidak berhak) agar
 * konsumen context tidak perlu menangani key yang hilang.
 */
export async function GET(request: Request) {
  try {
    const sql = getDb();
    const user = await getSessionUser(request);
    const isSuperAdmin = user ? ADMIN_ROLES.includes(user.role) : false;
    const publicOnly = !user;

    // Ambil semua data secara paralel untuk efisiensi
    const [
      profiles,
      programs,
      achievements,
      articles,
      events,
      testimonials,
      messages,
      settings,
      organization,
      users,
      sections,
      media,
    ] = await Promise.all([
      sql`SELECT * FROM school_profile LIMIT 1`,
      publicOnly
        ? sql`SELECT * FROM programs WHERE status = 'published' OR status IS NULL ORDER BY order_index ASC`
        : sql`SELECT * FROM programs ORDER BY order_index ASC`,
      sql`SELECT * FROM achievements ORDER BY year DESC, created_at DESC`,
      sql`SELECT a.id, a.slug, a.title, a.excerpt, a.cover_image, a.category,
                 a.tags, a.author, a.author_role, a.published_date, a.published_at,
                 a.read_time, a.status, a.featured, a.seo_title, a.seo_description,
                 a.created_at, a.updated_at, u.name AS author_name
          FROM articles a
          LEFT JOIN users u ON u.id = a.author_id
          WHERE a.status = 'published'
          ORDER BY a.published_at DESC NULLS LAST, a.published_date DESC, a.created_at DESC`,
      sql`SELECT * FROM events ORDER BY date ASC`,
      sql`SELECT * FROM testimonials ORDER BY created_at ASC`,
      isSuperAdmin
        ? sql`SELECT * FROM contact_messages ORDER BY created_at DESC`
        : Promise.resolve([] as Record<string, unknown>[]),
      sql`SELECT * FROM website_settings LIMIT 1`,
      sql`SELECT * FROM organization_members ORDER BY order_index ASC`,
      isSuperAdmin
        ? sql`SELECT * FROM users ORDER BY created_at ASC`
        : Promise.resolve([] as Record<string, unknown>[]),
      sql`SELECT * FROM page_sections ORDER BY order_index ASC`,
      sql`SELECT * FROM media_items
          WHERE (kind IS NULL OR kind <> 'document')
            AND (storage_key IS NULL OR visibility = 'public')
          ORDER BY created_at DESC`,
    ]);

    const profile = profiles[0] ?? null;
    const websiteSettings = settings[0] ?? null;

    return NextResponse.json({
      profile: profile ? mapProfile(profile) : null,
      programs: programs.map(mapProgram),
      achievements: achievements.map(mapAchievement),
      articles: articles.map(mapArticleRow),
      events: events.map(mapEvent),
      testimonials: testimonials.map(mapTestimonial),
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
    aboutImageUrl: r.about_image_url ?? "",
    foundation: r.foundation ?? null,
    principal: {
      name: r.principal_name,
      title: r.principal_title,
      photoUrl: r.principal_photo_url,
      welcomeMessage: r.principal_welcome_message,
      signatureUrl: r.principal_signature_url,
    },
    vision: r.vision,
    mission: r.mission,
    hero: r.hero ?? {},
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
  // Baris baru (modul berita) memakai kolom kind/size_bytes; baris legacy
  // memakai file_type/file_size — turunkan fileType & fileSize agar galeri
  // dan halaman admin media merender keduanya dengan benar.
  const sizeBytes = r.size_bytes != null ? Number(r.size_bytes) : null;
  const fileSize =
    (r.file_size as string | null) ??
    (sizeBytes != null ? `${Math.max(1, Math.round(sizeBytes / 1024))} KB` : undefined);
  return {
    id: r.id,
    fileName: r.file_name,
    fileUrl: r.file_url,
    fileType: (r.file_type as string | null) ?? (r.kind as string | null) ?? "image",
    fileSize,
    category: r.category,
    altText: r.alt_text,
    uploadedAt: r.uploaded_at,
  };
}
