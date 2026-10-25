import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db/neon";
import { PageSectionConfig } from "@/lib/types";

/**
 * PUT /api/sections
 * Menyimpan konfigurasi dan status enabled / order seksi halaman beranda ke Neon Database.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { sections } = body as { sections: PageSectionConfig[] };

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Format data sections tidak valid" },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Satu transaksi: gagal di tengah tidak menyisakan setengah konfigurasi.
    const operations = sections.map((sec) =>
      sql.query(
        `INSERT INTO page_sections (id, key, title, subtitle, is_enabled, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE
         SET
           is_enabled = $5,
           order_index = $6,
           title = $3,
           subtitle = $4`,
        [sec.id, sec.key, sec.title, sec.subtitle || "", sec.isEnabled, sec.orderIndex]
      )
    );
    await sql.transaction(operations);

    // Visibilitas seksi kini ikut dirender server-side di layout root —
    // invalidasi cache ISR agar perubahan toggle langsung tayang.
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, message: "Konfigurasi seksi berhasil disimpan" });
  } catch (error) {
    console.error("Error updating page sections:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status seksi di database" },
      { status: 500 }
    );
  }
}
