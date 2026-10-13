export default function SettingsTab({
  settings,
  setSettings,
  saveSettings,
  loading
}) {
  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Tetapan Sistem</h1>
      </div>

      <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>

        {/* Maklumat Am Laman */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            🏪 Maklumat Am Laman
          </h3>
          <div className="form-group">
            <label className="form-label">Nama Laman</label>
            <input
              type="text" className="form-control" placeholder="E-Market"
              value={settings.siteAdi || ''}
              onChange={e => setSettings({ ...settings, siteAdi: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Teks Tentang Kami</label>
            <textarea
              className="form-control" rows={4}
              placeholder="Pengenalan ringkas tentang syarikat anda..."
              value={settings.hakkindaMetni || ''}
              onChange={e => setSettings({ ...settings, hakkindaMetni: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <input
              type="text" className="form-control" placeholder="Kuala Lumpur, Malaysia"
              value={settings.adres || ''}
              onChange={e => setSettings({ ...settings, adres: e.target.value })}
            />
          </div>
        </div>

        {/* Maklumat Hubungan */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            📞 Maklumat Hubungan
          </h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">E-mel Hubungan</label>
              <input
                type="email" className="form-control" placeholder="info@example.com"
                value={settings.iletisimEmail || ''}
                onChange={e => setSettings({ ...settings, iletisimEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telefon</label>
              <input
                type="text" className="form-control" placeholder="+60 12-000 0000"
                value={settings.telefon || ''}
                onChange={e => setSettings({ ...settings, telefon: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nombor WhatsApp</label>
            <input
              type="text" className="form-control" placeholder="60123456789"
              value={settings.whatsappNumarasi || ''}
              onChange={e => setSettings({ ...settings, whatsappNumarasi: e.target.value })}
            />
          </div>
        </div>

        {/* Media Sosial */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            📱 Media Sosial
          </h3>
          <div className="form-group">
            <label className="form-label">Instagram</label>
            <input type="url" className="form-control" value={settings.instagramUrl || ''} onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Facebook</label>
            <input type="url" className="form-control" value={settings.facebookUrl || ''} onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Twitter / X</label>
            <input type="url" className="form-control" value={settings.twitterUrl || ''} onChange={e => setSettings({ ...settings, twitterUrl: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">YouTube</label>
            <input type="url" className="form-control" value={settings.youtubeUrl || ''} onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })} />
          </div>
        </div>

        {/* Mod Penyelenggaraan */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            ⚙️ Mod Penyelenggaraan
          </h3>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="checkbox"
              id="maintenance"
              checked={!!settings.maintenanceMode}
              onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            <label htmlFor="maintenance" className="form-label" style={{ margin: 0 }}>Aktifkan mod penyelenggaraan</label>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Tetapan'}
          </button>
        </div>
      </form>
    </div>
  );
}
