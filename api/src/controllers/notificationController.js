import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';

export class NotificationController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  list = asyncHandler(async (req, res) => {
    const list = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM notifications ORDER BY createdAt DESC LIMIT 50`
    );
    const unread = await this.prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count FROM notifications WHERE dibaca = 0`
    );
    res.json({ status: 'success', data: list, unread: unread[0]?.count || 0 });
  });

  markRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.prisma.$executeRawUnsafe(
      `UPDATE notifications SET dibaca = 1 WHERE id = ?`, id
    );
    res.json({ status: 'success' });
  });

  markAllRead = asyncHandler(async (req, res) => {
    await this.prisma.$executeRawUnsafe(`UPDATE notifications SET dibaca = 1`);
    res.json({ status: 'success' });
  });
}

export async function createNotification(prisma, { jenis, tajuk, mesej, rujukan }) {
  const id = crypto.randomUUID();
  await prisma.$executeRawUnsafe(
    `INSERT INTO notifications (id, jenis, tajuk, mesej, rujukan) VALUES (?, ?, ?, ?, ?)`,
    id, jenis, tajuk, mesej || '', rujukan || ''
  );
  return id;
}
