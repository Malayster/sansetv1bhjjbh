export default function SimpleBarChart({ data = [], valueKey = 'count', labelKey = 'date' }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
      {data.map((d, i) => {
        const h = ((d[valueKey] || 0) / max) * 100;
        const label = (d[labelKey] || '').slice(5); // MM-DD
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{d[valueKey] || 0}</div>
            <div style={{
              width: '100%',
              height: `${Math.max(h, 4)}%`,
              background: 'var(--color-primary)',
              borderRadius: 4,
              minHeight: 4
            }} />
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}
