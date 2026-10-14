-- AlterTable: urunler
-- Drop deprecated table if it exists
DROP TABLE IF EXISTS "renk_kartelasi";

-- Extra Tables
CREATE TABLE IF NOT EXISTS cms_kandungan (
    kunci TEXT PRIMARY KEY,
    kandunganJson TEXT NOT NULL,
    guncellenmeTarihi DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id TEXT PRIMARY KEY,
    tindakan TEXT NOT NULL,
    butiran TEXT,
    pengguna TEXT DEFAULT 'Admin',
    tarikh DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS points (
    eposta TEXT PRIMARY KEY,
    baki INTEGER DEFAULT 0,
    jumlahDiperoleh INTEGER DEFAULT 0,
    jumlahDigunakan INTEGER DEFAULT 0,
    guncellenmeTarihi DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS points_log (
    id TEXT PRIMARY KEY,
    eposta TEXT NOT NULL,
    jumlah INTEGER NOT NULL,
    jenis TEXT NOT NULL,
    nota TEXT,
    rujukan TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS langganan (
    id TEXT PRIMARY KEY,
    eposta TEXT NOT NULL,
    ad TEXT NOT NULL,
    soyad TEXT,
    telefon TEXT,
    alamat TEXT,
    sehir TEXT,
    poskod TEXT,
    frekuensi TEXT DEFAULT 'BULANAN',
    status TEXT DEFAULT 'AKTIF',
    diskaunPeratus REAL DEFAULT 0,
    jumlahAsas REAL DEFAULT 0,
    jumlahAkhir REAL DEFAULT 0,
    paymentToken TEXT,
    skipSeterusnya INTEGER DEFAULT 0,
    tarikhSeterusnya DATETIME,
    olusturulmaTarihi DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS langganan_item (
    id TEXT PRIMARY KEY,
    langgananId TEXT NOT NULL,
    urunId TEXT NOT NULL,
    kuantiti INTEGER DEFAULT 1,
    harga REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS admin_notifications (
    id TEXT PRIMARY KEY,
    tajuk TEXT NOT NULL,
    mesej TEXT NOT NULL,
    jenis TEXT DEFAULT 'info',
    dibaca INTEGER DEFAULT 0,
    tarikh DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed System Settings
INSERT OR REPLACE INTO sistem_ayarlari (id, kargoDesiCarpani, ambarEsikDesi, ucretsizKargoAltLimit, kargoFiyatListesi, maintenanceMode, siteAdi, iletisimEmail, whatsappNumarasi, updatedAt)
VALUES ('global-settings', 8.00, 0, 100.00, '[{"maxWeight": 2, "price": 8.00, "region": "Kedah / Semenanjung"}, {"maxWeight": 5, "price": 12.00, "region": "Kedah / Semenanjung"}, {"maxWeight": 10, "price": 15.00, "region": "Sabah / Sarawak"}]', 0, 'DIN''O EMPIRE', 'dinoempire.my@gmail.com', '60166911020', CURRENT_TIMESTAMP);

-- Seed Categories
INSERT OR REPLACE INTO kategoriler (id, ad, slug, resim, sira, aktif, olusturulmaTarihi, guncellenmeTarihi)
VALUES 
('5fb6ca4e-2a67-49a7-aded-83bba441dae6', 'Pek Kilang', 'pek-kilang', NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fcee8333-aeb6-4dba-85fc-d5908b56e43f', 'Barangan Terpilih', 'barangan-terpilih', NULL, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cc6675ef-466d-4d6d-a51d-121344fefcb4', 'Pakaian & Merch', 'pakaian-merch', NULL, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Brands
INSERT OR REPLACE INTO markalar (id, ad, slug, logoUrl, aktif, sira, olusturulmaTarihi, guncellenmeTarihi)
VALUES 
('e405ba1b-00f9-4d7d-8dfc-ca122a272d29', 'DIN''O EMPIRE', 'dino-empire', NULL, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('5805f1eb-dea3-47a9-9e9d-b1844e8d1878', 'Kilang Kuala Ketil', 'kilang-kuala-ketil', NULL, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Products
INSERT OR REPLACE INTO urunler (id, slug, ad, fiyat, indirimliFiyat, renkSecenekleri, iadeImkaniVar, desi, aciklama, resimUrl, aktif, oneCikan, firsatUrunu, yeniUrun, cokSatanlar, goruntulemeSayisi, satisAdedi, stokAdedi, kategoriId, markaId, olusturulmaTarihi, guncellenmeTarihi)
VALUES 
('9c2410a7-f275-46d6-b4d7-0c44a54cedbd', 'pek-kilang-dino-special', 'Pek Kilang DIN''O Special', 35.00, 28.00, '["Standard"]', 1, 0.5, '<p>Pek eksklusif direct terus dari Kilang Kuala Ketil. Produk terjamin berkualiti tinggi dan berstatus Halal.</p>', 'https://dino-empire.pages.dev/dino-logo.jpg', 1, 1, 1, 1, 1, 0, 0, 200, '5fb6ca4e-2a67-49a7-aded-83bba441dae6', '5805f1eb-dea3-47a9-9e9d-b1844e8d1878', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('4b75c9da-6e1d-47a1-aca8-9021d21f0f33', 'pek-keluarga-dino-empire', 'Pek Keluarga DIN''O EMPIRE', 65.00, 50.00, '["Standard"]', 1, 1.0, '<p>Pek jimat bersaiz besar sesuai untuk seisi keluarga. Diproses bersih mengikut piawaian cut-off kilang.</p>', 'https://dino-empire.pages.dev/dino-logo.jpg', 1, 1, 0, 0, 1, 0, 0, 150, '5fb6ca4e-2a67-49a7-aded-83bba441dae6', 'e405ba1b-00f9-4d7d-8dfc-ca122a272d29', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a0e2c0ee-e9e4-486a-b1aa-c9f5d8b7b809', 't-shirt-rasmi-dino-empire', 'T-Shirt Rasmi DIN''O EMPIRE', 45.00, 39.00, '["Hitam","Putih"]', 1, 0.3, '<p>T-Shirt kain cotton berkualiti tinggi dengan logo sulam DIN''O EMPIRE. Selesa dipakai harian.</p>', 'https://dino-empire.pages.dev/dino-logo.jpg', 1, 0, 1, 1, 0, 0, 0, 100, 'cc6675ef-466d-4d6d-a51d-121344fefcb4', 'e405ba1b-00f9-4d7d-8dfc-ca122a272d29', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
