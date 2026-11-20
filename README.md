# Landing Page Yazzakka

Website publik + CMS admin untuk **Yayasan Bina Iman Akhlak Yazzakka** (Yazzakka Aceh).

## URL Live

| URL | Keterangan |
|---|---|
| [landing-page-yazzaka.vercel.app](https://landing-page-yazzaka.vercel.app) | Production utama |
| [yazzaka.vercel.app](https://yazzaka.vercel.app) | Production (Vercel project `yazzaka`, team `saidil testing`) |

> Keduanya dibangun dari commit yang sama di branch `main`. Perubahan di `staging` hanya menghasilkan *preview deployment*, tidak ikut ke produksi.

## Teknologi

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + shadcn/ui (new-york) — komponen di `src/components/ui/*`, primitif Radix via package `radix-ui`
- **Neon Postgres** (`@neondatabase/serverless`) — git branch ↔ Neon branch, lihat [docs/NEON-BRANCHING.md](docs/NEON-BRANCHING.md)
- **better-auth**, **TipTap** (editor CMS), **zod**, **embla-carousel**, **lucide-react**
- Node >= 26 (lihat `.nvmrc`)

## Struktur

```
src/app/(public)/   → situs publik: /, program, agenda, galeri, prestasi,
                      berita, donasi, tentang-kami, kontak
src/app/admin/      → CMS: berita, content, media, organization, pages,
                      settings, users (role gating super_admin vs editor)
src/app/api/        → route handlers (auth, upload, dll.)
scripts/            → migrasi DB, seed, audit, util env
docs/               → dokumentasi fitur, audit, testing
```

## Menjalankan Lokal

```bash
npm install
npm run dev          # http://localhost:3000
```

Sebelum `next build`, script `prebuild` menjalankan `scripts/validate-build-db.mjs`.

## Branch & Environment

| Git branch | Neon branch | Keterangan |
|---|---|---|
| `main` | `production` | deploy production |
| `staging` | `staging` | deploy preview / pengembangan |

Pengembangan dilakukan di `staging`, lalu di-merge ke `main` untuk rilis produksi. Switch env lokal:

```bash
npm run env:staging      # .env.local → Neon staging
npm run env:production   # .env.local → Neon production
```

Git hook (opsional, sekali per clone) otomatis mengganti env saat checkout branch:

```bash
git config core.hooksPath .githooks
```

Detail lengkap: [docs/NEON-BRANCHING.md](docs/NEON-BRANCHING.md).

## Environment Variables

Semua disimpan di file `.env.*.local` (gitignored) dan di environment variables Vercel:

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string Neon (pooled) |
| `DATABASE_URL_UNPOOLED` | Connection string Neon (direct) |
| `AUTH_SECRET` | Secret better-auth (terpisah untuk staging & production) |
| `NEXT_PUBLIC_SITE_URL` | URL kanonik situs (fallback metadata) |
| `CMS_SEED_PASSWORD` | Password default seeding akun CMS |
| `NEON_STORAGE_PUBLIC_BASE` | Base URL storage publik (gambar/media) |
| `NEWS_MAX_IMAGE_MB` / `NEWS_MAX_DOC_MB` | Batas ukuran upload berita |
| `UPLOAD_LOCAL_FALLBACK` | Fallback upload ke lokal bila storage gagal |
| `REQUIRED_SECTIONS_KEYS` | Key section wajib untuk validasi konten |

## Dokumentasi

- [docs/AKUN-TESTING.md](docs/AKUN-TESTING.md) — akun testing & skenario login CMS
- [docs/NEON-BRANCHING.md](docs/NEON-BRANCHING.md) — pemetaan branch & sinkronisasi data
- [docs/AUDIT-FITUR-CMS.md](docs/AUDIT-FITUR-CMS.md), [docs/AUDIT-KONSISTENSI-APLIKASI.md](docs/AUDIT-KONSISTENSI-APLIKASI.md), [docs/AUDIT-REBUILD-LANDING.md](docs/AUDIT-REBUILD-LANDING.md) — audit fitur
- [docs/PANDUAN-FITUR-BERITA.md](docs/PANDUAN-FITUR-BERITA.md) — fitur berita

## Verifikasi Sebelum Commit

```bash
npx tsc --noEmit     # type check
npm run lint         # eslint
npm run build        # build produksi
```

Repo ini tidak punya test suite — verifikasi alur lewat browser mengikuti [docs/AKUN-TESTING.md](docs/AKUN-TESTING.md).
