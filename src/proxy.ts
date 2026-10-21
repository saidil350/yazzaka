import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, ADMIN_ROLES } from "@/lib/auth/server";
import type { UserRole } from "@/lib/types";

const PUBLIC_MUTATION_ROUTES: { prefix: string; methods: string[] }[] = [
  // Form kontak publik boleh diakses tanpa sesi
  { prefix: "/api/contact", methods: ["POST"] },
];

// Route API yang membutuhkan role admin untuk mutasi data
const ADMIN_ONLY_MUTATION_PREFIXES = [
  "/api/settings",
  "/api/profile",
  "/api/organization",
  "/api/school-data",
];

function isPublicMutation(pathname: string, method: string): boolean {
  return PUBLIC_MUTATION_ROUTES.some(
    (route) => pathname.startsWith(route.prefix) && route.methods.includes(method)
  );
}

function unauthorized(): NextResponse {
  return NextResponse.json(
    { error: "Autentikasi diperlukan untuk mengakses resource ini." },
    { status: 401 }
  );
}

function forbidden(): NextResponse {
  return NextResponse.json(
    { error: "Peran Anda tidak memiliki izin untuk aksi ini." },
    { status: 403 }
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  const isApiRoute = pathname.startsWith("/api/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  // Route Better Auth (/api/auth/*) menangani autentikasinya sendiri
  const isAuthApi = pathname.startsWith("/api/auth/");

  if (!isAdminRoute && !(isApiRoute && !isAuthApi)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  // ── Proteksi halaman admin ────────────────────────────────────────────
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Halaman manajemen pengguna hanya untuk super_admin/admin (server-side)
    if (pathname.startsWith("/admin/users") && !ADMIN_ROLES.includes(session.user.role as UserRole)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // ── Proteksi API ──────────────────────────────────────────────────────
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (isMutation) {
    if (isPublicMutation(pathname, method)) {
      return NextResponse.next();
    }
    if (!session) {
      return unauthorized();
    }
    const needsAdmin = ADMIN_ONLY_MUTATION_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (needsAdmin && !ADMIN_ROLES.includes(session.user.role as UserRole)) {
      return forbidden();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/:path*"],
};
