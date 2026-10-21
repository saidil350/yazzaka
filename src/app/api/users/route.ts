import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/db/neon";
import { auth } from "@/lib/auth/server";
import { hashPassword } from "@/lib/auth/password";
import type { UserRole } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getSession(request: NextRequest) {
  return auth.api.getSession({ headers: request.headers });
}

// ─── GET /api/users ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }
    if (session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Hanya super admin yang dapat mengakses daftar pengguna." },
        { status: 403 }
      );
    }

    const sql = getDb();
    const rows = await sql`
      SELECT id, name, email, role, avatar_url, created_at
      FROM users
      ORDER BY created_at ASC
    `;

    const users = rows.map((u) => ({
      id: u.id as string,
      name: u.name as string,
      email: u.email as string,
      role: u.role as UserRole,
      avatarUrl: (u.avatar_url as string | null) ?? undefined,
      createdAt: u.created_at
        ? new Date(u.created_at as string).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar pengguna." },
      { status: 500 }
    );
  }
}

// ─── POST /api/users ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }
    if (session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Hanya super admin yang dapat menambah pengguna." },
        { status: 403 }
      );
    }

    let body: { name?: unknown; email?: unknown; password?: unknown; role?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = typeof body.role === "string" ? body.role : "";

    // Validasi input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Nama, email, kata sandi, dan peran wajib diisi." },
        { status: 400 }
      );
    }
    if (!["super_admin", "editor"].includes(role)) {
      return NextResponse.json(
        { error: "Peran tidak valid. Pilih super_admin atau editor." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    const sql = getDb();

    // Cek email sudah ada
    const existing = await sql`SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Gunakan email lain." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const id = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const rows = await sql`
      INSERT INTO users (id, name, email, role, password_hash)
      VALUES (${id}, ${name}, ${email}, ${role}, ${passwordHash})
      RETURNING id, name, email, role, avatar_url, created_at
    `;

    // Credential Better Auth: hash disalin ke accounts agar bisa login
    await sql`
      INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
      VALUES (${"acct-" + randomBytes(12).toString("hex")}, ${id}, 'credential', ${id}, ${passwordHash}, now(), now())
    `;

    const u = rows[0];
    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pengguna baru." },
      { status: 500 }
    );
  }
}
