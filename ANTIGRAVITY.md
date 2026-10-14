# ANTIGRAVITY.md — Arahan untuk Gemini Agent (DIN'O EMPIRE)

Anda adalah agent Gemini yang bekerja dalam Antigravity / VSCodium pada repo **Malayster/sansetv1bhjjbh**.

**Tugas anda**: Jalankan semua langkah di bawah secara berperingkat sehingga selesai. Jangan berhenti separuh jalan. Commit setiap perubahan dengan mesej jelas.

---

## 0. Tugas Segera: Deploy Admin Panel ke Cloudflare

Worker `dinoempire-admin` sudah dicipta oleh Cloudflare dan custom domain `admin.dinoempire.my` sudah diattach. Fail `admin/wrangler.toml` dan `admin/src/worker.js` sudah ada dalam repo.

**Lakukan sekarang:**

```bash
cd admin
npm install
npm run build
npx wrangler deploy
```

Selepas berjaya, uji `https://admin.dinoempire.my` (selepas login Cloudflare Access).

**Nota:** API (`api.dinoempire.my`) mesti ada secret berikut supaya Access berfungsi:

```bash
cd api
npx wrangler secret put TEAM_DOMAIN
# Masukkan: https://dinoempire.cloudflareaccess.com

npx wrangler secret put POLICY_AUD
# Masukkan AUD tag dari aplikasi Access
```

---

## 1. Konteks Projek

| Item | Nilai |
|------|-------|
| Storefront | https://dinoempire.my (`dinoempirev1`) |
| Admin | https://admin.dinoempire.my (`dinoempire-admin`) |
| API | https://api.dinoempire.my (`dinoempire-api`) |
| Stack | Cloudflare Workers (Hono) + D1 + R2 + React |
| Pembayaran | ToyyibPay (FPX & Kad) |
| Penghantaran | EasyParcel |
| Bahasa | **Bahasa Melayu + English sahaja** |
| Repo | Malayster/sansetv1bhjjbh |

**Jangan guna perkataan Turki** (sipariş, ödeme, ürün, magaza, iade, kargo, Türkiye, dll.). Ganti dengan Melayu atau English.

---

## 2. Peraturan Mutlak

1. Jangan hardcode secret dalam kod atau `wrangler.toml` [vars]. Guna `wrangler secret put`.
2. Setiap produk mesti ada sekurang-kurangnya 2 gambar.
3. Jangan ubah schema D1 tanpa migration baru di `api/migrations/`.
4. Commit kecil, mesej format: `fix:`, `feat:`, `chore:`, `docs:`.
5. Pastikan mobile + tablet responsive jika ubah UI.
6. Selepas setiap perubahan penting, uji di local jika boleh.

---

## 3. Tindakan Segera (KRITIKAL — Buat Dulu)

### 3.1 Rotate ToyyibPay Secret
Secret lama pernah ada dalam git history. **Mesti rotate.**

```bash
cd api
npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY
# Paste key baru dari ToyyibPay dashboard
```

Pastikan `api/wrangler.toml` **tidak** mengandungi `TOYYIBPAY_USER_SECRET_KEY` dalam [vars].

### 3.2 Aktifkan CDN / R2 Public Access
`https://cdn.dinoempire.my` kini return 503. Gambar tidak boleh diakses.

1. Cloudflare Dashboard → R2 → bucket `dino-empire-assets`
2. Settings → **Enable Public Access**
3. Custom Domains → Add `cdn.dinoempire.my`
4. Deploy semula API:

```bash
cd api && npx wrangler deploy
```

### 3.3 Jalankan Migration
```bash
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

### 3.4 Cloudflare Access Secrets (API)
```bash
cd api
npx wrangler secret put TEAM_DOMAIN
# https://dinoempire.cloudflareaccess.com

npx wrangler secret put POLICY_AUD
# AUD tag dari Zero Trust → Access → Applications
```

---

## 4. Tugas Kod yang Perlu Diselesaikan

### 4.1 Upload Gambar
- Fail: `api/src/controllers/uploadController.js`
- Endpoint: `POST /api/v1/admin/upload`
- Pastikan FormData multipart berfungsi, File validation betul, dan URL yang dikembalikan ialah `https://cdn.dinoempire.my/products/xxx.webp`
- Minimum 2 gambar per produk sudah dikuatkuasakan di admin UI

### 4.2 Routes Melayu
Routes utama sudah ditukar. Pastikan tiada pautan lama yang terlepas:

| Lama | Baru |
|------|------|
| `/magaza` | `/kedai` |
| `/urun/:slug` | `/produk/:slug` |
| `/siparis-takip` | `/jejak-pesanan` |
| `/odeme` | `/bayaran` |
| `/iletisim` | `/hubungi` |
| `/sss` | `/soalan-lazim` |
| `/hakkimizda` | `/tentang` |
| `/iade-degisim` | `/pulangan` |
| `/kargo-bilgileri` | `/penghantaran` |
| `/gizlilik-ve-kvkk` | `/privasi` |

Cari sisa dalam Header, Footer, HomePage, email, sitemap, dan komponen lain.

### 4.3 Email
Fail: `api/src/services/emailService.js`
- Template Melayu
- Mata wang RM
- Pautan ke `/jejak-pesanan`
- Fallback negara Malaysia

### 4.4 SEO
- `client/public/robots.txt` — sitemap ke `https://api.dinoempire.my/sitemap.xml`
- `api/src/controllers/seoController.js` — routes Melayu
- `client/index.html` — Open Graph sudah ada
- `client/public/manifest.json` — nama DIN'O EMPIRE

### 4.5 Schema / Negara
Migration `api/migrations/0012_malaysia_defaults.sql` dan `0013_schema_drift_sync.sql` sudah wujud. Pastikan dijalankan.

---

## 5. Struktur Fail Penting

```
api/
  wrangler.toml          # Env (tanpa secret)
  src/
    middlewares/
      adminAuth.js       # Cloudflare Access (jose)
      turnstileMiddleware.js
    controllers/
      uploadController.js
      seoController.js
    services/
      emailService.js
      toyyibpayService.js
      easyParcelService.js
    routes/
client/
  src/
    App.jsx              # Routes
    components/
      Header.jsx
      Footer.jsx
  public/
    robots.txt
    manifest.json
admin/
  wrangler.toml          # dinoempire-admin
  src/
    worker.js            # SPA asset server
    ...
```

---

## 6. Perintah Berguna

```bash
# Dev
npm run dev

# Deploy API
cd api && npx wrangler deploy

# Deploy Admin
cd admin && npm run build && npx wrangler deploy

# Secret
cd api && npx wrangler secret list
cd api && npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY
cd api && npx wrangler secret put TEAM_DOMAIN
cd api && npx wrangler secret put POLICY_AUD

# Migration
cd api && npx wrangler d1 migrations apply dino-empire-db --remote

# Prisma
cd api && npx prisma generate
```

---

## 7. Semak Sebelum Commit

- [ ] Tiada perkataan Turki
- [ ] Tiada secret dalam wrangler.toml [vars]
- [ ] Routes Melayu digunakan
- [ ] Upload gambar return URL CDN yang betul
- [ ] Mobile responsive
- [ ] Commit message jelas

---

## 8. Urutan Kerja yang Disyorkan

1. Deploy admin: `cd admin && npm install && npm run build && npx wrangler deploy`
2. Set secret Cloudflare Access pada API (`TEAM_DOMAIN`, `POLICY_AUD`).
3. Pastikan secret ToyyibPay sudah di-rotate dan di-set sebagai secret.
4. Aktifkan R2 public access + custom domain CDN.
5. Jalankan migration.
6. Deploy API.
7. Uji `https://admin.dinoempire.my` selepas login Access.
8. Uji upload gambar di admin → pastikan URL CDN boleh dibuka.
9. Cari dan betulkan sebarang sisa Turki atau pautan lama.
10. Deploy client.
11. Uji laman utama, kedai, produk, checkout, dan jejak pesanan.

---

## 9. Fail yang Sudah Dikemaskini (14 Okt 2026)

- `admin/wrangler.toml` — Worker dinoempire-admin
- `admin/src/worker.js` — SPA asset server
- `api/src/middlewares/adminAuth.js` — jose + TEAM_DOMAIN/POLICY_AUD
- `api/src/middlewares/turnstileMiddleware.js`
- `api/package.json` — jose
- `api/wrangler.toml` — secret dikeluarkan
- `api/src/services/emailService.js` — Melayu + RM
- `api/migrations/0012_malaysia_defaults.sql`
- `api/migrations/0013_schema_drift_sync.sql`
- `client/src/App.jsx` — routes Melayu + redirect
- `client/src/components/Header.jsx`
- `client/src/components/Footer.jsx`
- `client/public/robots.txt`
- `client/public/manifest.json`
- `api/src/controllers/seoController.js`
- `README.md`

---

**Mula sekarang.** Jalankan seksyen 0 (deploy admin) dahulu, kemudian teruskan dengan langkah 3.1 ke atas. Laporkan status selepas setiap bahagian.
