import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db/neon";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import type { UserRole } from "@/lib/types";

function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

// ─── PATCH /api/users/[id] — Ubah Peran ─────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Hanya super admin yang dapat mengubah peran pengguna." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Tidak boleh ubah role diri sendiri
    if (session.sub === id) {
      return NextResponse.json(
        { error: "Anda tidak dapat mengubah peran akun Anda sendiri." },
        { status: 400 }
      );
    }

    let body: { role?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
    }

    const role = typeof body.role === "string" ? body.role : "";
    if (!["super_admin", "editor"].includes(role)) {
      return NextResponse.json(
        { error: "Peran tidak valid." },
        { status: 400 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      UPDATE users
      SET role = ${role}
      WHERE id = ${id}
      RETURNING id, name, email, role, avatar_url, created_at
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const u = rows[0];
    return NextResponse.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as UserRole,
        avatarUrl: (u.avatar_url as string | null) ?? undefined,
        createdAt: u.created_at
          ? new Date(u.created_at as string).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
      },
    });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui peran pengguna." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/users/[id] — Hapus Pengguna ────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Hanya super admin yang dapat menghapus pengguna." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Tidak boleh hapus diri sendiri
    if (session.sub === id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pengguna." },
      { status: 500 }
    );
  }
}
