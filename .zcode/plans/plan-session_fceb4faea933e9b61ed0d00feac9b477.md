## Integrasi Better Auth + Neon (mempertahankan user & password scrypt yang ada)

### Konteks
Auth saat ini: custom JWT cookie (`cms_session`, HMAC `AUTH_SECRET`), tabel `users` di Neon (kolom `id, name, email, role, avatar_url, created_at, password_hash` scrypt custom), guard di `src/proxy.ts` (Next 16 — middleware bernama `proxy.ts`), client guard via `AuthContext`. Tidak ada ORM.

### Implementasi

1. **Install** `better-auth` (dan `@better-auth/cli` dev, opsional).

2. **`src/lib/auth/server.ts`** — instance `betterAuth`:
   - `database`: `Pool` dari `@neondatabase/serverless` dengan `process.env.DATABASE_URL` (pola resmi Better Auth untuk Neon; tetap satu sumber env via `.env.local` yang di-swap per branch).
   - `secret: process.env.AUTH_SECRET` (tidak perlu env baru).
   - `user.modelName: "users"` + `fields` mapping ke kolom existing: `role` → `role` (additionalFields), `image` → `avatar_url`, `createdAt` → `created_at`, `emailVerified` → kolom baru `email_verified` (default true).
   - `emailAndPassword.enabled: true` dengan **custom `password.verify`** yang mem-parse format lama `scrypt:N:r:p:salt:hash` (logika scrypt dipindah ke helper bersih di `src/lib/auth/password.ts`, dipakai bersama skrip seeding). Semua user & password lama tetap valid.
   - `session.expiresIn` 8 jam (paritas dengan sekarang), rate limiting bawaan Better Auth diaktifkan (ganti rate-limit in-memory custom).

3. **Schema DB** — Better Auth butuh tabel `sessions`, `accounts`, `verifications` (+ kolom `email_verified` di `users`). Buat `scripts/migrate-better-auth.mjs` (SQL mentah, pola seperti `scripts/migrate-auth.mjs`, pakai `DATABASE_URL_UNPOOLED`) dan **jalankan ke KEDUA branch Neon** (staging dulu, lalu production via `npm run env:*`).

4. **Route handler** — `src/app/api/auth/[...all]/route.ts` dengan `toNextJsHandler(auth.handler)`. Hapus route lama `login/`, `session/`, `logout/` (endpoint Better Auth: `/api/auth/sign-in/email`, `get-session`, `sign-out`).

5. **Client** — `src/lib/auth/client.ts` (`createAuthClient` dari `better-auth/react`). Tulis ulang **isi** `AuthContext.tsx` memakai `authClient.useSession()` / `signIn.email()` / `signOut()`, tapi **pertahankan API `useAuth` yang sama** (`isAuthenticated`, `user`, `loginWithCredentials`, `logout`, `hasPermission`) agar semua halaman admin, sidebar, topbar tidak berubah.

6. **`src/proxy.ts`** — ganti `verifySessionToken` dengan `getSessionCookie` dari Better Auth untuk gate `/admin` & mutasi API; cek role `super_admin` tetap di route `/api/users*` via `auth.api.getSession({ headers })` (seperti re-check sekarang). Matcher dan aturan role tidak berubah.

7. **Kebersihan** — hapus `src/lib/auth/session.ts` (token custom) dan route rate-limit custom jika tergantikan; login page lama `src/app/admin/login/page.tsx` dibiarkan (proxy mengarah ke `/login`).

8. **Verifikasi** — `npx tsc --noEmit`, `npm run build`, lalu uji login admin (akun dari `docs/AKUN-TESTING.md`) di env staging: sign-in, sesi bertahan, logout, proteksi `/admin/users` (editor ditolak), CRUD users tetap jalan.

### Catatan
- Semua sesi lama hangus saat cutover (cookie `cms_session` tidak dikenali) — user login ulang sekali.
- Schema harus diterapkan ke dua branch Neon secara terpisah (staging & production tidak sinkron).