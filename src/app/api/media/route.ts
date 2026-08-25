import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMedia } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM media_items ORDER BY created_at DESC`;
    return NextResponse.json(result.map(mapMedia));
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ error: "Gagal mengambil media library" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("med");

    const result = await sql`
      INSERT INTO media_items (
        id, file_name, file_url, file_type, file_size, category, alt_text
      ) VALUES (
        ${id}, ${body.fileName}, ${body.fileUrl}, ${body.fileType ?? 'image'}, 
        ${body.fileSize ?? '1.5 MB'}, ${body.category ?? 'Galeri'}, ${body.altText ?? body.fileName}
      )
      RETURNING *
    `;

    return NextResponse.json(mapMedia(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json({ error: "Gagal menambahkan media ke database" }, { status: 500 });
  }
}
