# Murnikan semua badge ke stock shadcn/ui

Pengguna memilih scope **semua elemen badge** (komponen `<Badge>` + semua pill div/span yang secara visual berperan sebagai badge). Pertanyaan gaya dilewati — saya pakai penilaian terbaik: **full stock** (varian bawaan `default`/`secondary`/`outline`, `rounded-md` bawaan, token semantik), sesuai semangat "murni shadcn ui" dan aturan AGENTS.md.

## Aturan konversi

- `<Badge>`: hapus semua override `rounded-full`, `bg-stone-*`, hex, `text-[9px]/[10px]/[11px]`, `uppercase tracking-*`, `shadow-*`, `font-bold/extrabold/black`. Pakai varian stock saja.
- Kelas **fungsional** yang dipertahankan: posisi (`absolute top-3 left-3`, `mb-3`), layout (`shrink-0`, `gap-*`, `w-fit`, `hidden sm:inline-flex`), `ml-2`.
- Overlay di atas foto: `bg-background/95 backdrop-blur-xs text-foreground` (semantik) — bukan `bg-white/95 text-[#1E2330]`.
- Eyebrow pill (10x string identik): `<Badge variant="secondary">` tanpa override warna; ukuran `text-xs` bawaan.
- Pill div/span custom di halaman publik → diganti `<Badge>` dengan varian stock (orange `#FA6400` → `default` teal primary; green/purple/blue/yellow pill info → `secondary`/`outline`, warna kustom dihapus).
- Filter pill buttons (program/fasilitas/galeri/prestasi/agenda): ganti jadi `<Button variant="outline" size="sm">` (aktif → `default`). Ini tombol interaktif, varian stock Button yang benar.
- `AdminSidebar` count bubble (`ml-2 h-5 min-w-5 rounded-full px-1.5 tabular-nums`): ini pola resmi shadcn sidebar count-badge — **dipertahankan**.
- `admin/settings/general/page.tsx`: cek import Badge tanpa pemakaian → hapus import jika benar tidak terpakai.
- Status badge admin (`bg-success-bg text-success border-success/20` di pendaftaran admin): token semantik sudah oke, biarkan.

## File yang diedit

Komponen publik: HeroSection, Header, Footer, NewsAndEvents, AchievementsSection, FacilitiesSection, TestimonialsSection, AdmissionCTA, ProgramsSection, EditorialAbout, WhyUsSection.
Halaman: pendaftaran, program, program/[slug], fasilitas, galeri, agenda, berita, prestasi, kontak, tentang-kami, login.
Admin: content/program (count chips `text-[10px]` → default), content/pendaftaran (`text-[10px]` chips → default), settings/general (import), AdminSidebar (tidak diubah).

## Verifikasi

- `npx tsc --noEmit` dan `npm run build`.
- Grep pascaperubahan: tidak ada lagi `stone-`, hex `#FA6400`/`#FFF0E5`/`#E8E2D8`/`#FAF6EE`/`#1E2330`, `text-[9px]`/`text-[10px]`/`text-[11px]`, `rounded-full` pada elemen badge/pill (kecuali count bubble sidebar & elemen non-badge yang sah seperti avatar).
- Verifikasi visual halaman publik utama via dev server bila tersedia.