import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapAchievement } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM achievements ORDER BY year DESC, created_at DESC`;
    return NextResponse.json(result.map(mapAchievement));
  } catch (error) {
    console.error("GET /api/achievements error:", error);
    return NextResponse.json({ error: "Gagal mengambil prestasi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("ach");

    const result = await sql`
      INSERT INTO achievements (
        id, title, category, student_name, competition_name, level, year, date, image_url, description
      ) VALUES (
        ${id}, ${body.title}, ${body.category}, ${body.studentName}, ${body.competitionName}, 
        ${body.level}, ${body.year}, ${body.date}, ${body.imageUrl}, ${body.description}
      )
      RETURNING *
    `;

    return NextResponse.json(mapAchievement(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/achievements error:", error);
    return NextResponse.json({ error: "Gagal menambahkan prestasi" }, { status: 500 });
  }
}
