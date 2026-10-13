import { Shield } from 'lucide-react';

const ROLES = [
  {
    name: 'Super Admin',
    key: 'superadmin',
    color: '#ef4444',
    desc: 'Akses penuh termasuk tetapan dan audit.',
    perms: ['Semua']
  },
  {
    name: 'Admin',
    key: 'admin',
    color: '#6366f1',
    desc: 'Urus produk, pesanan, langganan. Tiada akses tetapan.',
    perms: ['Produk', 'Kategori', 'Jenama', 'Pesanan', 'Pemulangan', 'Langganan', 'Analytics']
  },
  {
    name: 'Staff',
    key: 'staff',
    color: '#10b981',
    desc: 'Urus pesanan dan pemulangan sahaja.',
    perms: ['Pesanan', 'Pemulangan', 'Analytics']
  }
];

export default function RolesTab() {
  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Role & Kebenaran</h1>
      </div>

      <div className="dashboard-grid">
        {ROLES.map(r => (
          <div key={r.key} className="card" style={{ borderTop: `3px solid ${r.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Shield size={18} color={r.color} />
              <span style={{ fontWeight: 700 }}>{r.name}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>{r.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {r.perms.map(p => (
                <span key={p} className="badge badge-secondary" style={{ fontSize: 11 }}>{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="kpi-title" style={{ marginBottom: 12 }}>Cara tetapkan role</div>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          Role ditentukan melalui environment variables di Cloudflare Workers:<br />
          <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: 4 }}>SUPERADMIN_EMAILS</code> — e-mel superadmin (dipisahkan koma)<br />
          <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: 4 }}>STAFF_EMAILS</code> — e-mel staff (dipisahkan koma)<br />
          E-mel lain akan jadi Admin secara automatik.
        </p>
      </div>
    </div>
  );
}
