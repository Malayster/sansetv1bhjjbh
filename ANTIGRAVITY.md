# ANTIGRAVITY.md — Arahan untuk Gemini Agent (DIN'O EMPIRE)

Anda adalah agent Gemini yang bekerja dalam Antigravity / VSCodium pada repo **Malayster/sansetv1bhjjbh**.

**Tugas anda**: Jalankan semua langkah di bawah secara berperingkat sehingga selesai. Jangan berhenti separuh jalan. Commit setiap perubahan dengan mesej jelas.

---

## 0. TUGAS KRITIKAL (BUAT SEKARANG)

### 0.1 Pulihkan AdminDashboardPage.jsx
Fail `client/src/pages/admin/AdminDashboardPage.jsx` terpotong secara tidak sengaja. Pulihkan dari commit yang betul:

```bash
git checkout 431a4ac57c1cf8cb110e3b7acd5d06ed270aa0c6 -- client/src/pages/admin/AdminDashboardPage.jsx
```

### 0.2 Betulkan Logout
Dalam `client/src/pages/admin/AdminDashboardPage.jsx`, ganti fungsi `handleLogout` dengan:

```javascript
const handleLogout = () => {
    localStorage.removeItem('dino_admin_auth');
    localStorage.removeItem('dino_admin_email');
    localStorage.removeItem('token');
    localStorage.removeItem('dino_admin_login_time');
    if (window.location.hostname === 'admin.dinoempire.my') {
        window.location.assign('/cdn-cgi/access/logout');
    } else {
        window.location.href = 'https://dinoempire.my';
    }
};
```

### 0.3 Betulkan Pautan Homepage
Pastikan sebarang pautan "Kembali ke Laman Kedai" / logo / homepage dalam dashboard pergi ke `https://dinoempire.my` (bukan kekal di `admin.dinoempire.my`).

Guna `window.location.href = 'https://dinoempire.my'` atau `<a href="https://dinoempire.my">`.

### 0.4 Deploy
```bash
cd admin
npm run deploy
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

**Jangan guna perkataan Turki**. Ganti dengan Melayu atau English.

---

## 2. Peraturan Mutlak

1. Jangan hardcode secret dalam kod atau `wrangler.toml` [vars]. Guna `wrangler secret put`.
2. Setiap produk mesti ada sekurang-kurangnya 2 gambar.
3. Jangan ubah schema D1 tanpa migration baru di `api/migrations/`.
4. Commit kecil, mesej format: `fix:`, `feat:`, `chore:`, `docs:`.
5. Pastikan mobile + tablet responsive jika ubah UI.

---

## 3. Cloudflare Access (Sudah Disahkan)

| Item | Nilai |
|------|-------|
| Team Domain | `https://dinoempire.cloudflareaccess.com` |
| POLICY_AUD | `136dc03441caed4570bc9f028a51490534d542013a7c200830b08e5f0e801adc` |
| Domain | `admin.dinoempire.my` |

Jika belum diset:
```bash
cd api
npx wrangler secret put TEAM_DOMAIN
# https://dinoempire.cloudflareaccess.com

npx wrangler secret put POLICY_AUD
# 136dc03441caed4570bc9f028a51490534d542013a7c200830b08e5f0e801adc

npx wrangler deploy
```

---

## 4. Perintah Berguna

```bash
# Deploy Admin (build dari client)
cd admin && npm run deploy

# Deploy API
cd api && npx wrangler deploy

# Deploy Client
cd client && npm run build && npx wrangler deploy
```

---

**Mula sekarang.** Jalankan seksyen 0.1 → 0.2 → 0.3 → 0.4 dahulu.
