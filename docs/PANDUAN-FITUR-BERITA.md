# Panduan Fitur Berita (Warta & Publikasi)

Fitur berita end-to-end: halaman publik ber-SEO, dashboard CMS dengan rich
text editor (Tiptap), workflow draft → tinjau → terbit → arsip, unggahan
gambar/dokumen ke Cloudflare R2, dan lampiran dokumen. Menyreplaced modul
lama `/admin/content/berita` (URL lama dialihkan otomatis).

## Ringkasan arsitektur

| Lapisan | Lokasi | Catatan |
|---|---|---|
| Migrasi skema | `scripts/migrate-news.mjs` | Additif + idempotent, dijalankan per branch Neon |
| Data access | `src/lib/news/service.ts` | Raw SQL via Neon driver (`sql.query`), izin diperiksa di sini |
| Validasi | `src/lib/news/schemas.ts` | Zod + validator dokumen Tiptap + util teks |
| Auth helper | `src/lib/news/api-helpers.ts` | Sesi/role di dalam setiap route handler |
| Object storage | `src/lib/storage/r2.ts`, `file-validation.ts` | R2 S3-compatible; magic bytes + allowlist |
| API | `src/app/api/articles`, `categories`, `uploads`, `files`, `media` | |
| Publik | `src/app/berita`, `src/app/berita/[slug]` | Server components + `generateMetadata` |
| Admin | `src/app/admin/berita*` | List / baru / edit / pratinjau |
| Komponen | `src/components/news/*`, `src/components/admin/news/*` | Renderer + Tiptap + form |
| Tipe | `src/lib/news/types.ts` | Re-export via `src/lib/types.ts` |

## Peran & workflow

Repo hanya mengenal dua role (Better Auth, kolom `users.role`); workflow
spesifikasi Author/Editor/Admin dipetakan tanpa menambah role baru:

| Kemampuan | editor (= Author) | super_admin (= Editor + Admin) |
|---|---|---|
| Membuat berita | ✅ | ✅ |
| Mengedit | hanya miliknya | semua |
| Simpan draf / kirim untuk ditinjau | ✅ | ✅ |
| Menerbitkan (publish) | ❌ | ✅ |
| Mengarsipkan / kembali ke draf | miliknya (pending_review) | ✅ |
| Menghapus | draf miliknya saja | semua |
| Mengelola kategori | ❌ | ✅ |
| Berita unggulan (featured) | ❌ | ✅ |

Aturan tambahan yang ditegakkan di server (`service.ts`):

- `author_id` SELALU diambil dari sesi, tidak pernah dari body request.
- Editor menyimpan beritanya yang sudah **terbit/arsip** → status otomatis
  kembali ke `pending_review` (re-review).
- Status: `draft`, `pending_review`, `published`, `archived`. Hanya
  `published` yang tampil di halaman publik.
- Publikasi pertama kali mencatat `published_at` (dipertahankan saat
  publish ulang).

## Skema database

Perubahan bersifat **additif** terhadap tabel `articles` yang sudah ada:

- `categories` (baru): `id`, `name`, `slug` UNIQUE, `created_at`. Seed 5
  kategori lama; `articles.category_id` di-backfill dari kolom teks
  `category`.
- `articles` kolom baru: `author_id`, `content_doc JSONB` (Tiptap JSON),
  `published_at TIMESTAMPTZ` (backfill dari `published_date`), 
  `cover_media_id`, `category_id` + index.
- `media_items` kolom baru: `storage_key` (kunci objek R2; NULL = entri
  registry URL lama), `mime_type`, `size_bytes`, `kind`
  (`image`/`document`), `visibility` (`public`/`private`), `uploaded_by`.
- `article_attachments` (baru): relasi artikel ↔ media lampiran
  (`ON DELETE CASCADE` dari artikel).

Kolom lama (`content` teks polos, `cover_image`, `category`, `author`,
`published_date`) tetap dipelihara untuk kompatibilitas artikel lama dan
widget landing (`/api/school-data` kini hanya mengirim artikel
**published** tanpa isi dokumen).

## Menjalankan migrasi (per branch Neon)

Branching Neon: git `staging` → Neon `staging`, git `main` → Neon
`production`. Tidak ada sistem migrasi otomatis — jalankan skrip per branch:

```bash
npm run env:staging      # pasang .env.local branch staging
node scripts/migrate-news.mjs

npm run env:production   # ganti ke branch production (hati-hati!)
node scripts/migrate-news.mjs
```

Skrip aman dijalankan berulang (semua `IF NOT EXISTS` / idempotent) dan
tidak pernah menghapus kolom/tabel lama. Sudah diterapkan di branch **staging** dan **production** pada 2026-10-22.

## Setup Cloudflare R2 (unggahan berkas)

1. Buat bucket R2 (mis. `yazzaka-media`) di dashboard Cloudflare.
2. R2 → **Manage API Tokens** → buat token dengan izin Object Read & Write
   pada bucket tersebut → catat Access Key ID + Secret.
3. Account ID ada di halaman utama R2 (atau kanan atas dashboard).
4. (Opsional, disarankan) Aktifkan **Public R2.dev URL** atau custom domain
   untuk bucket → isi `R2_PUBLIC_BASE_URL` agar berkas publik dilayani
   langsung dari R2, bukan lewat `/api/files`.
5. Isi `.env.local` (lihat `.env.example`):

```
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=yazzaka-media
R2_PUBLIC_BASE_URL=       # opsional
NEWS_MAX_IMAGE_MB=5       # opsional, default 5
NEWS_MAX_DOC_MB=10        # opsional, default 10
```

Tanpa variabel R2, `/api/uploads` menolak unggahan dengan pesan jelas
(HTTP 503) — fitur teks berita tetap berfungsi penuh.

**⚠️ Status pengujian unggahan: belum diuji end-to-end** karena kredensial
R2 belum tersedia saat pengembangan. Jalankan kembali skenario unggahan
(sampul, gambar inline, lampiran, unduh lampiran publik) setelah kredensial
diisi.

### Model visibility berkas

- Berkas baru diunggah sebagai `private`.
- Saat artikel **diterbitkan**, semua media yang dirujuknya (sampul,
  gambar inline, lampiran) otomatis menjadi `public`; saat kembali ke
  draf/arsip → `private` lagi.
- Berkas publik dengan `R2_PUBLIC_BASE_URL` → URL langsung R2; selain itu
  dilayani `/api/files/<key>` yang memeriksa visibility (berkas privat
  butuh sesi staff).
- Hapus berkas dari library ditolak (HTTP 409) bila masih dipakai artikel
  mana pun (sampul, lampiran, atau muncul di `content_doc`).

## Menjalankan proyek secara lokal

```bash
npm install
cp .env.example .env.local   # lalu isi kredensial
npm run env:staging          # pilih branch Neon staging
node scripts/migrate-news.mjs
npm run dev
```

Akun uji: lihat `docs/AKUN-TESTING.md`.

## Struktur konten artikel

- `content_doc` (JSONB) menyimpan dokumen Tiptap; editor mendukung
  paragraf, H2/H3, bold/italic, list, blockquote, tautan, undo/redo,
  gambar inline (alt + caption), dan pratinjau.
- `content` (teks) diisi otomatis sebagai turunan plaintext untuk
  pencarian/SEO/fallback render artikel lama.
- Field opsional (`excerpt`, `categoryId`, sampul, lampiran, SEO) benar
  benar disimpan `NULL`/kosong saat tidak diisi — artikel teks-saja tetap
  bisa diterbitkan.
- Slug otomatis dari judul, unik (suffix `-2`, `-3`, …), dapat diedit
  manual; perubahan slug otomatis membatalkan cache URL lama.
- `read_time` dihitung otomatis (~200 kata/menit).

## SEO & cache halaman publik

- `/berita` — server component, paginasi DB (9/halaman), pencarian `?q=`,
  filter kategori `?kategori=<slug>`, `loading.tsx` + `error.tsx`.
- `/berita/[slug]` — `generateMetadata` dari `seo_title`/`seo_description`
  → fallback excerpt, canonical, Open Graph `type=article` +
  `publishedTime` + gambar sampul. Konten Tiptap dirender via renderer
  React bertipe (tanpa `dangerouslySetInnerHTML`; protokol tautan
  dibatasi `http/https/mailto/relatif`).
- Setiap perubahan artikel (publish/update/delete) memanggil
  `revalidatePath('/berita')` + path slug terkait.

## API ringkas

| Endpoint | Akses | Fungsi |
|---|---|---|
| `GET /api/articles?scope=public&q&kategori&page` | publik | hanya published |
| `GET /api/articles?scope=admin&status&q&category&page` | staff | semua status |
| `POST /api/articles` | staff | buat (`status` dibatasi role) |
| `GET/PUT/DELETE /api/articles/[id]` | staff | detail / simpan / hapus |
| `POST /api/articles/[id]/transition` | staff | `submit`/`publish`/`archive`/`revert_to_draft` |
| `GET /api/articles/slug-check?slug=` | staff | cek keunikan slug |
| `GET /api/categories` | publik | daftar + jumlah artikel terbit |
| `POST/PUT/DELETE /api/categories/[id]` | super_admin | kelola kategori |
| `POST /api/uploads` (multipart `file`) | staff | unggah ke R2 |
| `GET /api/files/<key>` | publik/private | unduh berkas |
| `DELETE /api/media/[id]` | staff | hapus berkas (guard pemakaian) |

## Checklist pengujian (peta skenario)

Skenario GUI telah diuji di staging (lihat `docs/AKUN-TESTING.md` bagian
"Alur Berita"). Yang **belum** terverifikasi end-to-end:

1. Unggahan nyata ke R2 (butuh kredensial): sampul, gambar inline di
   posisi kursor + bertahan setelah reload, lampiran PDF/DOCX diunggah
   dan diunduh publik, berkas terlarang/oversize ditolak di GUI.
2. Penghapusan berkas library yang masih dipakai → guard 409 (teruji di
   level query, belum di GUI).
3. Deployment production (branch Neon `production` belum dimigrasi —
   jalankan `node scripts/migrate-news.mjs` setelah merge ke `main`).
