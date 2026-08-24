import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapTestimonial } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    const result = await sql`
      UPDATE testimonials
      SET 
        quote = COALESCE(${body.quote ?? null}, quote),
        name = COALESCE(${body.name ?? null}, name),
        role = COALESCE(${body.role ?? null}, role),
        photo_url = COALESCE(${body.photoUrl ?? null}, photo_url),
        graduation_year = COALESCE(${body.graduationYear ?? null}, graduation_year),
        child_name = COALESCE(${body.childName ?? null}, child_name),
        is_featured = COALESCE(${body.isFeatured ?? null}, is_featured),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapTestimonial(result[0]));
  } catch (error) {
    console.error(`PUT /api/testimonials/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui testimoni" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/testimonials/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus testimoni" }, { status: 500 });
  }
}
