import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import { initialSections } from "@/lib/data/initialData";
import type { PageSectionConfig } from "@/lib/types";

/**
 * Membaca konfigurasi page_sections dari DB untuk render awal server-side
 * (layout root). Mencegah kedipan konten yang nonaktif di DB tetapi aktif
 * di fallback initialData (mis. topbar) selama menunggu fetch client-side.
 * Di-cache per-request via React cache; gagal DB → fallback initialSections
 * agar situs tetap tampil.
 */
export const getServerSections = cache(async (): Promise<PageSectionConfig[]> => {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM page_sections ORDER BY order_index ASC`;
    return rows.map((r) => ({
      id: r.id as string,
      key: r.key as string,
      title: r.title as string,
      subtitle: r.subtitle as string,
      isEnabled: r.is_enabled as boolean,
      orderIndex: r.order_index as number,
    }));
  } catch (error) {
    console.error("getServerSections error:", error);
    return initialSections;
  }
});
