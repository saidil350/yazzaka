# Konfigurasi Neon Object Storage untuk staging

Aplikasi mendukung dua backend: Cloudflare R2 dan Neon Object Storage. R2 dipakai jika semua variabel `R2_*` wajib tersedia. Jika tidak, aplikasi memakai konfigurasi Neon di bawah.

## Variabel Vercel

Buat variabel berikut sebagai **Preview environment khusus branch `staging`**, bukan global Preview atau Production:

| Variabel | Nilai |
| --- | --- |
| `AWS_ENDPOINT_URL_S3` | Endpoint S3 milik Neon untuk branch staging |
| `AWS_REGION` | Region endpoint Neon, misalnya `ap-southeast-1` |
| `AWS_ACCESS_KEY_ID` | ID dari Neon Storage credential dengan scope `storage:read` dan `storage:write` |
| `AWS_SECRET_ACCESS_KEY` | Secret access key dari credential yang sama |
| `NEON_STORAGE_PUBLIC_BUCKET` | `gambar`, bucket dengan akses `public_read` |
| `NEON_STORAGE_PRIVATE_BUCKET` | `private-media`, bucket dengan akses `private` |
| `NEON_STORAGE_PUBLIC_BASE` | URL publik bucket, yaitu endpoint diikuti `/gambar` |

Jangan gunakan kredensial branch production untuk preview staging. Jangan menyimpan secret ke repository, client-side variables, atau log.

## Pemisahan akses

- Media dengan `visibility=public` disimpan di bucket publik dan boleh memakai URL langsung.
- Media dengan `visibility=private` disimpan di bucket privat dan hanya disajikan melalui `/api/files/<key>` setelah pemeriksaan sesi.
- Jika bucket privat belum dikonfigurasi, upload privat ditolak alih-alih ditulis ke bucket publik.
- Mengubah bucket publik menjadi privat atau sebaliknya bukan bagian dari deployment ini. Objek yang sudah ada tetap di bucket asalnya.

## Verifikasi setelah deployment

1. Halaman publik menampilkan sampul berita dari URL bucket `gambar`.
2. `GET /api/files/<key>` untuk media publik yang masih menggunakan proxy mengembalikan HTTP 200.
3. Request anonim ke media privat mengembalikan HTTP 401.
4. Upload gambar dengan `purpose=image` tersimpan di bucket publik.
5. Upload dokumen tanpa `purpose=image` tersimpan di bucket privat.
6. Delete media menghapus objek dari bucket sesuai nilai visibility.
7. Build, TypeScript, dan lint lolos sebelum pull request digabungkan ke branch `staging`.

Perbaikan ini tidak membutuhkan migrasi skema database.
