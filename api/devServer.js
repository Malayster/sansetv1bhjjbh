import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'local_dino.db');

// Inisialisasi Pangkalan Data SQLite
let db;
function initDatabase() {
    const isNew = !fs.existsSync(DB_PATH);
    db = new DatabaseSync(DB_PATH);

    if (isNew) {
        console.log('📦 Menjana pangkalan data tempatan baru (local_dino.db)...');
        const m1 = fs.readFileSync(path.join(__dirname, 'migrations/0001_init.sql'), 'utf8');
        const m2 = fs.readFileSync(path.join(__dirname, 'migrations/0002_schema_updates.sql'), 'utf8');
        const m4 = fs.readFileSync(path.join(__dirname, 'migrations/0004_integrations.sql'), 'utf8');
        const m5 = fs.readFileSync(path.join(__dirname, 'migrations/0005_schema_sync.sql'), 'utf8');
        const seed = fs.readFileSync(path.join(__dirname, 'prisma/seed.sql'), 'utf8');

        db.exec(m1);
        db.exec(m2);
        db.exec(m4);
        db.exec(m5);
        db.exec(seed);
        console.log('✅ Migrasi & Benih Data DIN\'O EMPIRE berjaya dimuatkan ke SQLite.');
    } else {
        console.log('✅ Pangkalan data SQLite tempatan sedia ada dimuatkan.');
    }

    // Pastikan jadual cms_kandungan dan admin_audit_log sentiasa wujud
    db.exec(`
        CREATE TABLE IF NOT EXISTS cms_kandungan (
            kunci TEXT PRIMARY KEY,
            kandunganJson TEXT NOT NULL,
            guncellenmeTarihi DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admin_audit_log (
            id TEXT PRIMARY KEY,
            tindakan TEXT NOT NULL,
            butiran TEXT,
            pengguna TEXT DEFAULT 'Admin',
            tarikh DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Benihkan data CMS sekiranya masih belum wujud
    const existingHero = db.prepare(`SELECT kunci FROM cms_kandungan WHERE kunci = 'hero_slides'`).get();
    if (!existingHero) {
        const defaultHeroSlides = [
            {
                id: 'slide-1',
                title: "TAWARAN HEBAT",
                subtitle: "KILANG KUALA KETIL",
                description: "Barangan terpilih berkualiti premium terus daripada pembekal kilang dengan harga berpatutan.",
                image: "/images/hero/shopping_hero.png",
                badge: "Pilihan Ramai",
                buttonText: "Lihat Barangan",
                buttonLink: "/magaza"
            },
            {
                id: 'slide-2',
                title: "KOLEKSI KHAS",
                subtitle: "EKSKLUSIF MALAYSIA",
                description: "Dapatkan produk berkualiti tinggi dan pilihan terlaris hanya di DIN'O EMPIRE.",
                image: "/images/hero/tech_hero.png",
                badge: "Kualiti Dijamin",
                buttonText: "Beli Sekarang",
                buttonLink: "/magaza"
            },
            {
                id: 'slide-3',
                title: "PANTAS & SELAMAT",
                subtitle: "BAYARAN FPX",
                description: "Urus niaga mudah menggunakan ToyyibPay FPX dan penghantaran pos pantas ke seluruh negara.",
                image: "/images/hero/deals_hero.png",
                badge: "Bayaran Mudah",
                buttonText: "Terokai Koleksi",
                buttonLink: "/magaza"
            }
        ];
        db.prepare(`INSERT INTO cms_kandungan (kunci, kandunganJson) VALUES ('hero_slides', ?)`).run(JSON.stringify(defaultHeroSlides));
    }

    const existingBar = db.prepare(`SELECT kunci FROM cms_kandungan WHERE kunci = 'announcement_bar'`).get();
    if (!existingBar) {
        const defaultBar = {
            active: true,
            text: "PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan RM100 ke atas! Terus dari Kilang Kuala Ketil.",
            link: "/magaza",
            theme: "amber"
        };
        db.prepare(`INSERT INTO cms_kandungan (kunci, kandunganJson) VALUES ('announcement_bar', ?)`).run(JSON.stringify(defaultBar));
    }

    const existingInfo = db.prepare(`SELECT kunci FROM cms_kandungan WHERE kunci = 'info_kedai'`).get();
    if (!existingInfo) {
        const defaultInfo = {
            namaKedai: "DIN'O EMPIRE",
            telefon: "016-6911020",
            whatsapp: "013-2359647",
            email: "dinoempireenterprise@gmail.com",
            alamat: "Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah",
            waktuOperasi: "Isnin - Sabtu: 9:00 AM - 6:00 PM"
        };
        db.prepare(`INSERT INTO cms_kandungan (kunci, kandunganJson) VALUES ('info_kedai', ?)`).run(JSON.stringify(defaultInfo));
    }
}

initDatabase();

// Helper audit log untuk mencatat aktiviti pentadbir (diilhamkan daripada firabib audit.mjs)
function logAudit(tindakan, butiran, pengguna = 'Admin') {
    try {
        const id = 'aud_' + Math.random().toString(36).substring(2, 9);
        db.prepare(`INSERT INTO admin_audit_log (id, tindakan, butiran, pengguna, tarikh) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`).run(id, tindakan, butiran, pengguna);
    } catch (e) {
        console.error('Audit log error:', e);
    }
}

// Helper parsing JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

// Helper send JSON response
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cf-Access-Jwt-Assertion'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cf-Access-Jwt-Assertion'
        });
        return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:8787'}`);
    const pathname = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams.entries());

    try {
        // ==========================================
        // 1. PRODUK (PUBLIC)
        // ==========================================
        if (pathname === '/api/v1/products' && (req.method === 'GET' || req.method === 'HEAD')) {
            let sql = `
                SELECT u.*, k.ad as kategoriAd, k.slug as kategoriSlug, m.ad as markaAd 
                FROM urunler u
                LEFT JOIN kategoriler k ON u.kategoriId = k.id
                LEFT JOIN markalar m ON u.markaId = m.id
                WHERE u.aktif = 1
            `;
            const params = [];

            if (query.kategori) {
                sql += ` AND k.slug = ?`;
                params.push(query.kategori);
            }
            if (query.kategoriId) {
                sql += ` AND u.kategoriId = ?`;
                params.push(query.kategoriId);
            }
            if (query.ozellik === 'one-cikan') {
                sql += ` AND u.oneCikan = 1`;
            }
            if (query.ozellik === 'yeni') {
                sql += ` AND u.yeniUrun = 1`;
            }
            if (query.search) {
                sql += ` AND (u.ad LIKE ? OR u.aciklama LIKE ?)`;
                params.push(`%${query.search}%`, `%${query.search}%`);
            }

            sql += ` ORDER BY u.olusturulmaTarihi DESC`;
            if (query.limit) {
                sql += ` LIMIT ?`;
                params.push(Number(query.limit));
            }

            const products = db.prepare(sql).all(...params);
            const mapped = products.map(p => ({
                ...p,
                renkSecenekleri: JSON.parse(p.renkSecenekleri || '[]'),
                boyutSecenekleri: JSON.parse(p.boyutSecenekleri || '[]'),
                kategori: p.kategoriAd ? { id: p.kategoriId, ad: p.kategoriAd, slug: p.kategoriSlug } : null,
                marka: p.markaAd ? { id: p.markaId, ad: p.markaAd } : null,
            }));
            return sendJson(res, 200, mapped);
        }

        // Single product by slug
        if (pathname.startsWith('/api/v1/products/slug/') && req.method === 'GET') {
            const slug = decodeURIComponent(pathname.replace('/api/v1/products/slug/', ''));
            const product = db.prepare(`
                SELECT u.*, k.ad as kategoriAd, k.slug as kategoriSlug, m.ad as markaAd 
                FROM urunler u
                LEFT JOIN kategoriler k ON u.kategoriId = k.id
                LEFT JOIN markalar m ON u.markaId = m.id
                WHERE u.slug = ?
            `).get(slug);

            if (!product) {
                return sendJson(res, 404, { status: 'error', errorMessage: 'Produk tidak dijumpai' });
            }

            const images = db.prepare(`SELECT * FROM urun_resimleri WHERE urunId = ? ORDER BY sira ASC`).all(product.id);
            const formatted = {
                ...product,
                renkSecenekleri: JSON.parse(product.renkSecenekleri || '[]'),
                boyutSecenekleri: JSON.parse(product.boyutSecenekleri || '[]'),
                resimler: images.map(img => img.url),
                kategori: product.kategoriAd ? { id: product.kategoriId, ad: product.kategoriAd, slug: product.kategoriSlug } : null,
                marka: product.markaAd ? { id: product.markaId, ad: product.markaAd } : null,
            };
            return sendJson(res, 200, formatted);
        }

        // Single product by ID
        if (pathname.startsWith('/api/v1/products/') && req.method === 'GET') {
            const id = pathname.replace('/api/v1/products/', '');
            const product = db.prepare(`
                SELECT u.*, k.ad as kategoriAd, k.slug as kategoriSlug, m.ad as markaAd 
                FROM urunler u
                LEFT JOIN kategoriler k ON u.kategoriId = k.id
                LEFT JOIN markalar m ON u.markaId = m.id
                WHERE u.id = ?
            `).get(id);

            if (!product) {
                return sendJson(res, 404, { status: 'error', errorMessage: 'Produk tidak dijumpai' });
            }
            return sendJson(res, 200, {
                ...product,
                renkSecenekleri: JSON.parse(product.renkSecenekleri || '[]'),
                boyutSecenekleri: JSON.parse(product.boyutSecenekleri || '[]'),
            });
        }

        // ==========================================
        // 2. KATEGORI & JENAMA
        // ==========================================
        if (pathname === '/api/v1/categories' && req.method === 'GET') {
            const categories = db.prepare(`SELECT * FROM kategoriler WHERE aktif = 1 ORDER BY sira ASC`).all();
            const parents = categories.filter(c => !c.ustKategoriId).map(p => ({
                ...p,
                altKategoriler: categories.filter(sub => sub.ustKategoriId === p.id)
            }));
            return sendJson(res, 200, parents.length > 0 ? parents : categories);
        }

        if (pathname === '/api/v1/brands' && req.method === 'GET') {
            const brands = db.prepare(`SELECT * FROM markalar WHERE aktif = 1 ORDER BY sira ASC`).all();
            return sendJson(res, 200, brands);
        }

        // ==========================================
        // 3. TETAPAN SISTEM (SETTINGS)
        // ==========================================
        if (pathname === '/api/v1/settings' && req.method === 'GET') {
            let settings = db.prepare(`SELECT * FROM sistem_ayarlari WHERE id = 'global-settings'`).get();
            if (!settings) {
                settings = {
                    siteAdi: "DIN'O EMPIRE",
                    ucretsizKargoAltLimit: 100.0,
                    kargoSabitUcret: 8.0,
                    telefon: "016-6911020",
                    whatsappNumarasi: "60166911020",
                    iletisimEmail: "dinoempire.my@gmail.com",
                    adres: "Kawasan Perusahaan Kuala Ketil, Kedah, Malaysia"
                };
            }
            return sendJson(res, 200, {
                ...settings,
                kargoFiyatListesi: settings.kargoFiyatListesi ? JSON.parse(settings.kargoFiyatListesi) : []
            });
        }

        // ==========================================
        // 4. PESANAN & CHECKOUT
        // ==========================================
        if (pathname === '/api/v1/orders/checkout' && req.method === 'POST') {
            const body = await parseBody(req);
            const orderId = 'ord_' + Math.random().toString(36).substring(2, 9);
            const siparisNo = 'DINO' + Math.floor(100000 + Math.random() * 900000);
            const token = 'tok_' + Math.random().toString(36).substring(2, 15);

            const items = body.items || body.sepet || [];
            let totalAmount = 0;
            items.forEach(i => {
                const qty = Number(i.quantity || i.adet || i.miktar || 1);
                const price = Number(i.price || i.fiyat || i.birimFiyat || 0);
                totalAmount += (price * qty);
            });

            // Hitung kadar pos mengikut negeri di Malaysia (Kedah RM 6, Semenanjung RM 8, Borneo RM 15, Percuma >= RM 100)
            const guest = body.guestInfo || {};
            const state = (guest.city || guest.sehir || body.city || body.sehir || '').toLowerCase().trim();
            const isKedah = state.includes('kedah');
            const isBorneo = state.includes('sabah') || state.includes('sarawak') || state.includes('labuan');

            let shippingFee = 8.00;
            if (isKedah) {
                shippingFee = 6.00;
            } else if (isBorneo) {
                shippingFee = 15.00;
            }

            if (totalAmount >= 100 && !isBorneo) {
                shippingFee = 0.00;
            }

            const grandTotal = totalAmount + shippingFee;
            const invoice = body.invoiceInfo || {};
            const rawName = (guest.name || `${guest.ad || ''} ${guest.soyad || ''}`.trim()) || 'Pelanggan';
            const nameParts = rawName.split(' ');
            const soyad = nameParts.length > 1 ? nameParts.pop() : '';
            const ad = nameParts.join(' ');
            const eposta = guest.email || guest.eposta || 'customer@dinoempire.my';
            const telefon = (guest.phone || guest.telefon || '0100000000').replace(/\D/g, '');
            const adres = guest.address || guest.adres || '-';
            const sehir = guest.city || guest.sehir || 'Kedah';
            const ilce = guest.district || guest.ilce || 'Kuala Ketil';
            const postaKodu = guest.zipCode || guest.postaKodu || '09300';
            const ulke = 'Malaysia';

            const isCorporate = invoice.isCorporate ? 1 : 0;
            const sirketAdi = invoice.companyName || null;
            const vergiDairesi = invoice.taxOffice || null;
            const vergiNumarasi = invoice.taxNumber || null;

            db.prepare(`
                INSERT INTO siparisler (
                    id, siparisNumarasi, takipTokeni, toplamTutar, kargoUcreti,
                    durum, ad, soyad, eposta, telefon,
                    adres, sehir, ilce, postaKodu, ulke,
                    kurumsalMi, sirketAdi, vergiDairesi, vergiNumarasi,
                    olusturulmaTarihi, guncellenmeTarihi
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).run(
                orderId,
                siparisNo,
                token,
                grandTotal,
                shippingFee,
                'BEKLEMEDE',
                ad,
                soyad,
                eposta,
                telefon,
                adres,
                sehir,
                ilce,
                postaKodu,
                ulke,
                isCorporate,
                sirketAdi,
                vergiDairesi,
                vergiNumarasi
            );

            // Simpan item pesanan ke dalam siparis_kalemleri
            for (const item of items) {
                const itemId = 'item_' + Math.random().toString(36).substring(2, 9);
                const itemQty = Number(item.quantity || item.adet || item.miktar || 1);
                const itemPrice = Number(item.price || item.fiyat || item.birimFiyat || 0);
                const itemName = item.name || item.ad || item.urunAd || 'Produk DIN\'O EMPIRE';
                const itemColor = item.selectedColor || item.secilenRenk || item.renk || 'Standard';

                db.prepare(`
                    INSERT INTO siparis_kalemleri (
                        id, siparisId, urunId, secilenRenk, adet, fiyat,
                        urunAdSnapshot, urunFiyatSnapshot, toplamFiyat, iadeyeUygunMuSnapshot
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                `).run(
                    itemId,
                    orderId,
                    item.id || item.urunId || null,
                    itemColor,
                    itemQty,
                    itemPrice,
                    itemName,
                    itemPrice,
                    itemPrice * itemQty
                );
            }

            // Pulangkan format tepat yang diperlukan oleh CheckoutPage
            return sendJson(res, 200, {
                status: 'pending_payment',
                orderId,
                orderNumber: siparisNo,
                total: grandTotal,
                shippingFee,
                trackingToken: token,
                message: 'Pesanan berjaya dicipta, menunggu pembayaran'
            });
        }

        // Permulaan Pembayaran (ToyyibPay / FPX)
        if (pathname === '/api/v1/payment/initiate' && req.method === 'POST') {
            const body = await parseBody(req);
            const orderId = body.orderId;
            if (!orderId) {
                return sendJson(res, 400, { status: 'failure', errorMessage: 'orderId diperlukan.' });
            }
            const order = db.prepare(`SELECT * FROM siparisler WHERE id = ?`).get(orderId);
            if (!order) {
                return sendJson(res, 404, { status: 'failure', errorMessage: 'Pesanan tidak dijumpai.' });
            }

            // Kemas kini status pesanan kepada HAZIRLANIYOR (simulasi bayaran berjaya dalam dev mode)
            db.prepare(`UPDATE siparisler SET durum = 'HAZIRLANIYOR', guncellenmeTarihi = CURRENT_TIMESTAMP WHERE id = ?`).run(order.id);

            const token = order.takipTokeni || order.odemeTokeni || order.id;
            const paymentUrl = `/payment/success?orderNumber=${order.siparisNumarasi}&trackingToken=${token}`;
            return sendJson(res, 200, {
                status: 'success',
                paymentUrl,
                orderId: order.id,
                orderNumber: order.siparisNumarasi,
                trackingToken: token,
                ucdHtml: `<script>window.location.href="${paymentUrl}";</script>`
            });
        }

        // Penjejakan Pesanan (Track Order)
        if (pathname === '/api/v1/orders/track' && req.method === 'GET') {
            const token = query.token;
            if (!token) {
                return sendJson(res, 400, { status: 'error', errorMessage: 'Token penjejakan diperlukan.' });
            }

            const order = db.prepare(`SELECT * FROM siparisler WHERE takipTokeni = ? OR siparisNumarasi = ? OR odemeTokeni = ?`).get(token, token, token);
            if (!order) {
                return sendJson(res, 404, { status: 'error', errorMessage: 'Pesanan tidak dijumpai.' });
            }

            const items = db.prepare(`SELECT * FROM siparis_kalemleri WHERE siparisId = ?`).all(order.id);
            const returnReq = db.prepare(`SELECT * FROM iade_talepleri WHERE siparisId = ?`).get(order.id);

            const formattedItems = items.map(item => ({
                ...item,
                urunAd: item.urunAdSnapshot,
                urunAdSnapshot: item.urunAdSnapshot,
                birimFiyat: item.urunFiyatSnapshot || item.fiyat,
                urunFiyatSnapshot: item.urunFiyatSnapshot || item.fiyat,
                fiyat: item.fiyat,
                adet: item.adet,
                quantity: item.adet,
                miktar: item.adet,
                toplamFiyat: (Number(item.fiyat) * Number(item.adet)).toFixed(2)
            }));

            const deliveryAddress = {
                adSoyad: `${order.ad || ''} ${order.soyad || ''}`.trim() || 'Pelanggan',
                adres: order.adres || '-',
                ilce: order.ilce || '-',
                sehir: order.sehir || '-',
                postaKodu: order.postaKodu || '-',
                ulke: order.ulke || 'Malaysia'
            };

            return sendJson(res, 200, {
                status: 'success',
                data: {
                    ...order,
                    siparisNumarasi: order.siparisNumarasi,
                    kargoTakipNo: order.kargoTakipNo || null,
                    kargoFirmasi: order.kargoFirmasi || null,
                    durum: order.durum,
                    toplamTutar: order.toplamTutar,
                    kargoUcreti: order.kargoUcreti,
                    araToplam: (Number(order.toplamTutar) - Number(order.kargoUcreti)).toFixed(2),
                    teslimatAdresi: deliveryAddress,
                    faturaAdresi: {
                        kurumsalMi: !!order.kurumsalMi,
                        sirketAdi: order.sirketAdi,
                        vergiDairesi: order.vergiDairesi,
                        vergiNumarasi: order.vergiNumarasi
                    },
                    kalemler: formattedItems,
                    iadeTalebi: returnReq || null
                }
            });
        }

        // Pembatalan Pesanan
        if (pathname === '/api/v1/orders/cancel' && req.method === 'POST') {
            const body = await parseBody(req);
            const token = body.token;
            const order = db.prepare(`SELECT * FROM siparisler WHERE odemeTokeni = ?`).get(token);
            if (!order) {
                return sendJson(res, 404, { status: 'error', errorMessage: 'Pesanan tidak dijumpai.' });
            }

            db.prepare(`UPDATE siparisler SET durum = 'IPTAL_EDILDI', guncellenmeTarihi = CURRENT_TIMESTAMP WHERE id = ?`).run(order.id);
            return sendJson(res, 200, { status: 'success', message: 'Pesanan berjaya dibatalkan.' });
        }

        // Permohonan Pemulangan
        if (pathname === '/api/v1/returns/request' && req.method === 'POST') {
            const body = await parseBody(req);
            const order = db.prepare(`SELECT * FROM siparisler WHERE odemeTokeni = ?`).get(body.token);
            if (!order) {
                return sendJson(res, 404, { status: 'error', errorMessage: 'Pesanan tidak dijumpai.' });
            }

            const returnId = 'ret_' + Math.random().toString(36).substring(2, 9);
            db.prepare(`
                INSERT INTO iade_talepleri (id, siparisId, durum, iadeTipi, sebepAciklamasi, olusturulmaTarihi, guncellenmeTarihi)
                VALUES (?, ?, 'BEKLEMEDE', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).run(returnId, order.id, body.iadeTipi || 'KUSURLU_URUN', body.sebepAciklamasi || '');

            return sendJson(res, 200, { status: 'success', message: 'Permohonan pemulangan diterima.' });
        }

        // ==========================================
        // 5. ADMIN ENDPOINTS (SEBENAR)
        // ==========================================
        // Senarai Produk Admin
        if (pathname === '/api/v1/admin/products' && req.method === 'GET') {
            const products = db.prepare(`
                SELECT u.*, k.ad as kategoriAd, m.ad as markaAd 
                FROM urunler u
                LEFT JOIN kategoriler k ON u.kategoriId = k.id
                LEFT JOIN markalar m ON u.markaId = m.id
                ORDER BY u.olusturulmaTarihi DESC
            `).all();
            const formatted = products.map(p => ({
                ...p,
                renkSecenekleri: JSON.parse(p.renkSecenekleri || '[]'),
                boyutSecenekleri: JSON.parse(p.boyutSecenekleri || '[]')
            }));
            return sendJson(res, 200, { status: 'success', data: formatted });
        }

        // Tambah Produk Admin
        if (pathname === '/api/v1/admin/products' && req.method === 'POST') {
            const b = await parseBody(req);
            const id = 'prod_' + Math.random().toString(36).substring(2, 9);
            const slug = (b.slug || b.ad || 'produk').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            db.prepare(`
                INSERT INTO urunler (
                    id, slug, ad, fiyat, indirimliFiyat, stokAdedi, desi, aciklama, resimUrl,
                    kategoriId, aktif, oneCikan, yeniUrun, renkSecenekleri, olusturulmaTarihi, guncellenmeTarihi
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).run(
                id,
                slug,
                b.ad,
                Number(b.fiyat || 0),
                b.indirimliFiyat ? Number(b.indirimliFiyat) : null,
                Number(b.stokAdedi || 100),
                Number(b.desi || 0.5),
                b.aciklama || '',
                b.resimUrl || 'https://dino-empire.pages.dev/dino-logo.jpg',
                b.kategoriId || null,
                b.aktif !== undefined ? (b.aktif ? 1 : 0) : 1,
                b.oneCikan ? 1 : 0,
                b.yeniUrun ? 1 : 0,
                JSON.stringify(b.renkSecenekleri || ['Standard'])
            );

            return sendJson(res, 201, { status: 'success', message: 'Produk berjaya dicipta.', data: { id, slug } });
        }

        // Kemas Kini Produk Admin
        if (pathname.startsWith('/api/v1/admin/products/') && req.method === 'PUT') {
            const id = pathname.replace('/api/v1/admin/products/', '');
            const b = await parseBody(req);

            db.prepare(`
                UPDATE urunler SET
                    ad = coalesce(?, ad),
                    fiyat = coalesce(?, fiyat),
                    indirimliFiyat = ?,
                    stokAdedi = coalesce(?, stokAdedi),
                    desi = coalesce(?, desi),
                    aciklama = coalesce(?, aciklama),
                    resimUrl = coalesce(?, resimUrl),
                    kategoriId = coalesce(?, kategoriId),
                    aktif = coalesce(?, aktif),
                    guncellenmeTarihi = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(
                b.ad,
                b.fiyat !== undefined ? Number(b.fiyat) : null,
                b.indirimliFiyat !== undefined ? Number(b.indirimliFiyat) : null,
                b.stokAdedi !== undefined ? Number(b.stokAdedi) : null,
                b.desi !== undefined ? Number(b.desi) : null,
                b.aciklama,
                b.resimUrl,
                b.kategoriId,
                b.aktif !== undefined ? (b.aktif ? 1 : 0) : null,
                id
            );

            return sendJson(res, 200, { status: 'success', message: 'Produk berjaya dikemas kini.' });
        }

        // Padam Produk Admin
        if (pathname.startsWith('/api/v1/admin/products/') && req.method === 'DELETE') {
            const id = pathname.replace('/api/v1/admin/products/', '');
            db.prepare(`DELETE FROM urunler WHERE id = ?`).run(id);
            return sendJson(res, 200, { status: 'success', message: 'Produk berjaya dipadam.' });
        }

        // Senarai Pesanan Admin
        if (pathname === '/api/v1/admin/orders' && req.method === 'GET') {
            const orders = db.prepare(`SELECT * FROM siparisler ORDER BY olusturulmaTarihi DESC`).all();
            const formatted = orders.map(o => {
                const items = db.prepare(`SELECT * FROM siparis_kalemleri WHERE siparisId = ?`).all(o.id);
                const buyerFullName = `${o.ad || ''} ${o.soyad || ''}`.trim() || 'Pelanggan';
                return {
                    ...o,
                    siparisNo: o.siparisNumarasi,
                    createdAt: o.olusturulmaTarihi,
                    aliciAdSoyad: buyerFullName,
                    aliciEposta: o.eposta,
                    aliciTelefon: o.telefon,
                    misafirBilgi: {
                        ad: buyerFullName,
                        email: o.eposta || '-',
                        telefon: o.telefon || '-'
                    },
                    teslimatAdresi: {
                        adres: o.adres || '-',
                        ilce: o.ilce || '-',
                        sehir: o.sehir || '-',
                        postaKodu: o.postaKodu || '-'
                    },
                    items: items.map(it => ({
                        id: it.id,
                        ad: it.urunAdSnapshot,
                        miktar: it.adet,
                        fiyat: it.fiyat
                    })),
                    kalemler: items
                };
            });
            return sendJson(res, 200, { status: 'success', data: formatted });
        }

        // Kemas Kini Status & Tracking Pesanan Admin
        if (pathname.startsWith('/api/v1/admin/orders/') && req.method === 'PUT') {
            const id = pathname.replace('/api/v1/admin/orders/', '');
            const b = await parseBody(req);

            db.prepare(`
                UPDATE siparisler SET
                    durum = coalesce(?, durum),
                    kargoFirmasi = coalesce(?, kargoFirmasi),
                    kargoTakipNo = coalesce(?, kargoTakipNo),
                    guncellenmeTarihi = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(
                b.durum,
                b.kargoFirmasi,
                b.kargoTakipNo,
                id
            );

            return sendJson(res, 200, { status: 'success', message: 'Pesanan berjaya dikemas kini.' });
        }

        // Senarai Kategori Admin
        if (pathname === '/api/v1/admin/categories' && req.method === 'GET') {
            const cats = db.prepare(`SELECT * FROM kategoriler ORDER BY sira ASC`).all();
            return sendJson(res, 200, { status: 'success', data: cats });
        }

        // Tambah Kategori Admin
        if (pathname === '/api/v1/admin/categories' && req.method === 'POST') {
            const b = await parseBody(req);
            const id = 'cat_' + Math.random().toString(36).substring(2, 9);
            const slug = (b.slug || b.ad || 'kategori').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            db.prepare(`
                INSERT INTO kategoriler (id, ad, slug, sira, aktif, olusturulmaTarihi, guncellenmeTarihi)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).run(id, b.ad, slug, Number(b.sira || 1), b.aktif !== undefined ? (b.aktif ? 1 : 0) : 1);
            return sendJson(res, 201, { status: 'success', message: 'Kategori berjaya ditambah.' });
        }

        // Kemas Kini Tetapan Admin
        if (pathname === '/api/v1/admin/settings' && req.method === 'PUT') {
            const b = await parseBody(req);
            db.prepare(`
                UPDATE sistem_ayarlari SET
                    siteAdi = coalesce(?, siteAdi),
                    telefon = coalesce(?, telefon),
                    whatsappNumarasi = coalesce(?, whatsappNumarasi),
                    iletisimEmail = coalesce(?, iletisimEmail),
                    adres = coalesce(?, adres),
                    ucretsizKargoAltLimit = coalesce(?, ucretsizKargoAltLimit),
                    kargoSabitUcret = coalesce(?, kargoSabitUcret),
                    updatedAt = CURRENT_TIMESTAMP
                WHERE id = 'global-settings'
            `).run(
                b.siteAdi,
                b.telefon,
                b.whatsappNumarasi,
                b.iletisimEmail,
                b.adres,
                b.ucretsizKargoAltLimit ? Number(b.ucretsizKargoAltLimit) : null,
                b.kargoSabitUcret ? Number(b.kargoSabitUcret) : null
            );
            logAudit('KEMAS_KINI_TETAPAN', 'Tetapan kedai dan kadar pos dikemas kini.');
            return sendJson(res, 200, { status: 'success', message: 'Tetapan sistem berjaya disimpan.' });
        }

        // ==========================================
        // 6. CMS KANDUNGAN DINAMIK (STOREFRONT & ADMIN)
        // ==========================================
        // Ambil Kandungan CMS (Public & Admin)
        if ((pathname === '/api/v1/cms' || pathname === '/api/v1/admin/cms') && req.method === 'GET') {
            const rows = db.prepare(`SELECT kunci, kandunganJson FROM cms_kandungan`).all();
            const cmsData = {};
            for (const r of rows) {
                try {
                    cmsData[r.kunci] = JSON.parse(r.kandunganJson);
                } catch {
                    cmsData[r.kunci] = r.kandunganJson;
                }
            }
            return sendJson(res, 200, { status: 'success', data: cmsData });
        }

        // Kemas Kini Kandungan CMS (Admin)
        if (pathname === '/api/v1/admin/cms' && req.method === 'PUT') {
            const body = await parseBody(req);
            const keys = Object.keys(body);
            for (const key of keys) {
                const val = body[key];
                const jsonStr = typeof val === 'string' ? val : JSON.stringify(val);
                db.prepare(`
                    INSERT INTO cms_kandungan (kunci, kandunganJson, guncellenmeTarihi)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(kunci) DO UPDATE SET kandunganJson = excluded.kandunganJson, guncellenmeTarihi = CURRENT_TIMESTAMP
                `).run(key, jsonStr);
            }
            logAudit('KEMAS_KINI_CMS', `Mengemas kini bahagian kandungan CMS: ${keys.join(', ')}`);
            return sendJson(res, 200, { status: 'success', message: 'Kandungan CMS berjaya disimpan ke pangkalan data.' });
        }

        // ==========================================
        // 7. UNJURAN KEWANGAN (FINANCIAL TRAJECTORY - DIILHAMKAN DARI JOHAN30)
        // ==========================================
        if (pathname === '/api/v1/admin/financial-trajectory' && req.method === 'GET') {
            const allOrders = db.prepare(`SELECT * FROM siparisler ORDER BY olusturulmaTarihi ASC`).all();
            
            const validOrders = allOrders.filter(o => o.durum !== 'IPTAL_EDILDI' && o.durum !== 'CANCELLED');
            const cancelledOrders = allOrders.filter(o => o.durum === 'IPTAL_EDILDI' || o.durum === 'CANCELLED');

            const totalGross = validOrders.reduce((sum, o) => sum + Number(o.toplamTutar || 0), 0);
            const totalShipping = validOrders.reduce((sum, o) => sum + Number(o.kargoUcreti || 0), 0);
            const netRevenue = Math.max(0, totalGross - totalShipping);
            const cancelledAmount = cancelledOrders.reduce((sum, o) => sum + Number(o.toplamTutar || 0), 0);

            const pendingOrders = validOrders.filter(o => ['BEKLEMEDE', 'HAZIRLANIYOR', 'PENDING', 'PREPARING'].includes(o.durum));
            const pendingAmount = pendingOrders.reduce((sum, o) => sum + Number(o.toplamTutar || 0), 0);

            const totalCount = validOrders.length;
            const aov = totalCount > 0 ? (totalGross / totalCount) : 0;

            // Pengiraan Halaju Jualan Berdasarkan Sejarah Pesanan
            let daysActive = 1;
            if (validOrders.length > 0) {
                const firstDate = new Date(validOrders[0].olusturulmaTarihi || Date.now());
                const now = new Date();
                const diffTime = Math.abs(now - firstDate);
                daysActive = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            }

            const dailySalesVelocity = totalCount > 0 ? (totalGross / daysActive) : 0;
            const unjuran30 = Number((dailySalesVelocity * 30).toFixed(2));
            const unjuran60 = Number((dailySalesVelocity * 60).toFixed(2));
            const unjuran90 = Number((dailySalesVelocity * 90).toFixed(2));

            const monthlyTarget = 15000.00; // Sasaran bulanan RM15,000
            const currentMonthSales = totalGross;
            const targetProgressPercent = Math.min(100, Number(((currentMonthSales / monthlyTarget) * 100).toFixed(1)));
            const bakiSasaran = Math.max(0, monthlyTarget - currentMonthSales);
            const dailyTargetNeeded = Number((bakiSasaran / 30).toFixed(2));

            return sendJson(res, 200, {
                status: 'success',
                data: {
                    kutipanKasar: Number(totalGross.toFixed(2)),
                    kutipanBersih: Number(netRevenue.toFixed(2)),
                    kosPosDikutip: Number(totalShipping.toFixed(2)),
                    kutipanTertunggak: Number(pendingAmount.toFixed(2)),
                    pesananTertunggakBil: pendingOrders.length,
                    kutipanBatal: Number(cancelledAmount.toFixed(2)),
                    pesananBatalBil: cancelledOrders.length,
                    jumlahPesananBerjaya: totalCount,
                    aov: Number(aov.toFixed(2)),
                    halajuJualanHarian: Number(dailySalesVelocity.toFixed(2)),
                    hariAktif: daysActive,
                    unjuran: {
                        hari30: unjuran30,
                        hari60: unjuran60,
                        hari90: unjuran90,
                        ayat: `Berdasarkan halaju purata jualan RM${dailySalesVelocity.toFixed(2)} sehari merentasi ${daysActive} hari tempoh operasi aktif.`
                    },
                    sasaranBulanan: {
                        target: monthlyTarget,
                        tercapai: Number(currentMonthSales.toFixed(2)),
                        kemajuanPeratus: targetProgressPercent,
                        bakiPerluDicapai: Number(bakiSasaran.toFixed(2)),
                        sasaranHarianDiperlukan: dailyTargetNeeded
                    }
                }
            });
        }

        // ==========================================
        // 8. ANALITIK JUALAN & DEMOGRAFI NEGERI
        // ==========================================
        if (pathname === '/api/v1/admin/analytics' && req.method === 'GET') {
            const allOrders = db.prepare(`SELECT * FROM siparisler ORDER BY olusturulmaTarihi DESC`).all();
            const validOrders = allOrders.filter(o => o.durum !== 'IPTAL_EDILDI' && o.durum !== 'CANCELLED');
            const cancelledOrders = allOrders.filter(o => o.durum === 'IPTAL_EDILDI' || o.durum === 'CANCELLED');

            // Tren Jualan Harian (7 Hari Terkini)
            const dailyMap = {};
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateKey = d.toISOString().slice(0, 10);
                dailyMap[dateKey] = { tarikh: dateKey, jumlah: 0, pesanan: 0 };
            }

            for (const o of validOrders) {
                if (o.olusturulmaTarihi) {
                    const dateKey = o.olusturulmaTarihi.slice(0, 10);
                    if (dailyMap[dateKey]) {
                        dailyMap[dateKey].jumlah += Number(o.toplamTutar || 0);
                        dailyMap[dateKey].pesanan += 1;
                    }
                }
            }
            const jualanHarian = Object.values(dailyMap).map(d => ({
                ...d,
                jumlah: Number(d.jumlah.toFixed(2))
            }));

            // Taburan Geografi / Zon Pos Malaysia
            let kedahCount = 0, kedahTotal = 0;
            let semenanjungCount = 0, semenanjungTotal = 0;
            let borneoCount = 0, borneoTotal = 0;

            for (const o of validOrders) {
                const sehir = (o.sehir || '').toLowerCase();
                const total = Number(o.toplamTutar || 0);
                if (sehir.includes('kedah') || (o.adres && o.adres.toLowerCase().includes('kedah'))) {
                    kedahCount++;
                    kedahTotal += total;
                } else if (sehir.includes('sabah') || sehir.includes('sarawak') || sehir.includes('labuan')) {
                    borneoCount++;
                    borneoTotal += total;
                } else {
                    semenanjungCount++;
                    semenanjungTotal += total;
                }
            }

            // Top 5 Produk Terlaris (Top SKU)
            const topProducts = db.prepare(`
                SELECT urunAdSnapshot as nama, SUM(adet) as totalQty, SUM(toplamFiyat) as totalSales
                FROM siparis_kalemleri
                GROUP BY urunAdSnapshot
                ORDER BY totalQty DESC
                LIMIT 5
            `).all();

            return sendJson(res, 200, {
                status: 'success',
                data: {
                    jualanHarian,
                    taburanGeografi: [
                        { zon: 'Kedah (Tempatan)', pesanan: kedahCount, jumlah: Number(kedahTotal.toFixed(2)), kadarPos: 'RM 6.00' },
                        { zon: 'Semenanjung Malaysia', pesanan: semenanjungCount, jumlah: Number(semenanjungTotal.toFixed(2)), kadarPos: 'RM 8.00' },
                        { zon: 'Sabah & Sarawak (Borneo)', pesanan: borneoCount, jumlah: Number(borneoTotal.toFixed(2)), kadarPos: 'RM 15.00' }
                    ],
                    topProduk: topProducts.map(tp => ({
                        nama: tp.nama || 'Produk Kilang',
                        terjual: tp.totalQty || 0,
                        hasil: Number((tp.totalSales || 0).toFixed(2))
                    })),
                    statusRingkasan: {
                        menunggu: validOrders.filter(o => ['BEKLEMEDE', 'PENDING'].includes(o.durum)).length,
                        dibungkus: validOrders.filter(o => ['HAZIRLANIYOR', 'PREPARING'].includes(o.durum)).length,
                        dipos: validOrders.filter(o => ['KARGOLANDI', 'SHIPPED'].includes(o.durum)).length,
                        selesai: validOrders.filter(o => ['TESLIM_EDILDI', 'DELIVERED', 'TAMAMLANDI'].includes(o.durum)).length,
                        batal: cancelledOrders.length
                    }
                }
            });
        }

        // ==========================================
        // 9. KESIHATAN STOK & AMARAN STOK TIPIS (JOHAN30 STOK.VUE)
        // ==========================================
        if (pathname === '/api/v1/admin/inventory-health' && req.method === 'GET') {
            const allProducts = db.prepare(`SELECT id, ad, fiyat, stokAdedi, aktif, resimUrl FROM urunler ORDER BY stokAdedi ASC`).all();
            
            const stokHabis = allProducts.filter(p => Number(p.stokAdedi || 0) <= 0);
            const stokTipis = allProducts.filter(p => Number(p.stokAdedi || 0) > 0 && Number(p.stokAdedi || 0) < 15);
            const stokSelamat = allProducts.filter(p => Number(p.stokAdedi || 0) >= 15);

            let totalUnits = 0;
            let totalAssetValue = 0;
            for (const p of allProducts) {
                const qty = Math.max(0, Number(p.stokAdedi || 0));
                totalUnits += qty;
                totalAssetValue += qty * Number(p.fiyat || 0);
            }

            return sendJson(res, 200, {
                status: 'success',
                data: {
                    jumlahProduk: allProducts.length,
                    jumlahUnitFizikal: totalUnits,
                    nilaiAsetGudang: Number(totalAssetValue.toFixed(2)),
                    kiraan: {
                        selamat: stokSelamat.length,
                        tipis: stokTipis.length,
                        habis: stokHabis.length
                    },
                    senaraiStokTipis: stokTipis.map(p => ({
                        id: p.id,
                        ad: p.ad,
                        stok: p.stokAdedi,
                        fiyat: p.fiyat,
                        resimUrl: p.resimUrl
                    })),
                    senaraiStokHabis: stokHabis.map(p => ({
                        id: p.id,
                        ad: p.ad,
                        stok: p.stokAdedi,
                        fiyat: p.fiyat,
                        resimUrl: p.resimUrl
                    }))
                }
            });
        }

        // Kemas Kini Stok Segera (Quick Stock Update)
        if (pathname.startsWith('/api/v1/admin/products/') && pathname.endsWith('/stock') && (req.method === 'PATCH' || req.method === 'PUT')) {
            const id = pathname.replace('/api/v1/admin/products/', '').replace('/stock', '');
            const body = await parseBody(req);
            const prod = db.prepare(`SELECT * FROM urunler WHERE id = ?`).get(id);
            if (!prod) {
                return sendJson(res, 404, { status: 'error', errorMessage: 'Produk tidak dijumpai.' });
            }

            let newStock = Number(prod.stokAdedi || 0);
            if (body.stokAdedi !== undefined) {
                newStock = Math.max(0, Number(body.stokAdedi));
            } else if (body.delta !== undefined) {
                newStock = Math.max(0, newStock + Number(body.delta));
            }

            db.prepare(`UPDATE urunler SET stokAdedi = ?, guncellenmeTarihi = CURRENT_TIMESTAMP WHERE id = ?`).run(newStock, id);
            logAudit('KEMAS_KINI_STOK', `Stok ${prod.ad} dikemas kini daripada ${prod.stokAdedi} kepada ${newStock}`);

            return sendJson(res, 200, { status: 'success', message: 'Stok berjaya dikemas kini.', data: { id, stokAdedi: newStock } });
        }

        // ==========================================
        // 10. JEJAK AUDIT PENTADBIR (FIRABIB AUDIT.MJS)
        // ==========================================
        if (pathname === '/api/v1/admin/audit-logs' && req.method === 'GET') {
            const logs = db.prepare(`SELECT * FROM admin_audit_log ORDER BY tarikh DESC LIMIT 30`).all();
            return sendJson(res, 200, { status: 'success', data: logs });
        }

        // Default 404
        return sendJson(res, 404, { status: 'error', errorMessage: `Laluan ${req.method} ${pathname} tidak dijumpai.` });

    } catch (err) {
        console.error('API Error:', err);
        return sendJson(res, 500, { status: 'error', errorMessage: err.message });
    }
});

const PORT = 8787;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Pelayan Backend DIN'O EMPIRE beroperasi di http://localhost:${PORT}`);
});
