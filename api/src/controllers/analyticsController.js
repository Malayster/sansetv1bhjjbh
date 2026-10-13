import { asyncHandler } from '../utils/asyncHandler.js';

export class AnalyticsController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getDashboard = asyncHandler(async (req, res) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalSubs,
      activeSubs,
      cancelledSubs,
      totalPoints,
      pointsUsed,
      recentSubs,
      recentOrders,
      topProducts
    ] = await Promise.all([
      this.prisma.langganan.count(),
      this.prisma.langganan.count({ where: { status: 'AKTIF' } }),
      this.prisma.langganan.count({ where: { status: 'DIBATALKAN' } }),
      this.prisma.points.aggregate({ _sum: { jumlahDiperoleh: true } }),
      this.prisma.points.aggregate({ _sum: { jumlahDigunakan: true } }),
      this.prisma.langganan.findMany({
        take: 5,
        orderBy: { olusturulmaTarihi: 'desc' },
        select: { id: true, eposta: true, ad: true, status: true, jumlahAkhir: true, olusturulmaTarihi: true }
      }),
      this.prisma.siparis.findMany({
        where: { olusturulmaTarihi: { gte: sevenDaysAgo } },
        select: { olusturulmaTarihi: true, toplamTutar: true, durum: true }
      }),
      this.prisma.urun.findMany({
        take: 5,
        orderBy: { satisAdedi: 'desc' },
        select: { id: true, ad: true, satisAdedi: true, fiyat: true }
      })
    ]);

    // Group orders by day
    const ordersByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      ordersByDay[key] = { date: key, count: 0, total: 0 };
    }
    for (const o of recentOrders) {
      const key = new Date(o.olusturulmaTarihi).toISOString().slice(0, 10);
      if (ordersByDay[key]) {
        ordersByDay[key].count += 1;
        ordersByDay[key].total += Number(o.toplamTutar || 0);
      }
    }

    res.json({
      status: 'success',
      data: {
        subscriptions: { total: totalSubs, active: activeSubs, cancelled: cancelledSubs },
        points: { earned: totalPoints._sum.jumlahDiperoleh || 0, used: pointsUsed._sum.jumlahDigunakan || 0 },
        recentSubscriptions: recentSubs,
        ordersTrend: Object.values(ordersByDay),
        topProducts
      }
    });
  });
}
