import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapFacility } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    const result = await sql`
      UPDATE facilities
      SET 
        name = COALESCE(${body.name ?? null}, name),
        category = COALESCE(${body.category ?? null}, category),
        description = COALESCE(${body.description ?? null}, description),
        capacity = COALESCE(${body.capacity ?? null}, capacity),
        image_url = COALESCE(${body.imageUrl ?? null}, image_url),
        status = COALESCE(${body.status ?? null}, status),
        order_index = COALESCE(${body.orderIndex ?? null}, order_index),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapFacility(result[0]));
  } catch (error) {
    console.error(`PUT /api/facilities/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui fasilitas" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM facilities WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/facilities/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus fasilitas" }, { status: 500 });
  }
}
