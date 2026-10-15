-- Kemaskini rekod sedia ada yang masih bernilai Türkiye atau kosong kepada Malaysia
UPDATE siparisler SET ulke = 'Malaysia' WHERE ulke = 'Türkiye' OR ulke IS NULL OR ulke = '';
