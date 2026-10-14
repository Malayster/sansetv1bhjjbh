# ANTIGRAVITY.md — Arahan untuk Gemini Agent (DIN'O EMPIRE)

Anda adalah agent Gemini yang bekerja dalam Antigravity / VSCodium pada repo **Malayster/sansetv1bhjjbh**.

**Tugas anda**: Jalankan semua langkah di bawah secara berperingkat sehingga selesai. Jangan berhenti separuh jalan. Commit setiap perubahan dengan mesej jelas.

---

## 0. TUGAS SEGERA (BUAT SEKARANG)

### 0.1 Set Cloudflare Access Secrets (API) — KRITIKAL
```bash
cd api
npx wrangler secret put TEAM_DOMAIN
# Masukkan: https://dinoempire.cloudflareaccess.com

npx wrangler secret put POLICY_AUD
# Masukkan: 136dc03441caed4570bc9f028a51490534d542013a7c200830b08e5f0e801adc

npx wrangler deploy
```

### 0.2 Deploy Admin Dashboard Penuh
```bash
cd admin
npm run deploy
```
Ini akan build `client/` dan deploy dashboard penuh ke `admin.dinoempire.my`.

### 0.3 Deploy Client
```bash
cd client
npm install
npm run build
npx wrangler deploy
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

## 4. Perintah Berguna

```bash
# Deploy API
cd api && npx wrangler deploy

# Deploy Admin (build dari client)
cd admin && npm run deploy

# Deploy Client
cd client && npm run build && npx wrangler deploy

# Secret
cd api && npx wrangler secret put TEAM_DOMAIN
cd api && npx wrangler secret put POLICY_AUD
cd api && npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY

# Migration
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

---

## 5. Cloudflare Access (Sudah Disahkan)

| Item | Nilai |
|------|-------|
| Team Domain | `https://dinoempire.cloudflareaccess.com` |
| POLICY_AUD | `136dc03441caed4570bc9f028a51490534d542013a7c200830b08e5f0e801adc` |
| Domain | `admin.dinoempire.my` |

---

## 6. Fail yang Sudah Dikemaskini (14 Okt 2026)

- `admin/package.json` — build dari client
- `admin/src/worker.js` — SPA asset server
- `client/src/App.jsx` — admin domain tunjuk dashboard penuh
- `api/src/middlewares/adminAuth.js` — jose + TEAM_DOMAIN/POLICY_AUD
- `api/wrangler.toml` — CORS termasuk admin.dinoempire.my
- `api/src/routes/adminRoutes.js` — Turnstile dibuang dari login

---

**Mula sekarang.** Jalankan seksyen 0.1 → 0.2 → 0.3 dahulu.
