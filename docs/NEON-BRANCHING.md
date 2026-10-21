# Branch Neon: Production & Staging

Dokumen ini menjelaskan pemetaan **git branch ↔ Neon branch** untuk project `yazzaka`.

## Ringkasan

| Git branch | Neon branch | Neon branch ID | Compute (pooled) |
|---|---|---|---|
| `main` | `production` | `br-raspy-moon-aze0f1do` | `ep-round-surf-az1urxre-pooler...` |
| `staging` | `staging` | `br-steep-scene-azgoi9z4` | `ep-holy-wildflower-azpzn9n9-pooler...` |

- Project Neon: **yazzaka** (`curly-scene-22851801`, region `aws-ap-southeast-1`)
- Branch `staging` dibuat dari `production` (**copy-on-write**), sehingga data, schema, dan role identik saat pembuatan.
- Setelah ada penulisan data di salah satu branch, kedua branch **berdiferensiasi** (tidak saling memengaruhi).

## File env (semua di-gitignore via `.env*`)

| File | Branch Neon | Keterangan |
|---|---|---|
| `.env.production.local` | production | sumber env production |
| `.env.staging.local` | staging | sumber env staging (AUTH_SECRET terpisah) |
| `.env.local` | **aktif** | di-generate dari salah satu file di atas — jangan diedit manual |

> `.env.local` selalu menjadi file yang dibaca Next.js. Isinya adalah salinan file sumber branch yang aktif.

## Cara switch branch

Manual:

```bash
npm run env:staging      # .env.local -> staging
npm run env:production   # .env.local -> production
```

Otomatis (hook git, sudah diaktifkan di repo ini):

```bash
git config core.hooksPath .githooks   # sekali per clone
git checkout staging                  # otomatis pakai env staging
git checkout main                     # otomatis pakai env production
```

Hook `.githooks/post-checkout` hanya mengganti env jika file `.env.<branch>.local` tersedia. Branch fitur lain (mis. `feature/x`) tidak mengubah env — tetap memakai env terakhir.

## Deploy (Vercel / lainnya)

- **Production deployment** (`main`): set `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET` dari branch Neon **production** di environment *Production*.
- **Preview/Staging deployment** (git `staging`): set variabel yang sama dari branch Neon **staging** di environment *Preview* (atau *Staging* bila tersedia).
- Jangan menaruh connection string langsung di repo — gunakan dashboard environment variables.

## Menyelaraskan ulang data staging dengan production

Branch Neon menyalin data saat **dibuat**, bukan sinkron berkelanjutan. Jika ingin staging kembali sama dengan production:

**Opsi A (aman, tanpa downtime production):** buat branch baru dari production lalu hapus yang lama.

1. Buat branch baru dari `production` (mis. `staging-reset`) melalui console/CLI/MCP.
2. Perbarui `.env.staging.local` dengan connection string branch baru.
3. Jalankan `npm run env:staging`.
4. Hapus branch `staging` lama setelah verifikasi.

**Opsi B:** `neon branches restore` / restore dari snapshot pada window retensi history (6 jam pada project ini) — lebih cocok untuk rollback cepat.

## Catatan keamanan

- File `.env.*.local` tidak boleh di-commit.
- `AUTH_SECRET` staging berbeda dari production — sesi login staging tidak valid di production (dan sebaliknya).
- Akses DB memakai role `neondb_owner`; pertimbangkan role read-only terpisah untuk kebutuhan pelaporan di kemudian hari.
- Branch `staging` tidak dijadikan default branch Neon; default tetap `production`.
