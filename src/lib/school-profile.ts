import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import type { HeroContent } from "@/lib/types";

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

/**
 * Konten hero (kolase galeri) untuk render awal server-side di layout root.
 * Tanpa ini, kolase hero hanya terisi setelah fetch client /api/school-data
 * selesai — gambar baru mulai diunduh belakangan dan selama menunggu user
 * melihat fallback/empty-state. Fail → null (context memakai default kosong,
 * perilakunya sama dengan sebelum perbaikan).
 */
export const getServerHero = cache(async function getServerHero(): Promise<Partial<HeroContent> | null> {
  try {
    const sql = getDb();
    const rows = await sql`SELECT hero FROM school_profile LIMIT 1`;
    const row = rows[0] as { hero?: unknown } | undefined;
    if (!row || typeof row.hero !== "object" || row.hero === null) return null;
    return row.hero as Partial<HeroContent>;
  } catch {
    return null;
  }
});
