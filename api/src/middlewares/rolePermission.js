/**
 * Role-based permission middleware.
 *
 * Roles (via env):
 * - SUPERADMIN_EMAILS: full access
 * - STAFF_EMAILS: limited access
 * - Default: admin
 *
 * Permissions are resource:action (e.g. products:read, products:write).
 */

const ROLE_PERMISSIONS = {
  superadmin: ['*'],
  admin: ['*'],
  staff: [
    'orders:read', 'orders:write', 'orders',
    'returns:read', 'returns:write', 'returns',
    'subscriptions:read', 'subscriptions:write', 'subscriptions',
    'analytics:read', 'analytics',
    'notifications:read', 'notifications'
  ]
};

function getRole(email, env = {}) {
  const e = (email || '').toLowerCase();
  const superadmins = (env.SUPERADMIN_EMAILS || 'admin@dinoempire.my').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const staff = (env.STAFF_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (superadmins.includes(e) || e === 'admin@dinoempire.my' || e.includes('admin')) return 'superadmin';
  if (staff.includes(e)) return 'staff';
  return 'admin';
}

function can(role, resource, action = 'read') {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes('*')) return true;
  const key = `${resource}:${action}`;
  return perms.includes(key) || perms.includes(resource) || perms.includes(`${resource}:write`) || perms.includes(`${resource}:read`);
}

export function requirePermission(resource, action = 'read') {
  return async (c, next) => {
    const user = c.get('adminUser');
    if (!user) {
      return c.json({ status: 'error', errorMessage: 'Tidak disahkan.' }, 401);
    }

    const role = getRole(user.email, c.env);
    c.set('adminRole', role);

    if (!can(role, resource, action)) {
      return c.json({ status: 'error', errorMessage: 'Anda tidak mempunyai kebenaran untuk tindakan ini.' }, 403);
    }

    await next();
  };
}

export function getUserRole(email, env) {
  return getRole(email, env);
}

export function getPermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}
