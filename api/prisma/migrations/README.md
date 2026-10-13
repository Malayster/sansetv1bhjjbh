# D1 Migration — Langganan & Points

## Jadual yang dicipta
- `langganan`
- `langganan_items`
- `points`
- `points_log`

## Kolum baru pada `siparisler`
- `langgananId`
- `pointsEarned`

---

## Cara jalankan

### 1. Preview / Local
```bash
cd api
npx wrangler d1 execute ecommerceflaredev-d1-preview --file=prisma/migrations/add_langganan_points.sql
npx wrangler d1 execute ecommerceflaredev-d1-preview --file=prisma/migrations/add_siparis_columns.sql
```

### 2. Staging
```bash
cd api
npx wrangler d1 execute ecommerceflaredev-d1-staging --env staging --file=prisma/migrations/add_langganan_points.sql
npx wrangler d1 execute ecommerceflaredev-d1-staging --env staging --file=prisma/migrations/add_siparis_columns.sql
```

### 3. Production
```bash
cd api
npx wrangler d1 execute ecommerceflaredev-d1-production --env production --file=prisma/migrations/add_langganan_points.sql
npx wrangler d1 execute ecommerceflaredev-d1-production --env production --file=prisma/migrations/add_siparis_columns.sql
```

### Alternatif: Cloudflare Dashboard
1. Buka **Workers & Pages → D1**
2. Pilih database
3. Pergi ke **Console**
4. Paste kandungan `add_langganan_points.sql` → Run
5. Paste kandungan `add_siparis_columns.sql` → Run
   - Jika muncul ralat `duplicate column`, abaikan (kolum sudah ada)

---

## Semak
```sql
SELECT name FROM sqlite_master WHERE type='table' AND name IN ('langganan','langganan_items','points','points_log');
PRAGMA table_info(siparisler);
```
