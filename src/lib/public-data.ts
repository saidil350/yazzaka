import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import {
  mapProfile,
  mapProgram,
  mapAchievement,
  mapEvent,
  mapTestimonial,
  mapMember,
  mapMedia,
} from "@/lib/data-mappers";
import type {
  Achievement,
  MediaItem,
  OrganizationMember,
  Program,
  SchoolEvent,
  SchoolProfile,
  Testimonial,
} from "@/lib/types";

/**
 * Akses data untuk halaman publik server-rendered (route group (public)).
 * Pola sama dengan sections-server.ts: di-cache per-request via React cache,
 * dan DB yang sesaat gagal (mis. cold start Neon) TIDAK membuat halaman
 * 500 — koleksi degradasi ke [] dan profil ke null sehingga seksi tampil
 * sebagai EmptyState, bukan error.
 */

export const getPublicProfile = cache(async (): Promise<SchoolProfile | null> => {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM school_profile LIMIT 1`;
    return rows[0] ? (mapProfile(rows[0]) as unknown as SchoolProfile) : null;
  } catch (error) {
    console.error("getPublicProfile error:", error);
    return null;
  }
});

export const listPublishedPrograms = cache(async (): Promise<Program[]> => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM programs
      WHERE status = 'published' OR status IS NULL
      ORDER BY order_index ASC
    `;
    return rows.map((r) => mapProgram(r) as Program);
  } catch (error) {
    console.error("listPublishedPrograms error:", error);
    return [];
  }
});

export const listAchievements = cache(async (): Promise<Achievement[]> => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM achievements ORDER BY year DESC, created_at DESC
    `;
    return rows.map((r) => mapAchievement(r) as Achievement);
  } catch (error) {
    console.error("listAchievements error:", error);
    return [];
  }
});

export const listPublishedEvents = cache(async (): Promise<SchoolEvent[]> => {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM events ORDER BY date ASC`;
    return rows.map((r) => mapEvent(r) as SchoolEvent);
  } catch (error) {
    console.error("listPublishedEvents error:", error);
    return [];
  }
});

export const listTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM testimonials ORDER BY created_at ASC`;
    return rows.map((r) => mapTestimonial(r) as Testimonial);
  } catch (error) {
    console.error("listTestimonials error:", error);
    return [];
  }
});

export const listOrganizationMembers = cache(
  async (): Promise<OrganizationMember[]> => {
    try {
      const sql = getDb();
      const rows =
        await sql`SELECT * FROM organization_members ORDER BY order_index ASC`;
      return rows.map((r) => mapMember(r) as OrganizationMember);
    } catch (error) {
      console.error("listOrganizationMembers error:", error);
      return [];
    }
  }
);

/** Media galeri publik — sama seperti subset media di /api/school-data anonim. */
export const listGalleryMedia = cache(async (): Promise<MediaItem[]> => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM media_items
      WHERE (kind IS NULL OR kind <> 'document')
        AND (storage_key IS NULL OR visibility = 'public')
      ORDER BY created_at DESC
    `;
    return rows.map((r) => mapMedia(r) as MediaItem);
  } catch (error) {
    console.error("listGalleryMedia error:", error);
    return [];
  }
});
