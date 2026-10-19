-- Tambah kolum tema dan install prompt
ALTER TABLE sistem_ayarlari ADD COLUMN theme TEXT;
ALTER TABLE sistem_ayarlari ADD COLUMN installPrompt INTEGER DEFAULT 1;
