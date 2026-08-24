import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapFacility } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM facilities ORDER BY order_index ASC`;
    return NextResponse.json(result.map(mapFacility));
  } catch (error) {
    console.error("GET /api/facilities error:", error);
    return NextResponse.json({ error: "Gagal mengambil fasilitas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("fac");

    const result = await sql`
      INSERT INTO facilities (
        id, name, category, description, capacity, image_url, status, order_index
      ) VALUES (
        ${id}, ${body.name}, ${body.category}, ${body.description}, ${body.capacity}, 
        ${body.imageUrl}, ${body.status ?? 'published'}, ${body.orderIndex ?? 0}
      )
      RETURNING *
    `;

    return NextResponse.json(mapFacility(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/facilities error:", error);
    return NextResponse.json({ error: "Gagal menambahkan fasilitas" }, { status: 500 });
  }
}
