# Arahan untuk Gemini Agent — DIN'O EMPIRE

Anda adalah pembantu pembangunan untuk projek **DIN'O EMPIRE** (e-dagang Malaysia). Bekerja dalam VSCodium dengan repo ini.

## Konteks Projek

- **Domain**: `dinoempire.my` / `api.dinoempire.my`
- **Stack**: Cloudflare Workers (Hono) + D1 + R2 + React (client & admin)
- **Pembayaran**: ToyyibPay (FPX & Kad)
- **Penghantaran**: EasyParcel
- **Bahasa UI**: Bahasa Melayu + English sahaja (jangan guna Turki)

## Struktur Penting

```
client/          # Storefront React (Vite)
admin/           # Admin dashboard React
api/             # Hono API (Cloudflare Workers)
  src/
    controllers/ # HTTP handlers
    services/    # Business logic (ToyyibPay, EasyParcel, dll.)
    routes/      # Route definitions
  wrangler.toml  # Env vars & bindings
```

## Peraturan

1. **Jangan tulis perkataan Turki** (sepet, sipariş, ödeme, fatura, kargo, ürün, iade, dll.). Guna Melayu atau English.
2. **Jangan hardcode secret** dalam kod. Guna env vars (`wrangler.toml` [vars] atau `wrangler secret put`).
3. **Setiap produk wajib ada sekurang-kurangnya 2 gambar** (sudah dikuatkuasakan dalam ProductModal).
4. **Jangan ubah schema D1** tanpa migration baru dalam `api/migrations/`.
5. **Commit kecil dan jelas**. Guna format: `fix:`, `feat:`, `chore:`, `docs:`.

## Tugas Semasa / Fokus

### 1. Upload Gambar (Prioriti)
- Endpoint: `POST /api/v1/admin/upload`
- Fail: `api/src/controllers/uploadController.js`
- R2 binding: `IMAGES_BUCKET` (bucket: `dino-empire-assets`)
- **CDN_URL** kini: `https://cdn.dinoempire.my`
- **Tindakan diperlukan** (manual di Cloudflare Dashboard):
  1. R2 → `dino-empire-assets` → Enable Public Access
  2. Add custom domain `cdn.dinoempire.my`
  3. Deploy semula API

### 2. ToyyibPay
- Service: `api/src/services/toyyibpayService.js`
- Callback: `/api/v1/payment/toyyibpay/callback`
- Env: `TOYYIBPAY_USER_SECRET_KEY`, `TOYYIBPAY_CATEGORY_CODE`
- Hash validation sudah ada

### 3. EasyParcel
- Service: `api/src/services/easyParcelService.js`
- Callback: `/api/v1/easyparcel/callback` (public)
- Admin UI: `admin/src/components/ShippingQuoteModal.jsx`

## Perintah Berguna

```bash
# Local dev
npm run dev

# Deploy API
cd api && npx wrangler deploy

# Semak secret
cd api && npx wrangler secret list

# Migration D1
cd api && npx wrangler d1 migrations apply dino-empire-db --remote
```

## Semak Sebelum Commit

- [ ] Tiada perkataan Turki dalam fail yang diubah
- [ ] Tiada secret hardcode
- [ ] Upload gambar masih berfungsi (jika ubah controller)
- [ ] Mobile responsive (jika ubah UI)
- [ ] Commit message jelas

## Fail yang Baru Dikemaskini (13 Okt 2026)

- `api/src/controllers/uploadController.js` — mesej Melayu
- `api/src/services/returnService.js` — mesej Melayu
- `api/src/config.js` — fallback domain dinoempire.my
- `api/wrangler.toml` — CDN_URL = https://cdn.dinoempire.my
- `client/public/legal/*.html` — semua Melayu
- `client/public/llms.txt` — Melayu
- `client/src/data/malaysia.json` — negeri Malaysia (turkiye.json dipadam)

## Jika Ada Error

1. Semak log Cloudflare Workers
2. Semak R2 public access jika gambar tidak muncul
3. Semak CORS jika request dari admin gagal
4. Jangan revert perubahan Melayu tanpa sebab

---

**Ringkasan**: Pastikan UI Melayu, upload gambar berfungsi dengan CDN public, dan jangan introduce Turki atau secret.
