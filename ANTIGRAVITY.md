# ANTIGRAVITY.md — Arahan untuk Gemini Agent (DIN'O EMPIRE)

Anda adalah agent Gemini yang bekerja dalam Antigravity / VSCodium pada repo **Malayster/sansetv1bhjjbh**.

**Tugas anda**: Jalankan semua langkah di bawah secara berperingkat sehingga selesai. Jangan berhenti separuh jalan. Commit setiap perubahan dengan mesej jelas.

---

## 0. TUGAS SEGERA (BUAT SEKARANG)

### 0.1 Deploy Admin Dashboard
Worker `dinoempire-admin` sudah wujud. Fail `admin/wrangler.toml` dan `admin/src/worker.js` sudah ada. `ADMIN_API_URL` sudah diarahkan ke `https://api.dinoempire.my`.

```bash
cd admin
npm install
npm run build
npx wrangler deploy
```

Selepas berjaya, buka `https://admin.dinoempire.my` (selepas login Cloudflare Access). Dashboard penuh mesti muncul.

### 0.2 Deploy Client (Redirect /login)
`client/src/App.jsx` sudah redirect `/login` dan `/admin` ke `https://admin.dinoempire.my`.

```bash
cd client
npm install
npm run build
npx wrangler deploy
```

Uji: `https://dinoempire.my/login` mesti redirect ke `https://admin.dinoempire.my`.

### 0.3 Set Cloudflare Access Secrets (API)
```bash
cd api
npx wrangler secret put TEAM_DOMAIN
# Masukkan: https://dinoempire.cloudflareaccess.com

npx wrangler secret put POLICY_AUD
# Masukkan AUD tag dari Zero Trust → Access → Applications
```

Kemudian deploy API:
```bash
cd api && npx wrangler deploy
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

## 3. Tindakan Lain (Selepas Deploy)

### 3.1 Rotate ToyyibPay Secret
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
4. Deploy semula API: `cd api && npx wrangler deploy`

### 3.3 Jalankan Migration
```bash
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

---

## 4. Tugas Kod yang Perlu Diselesaikan

### 4.1 Upload Gambar
- Fail: `api/src/controllers/uploadController.js`
- Endpoint: `POST /api/v1/admin/upload`
- Pastikan FormData multipart berfungsi dan URL dikembalikan ialah `https://cdn.dinoempire.my/products/xxx.webp`
- Minimum 2 gambar per produk sudah dikuatkuasakan di admin UI

### 4.2 Routes Melayu
Pastikan tiada pautan lama yang terlepas:

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

### 4.3 Email
Fail: `api/src/services/emailService.js` — Template Melayu, mata wang RM, pautan ke `/jejak-pesanan`.

### 4.4 SEO
- `client/public/robots.txt` — sitemap ke `https://api.dinoempire.my/sitemap.xml`
- `api/src/controllers/seoController.js` — routes Melayu

---

## 5. Perintah Berguna

```bash
# Dev
npm run dev

# Deploy API
cd api && npx wrangler deploy

# Deploy Admin
cd admin && npm install && npm run build && npx wrangler deploy

# Deploy Client
cd client && npm install && npm run build && npx wrangler deploy

# Secret
cd api && npx wrangler secret list
cd api && npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY
cd api && npx wrangler secret put TEAM_DOMAIN
cd api && npx wrangler secret put POLICY_AUD

# Migration
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

---

## 6. Semak Sebelum Commit

- [ ] Tiada perkataan Turki
- [ ] Tiada secret dalam wrangler.toml [vars]
- [ ] Routes Melayu digunakan
- [ ] Upload gambar return URL CDN yang betul
- [ ] Mobile responsive
- [ ] Commit message jelas

---

## 7. Urutan Kerja yang Disyorkan

1. **Deploy admin** (seksyen 0.1)
2. **Deploy client** (seksyen 0.2)
3. **Set Access secrets + deploy API** (seksyen 0.3)
4. Uji `https://admin.dinoempire.my` dan `https://dinoempire.my/login`
5. Rotate ToyyibPay secret
6. Aktifkan R2 public access + CDN
7. Jalankan migration
8. Uji upload gambar di admin
9. Cari dan betulkan sebarang sisa Turki

---

## 8. Fail yang Sudah Dikemaskini (14 Okt 2026)

- `admin/wrangler.toml` — Worker dinoempire-admin
- `admin/src/worker.js` — SPA asset server
- `admin/src/App.jsx` — ADMIN_API_URL = https://api.dinoempire.my
- `client/src/App.jsx` — /login & /admin redirect ke admin.dinoempire.my
- `api/src/middlewares/adminAuth.js` — jose + TEAM_DOMAIN/POLICY_AUD
- `api/src/middlewares/turnstileMiddleware.js`
- `api/package.json` — jose
- `api/wrangler.toml` — secret dikeluarkan
- `api/src/services/emailService.js` — Melayu + RM
- `api/migrations/0012_malaysia_defaults.sql`
- `api/migrations/0013_schema_drift_sync.sql`
- `client/src/components/Header.jsx`
- `client/src/components/Footer.jsx`
- `client/public/robots.txt`
- `client/public/manifest.json`
- `api/src/controllers/seoController.js`
- `README.md`
- `LAPORAN_PELAKSANAAN.md`

---

**Mula sekarang.** Jalankan seksyen 0.1 → 0.2 → 0.3 dahulu. Laporkan status selepas setiap bahagian.
