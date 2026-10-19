-- Tambah kolum tema dan install prompt
ALTER TABLE sistem_ayarlar ADD COLUMN theme TEXT;
ALTER TABLE sistem_ayarlar ADD COLUMN installPrompt INTEGER DEFAULT 1;
