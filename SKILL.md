---
name: landing-page-yazzaka
description: Landing page publik + CMS admin Yayasan Yazzakka Aceh (Next.js 16, shadcn/ui, Neon Postgres)
---

# landing-page-yazzaka

Skill untuk pekerjaan pada repo website Yayasan Bina Iman Akhlak Yazzakka.

## Kapan digunakan

Saat mengubah situs publik (`src/app/(public)`), CMS admin (`src/app/admin`), API (`src/app/api`), skrip database (`scripts`), atau setup environment Neon.

## Aturan penting

1. Baca `AGENTS.md` dulu — berisi aturan komponen UI (stock shadcn/ui only) dan verifikasi build.
2. Pengembangan di branch `staging` (env Neon staging); rilis produksi = merge ke `main`.
3. Switch env lokal dengan `npm run env:staging` / `npm run env:production` (lihat `docs/NEON-BRANCHING.md`).
4. Verifikasi sebelum commit: `npx tsc --noEmit`, `npm run build`; uji alur lewat `docs/AKUN-TESTING.md`.
