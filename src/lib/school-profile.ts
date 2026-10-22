import { cache } from "react";
import { getDb } from "@/lib/db/neon";

/**
 * Profil sekolah untuk halaman publik server-rendered (nama, tagline).
 * React.cache → satu query per request meski dipakai page + metadata.
 */
export const getSchoolProfile = cache(async function getSchoolProfile(): Promise<{
  name: string;
  tagline: string;
} | null> {
  try {
    const sql = getDb();
    const rows = await sql`SELECT name, tagline FROM school_profile LIMIT 1`;
    const row = rows[0] as { name?: string; tagline?: string } | undefined;
    if (!row) return null;
    return { name: row.name ?? "", tagline: row.tagline ?? "" };
  } catch {
    return null;
  }
});
