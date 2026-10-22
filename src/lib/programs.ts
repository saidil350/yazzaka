import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import { mapProgram } from "@/app/api/school-data/route";
import type { Program } from "@/lib/types";

/**
 * Akses data program untuk halaman publik server-rendered /program/[slug].
 * Hanya program berstatus published (NULL dianggap published — baris legacy)
 * yang boleh tampil; draft tetap 404.
 */

export const getProgramBySlug = cache(
  async (slug: string): Promise<Program | null> => {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT * FROM programs
        WHERE slug = ${slug} AND (status = 'published' OR status IS NULL)
        LIMIT 1
      `;
      const row = rows[0];
      return row ? (mapProgram(row) as Program) : null;
    } catch (error) {
      console.error("getProgramBySlug error:", error);
      throw error;
    }
  }
);

export const listOtherPublishedPrograms = cache(
  async (excludeSlug: string, limit = 4): Promise<Program[]> => {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM programs
      WHERE slug <> ${excludeSlug} AND (status = 'published' OR status IS NULL)
      ORDER BY order_index ASC
      LIMIT ${limit}
    `;
    return rows.map((r) => mapProgram(r) as Program);
  }
);

/** Status PPDB untuk label CTA di halaman detail program. */
export const getAdmissionOpen = cache(async (): Promise<boolean> => {
  try {
    const sql = getDb();
    const rows = await sql`SELECT is_open FROM admission_info LIMIT 1`;
    return rows[0] ? Boolean(rows[0].is_open) : false;
  } catch {
    return false;
  }
});

/** Kontak singkat profil untuk sidebar halaman program. */
export interface ProgramPageProfile {
  name: string;
  whatsapp: string;
  address: string;
  npsn: string;
}

export const getProgramPageProfile = cache(
  async (): Promise<ProgramPageProfile> => {
    const sql = getDb();
    const rows = await sql`
      SELECT name, whatsapp, address, npsn FROM school_profile LIMIT 1
    `;
    const r = rows[0];
    return {
      name: (r?.name as string) || "Yazzakka",
      whatsapp: (r?.whatsapp as string) || "",
      address: (r?.address as string) || "",
      npsn: (r?.npsn as string) || "",
    };
  }
);
