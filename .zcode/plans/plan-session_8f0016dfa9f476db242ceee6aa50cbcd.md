# Fitur Berita End-to-End (rework fitur existing)

**Konteks:** Fitur berita sudah ada tapi primitif (konten teks polos, textarea, gambar base64, status draft/published saja, tanpa SEO, tanpa storage). Ini rencana upgrade menyeluruh sesuai spesifikasi, dengan keputusan Anda: **tetap raw SQL** (tanpa Prisma), **R2 dengan kredensial dari Anda**, **workflow dipetakan ke role existing** (editor = Author, super_admin = Editor+Admin).

## 1. Evolusi skema — `scripts/migrate-news.mjs` (additif, idempotent, dijalankan per branch Neon)

- Tabel baru `categories` (id, name, slug UNIQUE, created_at) + seed 5 kategori hardcoded existing + backfill `articles.category_id` dari kolom teks `category`.
- `articles` kolom baru: `author_id` (users.id Better Auth, nullable untuk data lama), `content_doc JSONB` (Tiptap JSON; baris lama tetap pakai `content` teks), `published_at TIMESTAMPTZ` (backfill dari `published_date` via JS, skip yang gagal parse), `cover_media_id` (FK media_items, nullable). Index: status, published_at, category_id, author_id. Kolom `status` TEXT tanpa CHECK → nilai baru `pending_review`/`archived` tidak perlu DDL.
- `media_items` kolom baru: `storage_key` (kunci objek R2; baris lama NULL = entri registry URL), `mime_type`, `size_bytes`, `kind` ('image'|'document'), `visibility` ('public'|'private'), `uploaded_by`.
- Tabel baru `article_attachments` (id, article_id FK CASCADE, media_id FK, created_at) — metadata file tetap di `media_items`, jadi guard "file masih dipakai" dicek di satu tempat.
- Prosedur: `npm run env:staging` → `node scripts/migrate-news.mjs`, nanti sama di production. Didokumentasikan di panduan.

## 2. Object storage R2 (`src/lib/storage/r2.ts` + route handlers)

- Deps baru: `@aws-sdk/client-s3`, `zod`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder` (verifikasi versi Tiptap terkini saat instalasi).
- Env baru: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL` (opsional), `NEWS_MAX_IMAGE_MB` (default 5), `NEWS_MAX_DOC_MB` (default 10) + `.env.example` baru.
- `POST /api/uploads`: wajib sesi (editor/super_admin), multipart, validasi server: allowlist ekstensi + **magic bytes** (gambar: jpeg/png/webp/gif; dokumen: pdf/docx), batas ukuran, nama kunci unik `news/{yyyy}/{mm}/{uuid}-{nama-bersih}` → PutObject → INSERT `media_items`. Upload gagal → error toast, **tanpa** node/record dibuat. Tanpa env R2 → 503 pesan jelas (tidak pura-pura sukses).
- `GET /api/files/[...key]`: streaming download; file private (artikel belum terbit) wajib sesi; file publik bisa diunduh tanpa login. Jika `R2_PUBLIC_BASE_URL` diisi, file publik dilayani langsung dari domain itu.
- `DELETE /api/media/[id]` ditulis ulang: tolak penghapusan bila masih direferensikan (cover, attachment, atau muncul di `content_doc` — scan `::text`).

## 3. Service layer + API (auth di dalam handler, bukan hanya proxy)

- `src/lib/news/service.ts` (server-only): semua query Neon + mapper camelCase (mapper dipindah dari `api/school-data/route.ts` ke `src/lib/news/mappers.ts`, school-data tetap bekerja untuk widget landing).
- `src/lib/news/schemas.ts` (zod): payload berita — judul wajib, field opsional benar-benar NULL (bukan string kosong), validasi struktur dokumen Tiptap (type:'doc', punya konten bermakna).
- Matrix izin (diverifikasi dari sesi, `author_id` SELALU dari sesi):
  - **editor**: buat berita (own), edit miliknya saat draft/pending_review, simpan draft, kirim untuk ditinjau; menyimpan berita sendiri yang sudah terbit → otomatis jadi `pending_review` (re-review).
  - **super_admin**: semua + terbitkan (set `published_at` sekali), arsipkan, hapus (editor boleh hapus draft sendiri), kelola kategori.
- Route: `GET/POST /api/articles` (GET: `?q&category&status&page&scope` — paginasi DB, scope public hanya `published`), `GET/PUT/DELETE /api/articles/[id]`, `POST /api/articles/[id]/transition`, `GET/POST /api/categories`, `PUT/DELETE /api/categories/[id]` (tolak hapus jika dipakai). Slug unik (constraint existing + suffix otomatis). Setelah publish/update/delete → `revalidatePath('/berita')` + slug terkait.

## 4. Halaman publik (server components + SEO)

- `/berita` → server component: searchParams `?q&kategori&page`, query paginasi DB (9/halaman, hanya published), kartu responsif dengan **semantic tokens** (halaman existing memakai hex terlarang — ikut dirapikan), placeholder sampul konsisten saat kosong, filter kategori (link), pencarian via GET form, kontrol paginasi, `loading.tsx`, `EmptyState`, `generateMetadata` + canonical.
- `/berita/[slug]` → server component: `notFound()` bila bukan published; `generateMetadata` dari seoTitle/seoDescription/excerpt + Open Graph (type article, publishedTime, gambar sampul) + canonical. Render via **renderer Tiptap bertipe** (`src/components/news/render-doc.tsx`) — tanpa `dangerouslySetInnerHTML`; sanitasi href (hanya http/https/mailto/relatif), gambar hanya dari storage key yang dikenal, alt + caption. Artikel lama (teks polos) → fallback `whitespace-pre-line`. Bagian lampiran hanya muncul bila ada; tautan kembali ke /berita.

## 5. Admin CMS (rute baru sesuai spesifikasi)

- `/admin/berita` (list, client component): tabel judul/kategori/penulis/status Badge/tanggal, pencarian, filter status (Tabs) + kategori, paginasi DB, aksi per baris via DropdownMenu (Kirim tinjau / Terbitkan / Arsipkan / Set draft — sesuai role), Hapus via Modal konfirmasi (pola `users/page.tsx`), toast sukses/gagal, skeleton loading. Entri sidebar "Berita & Artikel" diarahkan ke sini; `/admin/content/berita` dihapus + redirect ke `/admin/berita`.
- `/admin/berita/baru` & `/admin/berita/[id]/edit` → shared `NewsEditorForm`: judul, slug otomatis (editable + cek unik), ringkasan, kategori (kelola kategori untuk super_admin), sampul via MediaPicker (pilih dari library / unggah baru), **Tiptap editor** (H2/H3, bold/italic, list, blockquote, link, undo/redo, sisip/hapus gambar dengan alt+caption; upload gagal tidak menyisipkan node), lampiran PDF/DOCX (tambah/hapus terpisah), SEO opsional, tombol status sesuai role, guard unsaved-changes. Tanpa autosave di fase ini (dicatat di docs).
- `/admin/berita/[id]/pratinjau`: server component (sesi via proxy /admin), render dengan renderer publik + banner "Pratinjau — belum terbit".

## 6. Dokumentasi & pengujian

- `docs/PANDUAN-FITUR-BERITA.md`: prosedur migrasi per branch Neon, setup R2 (bucket, token, CORS, env), cara jalan lokal, matrix role, checklist 19 skenario uji spesifikasi §14.
- Update `docs/AKUN-TESTING.md`: skenario alur berita (draft→review→publish, ownership, dll).
- Verifikasi: `npx tsc --noEmit`, `npm run build`, lalu **uji GUI browser** di staging dengan akun dari AKUN-TESTING.md: teks-saja bisa terbit, draft tak terlihat publik, konten Tiptap utuh after reload, upload/ganti/hapus sampul, gambar inline di posisi kursor, PDF/DOCX unduh, file terlarang/oversize ditolak, editor tak bisa edit milik orang lain, anonim ditolak di dashboard, slug unik, tampilan rapi tanpa gambar/kategori/lampiran, guard hapus media terpakai. **Anda perlu memasukkan kredensial R2 ke `.env.local` sebelum sesi uji upload.**
- Laporan akhir: ringkasan file, hasil uji, daftar konfigurasi yang butuh tindakan manual Anda.

## Urutan kerja
Deps & env → skrip migrasi + jalankan di staging → service/zod/API → storage R2 → admin + Tiptap → publik + SEO + revalidasi → tsc/build → uji GUI end-to-end → docs.