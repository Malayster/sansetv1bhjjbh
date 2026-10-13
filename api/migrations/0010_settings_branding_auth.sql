ALTER TABLE sistem_ayarlari ADD COLUMN logoUrl TEXT;
ALTER TABLE sistem_ayarlari ADD COLUMN logoMode TEXT DEFAULT 'image';
ALTER TABLE sistem_ayarlari ADD COLUMN faviconUrl TEXT;
ALTER TABLE sistem_ayarlari ADD COLUMN adminPin TEXT DEFAULT 'dino1234';
ALTER TABLE sistem_ayarlari ADD COLUMN adminEmail TEXT DEFAULT 'dinoempireenterprise@gmail.com';
