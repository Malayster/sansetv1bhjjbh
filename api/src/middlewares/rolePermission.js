/**
 * Role-based permission middleware.
 *
 * Roles:
 * - superadmin: full access
 * - admin: all except settings
 * - staff: read-only + orders update
 *
 * Superadmin emails are defined in SUPERADMIN_EMAILS env (comma-separated).
 * Default: any authenticated admin is treated as admin.
 */

const ROLE_PERMISSIONS = {
  superadmin: ['*'],
  admin: ['products', 'categories', 'brands', 'orders', 'returns', 'subscriptions', 'analytics', 'upload'],
  staff: ['orders', 'returns', 'subscriptions', 'analytics']
};

function getRole(email, env) {
  const superadmins = (env.SUPERADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (superadmins.includes((email || '').toLowerCase())) return 'superadmin';
  return 'admin';
}

function can(role, resource) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(resource);
}

export function requirePermission(resource) {
  return async (c, next) => {
    const user = c.get('adminUser');
    if (!user) {
      return c.json({ status: 'error', errorMessage: 'Tidak disahkan.' }, 401);
    }

    const role = getRole(user.email, c.env);
    c.set('adminRole', role);

    if (!can(role, resource)) {
      return c.json({ status: 'error', errorMessage: 'Anda tidak mempunyai kebenaran untuk tindakan ini.' }, 403);
    }

    await next();
  };
}

export function getUserRole(email, env) {
  return getRole(email, env);
}
