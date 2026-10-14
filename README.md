# DIN'O EMPIRE — Kedai E-Dagang Malaysia (Cloudflare)

Platform e-dagang serverless untuk **DIN'O EMPIRE** (dinoempire.my). Dibina atas Cloudflare Workers + D1 + R2.

- **Storefront**: https://dinoempire.my
- **API**: https://api.dinoempire.my
- **Pembayaran**: ToyyibPay (FPX & Kad)
- **Penghantaran**: EasyParcel
- **Bahasa**: Bahasa Melayu + English

---

## Status Semasa

| Item | Status |
|------|--------|
| Domain | dinoempire.my (live) |
| API health | UP |
| Routes | Melayu (`/kedai`, `/produk`, `/jejak-pesanan`, dll.) |
| Email | Melayu + RM |
| Secret ToyyibPay | **Keluar dari wrangler.toml** — set sebagai secret |
| CDN | `cdn.dinoempire.my` — perlu enable public access di R2 |

### Tindakan Manual Diperlukan

1. Rotate ToyyibPay key dan set:
   ```bash
   cd api && npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY
   ```
2. Enable R2 public access + custom domain `cdn.dinoempire.my`
3. Deploy semula API + client
4. Jalankan migration:
   ```bash
   cd api && npx wrangler d1 migrations apply dino-empire-db --remote
   ```

---

## Stack

| Komponen | Teknologi |
|----------|-----------|
| Storefront | React + Vite + Tailwind |
| Admin | React + Cloudflare Access |
| API | Hono (Cloudflare Workers) |
| Database | Cloudflare D1 |
| Storage | Cloudflare R2 |
| Pembayaran | ToyyibPay |
| Penghantaran | EasyParcel |

---

## Struktur

```
client/     # Storefront
admin/      # Admin dashboard
api/        # Hono API + migrations
```

---

## Routes Utama

| Path | Fungsi |
|------|--------|
| `/` | Laman utama |
| `/kedai` | Kedai / senarai produk |
| `/produk/:slug` | Butiran produk |
| `/checkout` / `/bayaran` | Checkout |
| `/jejak-pesanan` | Jejak pesanan |
| `/hubungi` | Hubungi |
| `/soalan-lazim` | FAQ |
| `/penghantaran` | Info penghantaran |
| `/pulangan` | Polisi pulangan |
| `/privasi` | PDPA |

Routes Turki lama (`/magaza`, `/urun`, dll.) masih redirect ke yang baru.

---

## Pembangunan Tempatan

```bash
npm run install:all
cd api && npx prisma generate
npm run db:migrate
npm run dev
```

- API: http://localhost:8787
- Storefront: http://localhost:3000
- Admin: http://localhost:5173

---

## Arahan untuk Agent

Lihat `GEMINI.md` untuk konteks dan peraturan pembangunan.

---

## License

MIT
