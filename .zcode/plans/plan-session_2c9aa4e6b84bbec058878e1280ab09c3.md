# Redesign Dashboard CMS ke shadcn/ui Murni (Konversi Penuh)

Keputusan user: **semua `src/components/ui/*` dikonversi ke stock shadcn/ui** dan **radius global diubah ke 0.625rem** — visual landing site ikut berubah. Identitas warna dipertahankan lewat token: background cream, `--primary` teal `#057984`, `--accent` orange `#EE6D2B`. Tidak ada perubahan business logic, route, API, auth, atau konten Indonesia.

## Fase 1 — Tambah 5 komponen stock shadcn (file baru)

Ditulis gaya shadcn new-york terbaru, import dari monolith `radix-ui` (pola sama seperti `ui/label.tsx`), **tanpa** kelas animasi `animate-in` (plugin tw-animate tidak terpasang — dropdown/sheet tetap statis & prediktabel):

- `src/components/ui/alert.tsx` (+ AlertTitle, AlertDescription)
- `src/components/ui/avatar.tsx` (Radix Avatar)
- `src/components/ui/breadcrumb.tsx` (tanpa Radix, compound standar)
- `src/components/ui/dropdown-menu.tsx` (Radix DropdownMenu)
- `src/components/ui/sheet.tsx` (Radix Dialog, side left/right)

## Fase 2 — Konversi primitives ke stock (API kompatibel)

- **`button.tsx`** → cva stock shadcn (`bg-primary text-primary-foreground` = teal, outline/secondary/ghost/link/destructive berbasis token, tanpa hard-shadow/translate/hex kustom). Kompatibilitas yang wajib dipertahankan: `variant="accent"` (dipakai 8 halaman admin — restyle ke `bg-accent` orange token), prop `isLoading`, `size="icon-sm"`. Dihapus: varian `mint/lilac/sky` dan `size="xl"` (0 pemakai). Konsekuensi disetujui user: CTA landing berubah dari pill orange ber-shadow jadi tombol teal stock.
- **`switch.tsx`** → Switch stock Radix (prop `checked/onCheckedChange/disabled/id/aria-label`). Call-site `admin/pages/beranda/page.tsx:90` yang mengirim `label=` diganti pasangan `Switch` + `<Label htmlFor>` (edit 1–2 baris).
- **`separator.tsx`** → versi stock (tidak ada konsumen saat ini, aman).

## Fase 3 — Token radius global (`globals.css`)

Ganti blok radius (baris 87–92 dan duplikat `.dark` baris 123) dari skala 1.5rem ke standar shadcn v4:
`--radius: 0.625rem; --radius-sm: calc(var(--radius) - 4px); --radius-md: calc(var(--radius) - 2px); --radius-lg: var(--radius); --radius-xl: calc(var(--radius) + 4px);` (pertahankan `--radius-full`). Palet warna, font (Plus Jakarta Sans/Newsreader), dan kelas landing-only (`.btn-headspace-*`, `.landing-surface`, keyframes) tidak disentuh.

## Fase 4 — Restyle internal komponen custom lainnya (API & JSX tak berubah)

Hanya ganti styling internal ke token semantik, tanpa mengubah API konsumen: `table.tsx` (hapus hex cream kustom), `select.tsx`, `tabs.tsx`, `accordion.tsx`, `modal.tsx`, `toast.tsx`, `empty-state.tsx` (hapus `#FAF6EE/#FED7AA/#FA6400`, `rounded-3xl`, `border-2` → token + `rounded-lg`), `image-upload.tsx`, cek `input/textarea`. Banyak akan otomatis membaik karena radius kini dari token. File dibaca satu per satu saat implementasi; jika ada yang terlalu terkait logic, dilaporkan — tidak dipaksakan.

## Fase 5 — Shell admin (`components/admin/`)

- **`AdminSidebar.tsx`**: navigasi mobile hand-rolled (fixed aside + backdrop + shadow-lg) diganti **Sheet** (side left) berisi nav yang sama; desktop `<aside>` tetap (collapse + matchMedia logic yang baru diperbaiki dipertahankan). Semua className via `cn()` (hapus pola array.join), badge pesan pakai Badge standar `rounded-full`, `text-[10px]` → `text-xs`, active state tetap `bg-primary text-primary-foreground` / `bg-primary/10 text-primary`. Seluruh `navGroups`, role gating, brand logo, logout dipertahankan.
- **`AdminTopbar.tsx`**: breadcrumb string → komponen **Breadcrumb**; chip user statis → **Avatar + AvatarFallback** dengan **DropdownMenu** akun (nama, role, "Keluar" — logout handler sama); bell super_admin jadi `Button ghost size="icon"` + badge count; tombol "Lihat Web Publik" outline tetap.
- **`admin/layout.tsx`**: struktur, auth guard, localStorage collapse tidak berubah (mungkin penyesuaian kecil untuk integrasi Sheet).

## Fase 6 — Rewrite dashboard (`src/app/admin/page.tsx`)

Struktur & data 100% sama (screenshot = referensi komposisi); hanya presentasi yang disusun ulang:

- **Header**: h1 `text-2xl font-semibold tracking-tight`, deskripsi `text-sm text-muted-foreground`, tombol "Tata Letak Beranda" (outline) + "Lihat Web Publik" (orange via `bg-accent` — brand action).
- **Alert inbox** (super_admin): custom div → komponen **Alert** standar; hapus kelas mati `animate-in fade-in` dan icon tile.
- **3 KPI Cards**: pola stock shadcn — CardTitle `text-sm font-medium` (hapus `uppercase tracking-wider`), ikon polos tanpa tile `bg-muted`, nilai `text-2xl font-bold tabular-nums`; tetap dibungkus Link dengan affordance ArrowUpRight.
- **Visibilitas Seksi Beranda**: hapus grid tile ber-border (mini-card dalam card) → list `divide-y` baris kompak `px-6 py-3` flex justify-between: label `text-sm font-medium` + keterangan `text-xs muted`, Switch kanan; hapus status dot (switch = status) dan dimming `opacity-60`. Tombol "Atur Urutan" tetap (reorder ada di beranda).
- **Pesan Konsultasi Masuk**: hapus CardHeader `bg-muted` → header stock; baris `divide-y` tetap; `text-[11px]` → `text-xs`; Badge Baru/Dibalas/Dibaca varian standar; link wa.me + tombol Balas WA/Rincian logikanya tetap.
- **Pusat Pengeditan Modul**: baris kartu ber-border → list Link `rounded-md hover:bg-muted` (ikon polos, judul `text-sm`, `mod.badge` jadi teks `text-xs muted` bukan Badge, ChevronRight).
- **Profil & Legalitas**: hapus semua kotak bersarang → baris info `text-sm` justify-between + statistik polos `text-2xl font-bold` (tanpa uppercase), Badge akreditasi varian `secondary` (hapus token `success` non-shadcn), tombol Edit tetap.

## Fase 7 — Verifikasi

1. `npm run lint`, `npx tsc --noEmit`, `npm run build` — harus bersih.
2. `npm run dev` + verifikasi browser (skill browser-use) pakai akun `docs/AKUN-TESTING.md` (super_admin & editor): dashboard desktop + 375px (Sheet mobile buka/tutup), toggle satu seksi (toast + persist), breadcrumb, dropdown akun, CRUD modal di satu halaman (mis. berita) untuk uji restyle Fase 4, spot-check landing (`/`, `/pendaftaran`, `/kontak`) untuk regresi visual tombol/radius. Tidak ada test suite di repo — verifikasi browser + build adalah test yang dilaporkan jujur.
3. Sebelum menulis kode Next, cek `node_modules/next/dist/docs/` sesuai AGENTS.md (perubahan kita hanya client components, risiko rendah).

## Catatan

- Sesuai spec & memory: proxy/API/auth/konten tidak disentuh; leftover backend (PII GET terbuka, ISO date users table) tetap jadi tiket terpisah.
- Komponen `empty-state.tsx` yang penuh hex tidak dipakai dashboard; hanya direstyle di Fase 4.
- File terpengaruh: 5 baru di `ui/`, edit ~10 file `ui/`, 3 file `admin/`, `globals.css`, 1 call-site beranda.