## Hapus fitur video dari Media (admin `/admin/media` + galeri publik `/galeri`)

Video di landing page hanya muncul sebagai kartu item media bertipe `fileType: "video"` — tidak ada player/iframes di mana pun. Sumbernya: item seed `med-5` (contoh "video-profil-sekolah-2026.mp4" dengan link YouTube rickroll) yang ada di fallback client DAN di database. Rencana: hapus dukungan video seluruhnya sehingga galeri hanya menampilkan foto & dokumen.

### 1. Hapus data seed video
- `src/lib/data/initialData.ts` — hapus item `med-5` dari `initialMedia` (fallback client).
- `scripts/seed-org-media.mjs` — hapus entri `med-5` agar seed ulang tidak memunculkannya kembali.

### 2. Bersihkan baris video dari database
- Jalankan `DELETE FROM media_items WHERE file_type = 'video'` terhadap DB Neon branch **staging** (via script Node one-off memakai `DATABASE_URL` dari `.env.local` — sesuai alur branch Neon di repo ini, tanpa sistem migrasi).
- Catatan: DB production perlu cleanup yang sama saat merge/deploy nanti (atau bisa dihapus manual lewat tombol Hapus di admin).

### 3. Halaman publik `/galeri` (`src/app/galeri/page.tsx`)
- Hapus branch `fileType === "video"` pada click handler (window.open) dan pada kartu placeholder gelap "Video Dokumentasi".
- Hapus import ikon `Video` dan `ExternalLink` yang tidak terpakai.
- Ubah copy EmptyState: "Belum ada dokumentasi foto atau video..." → "Belum ada dokumentasi foto...".
- Item legacy bertipe video (jika ada yang terlewat) akan jatuh ke placeholder dokumen — aman, tidak crash.

### 4. Admin Media Manager `/admin/media` (`src/app/admin/media/page.tsx`)
- Hapus tab filter "Video", branch kartu video placeholder, dan opsi `<option value="video">` pada form tambah media.
- Hapus import ikon `Video`.
- Rapikan copy: subtitle "Pusat penyimpanan gambar, video profil, brosur PDF..." → "Pusat penyimpanan gambar, brosur PDF, dan dokumen sekolah."; label input "URL File (Link Dokumen / Video URL)" → "URL File (Link Dokumen)"; EmptyState "Unggah foto kegiatan, thumbnail video, atau berkas PDF..." → tanpa video.

### 5. Label navigasi (`src/components/public/Header.tsx`)
- "Galeri Foto & Video" → "Galeri Foto" (deskripsi biarkan sama).

### 6. Yang tidak diubah
- `MediaItem.fileType` di `src/lib/types.ts` dan kolom `file_type` di DB dibiarkan (hanya opsi video di UI yang dihapus).
- Link YouTube di `settings.socialMedia` (halaman kontak) bukan video galeri — tetap ada.

### 7. Verifikasi
- `npx tsc --noEmit` dan `npm run build`.
- Jalankan dev server + cek cepat `/galeri` dan `/admin/media` di browser: tidak ada kartu video, tab video hilang, form tidak lagi punya opsi video.