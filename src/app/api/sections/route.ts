import { NextResponse } from "next/server";
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

    for (const sec of sections) {
      await sql`
        INSERT INTO page_sections (id, key, title, subtitle, is_enabled, order_index)
        VALUES (${sec.id}, ${sec.key}, ${sec.title}, ${sec.subtitle || ""}, ${sec.isEnabled}, ${sec.orderIndex})
        ON CONFLICT (id) DO UPDATE
        SET 
          is_enabled = ${sec.isEnabled},
          order_index = ${sec.orderIndex},
          title = ${sec.title},
          subtitle = ${sec.subtitle || ""};
      `;
    }

    return NextResponse.json({ success: true, message: "Konfigurasi seksi berhasil disimpan" });
  } catch (error) {
    console.error("Error updating page sections:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status seksi di database" },
      { status: 500 }
    );
  }
}
