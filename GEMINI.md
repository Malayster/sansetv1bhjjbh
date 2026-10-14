# Arahan untuk Gemini Agent — DIN'O EMPIRE

Anda adalah pembantu pembangunan untuk projek **DIN'O EMPIRE** (e-dagang Malaysia). Bekerja dalam VSCodium dengan repo ini.

## Konteks Projek

- **Domain**: `dinoempire.my` / `api.dinoempire.my`
- **Stack**: Cloudflare Workers (Hono) + D1 + R2 + React (client & admin)
- **Pembayaran**: ToyyibPay (FPX & Kad)
- **Penghantaran**: EasyParcel
- **Bahasa UI**: Bahasa Melayu + English sahaja (jangan guna Turki)

## Peraturan

1. **Jangan tulis perkataan Turki** (sepet, sipariş, ödeme, fatura, kargo, ürün, iade, dll.). Guna Melayu atau English.
2. **Jangan hardcode secret** dalam kod atau `wrangler.toml` [vars]. Guna `wrangler secret put`.
3. **Setiap produk wajib ada sekurang-kurangnya 2 gambar**.
4. **Jangan ubah schema D1** tanpa migration baru dalam `api/migrations/`.
5. **Commit kecil dan jelas**. Guna format: `fix:`, `feat:`, `chore:`, `docs:`.

## Tindakan Segera (Manual)

### 1. ToyyibPay Secret (KRITIKAL)
Secret key pernah ada dalam git history. **Rotate key di ToyyibPay dashboard sekarang.**

```bash
cd api
npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY
# paste key baru
```

### 2. CDN / R2 Public Access
`https://cdn.dinoempire.my` return 503. Gambar tidak boleh diakses.

1. Cloudflare Dashboard → R2 → `dino-empire-assets`
2. Settings → Enable Public Access
3. Custom Domains → Add `cdn.dinoempire.my`
4. Deploy semula API

### 3. Migration
```bash
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

## Tugas Semasa

### Upload Gambar
- Endpoint: `POST /api/v1/admin/upload`
- Fail: `api/src/controllers/uploadController.js`
- R2 binding: `IMAGES_BUCKET`

### ToyyibPay
- Service: `api/src/services/toyyibpayService.js`
- Callback: `/api/v1/payment/toyyibpay/callback`
- Hash validation ada

### EasyParcel
- Service: `api/src/services/easyParcelService.js`
- Callback: `/api/v1/easyparcel/callback`

## Perintah Berguna

```bash
npm run dev
cd api && npx wrangler deploy
cd api && npx wrangler secret list
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

## Semak Sebelum Commit

- [ ] Tiada perkataan Turki
- [ ] Tiada secret hardcode
- [ ] Upload gambar berfungsi (jika ubah)
- [ ] Mobile responsive (jika ubah UI)

## Fail Dikemaskini (14 Okt 2026)

- `api/wrangler.toml` — secret dikeluarkan
- `api/src/services/emailService.js` — Melayu + RM
- `api/migrations/0012_malaysia_defaults.sql` — default Malaysia
- `client/index.html` — Open Graph
- `api/src/app.js` — cron fallback betul

---

**Ringkasan**: Pastikan secret tidak dalam git, CDN public, UI Melayu, dan jangan introduce Turki.
