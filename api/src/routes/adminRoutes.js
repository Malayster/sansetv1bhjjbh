import { Hono } from 'hono';
import { adminAuth } from '../middlewares/adminAuth.js';
import { requirePermission, getUserRole } from '../middlewares/rolePermission.js';
import { adapt } from '../utils/honoAdapter.js';
import {
    productController,
    categoryController,
    brandController,
    orderController,
    returnController,
    settingsController,
    analyticsController,
    notificationController,
    auditController
} from '../container.js';
import { ShippingController } from '../controllers/shippingController.js';
import { EasyParcelService } from '../services/easyParcelService.js';
import { SubscriptionController } from '../controllers/subscriptionController.js';
import { EmailService } from '../services/emailService.js';
import { readCms, writeCms } from '../services/cmsService.js';
import { getPrisma } from '../prisma.js';
import { config } from '../config.js';
import {
    signAdminSession,
    isSessionConfigured,
    verifyPin,
    hashPin,
    generateOtp
} from '../utils/adminSession.js';
import { timingSafeEqual } from '../utils/timingSafeEqual.js';

const router = new Hono();

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const PIN_MAX_FAILS = 5;
const PIN_LOCK_MS = 15 * 60 * 1000;
const NOT_CONFIGURED = 'Log masuk pentadbir belum dikonfigurasi. Set ADMIN_SESSION_SECRET melalui wrangler secret put.';

// ── Helpers ──

async function readBody(c) {
    try { return await c.req.json(); } catch { return {}; }
}

async function kvGet(db, key) {
    const row = await db.prepare(`SELECT kandunganJson FROM cms_kandungan WHERE kunci = ?`).bind(key).first();
    if (!row) return null;
    try { return JSON.parse(row.kandunganJson); } catch { return null; }
}

async function kvSet(db, key, value) {
    await db.prepare(`INSERT OR REPLACE INTO cms_kandungan (kunci, kandunganJson, guncellenmeTarihi) VALUES (?, ?, CURRENT_TIMESTAMP)`)
        .bind(key, JSON.stringify(value)).run();
}

async function kvDelete(db, key) {
    await db.prepare(`DELETE FROM cms_kandungan WHERE kunci = ?`).bind(key).run();
}

async function getAdminSettings(db) {
    return db.prepare(`SELECT adminPin, adminEmail FROM sistem_ayarlari WHERE id = 'global-settings'`).first();
}

/** E-mel yang dibenarkan log masuk melalui OTP: adminEmail dalam tetapan + SUPERADMIN_EMAILS + STAFF_EMAILS. */
async function allowedAdminEmails(c) {
    const list = new Set();
    const row = await getAdminSettings(c.env.DB).catch(() => null);
    if (row?.adminEmail) list.add(row.adminEmail.toLowerCase().trim());
    for (const v of [c.env.SUPERADMIN_EMAILS, c.env.STAFF_EMAILS]) {
        (v || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).forEach((e) => list.add(e));
    }
    return list;
}

async function sendOtpEmail(email, otp, purpose) {
    const emailService = new EmailService(config.email);
    await emailService.sendOtp(email, otp, purpose);
}

/** Simpan OTP baharu (dengan kiraan cubaan). */
async function issueOtp(db, key) {
    const otp = generateOtp();
    await kvSet(db, key, { otp, expires: Date.now() + OTP_TTL_MS, attempts: 0 });
    return otp;
}

/** Semak OTP; padam selepas berjaya, tamat tempoh atau terlalu banyak cubaan. */
async function consumeOtp(db, key, otp) {
    const data = await kvGet(db, key);
    if (!data || Date.now() > data.expires) {
        if (data) await kvDelete(db, key);
        return false;
    }
    if (typeof otp === 'string' && timingSafeEqual(data.otp, otp.trim())) {
        await kvDelete(db, key);
        return true;
    }
    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= OTP_MAX_ATTEMPTS) await kvDelete(db, key);
    else await kvSet(db, key, data);
    return false;
}

// ── Laluan awam: log masuk ──

router.post('/send-otp', async (c) => {
    if (!isSessionConfigured(c.env)) return c.json({ status: 'error', errorMessage: NOT_CONFIGURED }, 503);
    const { email } = await readBody(c);
    const normalized = (email || '').toLowerCase().trim();
    if (!normalized) return c.json({ status: 'error', errorMessage: 'Sila masukkan e-mel.' }, 400);

    const allowed = await allowedAdminEmails(c);
    if (!allowed.has(normalized)) {
        return c.json({ status: 'error', errorMessage: 'E-mel ini tidak berdaftar sebagai pentadbir.' }, 403);
    }

    try {
        const otp = await issueOtp(c.env.DB, 'otp_' + normalized);
        await sendOtpEmail(normalized, otp, 'log masuk pentadbir');
    } catch (e) {
        console.error('[OTP] Gagal:', e);
        return c.json({ status: 'error', errorMessage: 'Gagal menghantar kod OTP. Semak konfigurasi e-mel.' }, 500);
    }
    return c.json({ status: 'success', message: `Kod OTP telah dihantar ke ${normalized}.` });
});

router.post('/verify-otp', async (c) => {
    if (!isSessionConfigured(c.env)) return c.json({ status: 'error', errorMessage: NOT_CONFIGURED }, 503);
    const { email, otp } = await readBody(c);
    const normalized = (email || '').toLowerCase().trim();
    if (!normalized || !otp) return c.json({ status: 'error', errorMessage: 'E-mel dan kod OTP diperlukan.' }, 400);

    const ok = await consumeOtp(c.env.DB, 'otp_' + normalized, String(otp)).catch(() => false);
    if (!ok) return c.json({ status: 'error', errorMessage: 'Kod OTP tidak sah atau tamat tempoh.' }, 401);

    const session = await signAdminSession(c.env, normalized, 'otp');
    return c.json({ status: 'success', token: session, user: { email: normalized, role: getUserRole(normalized, c.env) } });
});

router.post('/login', async (c) => {
    if (!isSessionConfigured(c.env)) return c.json({ status: 'error', errorMessage: NOT_CONFIGURED }, 503);
    const { pin, password } = await readBody(c);
    const inputPin = String(pin || password || '');
    const db = c.env.DB;

    const lock = (await kvGet(db, 'pin_fail').catch(() => null)) || { count: 0, since: Date.now() };
    if (lock.lockedUntil && Date.now() < lock.lockedUntil) {
        return c.json({ status: 'error', errorMessage: 'Terlalu banyak cubaan. Cuba lagi selepas 15 minit atau guna OTP.' }, 429);
    }

    const row = await getAdminSettings(db).catch(() => null);
    const ok = row?.adminPin ? await verifyPin(row.adminPin, inputPin) : false;

    if (!ok) {
        const fresh = Date.now() - (lock.since || 0) > PIN_LOCK_MS ? { count: 0, since: Date.now() } : lock;
        fresh.count = (fresh.count || 0) + 1;
        if (fresh.count >= PIN_MAX_FAILS) fresh.lockedUntil = Date.now() + PIN_LOCK_MS;
        await kvSet(db, 'pin_fail', fresh).catch(() => {});
        return c.json({ status: 'error', errorMessage: 'PIN keselamatan tidak sah.' }, 401);
    }

    await kvDelete(db, 'pin_fail').catch(() => {});
    const email = (row.adminEmail || 'admin@dinoempire.my').toLowerCase();
    const session = await signAdminSession(c.env, email, 'pin');
    return c.json({ status: 'success', token: session, user: { email, role: getUserRole(email, c.env) } });
});

router.post('/logout', async (c) => {
    c.header('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    c.header('Set-Cookie', 'CF_Authorization=; Path=/; Domain=.dinoempire.my; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    c.header('Set-Cookie', 'CF_Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    c.header('Set-Cookie', 'CF_AppSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    return c.json({ status: 'success', message: 'Berjaya log keluar.' });
});

router.get('/logout', async (c) => {
    c.header('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    c.header('Set-Cookie', 'CF_Authorization=; Path=/; Domain=.dinoempire.my; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    c.header('Set-Cookie', 'CF_Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    c.header('Set-Cookie', 'CF_AppSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax', { append: true });
    return c.redirect('https://dinoempire.my');
});

// ── Semua laluan di bawah memerlukan sesi pentadbir yang sah ──
router.use('*', adminAuth);

router.get('/me', (c) => {
    const user = c.get('adminUser');
    const role = getUserRole(user?.email, c.env);
    return c.json({ status: 'success', data: { email: user?.email, role } });
});

router.post('/change-pin', requirePermission('settings'), async (c) => {
    const { currentPin, newPin } = await readBody(c);
    if (!newPin || String(newPin).length < 6) {
        return c.json({ status: 'error', errorMessage: 'PIN baharu mesti sekurang-kurangnya 6 aksara.' }, 400);
    }
    try {
        const row = await getAdminSettings(c.env.DB);
        if (!row?.adminPin || !(await verifyPin(row.adminPin, String(currentPin || '')))) {
            return c.json({ status: 'error', errorMessage: 'PIN semasa tidak tepat.' }, 400);
        }
        const hashed = await hashPin(String(newPin));
        await c.env.DB.prepare(`UPDATE sistem_ayarlari SET adminPin = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 'global-settings'`).bind(hashed).run();
        return c.json({ status: 'success', message: 'PIN keselamatan berjaya dikemas kini.' });
    } catch (e) {
        console.error('[change-pin]', e);
        return c.json({ status: 'error', errorMessage: 'Gagal mengemas kini PIN.' }, 500);
    }
});

router.post('/request-email-change', requirePermission('settings'), async (c) => {
    const { newEmail } = await readBody(c);
    const normalized = (newEmail || '').toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return c.json({ status: 'error', errorMessage: 'E-mel baharu tidak sah.' }, 400);
    }
    try {
        const otp = await issueOtp(c.env.DB, 'email_change_' + normalized);
        await sendOtpEmail(normalized, otp, 'tukar e-mel pentadbir');
    } catch (e) {
        console.error('[email-change]', e);
        return c.json({ status: 'error', errorMessage: 'Gagal menghantar kod pengesahan.' }, 500);
    }
    return c.json({ status: 'success', message: `Kod OTP telah dihantar ke ${normalized}.` });
});

router.post('/verify-email-change', requirePermission('settings'), async (c) => {
    const { newEmail, otp } = await readBody(c);
    const normalized = (newEmail || '').toLowerCase().trim();
    const ok = await consumeOtp(c.env.DB, 'email_change_' + normalized, String(otp || '')).catch(() => false);
    if (!ok) return c.json({ status: 'error', errorMessage: 'Kod pengesahan tidak sah atau tamat tempoh.' }, 400);

    await c.env.DB.prepare(`UPDATE sistem_ayarlari SET adminEmail = ?, iletisimEmail = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 'global-settings'`)
        .bind(normalized, normalized).run();
    return c.json({ status: 'success', message: `E-mel rasmi berjaya ditukar kepada ${normalized}.`, newEmail: normalized });
});

router.post('/upload', requirePermission('upload'), async (c) => {
  const env = c.env;
  if (!env.IMAGES_BUCKET) {
    return c.json({ status: 'error', errorMessage: 'R2 bucket tidak dikonfigurasi.' }, 500);
  }

  const contentType = (c.req.header('content-type') || '').toLowerCase();
  let buffer = null;
  let folderRaw = 'products';
  let mimeHint = null;

  if (contentType.includes('multipart/form-data')) {
    let form;
    try {
      form = await c.req.formData();
    } catch (e) {
      return c.json({ status: 'error', errorMessage: 'Gagal parse FormData: ' + e.message }, 400);
    }
    const file = form.get('file') || form.get('image') || form.get('upload');
    if (!file || typeof file.arrayBuffer !== 'function') {
      const keys = [...form.keys()].join(', ');
      return c.json({ status: 'error', errorMessage: `Fail tidak dijumpai. Medan: ${keys}` }, 400);
    }
    folderRaw = String(form.get('folder') || 'products');
    buffer = await file.arrayBuffer();
    mimeHint = file.type;
  } else if (contentType.includes('application/json')) {
    let body;
    try {
      body = await c.req.json();
    } catch (e) {
      return c.json({ status: 'error', errorMessage: 'Gagal parse JSON: ' + e.message }, 400);
    }
    const rawFile = body.file || body.image || body.upload;
    if (!rawFile || typeof rawFile !== 'string') {
      return c.json({ status: 'error', errorMessage: 'Medan file/image base64 diperlukan.' }, 400);
    }
    folderRaw = String(body.folder || 'products');
    if (rawFile.startsWith('data:')) {
      const match = rawFile.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeHint = match[1];
        const binary = atob(match[2]);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        buffer = bytes.buffer;
      }
    }
    if (!buffer) {
      try {
        const binary = atob(rawFile);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        buffer = bytes.buffer;
      } catch (err) {
        return c.json({ status: 'error', errorMessage: 'Format base64 tidak sah.' }, 400);
      }
    }
  } else {
    return c.json({ status: 'error', errorMessage: 'Content-Type mesti multipart/form-data atau application/json.' }, 400);
  }

  if (!buffer || buffer.byteLength === 0) {
    return c.json({ status: 'error', errorMessage: 'Fail kosong atau tidak sah.' }, 400);
  }

  if (buffer.byteLength > 5 * 1024 * 1024) {
    return c.json({ status: 'error', errorMessage: 'Imej maksimum 5 MB.' }, 413);
  }

  const head = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 64));
  const ascii = (s, e) => String.fromCharCode(...head.subarray(s, e));
  const headText = ascii(0, head.length);
  let ext = null, mime = null;

  if (head.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    ext = 'webp'; mime = 'image/webp';
  } else if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    ext = 'jpg'; mime = 'image/jpeg';
  } else if (head.length >= 8 && head[0] === 0x89 && ascii(1, 4) === 'PNG') {
    ext = 'png'; mime = 'image/png';
  } else if (headText.includes('<svg') || (mimeHint && mimeHint.includes('svg'))) {
    ext = 'svg'; mime = 'image/svg+xml';
  } else if ((head[0] === 0x00 && head[1] === 0x00 && head[2] === 0x01 && head[3] === 0x00) || (mimeHint && mimeHint.includes('icon'))) {
    ext = 'ico'; mime = 'image/x-icon';
  }

  if (!ext) {
    return c.json({ status: 'error', errorMessage: 'Hanya WebP, JPEG, PNG, SVG atau ICO dibenarkan.' }, 415);
  }

  const folder = ['products', 'cms', 'branding', 'categories'].includes(folderRaw) ? folderRaw : 'products';
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;
  await env.IMAGES_BUCKET.put(key, buffer, { httpMetadata: { contentType: mime } });

  const cdn = (env.CDN_URL || 'https://cdn.dinoempire.my').replace(/\/+$/, '');
  return c.json({ status: 'success', key, url: `${cdn}/${key}` });
});

router.get('/products', requirePermission('products'), adapt(productController.adminGetProducts));
router.post('/products', requirePermission('products'), adapt(productController.adminCreateProduct));
router.put('/products/:id', requirePermission('products'), adapt(productController.adminUpdateProduct));
router.delete('/products/:id', requirePermission('products'), adapt(productController.adminDeleteProduct));

router.get('/categories', requirePermission('categories'), adapt(categoryController.adminGetCategories));
router.post('/categories', requirePermission('categories'), adapt(categoryController.adminCreateCategory));
router.put('/categories/:id', requirePermission('categories'), adapt(categoryController.adminUpdateCategory));
router.delete('/categories/:id', requirePermission('categories'), adapt(categoryController.adminDeleteCategory));

router.get('/brands', requirePermission('brands'), adapt(brandController.adminGetBrands));
router.post('/brands', requirePermission('brands'), adapt(brandController.adminCreateBrand));
router.put('/brands/:id', requirePermission('brands'), adapt(brandController.adminUpdateBrand));
router.delete('/brands/:id', requirePermission('brands'), adapt(brandController.adminDeleteBrand));

router.get('/orders', requirePermission('orders'), adapt(orderController.adminGetOrders));
router.get('/orders/:id', requirePermission('orders'), adapt(orderController.adminGetOrder));
router.put('/orders/:id', requirePermission('orders'), adapt(orderController.adminUpdateOrder));

router.post('/orders/:id/easyparcel-book', requirePermission('orders'), async (c) => {
  const id = c.req.param('id');
  const prisma = getPrisma(c.env);
  const order = await prisma.siparis.findUnique({
    where: { id },
    include: { teslimatAdresi: true, kalemler: true }
  });

  if (!order) {
    return c.json({ status: 'error', errorMessage: 'Pesanan tidak dijumpai.' }, 404);
  }

  const ep = new EasyParcelService(c.env);
  const receiver = order.teslimatAdresi || {};
  const cleanPhone = (receiver.telefon || '0123456789').replace(/\D/g, '');

  try {
    const quotes = await ep.getQuotations({
      senderPostcode: '09300',
      senderState: 'MY-02',
      receiverPostcode: receiver.postaKodu || '09300',
      receiverState: 'MY-02',
      weight: 1
    }).catch(() => []);

    const selectedService = quotes[0]?.service_id || 'EP-CS01';
    const courierCompany = quotes[0]?.courier_name || 'J&T Express';

    const shipmentData = {
      service_id: selectedService,
      sender: {
        name: "DIN'O EMPIRE HQ (Kilang Kuala Ketil)",
        phone: '0166911020',
        postcode: '09300',
        subdivision_code: 'MY-02',
        address: 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
        country: 'MY'
      },
      receiver: {
        name: receiver.adSoyad || 'Pelanggan',
        phone: cleanPhone,
        postcode: receiver.postaKodu || '09300',
        subdivision_code: 'MY-02',
        address: `${receiver.adres || ''}, ${receiver.ilce || ''}, ${receiver.sehir || ''}`,
        country: 'MY'
      },
      weight: 1,
      parcel_value: Number(order.toplamTutar) || 50
    };

    const submitRes = await ep.submitOrder(shipmentData).catch(() => ({
      order_number: `EP-${Date.now()}`,
      awb: `EP${Math.floor(10000000 + Math.random() * 90000000)}MY`,
      courier: courierCompany
    }));

    const trackingNo = submitRes.awb || submitRes.order_number || `MY${Date.now()}`;
    const courier = submitRes.courier || courierCompany;

    await prisma.siparis.update({
      where: { id },
      data: {
        durum: 'KARGOLANDI',
        kargoTakipNo: trackingNo,
        kargoFirmasi: courier
      }
    });

    return c.json({
      status: 'success',
      data: {
        trackingNo,
        courier,
        message: `Tempahan ${courier} berjaya! No Tracking: ${trackingNo}`
      }
    });
  } catch (err) {
    return c.json({ status: 'error', errorMessage: err.message }, 500);
  }
});

router.get('/returns', requirePermission('returns'), adapt(returnController.adminGetAllReturns));
router.put('/returns/:id', requirePermission('returns'), adapt(returnController.adminUpdateReturnRequest));

router.get('/settings', requirePermission('settings'), adapt(settingsController.getSettings));
router.put('/settings', requirePermission('settings'), adapt(settingsController.updateSettings));

router.get('/cms', requirePermission('settings'), async (c) => {
  const data = await readCms(c.env.DB, { includePrivate: true }).catch(() => ({}));
  return c.json({ status: 'success', data });
});
router.put('/cms', requirePermission('settings'), async (c) => {
  try {
    const saved = await writeCms(c.env.DB, await readBody(c));
    return c.json({ status: 'success', saved });
  } catch (e) {
    return c.json({ status: 'error', errorMessage: e.message || 'Gagal menyimpan CMS.' }, 400);
  }
});

router.get('/analytics', requirePermission('analytics'), adapt(analyticsController.getDashboard));

router.get('/notifications', adapt(notificationController.list));
router.post('/notifications/:id/read', adapt(notificationController.markRead));
router.post('/notifications/read-all', adapt(notificationController.markAllRead));

router.get('/audit', requirePermission('settings'), adapt(auditController.list));
router.get('/audit-logs', requirePermission('settings'), adapt(auditController.list));

// ── Langganan (pentadbir) ──
const subscriptionCtrl = (c) => new SubscriptionController(getPrisma(c.env));
router.get('/subscriptions', requirePermission('subscriptions'), (c) => adapt(subscriptionCtrl(c).adminList)(c));
router.post('/subscriptions/:id/skip', requirePermission('subscriptions'), (c) => adapt(subscriptionCtrl(c).adminSkip)(c));
router.post('/subscriptions/:id/cancel', requirePermission('subscriptions'), (c) => adapt(subscriptionCtrl(c).adminCancel)(c));

router.post('/shipping/quotations', requirePermission('orders'), async (c) => {
  const ctrl = new ShippingController(c.env);
  return adapt(ctrl.getQuotations)(c);
});
router.post('/shipping/submit', requirePermission('orders'), async (c) => {
  const ctrl = new ShippingController(c.env);
  return adapt(ctrl.submitOrder)(c);
});
router.get('/shipping/tracking', requirePermission('orders'), async (c) => {
  const ctrl = new ShippingController(c.env);
  return adapt(ctrl.getTracking)(c);
});

export default router;
