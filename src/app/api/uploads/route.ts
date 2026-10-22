import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { generateId } from "@/lib/utils";
import { mapNewsMediaRow } from "@/lib/news/mappers";
import {
  buildStorageKey,
  isStorageConfigured,
  maxDocumentMB,
  maxImageMB,
  putObject,
} from "@/lib/storage/r2";
import { validateUploadedFile } from "@/lib/storage/file-validation";
import { requireUser, toErrorResponse } from "@/lib/news/api-helpers";

/**
 * POST /api/uploads — unggah berkas ke object storage (multipart/form-data).
 * field: file (File), purpose ("image" | "document", opsional).
 * Validasi server: allowlist ekstensi + magic bytes + batas ukuran.
 * Gagal di tengah jalan TIDAK menyisakan record/node gambar.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);

    if (!isStorageConfigured()) {
      return NextResponse.json(
        {
          error:
            "Object storage belum dikonfigurasi (R2_*). Unggahan dinonaktifkan — hubungi administrator.",
        },
        { status: 503 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Request harus berupa multipart/form-data." },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
    }

    const fileName = file.name || "berkas";
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const validation = validateUploadedFile(fileName, head);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 415 });
    }

    const limitMB =
      validation.kind === "image" ? maxImageMB() : maxDocumentMB();
    if (file.size > limitMB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Ukuran berkas maksimal ${limitMB} MB.` },
        { status: 413 }
      );
    }

    const key = buildStorageKey(fileName);
    const buffer = new Uint8Array(await file.arrayBuffer());
    await putObject(key, buffer, validation.mimeType);

    const sql = getDb();
    const id = generateId("med");
    const dot = fileName.lastIndexOf(".");
    const baseName = dot > 0 ? fileName.slice(0, dot) : fileName;

    const result = await sql`
      INSERT INTO media_items (
        id, file_name, file_url, storage_key, mime_type, size_bytes,
        kind, visibility, alt_text, uploaded_by, uploaded_at, created_at
      ) VALUES (
        ${id}, ${fileName}, ${`/api/files/${key}`}, ${key}, ${validation.mimeType},
        ${file.size}, ${validation.kind}, 'private', ${baseName}, ${user.id},
        ${new Date().toISOString()}, NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(mapNewsMediaRow(result[0]), { status: 201 });
  } catch (error) {
    return toErrorResponse(error, "Gagal mengunggah berkas");
  }
}
