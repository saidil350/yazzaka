import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapArticleRow } from "@/lib/news/mappers";
import {
  mapProfile,
  mapProgram,
  mapAchievement,
  mapEvent,
  mapTestimonial,
  mapMessage,
  mapSettings,
  mapMember,
  mapUser,
  mapSection,
  mapMedia,
} from "@/lib/data-mappers";
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
