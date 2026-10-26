# Panduan Integrasi Gerbang Pembayaran DIN'O EMPIRE (ToyyibPay)

DIN'O EMPIRE menggunakan **ToyyibPay** sebagai gerbang pembayaran rasmi (*payment gateway*) untuk pasaran Malaysia. Integrasi ini menyokong perbankan atas talian **FPX (semua bank tempatan Malaysia)** dan **Kad Kredit/Debit**.

Seni bina pembayaran direka menggunakan corak reka bentuk *Strategy Pattern* (`api/src/services/toyyibpayService.js`), membolehkan transaksi diproses dengan selamat tanpa menyimpan sebarang maklumat perbankan pelanggan di dalam pangkalan data.

---

## 🇲🇾 Kaedah Pembayaran Yang Disokong

| Kaedah Pembayaran | Rangkaian / Protokol | Pengesahan | Persekitaran Ujian |
| :--- | :--- | :--- | :--- |
| **FPX Perbankan Atas Talian** | Semua bank utama Malaysia (Maybank2u, CIMB Clicks, Bank Islam, RHB, Public Bank, dll.) | Kod Resit & Status Transaksi ToyyibPay | Sandbox ToyyibPay / Production Live |
| **Kad Kredit & Kad Debit** | Visa & Mastercard (3D Secure OTP Bank) | 3D Secure Bank Penerbit | Sandbox ToyyibPay / Production Live |

---

## ⚙️ Pemboleh Ubah Konfigurasi & Kunci Rahsia

Konfigurasi disimpan di dua lokasi: pemboleh ubah awam di dalam `api/wrangler.toml` dan kunci rahsia disuntik terus ke Cloudflare Worker secrets.

### 1. Pemboleh Ubah Awam (`api/wrangler.toml`)

```toml
[vars]
PAYMENT_PROVIDER = "toyyibpay"
TOYYIBPAY_BASE_URL = "https://toyyibpay.com"
TOYYIBPAY_CATEGORY_CODE = "b4gn1lj7"
```

### 2. Kunci Rahsia (*Secrets*) — Wajib Disuntik Menggunakan Wrangler

> [!IMPORTANT]
> **JANGAN SESEKALI HARDCODE KUNCI RAHSIA DALAM KOD ATAU REPO GITHUB!**
> Kunci rahsia ToyyibPay mesti dimasukkan secara selamat menggunakan arahan `wrangler secret put`:

```bash
cd api
echo "buy5h8p1-0jls-u5h6-66yk-1nybygutf16y" | npx wrangler secret put TOYYIBPAY_USER_SECRET_KEY
```

| Nama Kunci Rahsia | Jenis | Penerangan |
| :--- | :--- | :--- |
| `TOYYIBPAY_USER_SECRET_KEY` | Secret | Kunci rahsia akaun ToyyibPay peniaga (format: 8-4-4-4-12 aksara) |
| `TOYYIBPAY_CATEGORY_CODE` | Var | Kod kategori ToyyibPay yang didaftarkan untuk pesanan kedai (`b4gn1lj7`) |
| `TOYYIBPAY_BASE_URL` | Var | URL asas API ToyyibPay (`https://toyyibpay.com` atau `https://dev.toyyibpay.com`) |

---

## 🔄 Aliran Pembayaran Penuh (*Payment Workflow*)

Aliran transaksi antara Pelanggan, Cloudflare Worker API, ToyyibPay, dan Bank:

```text
Pelanggan (Storefront)            API (Cloudflare Worker)               ToyyibPay / Bank
      |                                      |                                  |
      |-- 1. POST /api/v1/orders/checkout -->|                                  |
      |      (Cipta pesanan PENDING D1)     |                                  |
      |<-- { orderNumber, orderId } ---------|                                  |
      |                                      |                                  |
      |-- 2. POST /api/v1/payment/initiate ->|                                  |
      |      (Hantar orderId)                |-- 3. createBill (POST) --------->|
      |                                      |      (Jumlah, No Pesanan, Return)|
      |                                      |<-- Respon Bill Code (s071imm8) --|
      |<-- { paymentUrl: https://... } ------|                                  |
      |                                                                         |
      |-- 4. Pelanggan dihalakan ke portal ToyyibPay (Pilih Bank / FPX) ------->|
      |-- 5. Sahkan bayaran di portal perbankan (Maybank2u, CIMB, dll.) ------->|
      |                                                                         |
      |                                      |<-- 6. Webhook Callback / Return -|
      |                                      |      status_id=1, billcode=...   |
      |                                      |-- 7. Sahkan status & jumlah D1   |
      |                                      |      Kemas kini: ON_HOLD / PAID  |
      |<-- 8. Pengalihan ke /payment/success |                                  |
```

---

## 🌐 Laluan Webhook & Callback

ToyyibPay menyokong dwi-pemberitahuan: pemulangan pelayar pengguna (*browser return*) dan panggilan terus pelayan (*server webhook callback*).

Kedua-dua laluan dipetakan secara automatik:
- `ALL /api/v1/payment/toyyibpay/callback`
- `ALL /api/v1/payment/callback/toyyibpay`

### Pengesahan Status Pembayaran:
- **`status_id = 1`**: Pembayaran BERJAYA. Status pesanan dikemas kini ke `ON_HOLD` / `PAID`, emel invois dihantar, dan mata ganjaran dikreditkan.
- **`status_id = 2`**: Pembayaran MENUNGGU (*Pending*).
- **`status_id = 3`**: Pembayaran GAGAL. Pelanggan dihalakan ke laman `/payment/failure` dengan mesej ralat.

---

## 🔒 Langkah Keselamatan (*Security Hardening*)

1. **Pengesahan Jumlah Transaksi (*Amount Tamper Check*)**:
   - Backend mengesahkan jumlah yang dibayar oleh ToyyibPay berbanding jumlah pesanan sebenar di pangkalan data D1. Jika wujud perbezaan jumlah, status bayaran akan disekat serta-merta bagi menghalang penipuan manipulasi harga.
2. **Idempotensi Pembayaran (*Double-Payment Prevention*)**:
   - Sekiranya ToyyibPay menghantar webhook berkali-kali untuk pesanan yang sama, sistem hanya mengemas kini pesanan sekali sahaja tanpa menduplikasi emel atau mata ganjaran.
3. **Tiada Penyimpanan Nombor Kad**:
   - Maklumat perbankan dan kad dikendalikan sepenuhnya oleh infrastruktur keselamatan ToyyibPay dan FPX PayNet — pelayan Cloudflare Worker langsung tidak memproses data sensitif kad.

---

## 🛠️ Ujian Diagnostik Pantas

Untuk menyemak status perkhidmatan ToyyibPay dan kesahihan kunci rahsia:

```bash
# Semak kesahihan Category Code & Secret Key terus ke ToyyibPay API
curl -s -X POST https://toyyibpay.com/index.php/api/getCategoryDetails \
  -d "userSecretKey=buy5h8p1-0jls-u5h6-66yk-1nybygutf16y&categoryCode=b4gn1lj7"
```

Respon yang sah:
```json
[{"CategoryName":"dinoempire.my","categoryDescription":"dinoempire.my","categoryStatus":"1"}]
```
