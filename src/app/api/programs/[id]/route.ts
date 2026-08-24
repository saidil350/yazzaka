import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapProgram } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();
    
    // Convert features/targetCompetencies to JSON strings if they are arrays
    const featuresJson = Array.isArray(body.features) ? JSON.stringify(body.features) : undefined;
    const targetsJson = Array.isArray(body.targetCompetencies) ? JSON.stringify(body.targetCompetencies) : undefined;

    const result = await sql`
      UPDATE programs
      SET 
        title = COALESCE(${body.title ?? null}, title),
        category = COALESCE(${body.category ?? null}, category),
        short_desc = COALESCE(${body.shortDesc ?? null}, short_desc),
        full_desc = COALESCE(${body.fullDesc ?? null}, full_desc),
        image_url = COALESCE(${body.imageUrl ?? null}, image_url),
        icon_name = COALESCE(${body.iconName ?? null}, icon_name),
        features = COALESCE(${featuresJson ? sql`${featuresJson}::jsonb` : null}, features),
        target_competencies = COALESCE(${targetsJson ? sql`${targetsJson}::jsonb` : null}, target_competencies),
        status = COALESCE(${body.status ?? null}, status),
        order_index = COALESCE(${body.orderIndex ?? null}, order_index),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Program tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapProgram(result[0]));
  } catch (error) {
    console.error(`PUT /api/programs/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui program" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM programs WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Program tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/programs/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus program" }, { status: 500 });
  }
}
