import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMember } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM organization_members ORDER BY order_index ASC`;
    return NextResponse.json(result.map(mapMember));
  } catch (error) {
    console.error("GET /api/organization error:", error);
    return NextResponse.json({ error: "Gagal mengambil tim/guru" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("org");

    const result = await sql`
      INSERT INTO organization_members (
        id, name, role_title, department, photo_url, bio, qualifications, order_index
      ) VALUES (
        ${id}, ${body.name}, ${body.roleTitle}, ${body.department}, ${body.photoUrl}, 
        ${body.bio}, ${body.qualifications}, ${body.orderIndex ?? 0}
      )
      RETURNING *
    `;

    return NextResponse.json(mapMember(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/organization error:", error);
    return NextResponse.json({ error: "Gagal menambahkan anggota" }, { status: 500 });
  }
}
