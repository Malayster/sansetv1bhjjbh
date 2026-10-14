-- Kemaskini rekod sedia ada yang masih Türkiye (jika ada)
UPDATE siparisler SET ulke = 'Malaysia' WHERE ulke = 'Türkiye' OR ulke IS NULL OR ulke = '';
