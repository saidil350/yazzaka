import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapEvent } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    const result = await sql`
      UPDATE events
      SET 
        title = COALESCE(${body.title ?? null}, title),
        description = COALESCE(${body.description ?? null}, description),
        date = COALESCE(${body.date ?? null}, date),
        time = COALESCE(${body.time ?? null}, time),
        location = COALESCE(${body.location ?? null}, location),
        category = COALESCE(${body.category ?? null}, category),
        cover_image = COALESCE(${body.coverImage ?? null}, cover_image),
        registration_url = COALESCE(${body.registrationUrl ?? null}, registration_url),
        status = COALESCE(${body.status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapEvent(result[0]));
  } catch (error) {
    console.error(`PUT /api/events/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui event" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM events WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/events/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus event" }, { status: 500 });
  }
}
