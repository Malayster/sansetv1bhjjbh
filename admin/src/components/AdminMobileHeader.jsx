import { Menu, X } from 'lucide-react';

export default function AdminMobileHeader({ sidebarOpen, setSidebarOpen, title }) {
  return (
    <div className="admin-mobile-header" style={{
      display: 'none',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-color, #333)',
      background: 'var(--bg-secondary, #1a1a1a)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 8 }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <span style={{ fontWeight: 700, fontSize: 16 }}>{title || 'Admin'}</span>
      <div style={{ width: 40 }} />
    </div>
  );
}
