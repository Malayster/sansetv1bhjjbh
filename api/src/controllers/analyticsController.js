import { asyncHandler } from '../utils/asyncHandler.js';

export class AnalyticsController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getDashboard = asyncHandler(async (req, res) => {
    const [
      totalSubs,
      activeSubs,
      cancelledSubs,
      totalPoints,
      pointsUsed,
      recentSubs
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
      })
    ]);

    res.json({
      status: 'success',
      data: {
        subscriptions: {
          total: totalSubs,
          active: activeSubs,
          cancelled: cancelledSubs
        },
        points: {
          earned: totalPoints._sum.jumlahDiperoleh || 0,
          used: pointsUsed._sum.jumlahDigunakan || 0
        },
        recentSubscriptions: recentSubs
      }
    });
  });
}
