import { asyncHandler } from '../utils/asyncHandler.js';

const TIERS = [
  { min: 50, discount: 5 },
  { min: 100, discount: 10 },
  { min: 150, discount: 15 },
];

function calculateDiscount(total) {
  let discount = 0;
  for (const tier of TIERS) {
    if (total >= tier.min) discount = tier.discount;
  }
  return discount;
}

export class SubscriptionController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createSubscription = asyncHandler(async (req, res) => {
    const { eposta, ad, soyad, telefon, alamat, sehir, poskod, frekuensi, items } = req.body;

    if (!eposta || !ad || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 'error', errorMessage: 'Maklumat tidak lengkap.' });
    }

    const productIds = items.map(i => i.urunId);
    const products = await this.prisma.urun.findMany({
      where: { id: { in: productIds }, aktif: true }
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ status: 'error', errorMessage: 'Sesetengah produk tidak sah.' });
    }

    let jumlahAsas = 0;
    const itemData = items.map(item => {
      const prod = products.find(p => p.id === item.urunId);
      const harga = prod.indirimliFiyat || prod.fiyat;
      const qty = Math.max(1, parseInt(item.kuantiti || 1, 10));
      jumlahAsas += harga * qty;
      return { urunId: item.urunId, kuantiti: qty, harga };
    });

    const diskaunPeratus = calculateDiscount(jumlahAsas);
    const jumlahAkhir = jumlahAsas * (1 - diskaunPeratus / 100);

    const nextDate = new Date();
    if (frekuensi === '2_MINGGU') {
      nextDate.setDate(nextDate.getDate() + 14);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const langganan = await this.prisma.langganan.create({
      data: {
        eposta,
        ad,
        soyad: soyad || '',
        telefon: telefon || '',
        alamat: alamat || '',
        sehir: sehir || '',
        poskod: poskod || '',
        frekuensi: frekuensi || 'BULANAN',
        tarikhSeterusnya: nextDate,
        diskaunPeratus,
        jumlahAsas,
        jumlahAkhir,
        items: { create: itemData }
      },
      include: { items: { include: { urun: true } } }
    });

    res.json({ status: 'success', data: langganan });
  });

  getMySubscriptions = asyncHandler(async (req, res) => {
    const { eposta } = req.query;
    if (!eposta) {
      return res.status(400).json({ status: 'error', errorMessage: 'E-mel diperlukan.' });
    }

    const list = await this.prisma.langganan.findMany({
      where: { eposta, status: { not: 'DIBATALKAN' } },
      include: { items: { include: { urun: true } } },
      orderBy: { olusturulmaTarihi: 'desc' }
    });

    res.json({ status: 'success', data: list });
  });

  skipNext = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await this.prisma.langganan.update({
      where: { id },
      data: { skipSeterusnya: true }
    });
    res.json({ status: 'success', data: updated });
  });

  cancel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await this.prisma.langganan.update({
      where: { id },
      data: { status: 'DIBATALKAN' }
    });
    res.json({ status: 'success', data: updated });
  });

  adminList = asyncHandler(async (req, res) => {
    const list = await this.prisma.langganan.findMany({
      include: { items: { include: { urun: true } } },
      orderBy: { olusturulmaTarihi: 'desc' },
      take: 100
    });
    res.json({ status: 'success', data: list });
  });
}
