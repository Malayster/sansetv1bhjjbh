import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API = isLocalhost ? 'http://localhost:8787' : '';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/v1/admin/notifications`, { credentials: 'same-origin' });
      const data = await res.json();
      if (data.status === 'success') {
        setItems(data.data || []);
        setUnread(data.unread || 0);
      }
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const markRead = async (id) => {
    await fetch(`${API}/api/v1/admin/notifications/${id}/read`, { method: 'POST', credentials: 'same-origin' });
    load();
  };

  const markAll = async () => {
    await fetch(`${API}/api/v1/admin/notifications/read-all`, { method: 'POST', credentials: 'same-origin' });
    load();
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', position: 'relative', padding: 8 }}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: 16, height: 16, fontSize: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', width: 320,
          background: 'var(--bg-deep)', border: '1px solid var(--border-glass)',
          borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 100,
          maxHeight: 400, overflow: 'auto'
        }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>Notifikasi</span>
            {unread > 0 && <button onClick={markAll} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: 12 }}>Tanda semua dibaca</button>}
          </div>
          {items.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-muted)' }}>Tiada notifikasi</div>}
          {items.map(n => (
            <div
              key={n.id}
              onClick={() => !n.dibaca && markRead(n.id)}
              style={{
                padding: 12, borderBottom: '1px solid var(--border-glass)',
                background: n.dibaca ? 'transparent' : 'rgba(99,102,241,0.05)',
                cursor: n.dibaca ? 'default' : 'pointer'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{n.tajuk}</div>
              {n.mesej && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{n.mesej}</div>}
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>
                {new Date(n.createdAt).toLocaleString('ms-MY')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
