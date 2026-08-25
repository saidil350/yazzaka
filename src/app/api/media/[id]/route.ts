import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const sql = getDb();

    const result = await sql`DELETE FROM media_items WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error("DELETE /api/media/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus media" }, { status: 500 });
  }
}
