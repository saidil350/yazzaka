import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import { initialSections } from "@/lib/data/initialData";
import type { PageSectionConfig } from "@/lib/types";

/**
 * Membaca konfigurasi page_sections dari DB untuk render awal server-side
 * (layout root). Mencegah kedipan konten yang nonaktif di DB tetapi aktif
 * di fallback initialData (mis. topbar) selama menunggu fetch client-side.
 * Di-cache per-request via React cache. Gagal DB → pakai hasil baca
 * terakhir yang valid; bila belum ada sama sekali → fail-closed (semua
 * seksi nonaktif) agar seksi yang disembunyikan admin tidak pernah dirender.
 */
// State terakhir yang berhasil dibaca dari DB (per proses server). Dipakai
// sebagai fallback agar DB yang sesaat gagal (mis. cold start Neon) tidak
// memunculkan kembali seksi yang admin sembunyikan.
let lastKnownGood: PageSectionConfig[] | null = null;

function mapSectionRows(rows: Array<Record<string, unknown>>): PageSectionConfig[] {
  return rows.map((r) => ({
    id: r.id as string,
    key: r.key as string,
    title: r.title as string,
    subtitle: r.subtitle as string,
    isEnabled: r.is_enabled as boolean,
    orderIndex: r.order_index as number,
  }));
}

export const getServerSections = cache(async (): Promise<PageSectionConfig[]> => {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM page_sections ORDER BY order_index ASC`;
    const mapped = mapSectionRows(rows);
    lastKnownGood = mapped;
    return mapped;
  } catch (error) {
    console.error("getServerSections error:", error);
    // Fail-closed: tanpa data DB yang valid, seksi tidak boleh dirender —
    // bukan fallback ke initialData yang menampilkan seksi tersembunyi.
    if (lastKnownGood) return lastKnownGood;
    return initialSections.map((s) => ({ ...s, isEnabled: false }));
  }
});

/**
 * Menyegarkan fallback last-known-good dari hasil baca DB terbaru. Dipanggil
 * route PUT /api/sections setelah tulis sukses, agar kegagalan DB yang terjadi
 * sesaat sesudahnya tidak memakai konfigurasi lama yang membuat seksi yang
 * baru disembunyikan tampil kembali.
 */
export function setLastKnownGoodSections(rows: Array<Record<string, unknown>>) {
  lastKnownGood = mapSectionRows(rows);
}
