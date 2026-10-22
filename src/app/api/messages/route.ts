import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMessage } from "../school-data/route";
import { generateId } from "@/lib/utils";
import { getSessionUser, isSuperAdmin } from "@/lib/news/api-helpers";

/** Pesan kontak memuat PII — hanya super_admin (proxy menambah lapisan pertama utk mutasi). */
async function requireSuperAdminOrRespond(request: Request): Promise<NextResponse | null> {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan untuk mengakses resource ini." },
      { status: 401 }
    );
  }
  if (!isSuperAdmin(user)) {
    return NextResponse.json(
      { error: "Peran Anda tidak memiliki izin untuk aksi ini." },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const denied = await requireSuperAdminOrRespond(request);
    if (denied) return denied;
    const sql = getDb();
    const result = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    return NextResponse.json(result.map(mapMessage));
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Gagal mengambil pesan kontak" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const denied = await requireSuperAdminOrRespond(request);
    if (denied) return denied;
    const body = await request.json();
    const sql = getDb();
    const id = generateId("msg");
    // ISO agar konsisten dengan /api/contact — kolom `submitted_at` sama.
    const submittedAt = new Date().toISOString();

    const result = await sql`
      INSERT INTO contact_messages (
        id, name, email, phone, subject, message, submitted_at, status
      ) VALUES (
        ${id}, ${body.name}, ${body.email}, ${body.phone}, ${body.subject}, 
        ${body.message}, ${submittedAt}, ${body.status ?? 'new'}
      )
      RETURNING *
    `;

    return NextResponse.json(mapMessage(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Gagal menambahkan pesan" }, { status: 500 });
  }
}
