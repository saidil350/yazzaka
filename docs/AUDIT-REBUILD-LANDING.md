# Audit Render Static — Seksi Landing Page ("Konten Landing Page")

> Tanggal: 2026-10-22. Tujuan: peta pembandingan "sudah dari DB" vs "masih static"
> sebagai beban pembangunan ulang. Tidak ada kode yang diubah dalam audit ini.
>
> Ringkas: **data item sudah dari Neon**, tapi **judul/label/kerangka tampilan
> seksi masih hardcoded di komponen publik**, dan dua fitur admin (judul seksi +
> urutan seksi) tersimpan di DB namun **tidak pernah berefek di landing**.

## 0. Pipeline render & fakta kunci `page_sections`

- `src/app/page.tsx:16-41` merender 8 seksi ber-gating + Header/Footer:
  `hero`→HeroSection(29), `stats`→TrustStats(30), `about`→EditorialAbout(31),
  `programs`→ProgramsSection(32), `whyus`→WhyUsSection(33),
  `facilities`→FacilitiesSection(34), `achievements`→AchievementsSection(35),
  `testimonials`→TestimonialsSection(36).
- Yang dibaca dari `page_sections` HANYA `isEnabled` (`isSectionEnabled`, baris 20-23).
  **Tidak ada title/subtitle yang diteruskan ke komponen mana pun.**
- **Urutan JSX tetap** — `orderIndex` tidak berpengaruh di landing.
- `NewsAndEvents` dan `AdmissionCTA` = dead code (tidak diimpor halaman mana pun);
  baris seksi `admission_cta` tetap ada di DB.
- Konsumen title/subtitle di seluruh `src/`: hanya
  `src/app/tentang-kami/page.tsx:96-102,293-298` (key `organization`); ditampilkan
  admin di `admin/pages/beranda/page.tsx:66,72` & `admin/page.tsx:280-283`;
  di-edit hanya oleh `admin/organization/tim/page.tsx:113-127` — hasilnya tak pernah
  tampil di landing.
- DDL `page_sections` hanya ada di `scripts/migrate.mjs:242-251` (tidak di
  `neon/schema.sql` yang sudah usang). `scripts/update-sections.mjs` menonaktifkan
  `facilities` dan menghapus key `news`/`events` di DB live.

## 1. HeroSection — key `hero`

File: `src/components/public/HeroSection.tsx`; fallback `initialData.ts:22-29`
(`DEFAULT_HERO`); editor `src/app/admin/content/hero/page.tsx`.

- DB: eyebrow(38), headline(46), body(51), imageUrl(99), badges[](79-84),
  `admission.isOpen` untuk label CTA(61), `profile.name` di alt(100).
- STATIC: label CTA "Daftar Santri Baru"/"Informasi PPDB"(61) & "Jelajahi Profil"(72)
  + target link; chip foto "Lingkungan Nyaman"(112), "Karakter & Adab"(120),
  "Sekolah Terpadu"(129); judul kartu(132) & tagline(135); ikon tetap;
  blobs/gradient dekoratif.
- Gap admin: CTA, chips, kartu bawah, ikon tidak editable.

## 2. TrustStats — key `stats`

File: `src/components/public/TrustStats.tsx` (stats array hardcoded 10-47).

- DB: `establishedYear`(14), `studentCount`(23), `hafizCount`(32), `teacherCount`(41).
- STATIC (12 string): "Tahun Berdiri"/" M"/"14+ tahun berkiprah…"(13-16, kontradiktif
  dgn tahun berdiri 2022), "Santri Aktif"/"+"(22-25), "Hafiz 30 Juz"/"+"(31-34),
  "Tenaga Pendidik"/" Asatidz"(40-43); ikon tetap; `alumniCount` tak terpakai.
- Gap admin: angka diedit via `admin/organization/profil` (120-153); label/deskripsi
  tidak editable.

## 3. EditorialAbout — key `about`

File: `src/components/public/EditorialAbout.tsx`.

- DB: `profile.principal.*`(40,45,53,56), `vision`(90), `mission[]`(100-112),
  `values.slice(0,3)`(122-136).
- STATIC (9): badge(21), H2(24), sub(27), badge "Pimpinan Pesantren"(58), tombol(70),
  label "Visi Utama Lembaga"(86), "Misi Strategis Pendidikan"(97), "Pilar Karakter
  Santri"(119), "Pilar 0{n}"(128).
- Catatan: `profile.values` dipakai 3 tempat — WhyUs (semua), About (3 pertama),
  /tentang-kami Panca Jiwa (semua).

## 4. ProgramsSection — key `programs`

File: `src/components/public/ProgramsSection.tsx`.

- DB: programs published + `orderIndex`(16-18), title(183), shortDesc(186),
  imageUrl(153), features.slice(0,3)(195-203), slug, category.
- STATIC (±15): header(78,81,84), tombol(94), filter(22); **`getUnitIcon`(34-42)
  memilih ikon dari substring slug — field `icon_name` diabaikan**;
  `getUnitBadge`(44-67) 6 pasang tag/target hardcoded; "Unit 0{n}"(175);
  "Fokus & Capaian:"(193); CTA(219).
- Gap admin (`admin/content/program`): slug auto(154/168), orderIndex auto(177)
  **tanpa UI reorder**, iconName tersimpan **tanpa picker** (default "BookOpen", 53).

## 5. WhyUsSection — key `whyus`

File: `src/components/public/WhyUsSection.tsx`.

- DB: `profile.values`(34-39), `profile.name`(93).
- STATIC: badge(93), H2(96), sub(99), chip "Poin {n}"(118), ikon per-indeks(18-31),
  fallback 6 item hardcoded(40-83) termasuk nomor SK(74).
- Gap admin: values diedit via `admin/organization/visi-misi` (hanya saat values
  tidak kosong; kalau kosong publik menampilkan fallback hardcoded).

## 6. FacilitiesSection — key `facilities` (nonaktif di DB)

File: `src/components/public/FacilitiesSection.tsx`.

- DB: facilities published(15), kategori filter dari DB(18-21), name(120),
  description(123), imageUrl(104), category(109), capacity(111-115,132).
- STATIC (7): badge(37), H2(40), sub(43), tombol(53), "Daya Tampung:"(132), dll.

## 7. AchievementsSection — key `achievements` (nonaktif di DB)

File: `src/components/public/AchievementsSection.tsx`.

- DB: achievements urut `year DESC` (API school-data:38) → `slice(0,4)`(58);
  title(83), "Tingkat {level}"(72), "category • year"(80), studentName(90),
  competitionName(93), imageUrl(66).
- STATIC (6): header(23,26,29,39), prefix "Tingkat", tidak ada kontrol featured.

## 8. TestimonialsSection — key `testimonials`

File: `src/components/public/TestimonialsSection.tsx`.

- DB: role(47), quote(60), photoUrl(67), name(72), childName/graduationYear(76).
- STATIC (4): header(20,23,26); **rating 5 bintang dipaksa semua kartu**(50-53);
  `is_featured` diabaikan.

## 9. Header (selalu render)

File: `src/components/public/Header.tsx` (536 baris).

- DB: logoUrl(243-246,404-407), name, admission + fallback "2026/2027"(192-206),
  accreditation/npsn(212), whatsapp(215,521).
- STATIC (±25): primaryNavLinks(34-40), secondaryNavLinks(42-61), quickUnits(63-70),
  sub-bar PPDB(195-205), "WhatsApp CS"(221), dropdown(292), CTA(357), judul grup
  mobile(430,464,491), chip "Aktif"(453), CTA footer mobile(516), pesan WA(521-527).
- **`website_settings.navigation` (headerLinks/footerLinks) ada di DB & types
  (types.ts:220-223) tapi tidak pernah dikonsumsi — dead config.**

## 10. Footer (selalu render)

File: `src/components/public/Footer.tsx`.

- DB: description(52), logo(38-42), name(43,242), npsn sebagai
  "SK Kemenkumham: …"(59 — semantik terbalik dgn Header 212), whatsapp(107),
  address/city/province(215), phone(221), email(227),
  socialMedia instagram/youtube/facebook(73-105).
- STATIC (±20): badge(63), kolom unit 1-6 + sublabel(121-162), kolom link(167-202),
  "Sekretariat Yayasan"(209), jam(232), copyright(242), "Login Staf"(246);
  tiktok/linkedin tidak dirender.

## 11. Komponen mati (dead code di landing)

- `NewsAndEvents.tsx`: baca articles+events; static: header(35,38,41), tombol(51,183),
  "Agenda Terdekat"(177), **pengumuman PPDB hardcoded**(230-239).
- `AdmissionCTA.tsx`: baca admission; static: kedua heading(58-61), body(65), 2 bullet
  benefit(72,76), CTA(88,105), pesan WA(94), badge(39-45).

## Rekomendasi rebuild (apa yang harus pindah ke DB)

1. **Aktifkan `page_sections`**: render title/subtitle per seksi di landing, hormati
   `orderIndex` (sort + map key→komponen) atau hapus tombol reorder. Beri input
   title/subtitle di `/admin/pages/beranda` (`updateSection` context sudah mendukung,
   `SchoolDataContext.tsx:444-459`).
2. **JSONB baru di `school_profile`** (pola `hero` yang sudah jalan): `landing_config`
   atau per-seksi — `hero`: ctaPrimaryLabel/closedLabel/ctaSecondaryLabel/chips[3]/
   cardTitle/cardTagline; `stats`: items[{icon,label,valueSource,suffix,desc}];
   `about`: header{badge,title,subtitle} + label-label; header{badge,title,subtitle} +
   buttonLabel untuk programs/facilities/achievements/testimonials; badge per-program
   (atau jadikan `category` otoritatif) + konsumsi `icon_name`.
3. **Hidupkan `website_settings.navigation`** untuk nav Header/Footer, jam kerja,
   copyright, badge footer; render tiktok/linkedin.
4. **Perbaiki semantik**: `profile.npsn` berisi nomor SK di seed (Header mencetaknya
   sbg NPSN, Footer sbg SK) — pisah jadi `npsn` + `legalSk`; `profile.description`
   tidak pernah diedit admin mana pun.
5. **Putuskan NewsAndEvents/AdmissionCTA**: wire ke page.tsx lewat key
   `news`/`admission_cta`, atau hapus komponennya + baris `admission_cta` di DB.

| Seksi | DB hari ini | Static (±) | Prioritas rebuild |
|---|---|---|---|
| Hero | konten utama | 8 blok + CTA/ikon | Tinggi |
| Stats | 4 angka | 12 string | Tinggi |
| About | pimpinan/visi/misi/nilai | 9 blok | Sedang-Tinggi |
| Programs | data item penuh | ±15 + logika ikon | Tinggi |
| WhyUs | values[] | ±5 + fallback | Sedang |
| Facilities | data item | 7 | Rendah (nonaktif) |
| Achievements | data item (top-4) | 6 | Rendah (nonaktif) |
| Testimonials | data item | 4 + bintang | Sedang |
| Header | logo/kontak | ±25 (semua nav) | Tinggi (bila nav mau editable) |
| Footer | deskripsi/kontak/sosmed | ±20 | Sedang-Tinggi |
| NewsAndEvents / AdmissionCTA | (siap DB) | ±19 | Putuskan: hidupkan atau hapus |
