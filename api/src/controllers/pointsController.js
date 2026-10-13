import { asyncHandler } from '../utils/asyncHandler.js';

export class PointsController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getBalance = asyncHandler(async (req, res) => {
    const { eposta } = req.query;
    if (!eposta) {
      return res.status(400).json({ status: 'error', errorMessage: 'E-mel diperlukan.' });
    }

    let points = await this.prisma.points.findUnique({ where: { eposta } });
    if (!points) {
      points = { eposta, baki: 0, jumlahDiperoleh: 0, jumlahDigunakan: 0 };
    }

    const log = await this.prisma.pointsLog.findMany({
      where: { eposta },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({ status: 'success', data: { ...points, log } });
  });

  earn = asyncHandler(async (req, res) => {
    const { eposta, jumlah, nota, rujukan } = req.body;
    if (!eposta || !jumlah || jumlah <= 0) {
      return res.status(400).json({ status: 'error', errorMessage: 'Data tidak sah.' });
    }

    const points = await this.prisma.points.upsert({
      where: { eposta },
      update: {
        baki: { increment: jumlah },
        jumlahDiperoleh: { increment: jumlah }
      },
      create: {
        eposta,
        baki: jumlah,
        jumlahDiperoleh: jumlah
      }
    });

    await this.prisma.pointsLog.create({
      data: { eposta, jumlah, jenis: 'DAPAT', nota, rujukan }
    });

    res.json({ status: 'success', data: points });
  });

  redeem = asyncHandler(async (req, res) => {
    const { eposta, jumlah, nota } = req.body;
    if (!eposta || !jumlah || jumlah <= 0) {
      return res.status(400).json({ status: 'error', errorMessage: 'Data tidak sah.' });
    }

    const current = await this.prisma.points.findUnique({ where: { eposta } });
    if (!current || current.baki < jumlah) {
      return res.status(400).json({ status: 'error', errorMessage: 'Baki points tidak mencukupi.' });
    }

    const points = await this.prisma.points.update({
      where: { eposta },
      data: {
        baki: { decrement: jumlah },
        jumlahDigunakan: { increment: jumlah }
      }
    });

    await this.prisma.pointsLog.create({
      data: { eposta, jumlah: -jumlah, jenis: 'GUNA', nota }
    });

    res.json({ status: 'success', data: points });
  });
}
