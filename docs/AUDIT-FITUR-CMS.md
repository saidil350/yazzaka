# Rangkuman Audit Fitur CMS Panel

> **Tujuan:** Daftar sub-fitur CMS Panel yang dinilai kurang berguna, beserta alasan dan status tindak lanjut.
> **Basis audit:** Pemeriksaan kode (konsumsi data publik vs admin-only) dan pengujian fungsional pada refactor UI Oktober 2026.
> **Tanggal audit:** 2026-10-22 · **Eksekusi:** 2026-10-22 (item 1.1–1.4, 2.1, 2.2 selesai)

---

## 1. Rekomendasi Dihapus / Direvisi — ✅ TEREKSEKUSI

### 1.1 Tombol "Reset Data Demo" di topbar — ✅ DIHAPUS
- **Lokasi:** `src/components/admin/AdminTopbar.tsx`.
- **Temuan:** `resetToDefault()` ternyata no-op (hanya `console.warn`, sebelumnya di `SchoolDataContext.tsx:480`).
- **Eksekusi:** Tombol + handler + import `RotateCcw` dihapus; `resetToDefault` ikut dibersihkan dari interface, implementasi, dan provider value `SchoolDataContext.tsx`.

### 1.2 Halaman `/admin/organization/struktur` — ✅ DIHAPUS
- **Temuan:** Halaman read-only (bukan editor), tidak tertaut dari mana pun, data sama dengan halaman Tim yang punya CRUD penuh.
- **Eksekusi:** Folder `src/app/admin/organization/struktur/` dihapus. API organization tetap (dipakai halaman Tim).

### 1.3 Tombol collapse sidebar ganda — ✅ DIHAPUS
- **Eksekusi:** Toggle di topbar dihapus beserta props `isCollapsed`/`onToggleCollapse`; satu toggle di header sidebar tetap.

### 1.4 Badge "Live Sync" & eyebrow dekoratif Dashboard — ✅ DIHAPUS
- **Temuan:** Badge Live Sync dan eyebrow ber-ikon Sparkles murni dekoratif. Kartu KPI, shortcut modul, dan kartu profil terverifikasi fungsional (Link + data real) sehingga dipertahankan.
- **Eksekusi:** Badge + eyebrow + import `Sparkles` dihapus dari `src/app/admin/page.tsx`.

---

## 2. Verifikasi Lanjutan — ✅ TEREKSEKUSI

### 2.1 Inkonsistensi bell notifikasi — ✅ Bell disembunyikan untuk editor
- **Temuan:** Bell tampil untuk semua role, tapi menu "Pesan Masuk" hanya super_admin; server-side `/admin/settings/pesan` sebenarnya terbuka untuk editor (proxy hanya membatasi `/admin/users`).
- **Keputusan:** Konsisten dengan RBAC terdokumentasi (AKUN-TESTING.md: editor = konten saja).
- **Eksekusi:** Bell di topbar dan alert "Kotak Masuk Baru" di Dashboard kini hanya tampil untuk super_admin. (Catatan: pembatasan server-side untuk `/admin/settings/pesan` belum ada — lihat bagian 5.)

### 2.2 Tiga halaman `/admin/pages/*` kecil — ✅ DISELESAIKAN
- **`pages/program`** — ✅ DIHAPUS. Rusak: judul header tidak pernah tersimpan, malah menimpa `metaDescription` global (field SEO), dan tidak ada halaman publik yang memakainya.
- **`pages/tentang-kami`** — ✅ DIHAPUS. Duplikat penuh: `vision` diedit di Visi & Misi; `description` + `welcomeMessage` diedit di Profil & Slogan.
- **`pages/kontak`** — ✅ DIGABUNG lalu DIHAPUS. Field `address`, `city`, `province`, `mapsEmbedUrl` dipindahkan ke **Settings › Kontak & Sosmed** (`/admin/settings/contact`) sehingga menjadi satu editor kontak lengkap; semua field tetap live di halaman `/kontak` publik.

---

## 3. Ternyata Fungsional — JANGAN Dihapus

| Fitur | Bukti konsumsi |
|---|---|
| Media Library | Halaman publik `/galeri` merender langsung dari data media |
| Modul Kegiatan (events) | Dipakai halaman `/agenda` dan section "News & Events" di landing page |
| Pengaturan warna (Settings › General) | Meng-override `--color-primary`/`--color-accent` secara live via `SchoolDataContext` |

**Catatan untuk pengaturan warna:** fungsional, tetapi berisiko terhadap konsistensi identitas visual Yazzakka. Pertimbangkan membatasi pilihan palet, bukan menghapus fiturnya.

---

## 4. Status Eksekusi

| # | Item | Status |
|---|---|---|
| 1 | Hapus tombol Reset Data Demo (+ `resetToDefault` dari context) | ✅ |
| 2 | Hapus halaman Struktur Organisasi | ✅ |
| 3 | Rapikan bell per-role (+ alert Dashboard) | ✅ |
| 4 | Satu tombol collapse sidebar | ✅ |
| 5 | Hapus badge Live Sync + eyebrow dekoratif | ✅ |
| 6 | Audit halaman "Atur Seksi" kecil | ✅ (2 dihapus, 1 digabung) |

---

## 5. Sisa Temuan — Belum Ditindaklanjuti (perlu keputusan terpisah)

1. **Halaman admin yatim lain:** `/admin/content/kegiatan`, `/admin/settings/general`, `/admin/settings/social` punya route tetapi tidak ada di menu sidebar. Kegiatan (events) justru fungsional untuk situs publik — kemungkinan justru perlu **ditambahkan** ke menu, bukan dihapus.
2. **Celah keamanan (di luar cakupan UI):** proxy tidak memerlukan sesi untuk method GET — `GET /api/messages` dan `GET /api/school-data` mengembalikan pesan (dengan PII) dan tabel users ke pengunjung anonim. Selain itu `/admin/settings/pesan` dan mutasi `/api/messages` hanya butuh sesi (editor masih bisa akses via URL langsung). Layak ditangani sebagai tiket keamanan tersendiri.
