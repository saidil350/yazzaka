# Rencana: Hubungkan Sisa Konten Static ke Neon DB

Hasil audit: semua tab sidebar yang ada sudah terkoneksi DB. Yang dikerjakan (sesuai pilihan Anda): (A) tambah tab yang hilang ke sidebar, (B) fix risiko data-loss 3 halaman, (C) buat Hero & WhyUs editable dari CMS.

## A. Tambah tab yang hilang ke sidebar — `src/components/admin/AdminSidebar.tsx`

Edit array `navGroups` saja (semua halaman target sudah ada & terkoneksi DB):

- Grup **Konten Landing Page**: tambah `{ label: "Hero Beranda", href: "/admin/content/hero" }` (halaman baru, bagian C) dan `{ label: "Agenda & Kegiatan", href: "/admin/content/kegiatan" }` (sudah ada).
- Grup **Identitas & Kontak**: tambah `{ label: "Branding & Warna", href: "/admin/settings/general" }` dan `{ label: "Media Sosial", href: "/admin/settings/social" }` (keduanya sudah ada). Ganti label "Kontak & Sosmed" → "Kontak & Lokasi" (halaman contact tidak mengelola sosmed).

## B. Fix risiko data-loss 3 halaman (pola `useEffect` re-sync seperti halaman Kontak)

- `src/app/admin/organization/profil/page.tsx` — tambah `useEffect([profile])` yang me-resync 13 state form.
- `src/app/admin/organization/visi-misi/page.tsx` — `useEffect([profile])` untuk `vision` + `missionList`.
- `src/app/admin/organization/tim/page.tsx` — `useEffect([sections])` untuk `sectionTitle`/`sectionSubtitle`.

## C. Hero & WhyUs editable dari CMS

**C.1. Migrasi DB** — skrip baru `scripts/migrate-hero.mjs` (idempoten, DATABASE_URL dibaca dari env, BUKAN di-hardcode):
- `ALTER TABLE school_profile ADD COLUMN IF NOT EXISTS hero JSONB DEFAULT '{}'` — mengikuti pola kolom `branding`/`values` yang sudah ada.
- Seed `values` (nilai Why Us) dengan 6 item yang sekarang hardcoded, hanya jika `values IS NULL OR values = '[]'`.
- Jalankan ke branch Neon **staging** sekarang. Branch **production** dijalankan saat merge staging→main (dicatat di ringkasan akhir — tidak ada sistem migrasi otomatis di repo ini).

**C.2. Tipe & data** — `src/lib/types.ts`: interface `HeroContent { eyebrow, headline, body, imageUrl, badges: string[] }`; `SchoolProfile.hero: Partial<HeroContent>`. `src/lib/data/initialData.ts`: konstanta `DEFAULT_HERO` berisi konten Hero yang sekarang hardcoded (jadi fallback = tampilan saat ini), dan `initialSchoolProfile.hero = DEFAULT_HERO`.

**C.3. API** — `src/app/api/school-data/route.ts` (`mapProfile`: tambah `hero: r.hero ?? {}`) dan `src/app/api/profile/route.ts` (PUT: `if (body.hero) ... SET hero = ${JSON.stringify(body.hero)}::jsonb`, pola yang sama dengan `values`/`branding`).

**C.4. Halaman admin baru** `src/app/admin/content/hero/page.tsx` (client component, mengikuti struktur halaman konten lain):
- Form: eyebrow, headline, body (textarea), imageUrl (`ImageUpload`), badges (daftar string tambah/hapus, pola daftar misi).
- Simpan via `updateProfile({ hero })`, **dengan** `useEffect` re-sync dari awal (poin B).

**C.5. Editor Nilai (Why Us)** — tambah Card di `/admin/organization/visi-misi` (label sidebar jadi "Visi, Misi & Nilai"): daftar item `{title, description}` dengan tambah/edit (Modal, pola halaman tim)/hapus, simpan via `updateProfile({ values })`.

**C.6. Komponen publik:**
- `src/components/public/HeroSection.tsx`: `const hero = { ...DEFAULT_HERO, ...profile.hero }`, ganti teks eyebrow/headline/badges/gambar yang hardcoded dengan field hero. Chip dekoratif di atas foto dibiarkan statis (di luar scope). Headline dirender teks biasa (span "Qur'ani" bergaris wavy dihapus karena teks kini editable).
- `src/components/public/WhyUsSection.tsx`: tidak berubah (sudah baca `profile.values`); fallback hardcoded dipertahankan sebagai pengaman.

## Verifikasi

1. `npx tsc --noEmit` dan `npm run build`.
2. Jalankan `node scripts/migrate-hero.mjs` ke staging DB, lalu test browser sesuai `docs/AKUN-TESTING.md`: login admin, edit Hero & Nilai dari CMS → cek landing page berubah; cek 3 tab baru di sidebar; cecek halaman publik `/agenda` tetap jalan.
3. Ingatkan: jalankan migrasi yang sama ke production DB saat merge ke main (branch Neon drift — tanpa ini kolom `hero` tidak ada di production dan API PUT akan error).

Sesuai AGENTS.md, sebelum menulis kode saya cek dulu guide relevan di `node_modules/next/dist/docs/`, dan hanya pakai komponen `ui/*` stock + token semantik.