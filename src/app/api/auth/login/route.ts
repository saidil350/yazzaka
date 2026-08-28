import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db/neon";
import type { UserRole } from "@/lib/types";
import {
  createSessionToken,
  getCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/auth/rate-limit";

const GENERIC_ERROR =
  "Email atau kata sandi tidak valid. Silakan periksa kembali kredensial Anda.";

function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split(":");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const N = parseInt(parts[1], 10);
    const r = parseInt(parts[2], 10);
    const p = parseInt(parts[3], 10);
    const salt = Buffer.from(parts[4], "hex");
    const expected = Buffer.from(parts[5], "hex");
    const derived = scryptSync(password, salt, expected.length, { N, r, p });
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: { email?: unknown; password?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const rateKey = `${ip}:${email}`;

    const { allowed, retryAfterSeconds } = checkRateLimit(rateKey);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan masuk. Coba lagi dalam ${Math.ceil((retryAfterSeconds ?? 60) / 60)} menit.`,
        },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds ?? 60) } }
      );
    }

    const sql = getDb();
    const result =
      await sql`SELECT id, name, email, role, avatar_url, password_hash FROM users WHERE lower(email) = ${email} AND password_hash IS NOT NULL ORDER BY created_at DESC LIMIT 1`;
    const user = result[0];

    // Selalu jalankan verifikasi (dummy bila user tak ada) untuk mencegah timing enumeration
    const storedHash =
      user?.password_hash ??
      `scrypt:16384:8:1:${randomBytes(16).toString("hex")}:${randomBytes(64).toString("hex")}`;
    const isValid = verifyPassword(password, storedHash);

    if (!user || !isValid) {
      recordFailedAttempt(rateKey);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    resetRateLimit(rateKey);

    const role = user.role as string;
    if (!["super_admin", "editor"].includes(role)) {
      return NextResponse.json(
        { error: "Peran akun tidak dikenali. Hubungi administrator." },
        { status: 403 }
      );
    }

    const { token, expiresAt } = createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: role as UserRole,
      avatarUrl: user.avatar_url ?? null,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role as UserRole,
        avatarUrl: user.avatar_url ?? undefined,
        createdAt: "",
      },
    });
    response.cookies.set(SESSION_COOKIE, token, getCookieOptions());
    response.headers.set("X-Session-Expires", expiresAt.toISOString());
    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Terjadi gangguan pada server autentikasi. Coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
