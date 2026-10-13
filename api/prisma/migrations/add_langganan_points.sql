-- Migration: add_langganan_points
-- Jalankan: wrangler d1 execute <DB_NAME> --file=api/prisma/migrations/add_langganan_points.sql
-- Atau melalui Cloudflare Dashboard → D1 → Console

-- ============================================
-- 1. Jadual baru: Langganan
-- ============================================
CREATE TABLE IF NOT EXISTS langganan (
  id TEXT PRIMARY KEY,
  eposta TEXT NOT NULL,
  ad TEXT NOT NULL,
  soyad TEXT NOT NULL DEFAULT '',
  telefon TEXT NOT NULL DEFAULT '',
  alamat TEXT NOT NULL DEFAULT '',
  sehir TEXT NOT NULL DEFAULT '',
  poskod TEXT NOT NULL DEFAULT '',
  frekuensi TEXT NOT NULL DEFAULT 'BULANAN',
  status TEXT NOT NULL DEFAULT 'AKTIF',
  tarikhSeterusnya DATETIME NOT NULL,
  skipSeterusnya INTEGER NOT NULL DEFAULT 0,
  diskaunPeratus REAL NOT NULL DEFAULT 0,
  jumlahAsas REAL NOT NULL,
  jumlahAkhir REAL NOT NULL,
  paymentToken TEXT,
  nota TEXT,
  olusturulmaTarihi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  guncellenmeTarihi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_langganan_eposta ON langganan(eposta);
CREATE INDEX IF NOT EXISTS idx_langganan_status ON langganan(status);
CREATE INDEX IF NOT EXISTS idx_langganan_tarikh ON langganan(tarikhSeterusnya);

-- ============================================
-- 2. Jadual baru: LanggananItem
-- ============================================
CREATE TABLE IF NOT EXISTS langganan_items (
  id TEXT PRIMARY KEY,
  langgananId TEXT NOT NULL,
  urunId TEXT NOT NULL,
  kuantiti INTEGER NOT NULL DEFAULT 1,
  harga REAL NOT NULL,
  FOREIGN KEY (langgananId) REFERENCES langganan(id) ON DELETE CASCADE,
  FOREIGN KEY (urunId) REFERENCES urunler(id)
);

CREATE INDEX IF NOT EXISTS idx_langganan_items_langganan ON langganan_items(langgananId);

-- ============================================
-- 3. Jadual baru: Points
-- ============================================
CREATE TABLE IF NOT EXISTS points (
  id TEXT PRIMARY KEY,
  eposta TEXT NOT NULL UNIQUE,
  baki INTEGER NOT NULL DEFAULT 0,
  jumlahDiperoleh INTEGER NOT NULL DEFAULT 0,
  jumlahDigunakan INTEGER NOT NULL DEFAULT 0,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Jadual baru: PointsLog
-- ============================================
CREATE TABLE IF NOT EXISTS points_log (
  id TEXT PRIMARY KEY,
  eposta TEXT NOT NULL,
  jumlah INTEGER NOT NULL,
  jenis TEXT NOT NULL,
  nota TEXT,
  rujukan TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_points_log_eposta ON points_log(eposta);

-- ============================================
-- 5. Kolum baru pada siparisler (jalankan jika belum ada)
-- Jika ralat "duplicate column", abaikan — kolum sudah wujud.
-- ============================================
-- ALTER TABLE siparisler ADD COLUMN langgananId TEXT;
-- ALTER TABLE siparisler ADD COLUMN pointsEarned INTEGER DEFAULT 0;
-- CREATE INDEX IF NOT EXISTS idx_siparis_langganan ON siparisler(langgananId);
