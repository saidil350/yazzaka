import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMedia } from "../school-data/route";
import { mapNewsMediaRow } from "@/lib/news/mappers";
import { generateId } from "@/lib/utils";
import { requireUser, toErrorResponse } from "@/lib/news/api-helpers";

/**
 * GET /api/media — daftar media library (staff). Mendukung ?kind=image|document
 * untuk pemilih berkas di editor berita. Metadata berkas privat hanya
 * terlihat setelah login.
 */
export async function GET(request: Request) {
  try {
    await requireUser(request);
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind");
    const sql = getDb();

    const result =
      kind === "image" || kind === "document"
        ? await sql`SELECT * FROM media_items WHERE kind = ${kind} ORDER BY created_at DESC LIMIT 200`
        : await sql`SELECT * FROM media_items ORDER BY created_at DESC LIMIT 200`;

    return NextResponse.json({ items: result.map(mapNewsMediaRow) });
  } catch (error) {
    return toErrorResponse(error, "Gagal mengambil media library");
  }
}

/** POST /api/media — daftarkan URL eksternal (registry, alur galeri lama). */
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
