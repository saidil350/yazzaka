import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { scryptSync, randomBytes } from "crypto";
import { getDb } from "@/lib/db/neon";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import type { UserRole } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getSessionOrFail(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Hash password dengan format scrypt:N:r:p:salt:hash */
function hashPassword(password: string): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

// ─── GET /api/users ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = getSessionOrFail(request);
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }
    if (session.role !== "super_admin") {
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
      { error: "Gagal mengambil data pengguna." },
      { status: 500 }
    );
  }
}

// ─── POST /api/users ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = getSessionOrFail(request);
    if (!session) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }
    if (session.role !== "super_admin") {
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
