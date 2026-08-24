import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapAchievement } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    const result = await sql`
      UPDATE achievements
      SET 
        title = COALESCE(${body.title ?? null}, title),
        category = COALESCE(${body.category ?? null}, category),
        student_name = COALESCE(${body.studentName ?? null}, student_name),
        competition_name = COALESCE(${body.competitionName ?? null}, competition_name),
        level = COALESCE(${body.level ?? null}, level),
        year = COALESCE(${body.year ?? null}, year),
        date = COALESCE(${body.date ?? null}, date),
        image_url = COALESCE(${body.imageUrl ?? null}, image_url),
        description = COALESCE(${body.description ?? null}, description),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapAchievement(result[0]));
  } catch (error) {
    console.error(`PUT /api/achievements/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui prestasi" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM achievements WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/achievements/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus prestasi" }, { status: 500 });
  }
}
