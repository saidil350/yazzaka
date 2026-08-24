import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapTestimonial } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM testimonials ORDER BY created_at ASC`;
    return NextResponse.json(result.map(mapTestimonial));
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json({ error: "Gagal mengambil testimoni" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("test");

    const result = await sql`
      INSERT INTO testimonials (
        id, quote, name, role, photo_url, graduation_year, child_name, is_featured
      ) VALUES (
        ${id}, ${body.quote}, ${body.name}, ${body.role}, ${body.photoUrl}, 
        ${body.graduationYear ?? null}, ${body.childName ?? null}, ${body.isFeatured ?? false}
      )
      RETURNING *
    `;

    return NextResponse.json(mapTestimonial(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ error: "Gagal menambahkan testimoni" }, { status: 500 });
  }
}
