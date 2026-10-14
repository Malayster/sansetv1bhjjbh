import { useState } from 'react';

export default function SettingsTab({
  settings,
  setSettings,
  saveSettings,
  loading
}) {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeMsg, setEmailChangeMsg] = useState('');

  const requestEmailChange = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      setEmailChangeMsg('E-mel tidak sah.');
      return;
    }
    setEmailChangeLoading(true);
    setEmailChangeMsg('');
    try {
      const res = await fetch('/api/v1/admin/request-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: newAdminEmail })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setOtpSent(true);
        setEmailChangeMsg(data.message || 'OTP dihantar.');
      } else {
        setEmailChangeMsg(data.errorMessage || 'Gagal hantar OTP.');
      }
    } catch (e) {
      setEmailChangeMsg('Ralat rangkaian.');
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const verifyEmailChange = async () => {
    if (!otp || otp.length !== 6) {
      setEmailChangeMsg('Masukkan OTP 6 digit.');
      return;
    }
    setEmailChangeLoading(true);
    setEmailChangeMsg('');
    try {
      const res = await fetch('/api/v1/admin/verify-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: newAdminEmail, otp })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setEmailChangeMsg(data.message || 'E-mel berjaya ditukar.');
        setOtpSent(false);
        setOtp('');
        setNewAdminEmail('');
        if (data.newEmail) {
          setSettings({ ...settings, adminEmail: data.newEmail, iletisimEmail: data.newEmail });
        }
      } else {
        setEmailChangeMsg(data.errorMessage || 'OTP tidak sah.');
      }
    } catch (e) {
      setEmailChangeMsg('Ralat rangkaian.');
    } finally {
      setEmailChangeLoading(false);
    }
  };

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Tetapan Sistem</h1>
      </div>

      <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            🔒 Tukar E-mel Pentadbir (Dengan OTP)
          </h3>
          <div className="form-group">
            <label className="form-label">E-mel Baharu</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@dinoempire.my"
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              disabled={otpSent}
            />
          </div>
          {!otpSent ? (
            <button type="button" className="btn btn-secondary" onClick={requestEmailChange} disabled={emailChangeLoading}>
              {emailChangeLoading ? 'Menghantar...' : 'Hantar OTP'}
            </button>
          ) : (
            <>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Kod OTP (6 digit)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={verifyEmailChange} disabled={emailChangeLoading}>
                {emailChangeLoading ? 'Mengesahkan...' : 'Sahkan & Tukar E-mel'}
              </button>
            </>
          )}
          {emailChangeMsg && <p style={{ marginTop: 12, color: emailChangeMsg.includes('berjaya') || emailChangeMsg.includes('dihantar') ? '#16a34a' : '#dc2626' }}>{emailChangeMsg}</p>}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            🏪 Maklumat Am Laman
          </h3>
          <div className="form-group">
            <label className="form-label">Nama Laman</label>
            <input
              type="text" className="form-control" placeholder="DIN'O EMPIRE"
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
              type="text" className="form-control" placeholder="Kuala Ketil, Kedah"
              value={settings.adres || ''}
              onChange={e => setSettings({ ...settings, adres: e.target.value })}
            />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            📞 Maklumat Hubungan
          </h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">E-mel Hubungan</label>
              <input
                type="email" className="form-control" placeholder="dinoempire.my@gmail.com"
                value={settings.iletisimEmail || ''}
                onChange={e => setSettings({ ...settings, iletisimEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telefon</label>
              <input
                type="text" className="form-control" placeholder="016-6911020"
                value={settings.telefon || ''}
                onChange={e => setSettings({ ...settings, telefon: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nombor WhatsApp</label>
            <input
              type="text" className="form-control" placeholder="60132359647"
              value={settings.whatsappNumarasi || ''}
              onChange={e => setSettings({ ...settings, whatsappNumarasi: e.target.value })}
            />
          </div>
        </div>

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
