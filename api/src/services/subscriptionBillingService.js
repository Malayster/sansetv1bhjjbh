import { getPrisma } from '../prisma.js';

/**
 * Process due subscriptions: create pending orders for active langganan
 * whose tarikhSeterusnya <= now and skipSeterusnya = false.
 * Advances next date and clears skip flag.
 */
export async function processDueSubscriptions(env) {
  const prisma = getPrisma(env);
  const now = new Date();

  const due = await prisma.langganan.findMany({
    where: {
      status: 'AKTIF',
      tarikhSeterusnya: { lte: now },
      skipSeterusnya: false
    },
    include: { items: { include: { urun: true } } },
    take: 50
  });

  const results = [];

  for (const sub of due) {
    try {
      const orderNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const trackingToken = crypto.randomUUID();

      const order = await prisma.siparis.create({
        data: {
          siparisNumarasi: orderNumber,
          takipTokeni: trackingToken,
          toplamTutar: sub.jumlahAkhir,
          kargoUcreti: 0,
          durum: 'BEKLEMEDE',
          eposta: sub.eposta,
          ad: sub.ad,
          soyad: sub.soyad || '',
          telefon: sub.telefon || '',
          adres: sub.alamat || '',
          sehir: sub.sehir || '',
          ilce: '',
          postaKodu: sub.poskod || '',
          ulke: 'Malaysia',
          langgananId: sub.id,
          kalemler: {
            create: sub.items.map(item => ({
              urunId: item.urunId,
              adet: item.kuantiti,
              fiyat: item.harga,
              urunAdSnapshot: item.urun?.ad || 'Produk',
              urunFiyatSnapshot: item.harga,
              toplamFiyat: item.harga * item.kuantiti,
              iadeyeUygunMuSnapshot: true
            }))
          }
        }
      });

      // Advance next date
      const next = new Date(sub.tarikhSeterusnya);
      if (sub.frekuensi === '2_MINGGU') {
        next.setDate(next.getDate() + 14);
      } else {
        next.setMonth(next.getMonth() + 1);
      }

      await prisma.langganan.update({
        where: { id: sub.id },
        data: {
          tarikhSeterusnya: next,
          skipSeterusnya: false
        }
      });

      results.push({ id: sub.id, orderId: order.id, status: 'created' });
    } catch (err) {
      console.error('[Billing] Failed for', sub.id, err.message);
      results.push({ id: sub.id, status: 'error', error: err.message });
    }
  }

  // Handle skipped ones: just advance date
  const skipped = await prisma.langganan.findMany({
    where: {
      status: 'AKTIF',
      tarikhSeterusnya: { lte: now },
      skipSeterusnya: true
    },
    take: 50
  });

  for (const sub of skipped) {
    const next = new Date(sub.tarikhSeterusnya);
    if (sub.frekuensi === '2_MINGGU') {
      next.setDate(next.getDate() + 14);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    await prisma.langganan.update({
      where: { id: sub.id },
      data: { tarikhSeterusnya: next, skipSeterusnya: false }
    });
    results.push({ id: sub.id, status: 'skipped' });
  }

  return { processed: results.length, results };
}
