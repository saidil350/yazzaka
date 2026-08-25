# 🔐 Dokumentasi Akun Testing — CMS Yazzakka

> **Tujuan:** Referensi akun & skenario pengujian fitur login CMS.
> **Terakhir diperbarui:** 2026-08-26
> **Status auth:** Server-side (scrypt + cookie HttpOnly bertanda tangan HMAC)

---

## ⚠️ Peringatan

- Password di bawah adalah **password default development**.
- **JANGAN** gunakan di produksi. Ganti dengan:
  ```bash
  # Windows PowerShell
  $env:CMS_SEED_PASSWORD="PasswordBaruAnda#2026"; node scripts/migrate-auth.mjs
  ```
- File ini **tidak boleh berisi password produksi**. Simpan kredensial asli di password manager.

---

## 1. Daftar Akun

| # | Nama | Email | Role | Password (dev) | Keterangan |
|---|------|-------|------|----------------|------------|
| 1 | Super Admin Yazzaka | `admin@yazzakka.sch.id` | `super_admin` | `Yazzakka#2026` | Akses penuh semua modul |
| 2 | Editor Konten | `editor@yazzakka.sch.id` | `editor` | `Yazzakka#2026` | Konten saja, tidak bisa settings/organization |
| 3 | Staf PPDB | `spmb@yazzakka.sch.id` | `admission_staff` | `Yazzakka#2026` | Konten + pesan masuk |

### Matriks Hak Akses (RBAC — divalidasi server-side di `src/proxy.ts`)

| Area | super_admin | admin | editor | admission_staff | viewer |
|------|:-----------:|:-----:|:------:|:---------------:|:------:|
| Halaman `/admin/*` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mutasi API konten (articles, programs, events, dll.) | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/admin/users` (halaman) | ✅ | ✅ | ❌ redirect | ❌ redirect | ❌ redirect |
| Mutasi `/api/settings`, `/api/profile`, `/api/organization`, `/api/school-data` | ✅ | ✅ | ❌ 403 | ❌ 403 | ❌ 403 |
| Form kontak publik `POST /api/contact` | 🌐 publik | 🌐 publik | 🌐 publik | 🌐 publik | 🌐 publik |

---

## 2. Cara Login

1. Jalankan dev server: `npm run dev`
2. Buka `http://localhost:3000/login`
3. Masukkan email + password dari tabel di atas.

**URL praktis untuk testing redirect:**

```
http://localhost:3000/login?next=/admin/pages/beranda
http://localhost:3000/admin            → tanpa sesi akan dilempar ke /login?next=/admin
http://localhost:3000/admin/users      → khusus super_admin/admin
```

---

## 3. Endpoint Autentikasi

| Method | Endpoint | Auth? | Fungsi |
|--------|----------|-------|--------|
| POST | `/api/auth/login` | ❌ publik (rate-limited) | Login, set cookie `cms_session` |
| POST | `/api/auth/logout` | ✅ sesi | Hapus cookie sesi |
| GET | `/api/auth/session` | ❌ publik | Introspeksi sesi aktif (`{user}` atau `{user:null}`) |

### Detail aturan login

- Password diverifikasi dengan **scrypt** terhadap kolom `users.password_hash` (Neon DB).
- Pesan error selalu generik: *"Email atau kata sandi tidak valid."* (anti user-enumeration).
- **Rate limit:** maksimal **5 percobaan gagal per 15 menit** per kombinasi IP+email → respons `429`.
- Sesi kedaluwarsa dalam **8 jam** (cookie `Max-Age=28800`).
- Cookie: `HttpOnly; SameSite=Lax; Secure` (Secure hanya saat `NODE_ENV=production`).

---

## 4. Skenario Testing Manual

### A. Functional

| ID | Langkah | Hasil Diharapkan |
|----|---------|------------------|
| T-01 | Login akun #1 dengan password benar | Redirect ke `/admin`, toast sukses |
| T-02 | Login dengan password salah | Alert "Email atau kata sandi tidak valid.", field password dikosongkan |
| T-03 | Submit kosong / format email salah | Validasi client-side muncul, tidak ada request ke server |
| T-04 | Klik tombol Masuk 2x cepat | Submit kedua diblokir (tombol disabled) |
| T-05 | Saat loading | Spinner pada tombol, input disabled |
| T-06 | Logout dari sidebar → tekan Back / refresh | Tetap di halaman login, tidak bisa masuk `/admin` |
| T-07 | Refresh browser saat sudah login | Sesi bertahan (cookie), tetap di dashboard |

### B. Session & Route Protection

| ID | Langkah | Hasil Diharapkan |
|----|---------|------------------|
| T-08 | Buka `/admin` tanpa login | Redirect `307` → `/login?next=/admin` |
| T-09 | Setelah T-08, login | Kembali ke `/admin` (param `next` dipakai) |
| T-10 | Ubah/tambah cookie `cms_session` manual via DevTools | Ditolak (signature invalid) → tetap dianggap logout |
| T-11 | Tunggu/kirim cookie dengan exp kadaluarsa | Sesi dianggap tidak valid |
| T-12 | Login sebagai editor → buka `/admin/users` | Redirect balik ke `/admin` |

### C. RBAC via API (curl)

```bash
# 1. Login simpan cookie
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@yazzakka.sch.id","password":"Yazzakka#2026"}'

# 2. Editor mencoba mutasi settings -> HARUS 403
curl -b cookies.txt -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" -d '{"siteTitle":"hack"}' -i

# 3. Tanpa sesi -> HARUS 401
curl -X DELETE http://localhost:3000/api/articles/nonexistent-id -i

# 4. Rate limit: ulangi login gagal 6x -> percobaan ke-6 HARUS 429
for /L %i in (1,1,6) do curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yazzakka.sch.id","password":"salah"}' -o nul -w "%{http_code}\n"
```

### D. Keamanan

| ID | Check | Hasil Diharapkan |
|----|-------|------------------|
| T-13 | Inspect localStorage (`F12` → Application) | **Tidak ada** data sesi/password di localStorage |
| T-14 | Inspect cookie `cms_session` via JS (`document.cookie`) | Tidak terlihat (HttpOnly) |
| T-15 | Lihat tab Network saat login | Password ada di request body HTTPS, bukan di URL |
| T-16 | Error message email tak dikenal vs password salah | Pesan identik (tidak bisa memetakan akun terdaftar) |

---

## 5. Manajemen Akun (DB)

Akun tersimpan di tabel `users` (Neon Postgres) dengan kolom `password_hash` (format `scrypt:N:r:p:salt:hash`).

```bash
# Lihat daftar akun (tanpa hash)
node scripts/check-users.mjs

# Reset/ganti password semua akun seed
$env:CMS_SEED_PASSWORD="PasswordBaru"; node scripts/migrate-auth.mjs

# Migration lengkap (buat kolom hash + bersihkan baris legacy)
node scripts/migrate-auth.mjs
```

**Menambah akun baru secara manual:** insert baris ke tabel `users` dengan hash yang di-generate scrypt (format sama), atau hubungi developer untuk menambahkannya di `scripts/migrate-auth.mjs`.

---

## 6. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Login valid tapi 401 | Baris DB tanpa `password_hash` | Jalankan `node scripts/migrate-auth.mjs` |
| Selalu 429 saat login | Terkena rate limit (5 gagal / 15 mnt) | Restart dev server (limit in-memory) atau tunggu 15 menit |
| Error "AUTH_SECRET tidak valid" | Env belum diset | Pastikan `AUTH_SECRET` ada di `.env.local` (min 32 karakter) |
| Redirect loop `/login ↔ /admin` | Cookie tidak tersimpan (browser blokir cookie) | Izinkan cookie / cek mode incognito+strict |
| `403` padahal login super_admin | Role di DB bukan `super_admin` | Cek `node scripts/check-users.mjs` |
