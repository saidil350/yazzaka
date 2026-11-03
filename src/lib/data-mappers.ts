// Mapper snake_case DB → camelCase TS untuk koleksi sekolah.
// Dipindah dari src/app/api/school-data/route.ts agar bisa dipakai ulang
// oleh data layer server-side publik (src/lib/public-data.ts) tanpa
// duplikasi — paritas field wajib dijaga di satu tempat ini.

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
