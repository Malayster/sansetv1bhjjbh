import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';

export class AuditController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  list = asyncHandler(async (req, res) => {
    const { sumber, adminEmail, limit = 50 } = req.query;
    let sql = `SELECT * FROM audit_trail WHERE 1=1`;
    const params = [];
    if (sumber) { sql += ` AND sumber = ?`; params.push(sumber); }
    if (adminEmail) { sql += ` AND adminEmail = ?`; params.push(adminEmail); }
    sql += ` ORDER BY createdAt DESC LIMIT ?`;
    params.push(Number(limit));

    const list = await this.prisma.$queryRawUnsafe(sql, ...params);
    res.json({ status: 'success', data: list });
  });
}

export async function logAudit(prisma, { adminEmail, tindakan, sumber, sumberId, dataLama, dataBaru, ip }) {
  const id = crypto.randomUUID();
  await prisma.$executeRawUnsafe(
    `INSERT INTO audit_trail (id, adminEmail, tindakan, sumber, sumberId, dataLama, dataBaru, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    adminEmail || '',
    tindakan,
    sumber || '',
    sumberId || '',
    dataLama ? JSON.stringify(dataLama) : '',
    dataBaru ? JSON.stringify(dataBaru) : '',
    ip || ''
  );
  return id;
}
