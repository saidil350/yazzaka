import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMessage } from "../../school-data/route";
import { getSessionUser, isSuperAdmin } from "@/lib/news/api-helpers";

/** Pesan kontak memuat PII — hanya super_admin. */
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await requireSuperAdminOrRespond(request);
    if (denied) return denied;
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    // Biasa hanya update status
    const result = await sql`
      UPDATE contact_messages
      SET 
        status = COALESCE(${body.status ?? null}, status)
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapMessage(result[0]));
  } catch (error) {
    console.error(`PUT /api/messages/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui pesan" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await requireSuperAdminOrRespond(request);
    if (denied) return denied;
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM contact_messages WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/messages/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus pesan" }, { status: 500 });
  }
}
