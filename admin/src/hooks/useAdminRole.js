import { useState, useEffect } from 'react';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ADMIN_API_URL = isLocalhost ? 'http://localhost:8787' : '';

export function useAdminRole() {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ADMIN_API_URL}/api/v1/admin/me`, { credentials: 'same-origin' })
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setRole(d.data.role);
          setEmail(d.data.email);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const can = (resource) => {
    if (!role) return false;
    if (role === 'superadmin') return true;
    const map = {
      admin: ['products', 'categories', 'brands', 'orders', 'returns', 'subscriptions', 'analytics', 'upload'],
      staff: ['orders', 'returns', 'subscriptions', 'analytics']
    };
    return (map[role] || []).includes(resource);
  };

  return { role, email, loading, can };
}
