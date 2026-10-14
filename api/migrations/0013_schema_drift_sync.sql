-- Fix schema drift for Siparis, Langganan, LanggananItem, Points
ALTER TABLE siparisler ADD COLUMN langgananId TEXT;
ALTER TABLE siparisler ADD COLUMN pointsEarned INTEGER DEFAULT 0;

ALTER TABLE langganan ADD COLUMN nota TEXT;
ALTER TABLE langganan ADD COLUMN guncellenmeTarihi DATETIME;

CREATE TABLE IF NOT EXISTS langganan_items (
    id TEXT PRIMARY KEY,
    langgananId TEXT NOT NULL,
    urunId TEXT NOT NULL,
    kuantiti INTEGER DEFAULT 1,
    harga REAL DEFAULT 0
);

ALTER TABLE points ADD COLUMN id TEXT;
ALTER TABLE points ADD COLUMN updatedAt DATETIME;
