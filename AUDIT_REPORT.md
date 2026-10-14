# LAPORAN AUDIT & SEMAKAN MASALAH PROJEK (AUDIT REPORT)
**Tarikh Audit:** 14 Oktober 2026
**Projek:** E-Market Monorepo (`api`, `client`, `admin`)
**Status Audit:** Selesai (Pemeriksaan Menyeluruh & Ujian Kompilasi/Unit)

---

## 1. RINGKASAN EKSEKUTIF

Berdasarkan semakan komprehensif ke atas keseluruhan struktur projek (pakej REST API Hono/Cloudflare, Client Frontend React/Vite, dan Admin Dashboard):

- **Client & Admin Frontend (Build Status):**
  Pakej `client` dan `admin` berjaya dikompil (`npm run build` PASS tanpa ralat TypeScript/Vite). Walau bagaimanapun, beberapa komponen frontend memanggil endpoint API yang sama ada tidak wujud, mempunyai kegagalan respons format, atau menggunakan kaedah backend yang tiada.

- **Backend API (Test Status):**
  Menjalankan suite ujian unit (`npm test` dalam `api`) menghasilkan **5 Test Suites Gagal** dan **67 Ujian Lulus / 5 Ujian Gagal**.

Laporan di bawah memperincikan setiap masalah dan kegagalan fungsi yang dikesan mengikut komponen.

---

## 2. PENEMUAN MASALAH KHUSUS SANGAT KRITIKAL & UTAMA

### A. Ralat API Backend & Kaedah Terlupa/Hilang (Backend Service Errors)

1. **Kaedah `getAllOrdersForAdmin` & `getOrderByIdWithDetails` Tiada dalam `OrderService`**
   - **Lokasi:** `api/src/controllers/orderController.js` (Baris 110 & 117)
   - **Isu:** `OrderController` memanggil `this.orderService.getAllOrdersForAdmin()` dan `this.orderService.getOrderByIdWithDetails(id)`, tetapi kaedah-kaedah ini **TIDAK WUJUD** dalam `api/src/services/orderService.js`.
   - **Kesan:** Apabila admin cuba membuka atau memuat senarai pesanan (orders) dalam Admin Panel, API memulangkan ralat **500 / 503 Internal Server Error** (`TypeError: this.orderService.getAllOrdersForAdmin is not a function`).

2. **Kegagalan Ujian Schema Drift (`src/schemaDrift.test.js`)**
   - **Isu:** Ralat SQLite `duplicate column name: kisaAciklama`.
   - **Punca:** Fail-fail migrasi D1 dalam `api/migrations/` mempunyai perulangan skema `kisaAciklama` yang cuba ditambah dua kali apabila migrasi dijalankan secara berurutan.

3. **Ketidakpadanan Bahasa Mesej Pengesahan Produk (Validation Error Message)**
   - **Lokasi:** `api/src/controllers/catalog.security.test.js` & `api/src/validators/`
   - **Isu:** Ujian menyemak mesej ralat dalam bahasa Turki (cth. `Fiyat`), manakala pengesyoran backend kini menggunakan Bahasa Melayu (`Harga mestilah nombor...`). Ujian keselamatan gagal disebabkan regex mismatch.

4. **Pengiraan Harga Hardening Checkout Mismatch (`src/services/checkout.hardening.test.js`)**
   - **Isu:** Ujian menjangka jumlah $350 (`expect(result.total).toBe(350)`), tetapi logik harga dalam `checkout` mengembalikan $300 atau format data struktur tetapan JSON yang berbeza (`{ status: "success", data: ... }`).

5. **Ralat Rujukan Pembayaran Tanpa Prefiks (Unprefixed Payment Reference)**
   - **Lokasi:** `api/src/services/paymentService.js` (Baris 45)
   - **Isu:** `TypeError: Cannot read properties of undefined (reading 'paymentProvider')` apabila `this.config` bernilai `undefined` semasa fungsi `getProvider()` dipanggil.

---

### B. Masalah Menu & Fungsi Admin Panel (`admin` & `client/src/pages/admin/`)

1. **Gagal Memuatkan Pesanan (Orders Menu Failure):**
   - Berpunca daripada isu A1 (kaedah `getAllOrdersForAdmin` tiada pada API). Semua tindakan melihat, menapis, dan mencetak slip pesanan tidak dapat berfungsi.

2. **Tetapan Sistem / CMS / Tetapan Pembayaran Tidak Mengemaskini Respons yang Dijangka:**
   - Dalam `SettingsContext.jsx` dan `settingsRoutes.js`, respons API dikembalikan dalam format sarang `{ status: 'success', data: { ... } }`, tetapi sesetengah fungsi pemprosesan menjangka objek terus `{ siteAdi: 'E-Market' }`. Ini menyebabkan sesetengah borang tetapan borang tidak mengemas kini UI secara real-time selepas disimpan.

3. **Penyimpanan Gambar / ImageUploader:**
   - Komponen `ImageUploader.jsx` di Admin dan Client memerlukan kelayakan R2 Cloudflare yang sah. Jika pautan R2 atau kunci S3/Cloudflare tiada, fungsi muat naik gambar gagal secara senyap tanpa tindak balas borang yang mesra pengguna.

---

### C. Masalah Menu & Fungsi Client (Pembeli Frontend)

1. **Jejak Pesanan (Order Tracking Page - `OrderTrackingPage.jsx`):**
   - Fungsi pembatalan pesanan dan paparan maklumat teras boleh gagal jika token penjejakan mengandungi aksara khas yang tidak dilepaskan (escaped) dengan betul pada endpoint.

2. **Penebusan Mata & Program Kesetiaan (Points Redemptions):**
   - Pada `PointsHistory.jsx` dan `PointsRedeem.jsx`, permintaan API untuk menambah/tebus mata ganjaran menghasilkan amaran log `Prisma client has not been initialized with env yet! Run getPrisma(env) in middleware.` sekiranya middleware konteks Prisma tidak dilepaskan dengan tepat dalam environment serverless Hono.

3. **Integrasi Gerbang Pembayaran ToyyibPay / Iyzico / PayTR:**
   - Walaupun ToyyibPay dijadikan penyedia utama bagi pasaran Malaysia (RM), fungsi rujukan simpanan callback dan fallback masih cuba mengakses pembolehubah persekitaran lama yang tiada konfigurasi lengkap.

---

## 3. CADANGAN & STRATEGI PEMBAIKAN (NEXT STEPS)

1. **Baiki Kaedah `OrderService`:**
   - Tambah kaedah `getAllOrdersForAdmin()` dan `getOrderByIdWithDetails(id)` serta pengemaskinian status dalam `api/src/services/orderService.js` dan repository berkenaan.

2. **Kemaskan Ujian Unit API & Ralat Migrasi D1:**
   - Selaraskan fail migrasi D1 supaya tiada lajur bertindih (`kisaAciklama`).
   - Kemaskan ujian pengesahan supaya serasi dengan Bahasa Melayu dan format respons JSON terkini.

3. **Gandingan Pembalas API (API Response Wrapping):**
   - Selaraskan pemulangan format data JSON `{ status: 'success', data: ... }` antara API backend dan penggunaannya dalam React contexts / services.

---
*Laporan ini disimpan dalam fail `AUDIT_REPORT.md` untuk rujukan penuh.*
