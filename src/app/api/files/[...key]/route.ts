import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { getObject } from "@/lib/storage/r2";
import { getSessionUser, toErrorResponse } from "@/lib/news/api-helpers";

type RouteContext = { params: Promise<{ key: string[] }> };

/**
 * GET /api/files/<storage key> — unduh/tampilkan berkas dari object storage.
 * Berkas privat (artikel belum terbit) wajib sesi staff; berkas publik
 * dapat diakses tanpa login.
 */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const key = (await params).key.join("/");
    const sql = getDb();
    const rows = await sql`
      SELECT file_name, mime_type, visibility
      FROM media_items
      WHERE storage_key = ${key}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Berkas tidak ditemukan" }, { status: 404 });
    }

    const media = rows[0] as { file_name: string; mime_type: string | null; visibility: string };
    if (media.visibility !== "public") {
      const user = await getSessionUser(request);
      if (!user) {
        return NextResponse.json(
          { error: "Berkas ini belum dipublikasikan dan memerlukan login." },
          { status: 401 }
        );
      }
    }

    const object = await getObject(key);
    const encodedName = encodeURIComponent(media.file_name || "berkas");

    return new Response(object.body, {
      headers: {
        ...(object.contentType
          ? { "Content-Type": object.contentType }
          : media.mime_type
            ? { "Content-Type": media.mime_type }
            : {}),
        ...(object.contentLength != null
          ? { "Content-Length": String(object.contentLength) }
          : {}),
        "Content-Disposition": `inline; filename*=UTF-8''${encodedName}`,
        "Cache-Control":
          media.visibility === "public"
            ? "public, max-age=31536000, immutable"
            : "private, no-store",
      },
    });
  } catch (error) {
    return toErrorResponse(error, "Gagal mengambil berkas");
  }
}
