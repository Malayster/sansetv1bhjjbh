-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  jenis TEXT NOT NULL,
  tajuk TEXT NOT NULL,
  mesej TEXT,
  rujukan TEXT,
  dibaca INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_dibaca ON notifications(dibaca);
CREATE INDEX IF NOT EXISTS idx_notifications_createdAt ON notifications(createdAt);
