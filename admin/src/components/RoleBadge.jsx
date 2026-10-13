export default function RoleBadge({ role }) {
  const colors = {
    superadmin: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'Super Admin' },
    admin: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', label: 'Admin' },
    staff: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'Staff' }
  };
  const c = colors[role] || colors.admin;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      background: c.bg,
      color: c.color
    }}>
      {c.label}
    </span>
  );
}
