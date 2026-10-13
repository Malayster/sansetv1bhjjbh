-- Migration: add columns to siparisler
-- Jalankan SELEPAS add_langganan_points.sql
-- Jika ralat "duplicate column name", kolum sudah wujud — abaikan.

ALTER TABLE siparisler ADD COLUMN langgananId TEXT;
ALTER TABLE siparisler ADD COLUMN pointsEarned INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_siparis_langganan ON siparisler(langgananId);
