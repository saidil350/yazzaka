import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapEvent } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM events ORDER BY date ASC`;
    return NextResponse.json(result.map(mapEvent));
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Gagal mengambil event" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("evt");

    const result = await sql`
      INSERT INTO events (
        id, title, description, date, time, location, category, cover_image, registration_url, status
      ) VALUES (
        ${id}, ${body.title}, ${body.description}, ${body.date}, ${body.time}, ${body.location}, 
        ${body.category}, ${body.coverImage}, ${body.registrationUrl ?? null}, ${body.status ?? 'upcoming'}
      )
      RETURNING *
    `;

    return NextResponse.json(mapEvent(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Gagal menambahkan event" }, { status: 500 });
  }
}
