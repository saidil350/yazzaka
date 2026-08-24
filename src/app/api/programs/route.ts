import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapProgram } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM programs ORDER BY order_index ASC`;
    return NextResponse.json(result.map(mapProgram));
  } catch (error) {
    console.error("GET /api/programs error:", error);
    return NextResponse.json({ error: "Gagal mengambil program" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("prog");
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const result = await sql`
      INSERT INTO programs (
        id, slug, title, category, short_desc, full_desc, 
        image_url, icon_name, features, target_competencies, status, order_index
      ) VALUES (
        ${id}, ${slug}, ${body.title}, ${body.category}, ${body.shortDesc}, ${body.fullDesc},
        ${body.imageUrl}, ${body.iconName}, ${JSON.stringify(body.features)}::jsonb, 
        ${JSON.stringify(body.targetCompetencies)}::jsonb, ${body.status ?? 'published'}, ${body.orderIndex ?? 0}
      )
      RETURNING *
    `;

    return NextResponse.json(mapProgram(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/programs error:", error);
    return NextResponse.json({ error: "Gagal menambahkan program" }, { status: 500 });
  }
}
