import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/server";
import { ADMIN_ROLES, EDITOR_ROLES } from "@/lib/auth/server";
import type { UserRole } from "@/lib/types";

/**
 * Helper API untuk fitur berita: error terbungkus + pemeriksaan sesi/role
 * DI DALAM setiap route handler (proxy.ts hanya lapisan pertama).
 */

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function getSessionUser(
  request: Request
): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: session.user.role as UserRole,
  };
}

export async function requireUser(request: Request): Promise<SessionUser> {
  const user = await getSessionUser(request);
  if (!user) {
    throw new ApiError(401, "Sesi tidak ditemukan. Silakan login kembali.");
  }
  if (!EDITOR_ROLES.includes(user.role)) {
    throw new ApiError(403, "Peran Anda tidak memiliki akses ke fitur ini.");
  }
  return user;
}

export function isSuperAdmin(user: SessionUser): boolean {
  return ADMIN_ROLES.includes(user.role);
}

export function requireSuperAdmin(user: SessionUser): void {
  if (!isSuperAdmin(user)) {
    throw new ApiError(
      403,
      "Aksi ini hanya dapat dilakukan oleh super admin."
    );
  }
}

/** Terjemahkan error apa pun menjadi NextResponse JSON yang aman. */
export function toErrorResponse(error: unknown, fallback: string): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

/** Segarkan halaman publik /berita setelah artikel berubah. */
export function revalidateNews(slug?: string | null): void {
  revalidatePath("/berita");
  if (slug) {
    revalidatePath(`/berita/${slug}`);
  }
}

/** Validasi zod → lempar ApiError 400 dengan pesan gabungan. */
export function parseOrThrow<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { issues: { path: (string | number | symbol)[]; message: string }[] } } },
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success || result.data === undefined) {
    const issues = result.error?.issues ?? [];
    const detail = issues
      .map((issue) => `${issue.path.join(".") || "data"}: ${issue.message}`)
      .join("; ");
    throw new ApiError(400, `Data tidak valid.${detail ? ` ${detail}` : ""}`);
  }
  return result.data;
}
