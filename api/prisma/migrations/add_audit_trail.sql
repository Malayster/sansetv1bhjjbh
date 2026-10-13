-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_trail (
  id TEXT PRIMARY KEY,
  adminEmail TEXT,
  tindakan TEXT NOT NULL,
  sumber TEXT,
  sumberId TEXT,
  dataLama TEXT,
  dataBaru TEXT,
  ip TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_trail_admin ON audit_trail(adminEmail);
CREATE INDEX IF NOT EXISTS idx_audit_trail_sumber ON audit_trail(sumber);
CREATE INDEX IF NOT EXISTS idx_audit_trail_createdAt ON audit_trail(createdAt);
