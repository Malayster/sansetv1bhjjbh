import { useState, useEffect } from 'react';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ADMIN_API_URL = isLocalhost ? 'http://localhost:8787' : '';

const ROLE_PERMISSIONS = {
  superadmin: ['*'],
  admin: [
    'products:read', 'products:write',
    'categories:read', 'categories:write',
    'brands:read', 'brands:write',
    'orders:read', 'orders:write',
    'returns:read', 'returns:write',
    'subscriptions:read', 'subscriptions:write',
    'analytics:read', 'upload:write', 'notifications:read'
  ],
  staff: [
    'orders:read', 'orders:write',
    'returns:read', 'returns:write',
    'subscriptions:read', 'analytics:read', 'notifications:read'
  ]
};

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

  const can = (resource, action = 'read') => {
    if (!role) return false;
    const perms = ROLE_PERMISSIONS[role] || [];
    if (perms.includes('*')) return true;
    return perms.includes(`${resource}:${action}`) || perms.includes(resource);
  };

  return { role, email, loading, can };
}
