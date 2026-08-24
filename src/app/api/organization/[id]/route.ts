import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMember } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    const result = await sql`
      UPDATE organization_members
      SET 
        name = COALESCE(${body.name ?? null}, name),
        role_title = COALESCE(${body.roleTitle ?? null}, role_title),
        department = COALESCE(${body.department ?? null}, department),
        photo_url = COALESCE(${body.photoUrl ?? null}, photo_url),
        bio = COALESCE(${body.bio ?? null}, bio),
        qualifications = COALESCE(${body.qualifications ?? null}, qualifications),
        order_index = COALESCE(${body.orderIndex ?? null}, order_index),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapMember(result[0]));
  } catch (error) {
    console.error(`PUT /api/organization/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui anggota" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM organization_members WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/organization/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus anggota" }, { status: 500 });
  }
}
