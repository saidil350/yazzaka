# Audit & Perbaikan Konsistensi Aplikasi

> **Tanggal:** 2026-10-22 · **Status:** Selesai dieksekusi (P0–P2) · **Basis:** Next.js 16.3.2, React 19, Neon Postgres, Better Auth
> Laporan audit awal + verifikasi independen dilakukan di sesi ini; temuan P3 yang tersisa tercantum di bagian akhir.

## 1. Ringkasan

Audit konsistensi end-to-end menemukan **23 temuan** (6 P0, 5 P1, 9 P2, 3 P3). Semua temuan diverifikasi dua lapis (pembacaan kode + verifikasi mandiri termasuk query DB staging), lalu diverifikasi independen oleh agen `application-consistency-engineer` (0 temuan dibantah; beberapa penajaman). Perbaikan dieksekusi atas persetujuan scope dengan keputusan: D1 payload `school-data` session-aware, D2 modul pesan super_admin-only, D3 modul Tim disembunyikan dari editor, D4 KPI dilabeli + urutan diselaraskan, D5 perbaikan label tanpa migrasi skema.

## 2. Arsitektur data (setelah perbaikan)

| Jenis fitur | Sumber data | Rendering/cache | Perilaku setelah perubahan |
|---|---|---|---|
| Berita publik + detail | `lib/news/service` (satu definisi) | Dynamic SSR + `revalidatePath` | Tayang langsung |
| Landing & list publik | `/api/school-data` **session-aware**: anonim = subset publik (published-only, tanpa PII); editor = +draft, tanpa messages/users; super_admin = lengkap | Client-fetch `no-store` per kunjungan | Pengunjung berikutnya melihat data baru; tak ada draft/PII bocor |
| `/program/[slug]` | `lib/programs.ts` (server, published-only) | Server component + `generateMetadata`; 404 HTTP asli | Slug baru/publish/unpublish tayang via `revalidatePath` di PUT/POST/DELETE programs |
| Form kontak & PPDB publik | `POST /api/contact` (satu-satunya POST anonim, error jujur) | — | Toast sukses hanya bila tersimpan; `submitted_at` ISO |
| Admin content/forms | Context actions: optimistic + **rollback + rethrow** | — | Gagal simpan → state kembali + toast error; tidak ada lagi sukses palsu |
| Pesan masuk | `/api/messages*` **super_admin-only** (in-route + proxy) | — | Editor tak bisa baca/ubah/hapus via jalur mana pun |
| SEO metadata | `website_settings` | ISR 60s (root layout) | Tayang ≤60 dtk (kebijakan eksplisit) |
| Konfigurasi UI tetap (nav, ikon, copy seksi, fallback form) | Kode (`initialData`) | Statis | Tak perlu sinkron DB sampai rebuild landing |

## 3. Temuan & status perbaikan

| ID | Severity | Ringkasan | Status |
|---|---|---|---|
| F01 | P0 | `GET /api/messages` publik (PII) | ✅ `requireSuperAdmin` in-route GET/PUT/DELETE + proxy `/api/messages` admin-only mutation |
| F02 | P0 | `school-data` kirim messages+users ke anonim | ✅ Payload session-aware (anonim/editor = array kosong; key selalu ada) |
| F03 | P0 | Form kontak/PPDB POST `/api/messages` → 401 anonim + toast palsu; `/api/contact` yatim | ✅ Context → `/api/contact`; kedua form async await/catch/finally; `/api/contact` tidak lagi menelan error DB |
| F04 | P0 | `updateProfile` & keluarga section menelan error | ✅ Rethrow setelah rollback; `saveSections` berbagi jalur dengan rollback |
| F05 | P0 | 15+ halaman fire-and-forget → toast sukses prematur | ✅ Sweep await+try/catch: hero, profil, visi-misi, tim (incl. delete/move/header), seo, social, contact, general, pages/beranda, dashboard, fasilitas, kegiatan, prestasi, program, testimoni, PPDB fees/FAQ, pesan, media |
| F06 | P0 | RBAC 3 lapis tidak sinkron | ✅ `proxy.ts`: gate halaman super_admin (`/admin/organization`, `/admin/settings`, `/admin/content/hero`); sidebar Tim `roles: ["super_admin"]`; kartu pesan dashboard digate `isSuperAdmin` |
| F07 | P1 | Draft programs/facilities bocor ke publik (termasuk URL detail) | ✅ Filter `published OR NULL` untuk anonim di school-data + query server `/program/[slug]` |
| F08 | P1 | Urutan berita beda + KPI tidak selaras | ✅ Tie-break `created_at DESC` disamakan; KPI → "Berita Terpublikasi" |
| F09 | P1 | Halaman publik client-only; `/program/[slug]` soft-404 | ✅ `/program/[slug]` → server component + metadata + `notFound()` **HTTP 404 asli** (+ `error.tsx`); catatan: `loading.tsx` sengaja TIDAK dipakai karena membuat status ter-stream 200 |
| F10 | P1 | `context.error` tak pernah dirender | ✅ (bagian dari F09/sweep; halaman kini punya error state via `error.tsx` + toast gagal) |
| F11 | P1 | `/api/contact` telan error; `submitted_at` dua format | ✅ Error jujur 500; kedua endpoint ISO; display helper menoleransi baris legacy |
| F12 | P2 | Hydration tahun + tanggal geser hari (offset UTC negatif) | ✅ Footer/login tahun via effect; `formatDateIndonesian` + chip agenda parse UTC deterministik |
| F13 | P2 | sections PUT non-transaksional; reorder tim rapuh | ✅ `sql.transaction` di `/api/sections`; reorder tim: blokir saat pencarian aktif + try/catch + rollback best-effort |
| F14 | P2 | Validasi lemah; POST media tanpa `requireUser` | ✅ `requireUser` di POST media; guard title/features di POST programs (zod penuh tetap inkremental) |
| F15 | P2 | PUT per keystroke (branding); form hero tertimpa | ✅ Pratinjau CSS lokal + commit debounce 500ms; hero `lastSyncedRef` dirty-guard |
| F16 | P2 | Label NPSN/SK & copy kontradiktif | ✅ Header "SK Kemenkumham", dashboard "SK Kemenkumham", badge fallback "Terdaftar Resmi Kemenkumham RI", TrustStats desc dari `establishedYear` (tanpa migrasi skema — D5) |
| F17 | P2 | Toggle seksi tanpa efek (news, admission_cta) | ✅ Disembunyikan dari dashboard & `/admin/pages/beranda` |
| F18 | P2 | Nav hardcode slug program | ⏳ Sisa — slug DB saat ini cocok; risiko berkurang karena `/program/[slug]` kini 404 jujur |
| F19 | P2 | Kebijakan revalidation timpang | ✅ programs kini revalidate; entitas lain client-fetch (selalu segar); dokumentasi kebijakan |
| F20 | P2 | Section family tanpa rollback | ✅ (gabung F04) |
| F21 | P3 | Dua sistem media (base64 vs R2) | ⏳ Tersisa (butuh keputusan desain) |
| F22 | P3 | PUT settings/admission tanpa 404; entri proxy sia-sia; metadataBase localhost | ✅ 404 check; entri `/api/school-data` dihapus dari ADMIN_ONLY_MUTATION (GET kini session-aware in-route); metadataBase tersisa (set `NEXT_PUBLIC_SITE_URL` saat deploy) |
| F23 | P3 | Tidak ada test suite | ⏳ Tersisa — QA manual + build sesuai konvensi repo |

## 4. Strategi sinkronisasi

1. **Kontrak error tunggal**: context action = optimistic → API → setState dari respons; gagal = rollback + rethrow. Halaman wajib `await` + `try/catch` + toast dari hasil. Referensi pola: `/admin/users` & modul berita.
2. **Satu pintu kebenaran per entitas**: berita via `news/service` (list & detail & landing order); program detail via `lib/programs`; sisanya via context yang satu payload-nya menyesuaikan sesi.
3. **Invalidasi**: `revalidatePath("/berita"…)` (sudah ada) + `revalidatePath("/program", "/program/[slug]")` baru pada POST/PUT/DELETE programs. Entitas lain tidak butuh karena halaman publiknya client-fetch `no-store`.
4. **RBAC**: sidebar = gate proxy = cek in-route. Pesan & manajemen user = super_admin; settings/profile/organization = super_admin (mutasi); content = editor+.

## 5. Hasil pengujian (bukti)

- `npx tsc --noEmit` → bersih. `npm run build` → sukses 57 halaman (warning Better Auth baseURL: pra-eksisting, env).
- Anonim: `GET /api/messages` → **401**; `GET /api/school-data` → `messages: []`, `users: []`, programs/facilities hanya `published`; `POST /api/messages` → **401**; `POST /api/contact` → sukses & baris tersimpan (ISO), dibersihkan setelah uji.
- `/program/slug-palsu` → **404 HTTP**; `/program/tpa-yazzakka` → 200 dengan konten & `<title>` server-rendered dari DB.
- Editor: `GET /api/messages` → **403**; `GET /admin/settings/seo` → **307 → /admin**; school-data tanpa messages/users.
- super_admin: `GET /api/messages` → 200 berisi data; school-data lengkap (messages 1, users 4).
- Browser E2E (`/kontak`): form terisi → kirim → toast sukses → baris ada di staging → dibersihkan.
- Kebersihan data uji: baris QA dihapus dari staging **dan** production DB (satu baris uji sempat masuk production karena `next start` memuat `.env.production.local` — sudah dihapus, dicatat sebagai kehati-hatian deploy: gunakan `.env.local`/`npm run env:staging` saat QA lokal).

## 6. Risiko tersisa & rekomendasi

1. **F21** — unifikasi media (base64 → R2/kind) butuh keputusan desain terpisah.
2. **F18** — nav hardcode slug program; pertimbangkan render dari DB saat rebuild landing.
3. **`/berita/[slug]` soft-404** — `berita/loading.tsx` membuat `notFound()` ter-stream dengan status 200 (pola sama yang sudah diperbaiki di `/program`). `noindex` sudah diset, tapi jika ingin 404 HTTP asli: pindahkan/hapus `loading.tsx` level `/berita` (pra-eksisting, di luar scope kali ini).
4. **Rate limit `/api/contact`** — endpoint anonim kini berfungsi; tambahkan throttling sebelum produksi ramai.
5. **Deploy**: jalankan `node scripts/migrate-hero.mjs` ke branch Neon **production** saat merge staging→main (kolom `hero` belum ada di production — PUT profil akan error tanpa ini).
6. Tidak ada test suite; pertimbangkan smoke test `node:test` untuk endpoint kritis (F23).
